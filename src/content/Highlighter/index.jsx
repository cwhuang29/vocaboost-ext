import React, { useEffect, useRef, useState } from 'react';
import Browser from 'webextension-polyfill';

import menuBookIcon from '@/../assets/menu_book.svg';
import { getStorage } from '@browsers/storage';
import { EVENT_TYPE } from '@constants/browser';
import {
  CONTENT_SCRIPT_ROOT_CLASS,
  HIGHLIGHTER_CHECK_INTERVAL,
  HIGHLIGHTER_DEF_CLASS,
  HIGHLIGHTER_DETAIL_CLASS,
  HIGHLIGHTER_DETAIL_ITEM_CLASS,
  HIGHLIGHTER_FONT_SIZE_CLASS,
  HIGHLIGHTER_ICON_CLASS,
  HIGHLIGHTER_ORG_WORD_CLASS,
  HIGHLIGHTER_POPUP_IS_SHOWING_CLASS,
  HIGHLIGHTER_POS_CLASS,
  HIGHLIGHTER_TARGET_WORD_CLASS,
  LANGS,
  ONLINE_DIC_URL,
  PARTS_OF_SPEECH_SHORTHAND,
} from '@constants/index';
import { EXT_MSG_TYPE_CONFIG_UPDATE } from '@constants/messages';
import { EXT_STORAGE_CONFIG } from '@constants/storage';
import { POPUP_MAX_WIDTH } from '@constants/styles';
import { getAllWords } from '@content/Highlighter/data';
import { parseAllNodes } from '@content/Highlighter/injectHighlight';
import { insertFontStyles } from '@content/Highlighter/scripts';
import { tryUpdateWebContent } from '@content/Highlighter/updateHighlight';
import { DEFAULT_CONFIG, isConfigEqual } from '@utils/config';
import { getAllTextNodesFromDOM } from '@utils/dom';
import { constructWordExample } from '@utils/highlight';
import { logger } from '@utils/logger';

const getDisplayPos = ({ x, y, offsetX, offsetY, maxX, width }) => {
  const delta = 12;
  const xx = Math.max(0, x + offsetX + delta - Math.max(0, x + delta + width - maxX));
  const yy = y + offsetY + delta;
  return { x: xx, y: yy };
};

