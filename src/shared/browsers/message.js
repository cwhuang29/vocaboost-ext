import Browser from 'webextension-polyfill';

import { logger } from '@utils/logger';

/*
 * Note that Browser.tabs API is not available for content-scripts
 * To send message from one content-script to other content-script(s), the message has to be redirected by popup/background
 * Background is a good choice since it is always running (only idle when nothing to do)
 */

export const getCurrentTab = async () => {
  const queryInfo = { active: true, currentWindow: true };
  const [tab] = await Browser.tabs.query(queryInfo);
  return tab;
};

/*
 * Both background, popup, and other tabs receive this message
 * The tab send this message does not receive it
 */
export const sendMessage = async ({ type = '', payload = {} } = {}) => {
  logger(`Going to send message. Message: ${type}`);

  const msg = { type, payload };
  const resp = await Browser.runtime.sendMessage(msg).catch(err => logger(`Error occurred in sendMessage. error: ${err}`));
  return resp?.payload;
  // return new Promise((resolve, reject) => { // The old way
  //   chrome.runtime.sendMessage(msg, resp => {
  //     if (!resp) logger('message error: ', chrome.runtime.lastError.message);
  //     if (resp.payload) { resolve(resp.payload); }
  //     reject(new Error(`Error - payload: ${payload}`));
  //   });
  // });
};

/*
 * This function sends message to all the tabs except the active tab in current focused window
 */
export const sendMessageToOtherContentScripts = async ({ type = '', payload = {} } = {}) => {
  logger(`Going to send message to tab. Message: ${type}`);

  const tabs1 = await Browser.tabs.query({ active: false }); // Tabs in all windows but not the active (i.e., displayed) ones
  const tabs2 = await Browser.tabs.query({ currentWindow: false }); // Tabs in other windows and are the active ones
  new Set([...tabs1, ...tabs2]).forEach(tab => {
    if (!tab.url.startsWith('http')) {
      return;
    }
    const msg = { type, payload };
    Browser.tabs.sendMessage(tab.id, msg).catch(err => logger(`Error occurred in sendMessageToOtherContentScripts. error: ${err}`));
  });
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
  logger(`Going to send message to tab. Message: ${type}`);

  const tab = await getCurrentTab();
  const msg = { type, payload };
  const resp = await Browser.tabs.sendMessage(tab.id, msg).catch(err => logger(`Error occurred in sendMessageToTab. error: ${err}`));
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
