// See https://developer.chrome.com/docs/extensions/reference/action/#method

// Sets the badge text for the action. The badge is displayed on top of the icon
export const setBadgeText = ({ text, tabId = null, callback = null }) => {
  const args = {
    ...{ text },
    ...(tabId ? { tabId } : {}),
    ...(callback ? { callback } : {}),
  };
  chrome.action.setBadgeText(args);
};

// Sets the title of the action. This shows up in the tooltip
export const setBadgeTitle = ({ title, tabId = null, callback = null }) => {
  const args = {
    ...{ title },
    ...(tabId ? { tabId } : {}),
    ...(callback ? { callback } : {}),
  };
  chrome.action.setBadgeText(args);
};

// color: An array of four integers in the range [0,255] that make up the RGBA color of the badge. For example, opaque
// red is [255, 0, 0, 255]. Can also be a string with a CSS value, with opaque
// red being #FF0000 or #F00
export const setBadgeTextColor = ({ color, tabId = null, callback = null }) => {
  const args = {
    ...{ color },
    ...(tabId ? { tabId } : {}),
    ...(callback ? { callback } : {}),
  };
  chrome.action.setBadgeTextColor(args);
};

export const setBadgeBackgroundColor = ({ color, tabId = null, callback = null }) => {
  const args = {
    ...{ color },
    ...(tabId ? { tabId } : {}),
    ...(callback ? { callback } : {}),
  };
  chrome.action.setBadgeBackgroundColor(args);
};
