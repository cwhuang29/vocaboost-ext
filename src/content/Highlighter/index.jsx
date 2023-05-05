import React, { useEffect, useRef, useState } from 'react';
import Browser from 'webextension-polyfill';

import { sendMessage } from '@browsers/message';
import { EVENT_TYPE } from '@constants/browser';
import {
  CONTENT_SCRIPT_ROOT_CLASS,
  HIGHLIGHTER_CHECK_INTERVAL,
  HIGHLIGHTER_DETAIL_CLASS,
  HIGHLIGHTER_ORG_WORD_CLASS,
  HIGHLIGHTER_POPUP_IS_SHOWING_CLASS,
} from '@constants/index';
import { EXT_MSG_TYPE_COLLECTED_WORD_LIST_UPDATE, EXT_MSG_TYPE_CONFIG_UPDATE } from '@constants/messages';
import { POPUP_MAX_WIDTH } from '@constants/styles';
import { parseAllNodes } from '@content/Highlighter/injectHighlight';
import { insertFontStyles } from '@content/Highlighter/scripts';
import { updateWebContent } from '@content/Highlighter/updateHighlight';
import { DEFAULT_CONFIG, getConfig, setURLToConfigFormat, shouldUpdateConfig, storeConfig, trySyncUpConfigToServer } from '@utils/config';
import { getAllTextNodesFromDOM } from '@utils/dom';
import { getAllWords, getDetailDisplayPos } from '@utils/highlight';
import { logger } from '@utils/logger';
import { getLocalDate } from '@utils/time';

import Detail from './Detail';

/*
 * Note that all customizations set by user except collecting words are passively updated, i.e., only the collect words operation is immediately reflected on other tabs
 */

const registerGlobalEventHandler = listener => {
  document.addEventListener('click', listener(EVENT_TYPE.CLICK));
  document.addEventListener('mousemove', listener(EVENT_TYPE.HOVER));
};

