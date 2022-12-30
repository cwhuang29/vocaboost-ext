import {
  EXT_CHECK_INTERVAL,
  HIGHLIGHTER_BG_COLOR_CLASS,
  HIGHLIGHTER_CLASS,
  HIGHLIGHTER_DETAIL_CLASS,
  HIGHLIGHTER_DETAIL_HIDDEN_CLASS,
  HIGHLIGHTER_DETAIL_ITEM_CLASS,
  HIGHLIGHTER_FONT_SIZE_CLASS,
  HIGHLIGHTER_LINK_CLASS,
  HIGHLIGHTER_ORG_WORD_CLASS,
  HIGHLIGHTER_TARGET_WORD_CLASS,
  ONLINE_DIC_URL,
} from '@shared/constants';
import { EXT_MSG_TYPE_CONFIG_UPDATE, EXT_MSG_TYPE_GET_WORD_LIST } from '@shared/constants/messages';
import { EXT_STORAGE_CONFIG, EXT_STORAGE_WORD_LIST } from '@shared/constants/storage';
import { getDefaultConfig } from '@shared/utils/config';
import { genHighlightSyntax } from '@shared/utils/highlight';

let highlightWorker = null;
let PREV_HTML_NODE_COUNT = -1;
let CONFIG = {};

const messagesFromReactAppListener = (message, sender, sendResponse) => {
  const sdr = sender.tab ? `from a content script:${sender.tab.url}` : 'from the extension';
  console.log(`[content] message received: ${message.type}, sender: ${sdr}`);

  if (message.type === EXT_MSG_TYPE_CONFIG_UPDATE) {
    console.log('[content] prevState:', message.payload?.prevState);
    console.log('[content] state: ', message.payload?.state);
    loadConfigAndAdjustStyle();
    sendResponse({ payload: true });
  }
  return true;
};

const sendMessage = async ({ type = '', payload = {} } = {}) => {
  console.log(`[content] going to send message. Message: ${type}`);

  const msg = { type, payload };
  const resp = await chrome.runtime.sendMessage(msg).catch(err => console.log(`[content] Error occurred while sending request. error: ${err}`));
  return resp?.payload;
};

const loadConfig = async () => {
  // The very first time after installation, background notifies popup to insert default config into chrome.storage
  // Since content script loads config before the initial/default config is stored, give it default value here
  const cache = await chrome.storage.sync.get(EXT_STORAGE_CONFIG);
  CONFIG = cache[EXT_STORAGE_CONFIG] || getDefaultConfig();
  return Object.keys(CONFIG).length > 0;
};

