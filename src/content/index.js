import { EXT_CHECK_INTERVAL, HIGHLIGHTER_BG_COLOR_CLASS, HIGHLIGHTER_FONT_SIZE_CLASS } from '@shared/constants';
import { EXT_MSG_TYPE_CONFIG_UPDATE, EXT_MSG_TYPE_GET_WORD_LIST } from '@shared/constants/messages';
import { EXT_STORAGE_CONFIG, EXT_STORAGE_WORD_LIST } from '@shared/constants/storage';
import { getDefaultConfig } from '@shared/utils/config';

import { insertFontStyles, insertIcons } from './scripts';
import { findWordsInNodes, getAllNodesFromDOM, highlightMatchedWords, shouldAddHighlight, shouldUpdate, updateNode } from './webHandler';

/*
 * Note: if there's any elements that you don't want to be highlighted, add class="HIGHLIGHTER_CLASS" to it's tag
 * e.g., daily word is displayed on the extension popup. To prevent it from being highlighted, the HIGHLIGHTER_CLASS is added
 */

let highlightWorker = null;
let PREV_HTML_NODE_COUNT = -1;
let CONFIG = {};

const messagesFromReactAppListener = (message, sender, sendResponse) => {
  // const sdr = sender.tab ? `from a content script:${sender.tab.url}` : 'from the extension';
  // console.log(`[content] message received: ${message.type}, sender: ${sdr}`);

  if (message.type === EXT_MSG_TYPE_CONFIG_UPDATE) {
    // console.log(`[content] prevState: ${message.payload?.prevState}. state: ${message.payload?.state}`);
    loadConfigAndAdjustStyle();
    sendResponse({ payload: true });
  }
  return true;
};

const sendMessage = async ({ type = '', payload = {} } = {}) => {
  // console.log(`[content] going to send message. Message: ${type}`);

  const msg = { type, payload };
  const resp = await chrome.runtime.sendMessage(msg).catch(err => console.log(`[content] Error occurred while sending request. error: ${err}`));
  return resp?.payload;
};

const loadConfig = async () => {
  // The very first time after installation, background notifies popup to insert default config into chrome.storage
  // Since content script loads config before the initial (default) config is stored, give it default value here
  const cache = await chrome.storage.sync.get(EXT_STORAGE_CONFIG);
  CONFIG = cache[EXT_STORAGE_CONFIG] || getDefaultConfig();
  return Object.keys(CONFIG).length > 0;
};

const insertCSS = async () =>
  new Promise(res => {
    insertFontStyles();
    insertIcons();
    res(true);
  });

const getAllWords = async () => {
  const cache = await chrome.storage.local.get([EXT_STORAGE_WORD_LIST]);
  let wordListStr = null;
  if (cache[EXT_STORAGE_WORD_LIST]) {
    wordListStr = cache[EXT_STORAGE_WORD_LIST];
  } else {
    wordListStr = await sendMessage({ type: EXT_MSG_TYPE_GET_WORD_LIST });
  }

  if (!wordListStr) {
    return new Map([]);
  }

  chrome.storage.local.set({ [EXT_STORAGE_WORD_LIST]: wordListStr });
  return new Map(JSON.parse(wordListStr).map(item => [item.word, item]));
};

const updateExtensionNodes = nodes => {
  const { highlightColor, language, fontSize, showDetail } = CONFIG;
  const highlightColorClass = HIGHLIGHTER_BG_COLOR_CLASS[highlightColor];
  const fontSizeClass = HIGHLIGHTER_FONT_SIZE_CLASS[fontSize];
  nodes
    .filter(node => shouldUpdate(node))
    .forEach(node => {
      updateNode(node, { language, showDetail, highlightColorClass, fontSizeClass });
    });
  // TODO use document.getElementsByClassName to extract elements directly
  // TODO update the necessary nodes and attributes (the value of class) only by comparing the difference between the prevState and state
};

const parseAllNodes = (nodes, words) => {
  const map = new Map();
  let cnt = 0;
  nodes
    .filter(node => shouldAddHighlight(node))
    .forEach(node => {
      const matchedWords = findWordsInNodes({ nodeValue: node.nodeValue, words });
      if (matchedWords.length) {
        // If we update parent node right now, subsequent nodes with same parent node may lose their parent node (node.parentNode becomes null)
        const args = { config: CONFIG, nodeValue: node.nodeValue, matchedWords, words };
        map.set(cnt++, { parent: node.parentNode, orgValue: node.nodeValue, newValue: highlightMatchedWords(args) });
      }
    });

  // console.log(`[content] Update. number of nodes to update: ${map.size}`);
  for (const { parent, orgValue, newValue } of map.values()) {
    parent.innerHTML = parent.innerHTML.replace(orgValue, newValue);
  }
};

const loadConfigAndAdjustStyle = async () => {
  if (highlightWorker) {
    clearInterval(highlightWorker);
  }
  const prevConfig = CONFIG;
  await loadConfig();
  if (JSON.stringify(prevConfig) !== JSON.stringify(CONFIG)) {
    updateExtensionNodes(getAllNodesFromDOM());
  }
  highlightWorker = setInterval(exec, EXT_CHECK_INTERVAL);
};

const exec = async () => {
  // const vals = await Promise.all([Promise.resolve(1), Promise.resolve(30)]); // Okay
  // const [v1, v2] = await Promise.all([Promise.resolve(1), Promise.resolve(30)]); // Error. Content script won't work properly!!!!!'
  const nodes = getAllNodesFromDOM();
  if (nodes.length === PREV_HTML_NODE_COUNT) {
    return;
  }
  const words = await getAllWords();

  // console.log(`[content] Start. number of words: ${words.size}, number of text nodes: ${nodes.length}`);
  PREV_HTML_NODE_COUNT = nodes.length;
  parseAllNodes(nodes, words);
};

const setup = async () => {
  const res1 = await loadConfig();
  const res2 = await insertCSS();
  // eslint-disable-next-line no-unused-vars
  const msg = res1 && res2 ? '[content] setup work completed' : '[content] setup work failed';
  // console.log(msg);
};

const main = async () => {
  // console.log('[content] content script start');

  await setup();
  exec();
  highlightWorker = setInterval(exec, EXT_CHECK_INTERVAL);

  // The runtime.onMessage event is fired in each content script running in the specified tab for the extension
  // when a message is sent from either an extension process or a content script
  // see: https://developer.chrome.com/docs/extensions/reference/tabs/#method-query
  chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
};

setTimeout(main, 600);
