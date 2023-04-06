import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Browser from 'webextension-polyfill';

import { getStorage, setStorage } from '@browsers/storage';
import { EXT_MSG_TYPE_COLLECTED_WORD_LIST_UPDATE, EXT_MSG_TYPE_CONFIG_UPDATE, EXT_MSG_TYPE_GET_WORD_LIST, EXT_MSG_TYPE_INIT_SETUP } from '@constants/messages';
import { EXT_STORAGE_DAILY_WORD } from '@constants/storage';
import { ExtensionMessageContext } from '@hooks/useExtensionMessageContext';
import { logger } from '@utils/logger';
import { isSameDay } from '@utils/time';
import { genWordDetailList, getRandomWordFromList } from '@utils/word';

/*
 * Note: if there's any elements that you don't want to be highlighted, add class="HIGHLIGHTER_CLASS" to it's tag
 */

const storeDailyWord = word => setStorage({ type: 'local', key: EXT_STORAGE_DAILY_WORD, value: { word, timestamp: new Date().toJSON() } });

const setupDailyWord = async () => {
  const cache = await getStorage({ type: 'local', key: EXT_STORAGE_DAILY_WORD });
  const { word, timestamp } = cache[EXT_STORAGE_DAILY_WORD] || {};
  if (word && isSameDay(new Date(timestamp), new Date())) {
    return word;
  }

  const w = getRandomWordFromList();
  await storeDailyWord(w);
  return w;
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

  /*
   * Since this function is registered to the listener in the beginning, the setExtMessageValue becomes a "stale" version
   * Even if using the callback function syntax cannot let us get the latest value
   */
  const onMessageListener = (message, sender, sendResponse) => {
    const sdr = sender.tab ? `from a content script :${sender.tab.url}` : 'from the extension';
    logger(`[popup] message received: ${message.type}. Sender: ${sdr}`);

    switch (message.type) {
      case EXT_MSG_TYPE_INIT_SETUP:
        // Triggered by background's onInstall event listener
        break;
      case EXT_MSG_TYPE_GET_WORD_LIST:
        // Triggered by context script to setup wordlist
        sendResponse({ payload: JSON.stringify(genWordDetailList()) });
        break;
      case EXT_MSG_TYPE_CONFIG_UPDATE:
      case EXT_MSG_TYPE_COLLECTED_WORD_LIST_UPDATE:
        // Whenever a tab update the config, it sends a message to notify all other tabs
        setExtMessageValue(prev => ({ ...prev, config: message.payload.state }));
        break;
      // case EXT_MSG_TYPE_COLLECTED_WORD_LIST_UPDATE:
      //   // Note that the value of prev will ALWAYS EQUAL TO THE INITIAL VALUE of extMessageValue!
      //   setExtMessageValue(prev => ({ ...prev, config: { ...prev.config, collectedWords: [...(prev.config?.collectedWords || []), message.payload.id] } }));
      //   break;
      default:
        break;
    }
    return true;
  };

  const handleExtensionMessage = () => {
    Browser.runtime.onMessage.addListener(onMessageListener);
  };

  useEffect(() => {
    handleDailyWord();
    handleExtensionMessage();
  }, []);

  return <ExtensionMessageContext.Provider value={extMessageValue}>{children}</ExtensionMessageContext.Provider>;
};

PopupManager.propTypes = {
  children: PropTypes.element.isRequired,
};

export default PopupManager;
