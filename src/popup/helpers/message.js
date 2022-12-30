// Both background.js and other tabs receive this message
// The tab send this message does not receive it
export const sendMessage = async ({ type = '', payload = {} } = {}) => {
  console.log(`[popup] going to send message. Message: ${type}`);

  const msg = { type, payload };
  const resp = await chrome.runtime.sendMessage(msg).catch(err => console.log(`[popup] Error occurred while sending request. error: ${err}`));
  return resp?.payload;
  // return new Promise((resolve, reject) => { // The old way
  //   chrome.runtime.sendMessage(msg, resp => {
  //     if (!resp) console.log('message error: ', chrome.runtime.lastError.message);
  //     if (resp.payload) { resolve(resp.payload); }
  //     reject(new Error(`Error - payload: ${payload}`));
  //   });
  // });
};

export const sendMessageToTab = async ({ type = '', payload = {} } = {}) => {
  const queryInfo = { active: true, currentWindow: true };

  return new Promise(resolve => {
    chrome.tabs &&
      chrome.tabs.query(queryInfo, tabs => {
        const tabId = tabs[0].id;
        // const link = tabs[0].url;
        const msg = { type, payload };
        chrome.tabs.sendMessage(tabId, msg, resp => {
          resolve(resp?.payload);
        });
      });
  });
};
