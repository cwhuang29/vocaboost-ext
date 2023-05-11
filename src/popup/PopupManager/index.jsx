import React, { useEffect, useState } from 'react';
import Browser from 'webextension-polyfill';
import PropTypes from 'prop-types';

import { getStorage, setStorage } from '@browsers/storage';
import { EXT_MSG_TYPE_COLLECTED_WORD_LIST_UPDATE, EXT_MSG_TYPE_CONFIG_UPDATE, EXT_MSG_TYPE_GET_WORD_LIST } from '@constants/messages';
import { EXT_STORAGE_DAILY_WORD } from '@constants/storage';
import { ExtensionMessageContext } from '@hooks/useExtensionMessageContext';
import { logger } from '@utils/logger';
import { getLocalDate, isSameDay } from '@utils/time';
import { getRandomWordFromList } from '@utils/word';

/*
 * Note: if there's any elements that you don't want to be highlighted, add class="HIGHLIGHTER_CLASS" to it's tag
 */

const storeDailyWord = word => setStorage({ type: 'local', key: EXT_STORAGE_DAILY_WORD, value: { word, timestamp: getLocalDate().toJSON() } });

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
    if (extMessageValue.dailyWord?.word !== dailyWord.word) {
      setExtMessageValue(prev => ({ ...prev, dailyWord }));
    }
  };

  /*
   * Since this function is registered to the listener in the beginning, the setExtMessageValue becomes a "stale" version
   * Even if using the callback function syntax cannot let us get the latest value
   */
  const onMessageListener = (message, sender) => {
    const sdr = sender.tab ? `from a content script :${sender.tab.url}` : 'from the extension';
    logger(`[popup] message received: ${message.type}. Sender: ${sdr}`);

    switch (message.type) {
      case EXT_MSG_TYPE_CONFIG_UPDATE:
      case EXT_MSG_TYPE_COLLECTED_WORD_LIST_UPDATE:
        // Whenever a tab update the config, it sends a message to notify all other tabs
        setExtMessageValue(prev => ({ ...prev, config: message.payload.state }));
        break;
      case EXT_MSG_TYPE_GET_WORD_LIST:
        // Triggered by context script to setup wordlist. Not workable since popup only runs when user open it
        // sendResponse({ payload: JSON.stringify(genWordDetailList()) });
        break;
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
  children: PropTypes.node.isRequired,
};

export default PopupManager;
