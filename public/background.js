/*
 * See: https://developer.chrome.com/docs/extensions/mv3/user_interface/
 * To use the Action API, the extension's manifest must contain an "action" key
 * The Action API controls the extension's action (toolbar icon). It can either open a popup or trigger some functionality when it's clicked.
 * It's possible to register an OnClicked handler for when the user clicks the action item. However, this won't fire if the action has a popup (default or otherwise).
 */

const sendMessage = async ({ type = '', payload = {} } = {}) => {
  // console.log(`[background] going to send message to popup. Message: ${type}`);

  const msg = { type, payload };
  const resp = await chrome.runtime.sendMessage(msg).catch(err => console.log(`[background] Error occurred while sending request. error: ${err}`));
  return resp?.payload;
};

/*
 * Fired when extension just installed
 */
chrome.runtime.onInstalled.addListener(details => {
  chrome.storage.local.clear();
  chrome.tabs.create({ url: chrome.runtime.getURL('index.html') }); // e.g. chrome-extension://dgkojjmldclhegjngnibipblnclmohod/index.html

  if (details.reason === 'install') {
    // TODO a better way is to let popup notify background whenever it is ready then send this message
    setTimeout(() => sendMessage({ type: 'EXT_MSG_TYPE_INIT_SETUP' }), 5000);
  }
});

// eslint-disable-next-line
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // const sdr = sender.tab ? `from a content script:${sender.tab.url}` : 'from the extension';
  // console.log(`[background] message received: ${message.type}. Sender: ${sdr}`);
  return true;
});

/*
 * Fired when one or more storage items change
 */
// chrome.storage.onChanged.addListener((changes, namespace) => {
//   for (const [key, { oldValue = '<empty>', newValue = '<empty>' }] of Object.entries(changes)) {
//     const oldVal = oldValue.constructor === Object ? JSON.stringify(oldValue) : oldValue;
//     const newVal = newValue.constructor === Object ? JSON.stringify(newValue) : newValue;
//     const msg = `Storage key "${key}" in namespace "${namespace}" changed. Old value was "${oldVal}", new value is "${newVal}"`;
//     console.log(msg);
//   }
// });

/*
 * notifications.onButtonClicked: The user pressed a button in the notification
 * notifications.onClicked: The user clicked in a non-button area of the notification
 */
// chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
//   console.log("[background] notification's button clicked", notificationId, buttonIndex); // Button id starts with zero
//   chrome.alarms.create({ delayInMinutes: 1 }); // Chrome limits alarms to at most once every 1 minute but may delay them an arbitrary amount more
// });

// Fired when an alarm has elapsed
// chrome.alarms.onAlarm.addListener(() => { });

// If we want to open a URL on uninstallation of the extension, we can use
// chrome.runtime.setUninstallURL()

// This will run when a bookmark is created.
// chrome.bookmarks.onCreated.addListener(() => { });

/*
 * This won't be fired since we create a popup file (index.html in the manifest.action)
 */
// chrome.action.onClicked.addListener(async tab => {
//   chrome.tabs.create({ url: 'https://www.youtube.com' });

//   chrome.action.setBadgeText({ text: 'OFF' });

//   const injectedFunction = color => {
//     document.body.style.backgroundColor = color;
//   };
//   const color = 'orange';

//   // Be aware that the injected function is a copy of the function referenced in the chrome.scripting.executeScript call, not the original function itself
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: injectedFunction,
//     args: [color], // If we want to pass arguments to the func
//   });

//   // Send a message to the active tab
//   chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//     const activeTab = tabs[0];
//     chrome.tabs.sendMessage(activeTab.id, { message: 'clicked_browser_action' });
//   });

//   if (tab.url === 'https://www.abc.com') {
//     const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
//     await chrome.action.setBadgeText({
//       tabId: tab.id,
//       text: `prevState is ${prevState}`,
//     });
//     await chrome.scripting.insertCSS({
//       // insertCSS or removeCSS
//       files: ['focus-mode.css'],
//       target: { tabId: tab.id },
//     });
//   }
// });

// console.log(`chrome: ${JSON.stringify(chrome)}`);
