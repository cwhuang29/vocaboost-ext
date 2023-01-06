import Browser from 'webextension-polyfill';

export const getCurrentTab = async () => {
  const queryInfo = { active: true, currentWindow: true };
  const [tab] = await Browser.tabs.query(queryInfo);
  return tab;
};

// Both background.js and other tabs receive this message
// The tab send this message does not receive it
export const sendMessage = async ({ type = '', payload = {} } = {}) => {
  // console.log(`Going to send message. Message: ${type}`);

  const msg = { type, payload };
  const resp = await Browser.runtime.sendMessage(msg).catch(err => console.log(`Error occurred while sending request. error: ${err}`));
  return resp?.payload;
  // return new Promise((resolve, reject) => { // The old way
  //   chrome.runtime.sendMessage(msg, resp => {
  //     if (!resp) console.log('message error: ', chrome.runtime.lastError.message);
  //     if (resp.payload) { resolve(resp.payload); }
  //     reject(new Error(`Error - payload: ${payload}`));
  //   });
  // });
};

/*
 * { active: true, currentWindow: true }: retrieve the active tab from the currently-focused window (or most recently-focused window, if no Chrome windows are focused).
 *                                        This can usually be thought of as the user's current tab
 * active:            whether the tabs are active in their windows
 * lastFocusedWindow: whether the tabs are in the last focused window
 * currentWindow:     whether the tabs are in the current window. The current window is the window that contains the code that is currently executing.
 *                    It's important to realize that this can be different from the topmost or focused window
 * See: https://developer.chrome.com/docs/extensions/reference/windows/
 * See: https://developer.chrome.com/docs/extensions/reference/tabs/
 */
export const sendMessageToTab = async ({ type = '', payload = {} } = {}) => {
  // console.log(`Going to send message to tab. Message: ${type}`);

  const tab = await getCurrentTab();
  const msg = { type, payload };
  const resp = await Browser.tabs.sendMessage(tab.id, msg);
  return resp?.payload;
  // const queryInfo = { active: true, currentWindow: true };
  // return new Promise(resolve => {
  //   chrome.tabs.query(queryInfo, tabs => {
  //     const tabId = tabs[0].id;
  //     const msg = { type, payload };
  //     chrome.tabs.sendMessage(tabId, msg, resp => {
  //       resolve(resp?.payload);
  //     });
  //   });
  // });
};
