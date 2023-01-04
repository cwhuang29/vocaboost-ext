import React, { useEffect, useState } from 'react';

import { ExtensionMessageContext } from '@hooks/useExtensionMessageContext';
import { getStorage, setStorage } from '@popup/helpers/storage';
import { EXT_MSG_TYPE_CONFIG_UPDATE, EXT_MSG_TYPE_GET_WORD_LIST, EXT_MSG_TYPE_INIT_SETUP } from '@shared/constants/messages';
import { EXT_STORAGE_CONFIG, EXT_STORAGE_DAILY_WORD } from '@shared/constants/storage';
import { getDefaultConfig } from '@shared/utils/config';
import { isSameDay } from '@shared/utils/time';
import { genWordDetailList } from '@shared/utils/word';

/*
 * Note: if there's any elements that you don't want to be highlighted, add class="HIGHLIGHTER_CLASS" to it's tag
 * e.g., there is daily word displayed on the extension popup. To prevent it from  being highlighted, the HIGHLIGHTER_CLASS is added
 */

const storeDailyWord = word => setStorage({ type: 'sync', key: EXT_STORAGE_DAILY_WORD, value: { word, timestamp: new Date().toJSON() } });

const setupDailyWord = async () => {
  const cache = await getStorage({ type: 'sync', key: EXT_STORAGE_DAILY_WORD });
  const { word, timestamp } = cache[EXT_STORAGE_DAILY_WORD] || {};
  if (word && isSameDay(new Date(timestamp), new Date())) {
    return word;
  }

  const wordList = genWordDetailList();
  let w = wordList[Math.floor(Math.random() * wordList.length)];
  while (!w?.detail[0]?.meaning?.en) {
    w = wordList[Math.floor(Math.random() * wordList.length)];
  }
  await storeDailyWord(w);
  return w;
};

const setupDefaultConfigIfNotExist = async () => {
  let config = await getStorage({ type: 'sync', key: EXT_STORAGE_CONFIG });
  if (!config || Object.keys(config).length === 0) {
    config = getDefaultConfig();
    await setStorage({ type: 'sync', key: EXT_STORAGE_CONFIG, value: config });
  }
  // console.log(`[popup] get config after installation. Config: ${config}`);
};

const PopupManager = ({ children }) => {
  const [extMessageValue, setExtMessageValue] = useState({});

  const handleDailyWord = async () => {
    const dailyWord = await setupDailyWord();
    if (!extMessageValue.dailyWord?.word !== dailyWord.word) {
      setExtMessageValue(prev => ({ ...prev, dailyWord }));
      // setExtMessageValue({ ...extMessageValue, dailyWord }); // Error: the specify key will update yet other parts will be lost
    }
  };

  const handleExtensionMessage = () => {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      // const sdr = sender.tab ? `from a content script:${sender.tab.url}` : 'from the extension';
      // console.log(`[popup] message received: ${message.type}. Sender: ${sdr}`);

      switch (message.type) {
        case EXT_MSG_TYPE_INIT_SETUP:
          // Triggered by background's onInstall event listener
          setupDefaultConfigIfNotExist();
          break;
        case EXT_MSG_TYPE_GET_WORD_LIST:
          // Triggered by context script periodically
          sendResponse({ payload: JSON.stringify(genWordDetailList()) });
          break;
        case EXT_MSG_TYPE_CONFIG_UPDATE:
          // Whenever a tab update the config, it sends a message to notify all other tabs
          setExtMessageValue(prev => ({ ...prev, config: message.payload.state }));
          break;
        default:
          break;
      }
      return true;
    });
  };

  useEffect(() => {
    // console.log('[popup] start execute');

    handleDailyWord();
    handleExtensionMessage();
  }, []);

  return <ExtensionMessageContext.Provider value={extMessageValue}>{children}</ExtensionMessageContext.Provider>;
};

PopupManager.propTypes = {
  children: Proptypes.element.isRequired,
};

export default PopupManager;
