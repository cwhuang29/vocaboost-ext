import { sendMessageToOtherContentScripts } from '@browsers/message';
import { LOGIN_METHOD } from '@constants/loginType';
import { oauthAzureLogin } from '@oauth/azure';
import { oauthGoogleSignIn } from '@oauth/google';
import authService from '@services/auth.service';
import { storeAuthDataToStorage } from '@utils/auth';
import { fetchLatestConfigOnLogin } from '@utils/config';

// Since content-script cannot access the Browser.tabs API, use background to notify (redirect to) other tabs
// Note that background cannot use axios: Adapter 'http' is not available in the build. Axios is based on XMLHttpRequest which is not available in service worker
export const onCollectedWordsUpdate = async message => {
  sendMessageToOtherContentScripts(message);
};

const login = async loginPayload => {
  const { token, isNewUser, user } = await authService.login(loginPayload).catch(err => {
    logger(`Login error: ${JSON.stringify(err)}`);
  });
  await storeAuthDataToStorage({ token, user });
  if (!isNewUser) {
    await fetchLatestConfigOnLogin();
  }
};

// eslint-disable-next-line no-unused-vars
export const oauthLogin = async ({ payload }, sendResponse) => {
  const { loginMethod } = payload;

  let loginPayload;
  if (loginMethod === LOGIN_METHOD.GOOGLE) {
    loginPayload = await oauthGoogleSignIn();
  }
  if (loginMethod === LOGIN_METHOD.AZURE) {
    loginPayload = await oauthAzureLogin();
  }
  await login(loginPayload);
  return { payload: loginPayload }; // Just return the value. This is not working: sendResponse({ payload: userInfo });
};