const Highlighter = () => {
  const [config, setConfig] = useState({});
  const [isInit, setIsInit] = useState(true);
  const [wordData, setWordData] = useState({});
  const [posStyle, setPosStyle] = useState({});
  const [showPopupHover, setShowPopupHover] = useState(false);
  const [showPopupClick, setShowPopupClick] = useState(false);
  const words = useRef({});
  const prevConfig = useRef({});
  const prevWebNodeCount = useRef(-1);

  const showPopup = ({ type, word, ...posInfo }) => {
    const displayPos = getDisplayPos({ ...posInfo, width: POPUP_MAX_WIDTH });
    setPosStyle({ left: `${displayPos.x}px`, top: `${displayPos.y}px` });
    setWordData(words.current.get(word));

    if (type === EVENT_TYPE.CLICK) {
      document.getElementById(CONTENT_SCRIPT_ROOT_CLASS).classList.add(HIGHLIGHTER_POPUP_IS_SHOWING_CLASS);
      setShowPopupClick(true);
    } else {
      setShowPopupHover(true);
    }
  };

  const closePopup = type => {
    if (type === EVENT_TYPE.CLICK) {
      document.getElementById(CONTENT_SCRIPT_ROOT_CLASS).classList.remove(HIGHLIGHTER_POPUP_IS_SHOWING_CLASS);
      setShowPopupClick(false);
    } else {
      setShowPopupHover(false);
    }
  };

  const shouldShowPopup = ({ evtType, evt }) => {
    const isTarget = evt.target.classList.contains(HIGHLIGHTER_ORG_WORD_CLASS);
    const hasClicked = document.getElementById(CONTENT_SCRIPT_ROOT_CLASS).classList.contains(HIGHLIGHTER_POPUP_IS_SHOWING_CLASS);
    // evtType === 'click' || (evtType === 'hover' && !showPopupClick) -> ERROR. Due to showPopupClick will always be false (due to toclosure):
    return isTarget && (evtType === EVENT_TYPE.CLICK || (evtType === EVENT_TYPE.HOVER && !hasClicked));
  };

  const shouldKeepShowingPopup = ({ evtType, evt }) => {
    const concernedNodes = [evt.target, evt.target.parentNode, evt.target.parentNode?.parentNode];
    const evtWasWithinPopup = concernedNodes.some(node => node?.classList?.contains(HIGHLIGHTER_DETAIL_CLASS));
    return evtType === EVENT_TYPE.CLICK && evtWasWithinPopup;
  };

  const globalListener = evtType => evt => {
    const toShow = shouldShowPopup({ evtType, evt });
    const toKeepShow = shouldKeepShowingPopup({ evtType, evt });

    if (toShow) {
      showPopup({
        type: evtType,
        word: evt.target.innerHTML,
        x: evt.clientX,
        y: evt.clientY,
        offsetX: window.pageXOffset,
        offsetY: window.pageYOffset,
        maxX: window.innerWidth,
        maxY: window.innerHeight,
      });
    } else if (toKeepShow) {
      // Do nothing
    } else {
      closePopup(evtType);
    }
  };

  const exec = async () => {
    const nodes = getAllTextNodesFromDOM();
    if (nodes.length === prevWebNodeCount.current) {
      return;
    }
    logger(`[content] Start. number of words: ${words.current.size}, number of text nodes: ${nodes.length}. Config: ${JSON.stringify(config)}`);
    prevWebNodeCount.current = nodes.length;
    parseAllNodes(nodes, words.current, config);
  };

  const loadConfig = async () => {
    const cache = await getStorage({ type: 'sync', key: EXT_STORAGE_CONFIG });
    const c = cache[EXT_STORAGE_CONFIG] || DEFAULT_CONFIG;
    if (!isConfigEqual(c, config)) {
      setConfig(c);
      return c;
    }
    return null;
  };

  const insertCSS = async () =>
    new Promise(res => {
      insertFontStyles();
      res(true);
    });

  const loadWords = async () => {
    words.current = await getAllWords();
  };

  const registerGlobalEventHandler = () => {
    document.addEventListener('click', globalListener(EVENT_TYPE.CLICK));
    document.addEventListener('mousemove', globalListener(EVENT_TYPE.HOVER));
  };

  const setup = async () => {
    await Promise.all([loadConfig(), insertCSS(), loadWords(), registerGlobalEventHandler()]);
    setIsInit(false);
  };

  const onConfigUpdate = async () => {
    const latestConfig = await loadConfig();
    tryUpdateWebContent(latestConfig, prevConfig.current);
  };

  const onMessageListener = (message, sender, sendResponse) => {
    const sdr = sender.tab ? `from a content script: ${sender.tab.url}` : 'from the extension';
    logger(`[content] message received: ${message.type}, sender: ${sdr}`);

    if (message.type === EXT_MSG_TYPE_CONFIG_UPDATE) {
      logger(`[content] prevState: ${message.payload?.prevState}. state: ${message.payload?.state}`);
      onConfigUpdate();
      sendResponse({ payload: true });
    }
    return true;
  };

  const handleExtensionMessage = () => {
    Browser.runtime.onMessage.addListener(onMessageListener);
    return () => chrome.runtime.onMessage.removeListener(onMessageListener);
  };

  useEffect(() => {
    if (isInit) {
      return;
    }
    prevConfig.current = { ...config }; // usePrevious is not working properly in content-script
    exec();
    const interval = setInterval(() => exec(), HIGHLIGHTER_CHECK_INTERVAL);
    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval);
  }, [config]);

  useEffect(() => {
    setup();
    const cleanup = handleExtensionMessage();
    return () => cleanup();
  }, []);

  return (
    (showPopupHover || showPopupClick) &&
    config.showDetail && (
      <div className={HIGHLIGHTER_DETAIL_CLASS} style={{ ...posStyle }}>
        <div style={{ display: 'flex' }}>
          <div className={`${HIGHLIGHTER_TARGET_WORD_CLASS} ${HIGHLIGHTER_FONT_SIZE_CLASS[config.fontSize]}`}>{wordData.word}</div>
          <a
            className={HIGHLIGHTER_ICON_CLASS}
            href={`${ONLINE_DIC_URL[config.language]}${wordData.word}`}
            data-word={wordData.word}
            target='_blank'
            rel='noopener noreferrer'
          >
            <img src={Browser.runtime.getURL(menuBookIcon)} alt='' width={26} style={{ filter: 'invert(92%)', width: '26px' }} />
          </a>
        </div>
        {wordData.detail.map(
          ({ meaning, partsOfSpeech, example }) =>
            partsOfSpeech && (
              <div
                className={`${HIGHLIGHTER_DETAIL_ITEM_CLASS} ${HIGHLIGHTER_FONT_SIZE_CLASS[config.fontSize]}`}
                key={`${partsOfSpeech}-${example.slice(0, 10)}`}
              >
                <span className={HIGHLIGHTER_POS_CLASS}>{PARTS_OF_SPEECH_SHORTHAND[partsOfSpeech]}</span>
                <span className={HIGHLIGHTER_DEF_CLASS}>
                  {meaning[LANGS[config.language]] || (LANGS[config.language].startsWith('zh') ? meaning[LANGS.zh_TW] : meaning[LANGS.en])}
                </span>
                <br />
                {constructWordExample(example)}
              </div>
            )
        )}
      </div>
    )
  );
};

export default Highlighter;
