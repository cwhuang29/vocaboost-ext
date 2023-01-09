import Browser from 'webextension-polyfill';

import { sendMessage } from '@browsers/message';
import { BROWSER_ONINSTALL_REASON } from '@constants/browser';
import { BACKGROUND_INIT_SETUP_DELAY } from '@constants/index';
import { EXT_MSG_TYPE_INIT_SETUP } from '@constants/messages';

/*
 * See: https://developer.chrome.com/docs/extensions/mv3/user_interface/
 * To use the Action API, the extension's manifest must contain an "action" key
 * The Action API controls the extension's action (toolbar icon). It can either open a popup or trigger some functionality when it's clicked.
 * It's possible to register an OnClicked handler for when the user clicks the action item. However, this won't fire if the action has a popup (default or otherwise).
 */

const onInstalledListener = details => {
  Browser.storage.local.clear();
  Browser.tabs.create({ url: Browser.runtime.getURL('index.html') }); // e.g. chrome-extension://dgkojjmldclhegjngnibipblnclmohod/index.html

  if (details.reason === BROWSER_ONINSTALL_REASON.INSTALL) {
    // TODO a better way is to let popup notify background whenever it is ready then send this message
    setTimeout(() => sendMessage({ type: EXT_MSG_TYPE_INIT_SETUP }), BACKGROUND_INIT_SETUP_DELAY);
  }
};

// eslint-disable-next-line
const onMessageListener = (message, sender, sendResponse) => {
  // const sdr = sender.tab ? `from a content script:${sender.tab.url}` : 'from the extension';
  // console.log(`[background] message received: ${message.type}. Sender: ${sdr}`);
  return true;
};

Browser.runtime.onMessage.addListener(onMessageListener);
Browser.runtime.onInstalled.addListener(onInstalledListener);

/*
 * Fired when one or more storage items change
 */
// Browser.storage.onChanged.addListener((changes, namespace) => {
//   for (const [key, { oldValue = '<empty>', newValue = '<empty>' }] of Object.entries(changes)) {
//     const oldVal = oldValue.constructor === Object ? JSON.stringify(oldValue) : oldValue;
//     const newVal = newValue.constructor === Object ? JSON.stringify(newValue) : newValue;
//     const msg = `Storage key "${key}" in namespace "${namespace}" changed. Old value was "${oldVal}", new value is "${newVal}"`;
//     console.log(msg);
//   }
// });

// notifications.onClicked: The user clicked in a non-button area of the notification
// notifications.onButtonClicked: The user pressed a button in the notification
// Browser.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
//   console.log("[background] notification's button clicked", notificationId, buttonIndex); // Button id starts with zero
//   Browser.alarms.create({ delayInMinutes: 1 }); // Chrome limits alarms to at most once every 1 minute but may delay them an arbitrary amount more
// });

// Fired when an alarm has elapsed
// Browser.alarms.onAlarm.addListener(() => { });

// If we want to open a URL on uninstallation of the extension, we can use
// Browser.runtime.setUninstallURL()

// This will run when a bookmark is created.
// Browser.bookmarks.onCreated.addListener(() => { });