const insertCSS = async () =>
  new Promise(res => {
    const fontStyle = document.createElement('link');

    fontStyle.id = 'vocabulary-highlighter-font-style';
    fontStyle.rel = 'stylesheet';
    fontStyle.href = 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap';
    document.head.appendChild(fontStyle);
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

const getAllNodesFromDOM = () => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let currNode = walker.currentNode;
  let nodes = [];
  while (currNode) {
    nodes = [...nodes, currNode];
    currNode = walker.nextNode();
  }
  return nodes;
};

const shouldInsertHighlight = node =>
  node.parentNode != null &&
  node.parentNode.tagName !== 'STYLE' &&
  node.parentNode.tagName !== 'SCRIPT' &&
  node.parentNode.tagName !== 'NOSCRIPT' &&
  !node.parentNode.classList.contains(HIGHLIGHTER_CLASS) && // This is for text in the popup page
  !node.parentNode.classList.contains(HIGHLIGHTER_ORG_WORD_CLASS) &&
  !node.parentNode.classList.contains(HIGHLIGHTER_TARGET_WORD_CLASS) &&
  !node.parentNode.classList.contains(HIGHLIGHTER_DETAIL_ITEM_CLASS) &&
  node.nodeValue &&
  node.nodeValue.trim().length;

const shouldUpdate = node =>
  node.parentNode != null &&
  (node.parentNode.classList.contains(HIGHLIGHTER_ORG_WORD_CLASS) ||
    node.parentNode.classList.contains(HIGHLIGHTER_TARGET_WORD_CLASS) ||
    node.parentNode.classList.contains(HIGHLIGHTER_DETAIL_ITEM_CLASS) ||
    node.parentNode.classList.contains(HIGHLIGHTER_DETAIL_CLASS) ||
    node.parentNode.classList.contains(HIGHLIGHTER_LINK_CLASS));

const findWordsInNodes = (nodeValue, words) => {
  const parsed = nodeValue
    .replace(/[^a-z]/gi, ' ')
    .split(' ')
    .filter(val => val && words.has(val.toLowerCase()));
  return [...new Set(parsed)];
};

const highlightMatchedWords = (nodeValue, matchedWords, words) => {
  let value = nodeValue;
  matchedWords.forEach(word => {
    const arg = { config: CONFIG, orgWord: word, word: words.get(word.toLowerCase()) };
    value = value.replace(word, genHighlightSyntax(arg)); // TODO if target word is 'the', then 'therefore' will be effected
  });
  return value;
};

// const highlightWordOnclick = evt => {
//   evt.stopPropagation();
//   evt.stopImmediatePropagation();
//   // evt.preventDefault(); // This also blocks the link to dictionary
//   return False;
// };

const updateRelatedNodes = nodes => {
  const { highlightColor, language, fontSize, showDetail } = CONFIG;
  const highlightColorClass = HIGHLIGHTER_BG_COLOR_CLASS[highlightColor];
  const fontSizeClass = HIGHLIGHTER_FONT_SIZE_CLASS[fontSize];

  nodes
    .filter(node => shouldUpdate(node))
    .forEach(node => {
      const { parentNode } = node;
      const { classList } = parentNode;

      let flag = -1;
      if (classList.contains(HIGHLIGHTER_ORG_WORD_CLASS)) {
        flag = 0;
      } else if (classList.contains(HIGHLIGHTER_TARGET_WORD_CLASS)) {
        flag = 1;
      } else if (classList.contains(HIGHLIGHTER_DETAIL_ITEM_CLASS)) {
        flag = 2;
      } else if (classList.contains(HIGHLIGHTER_LINK_CLASS)) {
        flag = 3;
      }

      if (flag === 1) {
        const detailPopupNode = parentNode.parentNode;
        if (showDetail) {
          detailPopupNode.classList.remove(HIGHLIGHTER_DETAIL_HIDDEN_CLASS);
        } else {
          detailPopupNode.classList.add(HIGHLIGHTER_DETAIL_HIDDEN_CLASS);
        }
      }

      classList.remove(...classList);
      if (flag === 0) {
        classList.add(HIGHLIGHTER_ORG_WORD_CLASS);
        classList.add(highlightColorClass);
      } else if (flag === 1) {
        classList.add(HIGHLIGHTER_TARGET_WORD_CLASS);
        classList.add(fontSizeClass);
      } else if (flag === 2) {
        classList.add(HIGHLIGHTER_DETAIL_ITEM_CLASS);
        classList.add(fontSizeClass);
      } else if (flag === 3) {
        const word = parentNode.href.split('/').pop();
        const link = `${ONLINE_DIC_URL[language]}${word}`;
        classList.add(HIGHLIGHTER_LINK_CLASS);
        classList.add(fontSizeClass);
        parentNode.href = link;
      }
    });
};

const parseAllNodes = (nodes, words) => {
  const map = new Map();
  let cnt = 0;
  nodes
    .filter(node => shouldInsertHighlight(node))
    .forEach(node => {
      const matchedWords = findWordsInNodes(node.nodeValue, words);
      if (matchedWords.length) {
        // If we update parent node right now, subsequent nodes with same parent node may lose their parent node (node.parentNode becomes null)
        map.set(cnt++, { parent: node.parentNode, orgValue: node.nodeValue, newValue: highlightMatchedWords(node.nodeValue, matchedWords, words) });
      }
    });

  console.log(`[content] Update. number of nodes to update: ${map.size}`);
  for (const { parent, orgValue, newValue } of map.values()) {
    parent.innerHTML = parent.innerHTML.replace(orgValue, newValue);
    // parent.addEventListener('click', highlightWordOnclick);
  }
};

const loadConfigAndAdjustStyle = async () => {
  if (highlightWorker) {
    clearInterval(highlightWorker);
  }
  const prevConfig = CONFIG;
  await loadConfig();
  if (JSON.stringify(prevConfig) !== JSON.stringify(CONFIG)) {
    updateRelatedNodes(getAllNodesFromDOM());
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

  console.log(`[content] Start. number of words: ${words.size}, number of text nodes: ${nodes.length}`);
  PREV_HTML_NODE_COUNT = nodes.length;
  parseAllNodes(nodes, words);
};

const setup = async () => {
  const res1 = await loadConfig();
  const res2 = await insertCSS();
  const msg = res1 && res2 ? '[content] setup work completed' : '[content] setup work failed';
  console.log(msg);
};

const main = async () => {
  console.log('[content] content script start');

  await setup();
  exec();
  highlightWorker = setInterval(exec, EXT_CHECK_INTERVAL);

  // The runtime.onMessage event is fired in each content script running in the specified tab for the extension.
  // Fired when a message is sent from either an extension process or a content script
  // see: https://developer.chrome.com/docs/extensions/reference/tabs/#method-query
  chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
};

setTimeout(main, 1000);
