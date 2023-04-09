import { sendMessageToOtherContentScripts } from '@browsers/message';

// Since content-script cannot access the Browser.tabs API, use background to notify (redirect to) other tabs
// Note that background cannot use axios: Adapter 'http' is not available in the build. Axios is based on XMLHttpRequest which is not available in service worker
export const onCollectedWordsUpdate = async message => {
  sendMessageToOtherContentScripts(message);
};