const Highlighter = () => {
  const [config, setConfig] = useState({});
  const [isInit, setIsInit] = useState(true);
  const [wordData, setWordData] = useState({});
  const [posStyle, setPosStyle] = useState({});
  const [showPopupHover, setShowPopupHover] = useState(false);
  const [showPopupClick, setShowPopupClick] = useState(false);
  const wordList = useRef({});
  const prevConfig = useRef({});
  const prevWebNodeCount = useRef(-1);

  const closePopup = type => {
    if (type === EVENT_TYPE.CLICK) {
      document.getElementById(CONTENT_SCRIPT_ROOT_CLASS).classList.remove(HIGHLIGHTER_POPUP_IS_SHOWING_CLASS);
      setShowPopupClick(false);
    } else {
      setShowPopupHover(false);
    }
  };

  const showPopup = ({ type, word, ...posInfo }) => {
    const displayPos = getDetailDisplayPos({ ...posInfo, width: POPUP_MAX_WIDTH });
    setPosStyle({ left: `${displayPos.x}px`, top: `${displayPos.y}px` });
    setWordData(wordList.current.get(word));

    if (type === EVENT_TYPE.CLICK) {
      document.getElementById(CONTENT_SCRIPT_ROOT_CLASS).classList.add(HIGHLIGHTER_POPUP_IS_SHOWING_CLASS);
      setShowPopupClick(true);
    } else {
      setShowPopupHover(true);
    }
  };

  const shouldShowPopup = ({ evtType, evt }) => {
    const isTarget = evt.target.classList.contains(HIGHLIGHTER_ORG_WORD_CLASS);
    const hasClicked = document.getElementById(CONTENT_SCRIPT_ROOT_CLASS).classList.contains(HIGHLIGHTER_POPUP_IS_SHOWING_CLASS);
    // evtType === 'click' || (evtType === 'hover' && !showPopupClick) -> ERROR. Due to showPopupClick will always be false (due to closure):
    return isTarget && (evtType === EVENT_TYPE.CLICK || (evtType === EVENT_TYPE.HOVER && !hasClicked));
  };

  const shouldKeepShowingPopup = ({ evtType, evt }) => {
    const concernedNodes = [evt.target, evt.target.parentNode, evt.target.parentNode?.parentNode];
    const evtWasWithinPopup = concernedNodes.some(node => node?.classList?.contains(HIGHLIGHTER_DETAIL_CLASS) || node?.tagName === 'IMG');
    return evtType === EVENT_TYPE.CLICK && evtWasWithinPopup;
  };

  const globalListener = evtType => evt => {
    const toShow = shouldShowPopup({ evtType, evt });
    const toKeepShow = shouldKeepShowingPopup({ evtType, evt });

    if (toShow) {
      showPopup({
        type: evtType,
        word: evt.target.innerHTML.toLowerCase(),
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

  const exec = () => {
    const nodes = getAllTextNodesFromDOM();
    if (nodes.length !== prevWebNodeCount.current) {
      logger(`[content] Start. number of words: ${wordList.current.size}, number of text nodes: ${nodes.length}. Config: ${JSON.stringify(config)}`);
      prevWebNodeCount.current = nodes.length;
      parseAllNodes(nodes, wordList.current, config);
    }
  };

  const entrypoint = () => {
    if (isInit) {
      return;
    }
    prevConfig.current = { ...config }; // By now, tryUpdateWebContent() had executed
    if (config.suspendedPages.includes(setURLToConfigFormat(window.location))) {
      return;
    }
    exec();
    const interval = setInterval(() => exec(), HIGHLIGHTER_CHECK_INTERVAL);
    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval);
  };

  useEffect(() => {
    const cleanup = entrypoint();
    return cleanup;
  }, [JSON.stringify(config)]);

  const loadWordList = async language => {
    // Word lists were prepared and stored into browser storage by service worker. Processing such a large amount of data in content script can paralyze it
    wordList.current = await getAllWords(language);
  };

  const updateWordListAndWordData = async ({ language }) => {
    await loadWordList(language);
    const newWordData = wordList.current.get(wordData.word);
    if (newWordData) {
      setWordData(newWordData);
    }
  };

  const loadConfig = async ({ syncToBackend = false } = {}) => {
    const cache = await getConfig();
    const isEmpty = !cache;
    let latestConfig = isEmpty ? DEFAULT_CONFIG : cache;

    let isStale = null;
    if (syncToBackend && !isEmpty) {
      const result = await trySyncUpConfigToServer(cache);
      latestConfig = result.latestConfig;
      isStale = result.isStale;
    }

    if (isStale || shouldUpdateConfig({ currConfig: latestConfig, prevConfig: config })) {
      if (!isStale) {
        await storeConfig(latestConfig);
      }
      setConfig(latestConfig);
      return latestConfig;
    }
    return null;
  };

  const updateConfig = async ({ isFirstTime = false } = {}) => {
    const latestConfig = await loadConfig({ syncToBackend: isFirstTime });
    if (!isFirstTime) {
      updateWebContent(latestConfig, prevConfig.current);
    }
    if (config?.language !== latestConfig.language) {
      updateWordListAndWordData({ language: latestConfig.language });
    }
  };

  const onMessageListener = (message, sender, sendResponse) => {
    const sdr = sender.tab ? `from a content script: ${sender.tab.url}` : 'from the extension';
    logger(`[content] message received: ${message.type}, sender: ${sdr}`);

    switch (message.type) {
      case EXT_MSG_TYPE_CONFIG_UPDATE:
        logger(`[content] prevState: ${JSON.stringify(message.payload?.prevState)}. state: ${JSON.stringify(message.payload?.state)}`);
        updateConfig();
        sendResponse({ payload: true });
        break;
      case EXT_MSG_TYPE_COLLECTED_WORD_LIST_UPDATE:
        setConfig(message.payload.state);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // Re-register browser event listener every time the config changes or wordData changes (initial value is {}) to retrieve latest values in callback functions
    Browser.runtime.onMessage.addListener(onMessageListener);
    return () => Browser.runtime.onMessage.removeListener(onMessageListener);
  }, [JSON.stringify(config), wordData.word]);

  const insertCSS = async () =>
    new Promise(res => {
      insertFontStyles();
      res(true);
    });

  const setup = async () => {
    registerGlobalEventHandler(globalListener);
    await loadWordList(DEFAULT_CONFIG.language); // Later when we load the config, the word list might change if necessary
    await Promise.all([updateConfig({ isFirstTime: true }), insertCSS()]);
    setIsInit(false);
  };

  useEffect(() => {
    setup();
  }, []);

  const onCollectWord =
    ({ id, isCollected }) =>
    async () => {
      // Background and all the currently opened popups receive this message directly
      // Background syncs up latest config with server, stores to storage, and redirects message to other content-scripts
      const newConfig = {
        ...config,
        collectedWords: isCollected ? config.collectedWords.filter(wordId => wordId !== id) : [...config.collectedWords, id],
        updatedAt: getLocalDate(),
      };
      const { latestConfig, isStale } = await trySyncUpConfigToServer(newConfig);
      if (!isStale) {
        await storeConfig(latestConfig);
      }
      await sendMessage({ type: EXT_MSG_TYPE_COLLECTED_WORD_LIST_UPDATE, payload: { state: newConfig, prevState: config } });
      setConfig(latestConfig);
    };

  const isCollected = config.collectedWords?.includes(wordData?.id); // Note that config takes a while to load in the beginning

  const suspendThisPage = config.suspendedPages?.includes(setURLToConfigFormat(window.location));

  const displayPopup = !suspendThisPage && config.showDetail && wordData && (showPopupHover || showPopupClick);

  return (
    !isInit && (
      <Detail
        display={displayPopup}
        posStyle={posStyle}
        wordData={wordData}
        language={config.language}
        fontSize={config.fontSize}
        isCollected={isCollected}
        onCollectWord={onCollectWord}
      />
    )
  );
};
export default Highlighter;
