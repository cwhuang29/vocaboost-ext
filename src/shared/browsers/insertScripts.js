import Browser from 'webextension-polyfill';

// import { logger } from '@utils/logger';

/*
 * The url of the tab to be inserted should match the manifest.content_scripts.matches rules
 * Chrome has removed the ability for content scripts to be injected into chrome-extension:/[>/* pages
 * See match patterns here: https://developer.chrome.com/docs/extensions/mv3/match_patterns/
 */

export const executeScript = insertFunc => {
  const queryInfo = { active: true, currentWindow: true };

  return new Promise((resolve, reject) => {
    Browser.tabs &&
      Browser.tabs.query(queryInfo, tabs => {
        Browser.scripting.executeScript({ target: { tabId: tabs[0].id }, func: insertFunc }, injectionResults => {
          // injectionResult: [{documentId: 'E3FEFF61D9C5677FCAE471DD17D4BCC1', frameId: 0, result: null}] (may be undefined if insertion failed)
          if (!injectionResults) {
            reject(new Error('Insert script failed'));
          }
          resolve(injectionResults);
        });
      });
  });
};

// If injecting CSS within a page, you can also specify a string to be used in the css property
export const insertCSS = css => {
  const queryInfo = { active: true, currentWindow: true };

  return new Promise(resolve => {
    Browser.tabs &&
      Browser.tabs.query(queryInfo, tabs => {
        Browser.scripting.insertCSS({ target: { tabId: tabs[0].id }, css }, () => resolve(true));
      });
  });
};

// const wrapper = async () => {
//   const res = await insertCSS('body { background-color: red; }').catch(err => {
//     logger(err);
//     return false;
//   });
//   return res;
// };
