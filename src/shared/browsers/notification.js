import Browser from 'webextension-polyfill';

// buttons: [{ title: 'Option 1' }, { title: 'Option 2' }],
// priority: 0 - 2 (highest)
export const createNotification = ({ type = 'basic', iconUrl, title, message, buttons, priority = 0 }) => {
  // https://developer.chrome.com/docs/extensions/reference/notifications/#method-create
  Browser.notifications.create({ type, iconUrl, title, message, buttons, priority });
};
