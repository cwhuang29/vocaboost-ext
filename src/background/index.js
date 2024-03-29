import Browser from 'webextension-polyfill';

import { BROWSER_ONINSTALL_REASON } from '@constants/browser';
import { EXT_MSG_TYPE_COLLECTED_WORD_LIST_UPDATE, EXT_MSG_TYPE_OAUTH_LOGIN } from '@constants/messages';
import { logger } from '@utils/logger';
import { isArray, isObject } from '@utils/misc';

import { oauthLogin, onCollectedWordsUpdate } from './helper';
import { storeEssentialDataOnInstall, updateIfNeeded } from './init';

const onInstalledListener = details => {
  // Browser.tabs.create({ url: Browser.runtime.getURL('index.html') }); // A trick to force the execution of popup code on installation

  if (details.reason === BROWSER_ONINSTALL_REASON.INSTALL) {
    storeEssentialDataOnInstall(); // Background is more suitable to perform setup than popup. Popup will not be executed unless it get launched in a new tab or user clicks the icon
  } else if (details.reason === BROWSER_ONINSTALL_REASON.UPDATE) {
    updateIfNeeded();
  }
};

// eslint-disable-next-line consistent-return
const onMessageListener = async (message, sender, sendResponse) => {
  const sdr = sender.tab ? `from a content script: ${sender.tab.url}` : 'from the extension';
  logger(`[background] message received: ${message.type}. Sender: ${sdr}`);

  switch (message.type) {
    case EXT_MSG_TYPE_COLLECTED_WORD_LIST_UPDATE:
      await onCollectedWordsUpdate(message);
      return true;
    case EXT_MSG_TYPE_OAUTH_LOGIN:
      const resp = await oauthLogin(message, sendResponse);
      return resp;
    default:
      break;
  }
};

const onStorageChangedListener = (changes, namespace) => {
  for (const [key, { oldValue = '<empty>', newValue = '<empty>' }] of Object.entries(changes)) {
    let oldVal = oldValue ?? '<empty>';
    let newVal = newValue ?? '<empty>';
    oldVal = isObject(oldVal) || isArray(oldVal) ? JSON.stringify(oldVal) : oldValue;
    newVal = isObject(newVal) || isArray(newVal) ? JSON.stringify(newVal) : newValue;
    const msg = `Storage key "${key}" in namespace "${namespace}" changed. Old value was "${oldVal}", new value is "${newVal}"`;
    logger(msg);
  }
};

Browser.runtime.onMessage.addListener(onMessageListener);
Browser.runtime.onInstalled.addListener(onInstalledListener);
Browser.storage.onChanged.addListener(onStorageChangedListener);

// Fired when an alarm has elapsed
// Browser.alarms.onAlarm.addListener(() => { });

// Open an URL on uninstallation of the extension
// Browser.runtime.setUninstallURL()

// This will run when a bookmark is created.
// Browser.bookmarks.onCreated.addListener(() => { });

// notifications.onClicked: The user clicked in a non-button area of the notification
// notifications.onButtonClicked: The user pressed a button in the notification
// Browser.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
//   logger("[background] notification's button clicked", notificationId, buttonIndex); // Button id starts with zero
//   Browser.alarms.create({ delayInMinutes: 1 }); // Chrome limits alarms to at most once every 1 minute but may delay them an arbitrary amount more
// });
