import { useEffect, useRef, useState } from 'react';

import { getStorage } from '@browsers/storage';
import { HIGHLIGHTER_CHECK_INTERVAL } from '@constants/index';
import { EXT_MSG_TYPE_CONFIG_UPDATE } from '@constants/messages';
import { EXT_STORAGE_CONFIG } from '@constants/storage';
import { getAllWords } from '@content/Highlighter/data';
import { parseAllNodes } from '@content/Highlighter/injectHighlight';
import { insertFontStyles, insertIcons } from '@content/Highlighter/scripts';
import { updateExtensionNodes } from '@content/Highlighter/updateHighlight';
import usePrevious from '@hooks/usePrevious';
import { getDefaultConfig, isConfigEqual } from '@utils/config';
import { getAllNodesFromDOM } from '@utils/dom';

import Browser from 'webextension-polyfill';

const Highlighter = () => {
  const [config, setConfig] = useState({});
  const prevConfig = usePrevious(config); // Initial value is undefined
  const prevWebNodeCount = useRef(-1);
  const [isSetup, setIsSetup] = useState(true);

  const exec = async () => {
    const nodes = getAllNodesFromDOM();
    if (nodes.length === prevWebNodeCount.current) {
      return;
    }
    const words = await getAllWords();

    // console.log(`[content] Start. number of words: ${words.size}, number of text nodes: ${nodes.length}. Config: ${JSON.stringify(config)}`);
    prevWebNodeCount.current = nodes.length;
    parseAllNodes(nodes, words, config);
  };

  const loadConfig = async () => {
    // The very first time after installation, background notifies popup to insert default config into chrome.storage
    // Since content script loads config before the initial (default) config is stored, give it default value here
    const cache = await getStorage({ type: 'sync', key: EXT_STORAGE_CONFIG });
    const c = cache[EXT_STORAGE_CONFIG] || getDefaultConfig();
    if (!isConfigEqual(c, config)) {
      setConfig(c);
    }
    return c;
  };

  const insertCSS = async () =>
    new Promise(res => {
      insertFontStyles();
      insertIcons();
      res(true);
    });

  const setup = async () => {
    await Promise.all([loadConfig(), insertCSS()]);
    setIsSetup(false);
  };

  const onConfigUpdate = async () => {
    const latestConfig = await loadConfig();
    if (!isConfigEqual(latestConfig, prevConfig)) {
      updateExtensionNodes(getAllNodesFromDOM(), latestConfig); // Should pass the latest config and not rely on setState
    }
  };

  const onMessageListener = (message, sender, sendResponse) => {
    // const sdr = sender.tab ? `from a content script:${sender.tab.url}` : 'from the extension';
    // console.log(`[content] message received: ${message.type}, sender: ${sdr}`);

    if (message.type === EXT_MSG_TYPE_CONFIG_UPDATE) {
      // console.log(`[content] prevState: ${message.payload?.prevState}. state: ${message.payload?.state}`);
      onConfigUpdate();
      sendResponse({ payload: true });
    }
    return true;
  };

  const handleExtensionMessage = () => {
    Browser.runtime.onMessage.addListener(onMessageListener);
  };

  useEffect(() => {
    if (isSetup) {
      return;
    }
    exec();
    const interval = setInterval(() => {
      exec();
    }, HIGHLIGHTER_CHECK_INTERVAL);
    return () => clearInterval(interval);
  }, [config]);

  useEffect(() => {
    setup();
    handleExtensionMessage();
  }, []);

  return null;
};

export default Highlighter;
