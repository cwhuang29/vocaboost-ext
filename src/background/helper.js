import { sendMessageToOtherContentScripts } from '@browsers/message';
import { LOGIN_METHOD } from '@constants/loginType';
import { oauthAzureLogin } from '@oauth/azure';
import { oauthGoogleSignIn } from '@oauth/google';
import authService from '@services/auth.service';
import { storeAuthDataToStorage } from '@utils/auth';
import { fetchLatestConfigOnLogin } from '@utils/config';
import { logger } from '@utils/logger';
import { isObjectEmpty } from '@utils/misc';

/*
 * Since content-script cannot access the Browser.tabs API, use background to notify (redirect to) other tabs
 * Note that background cannot use axios: Adapter 'http' is not available in the build. Axios is based on XMLHttpRequest which is not available in service worker
 */
export const onCollectedWordsUpdate = async message => {
  sendMessageToOtherContentScripts(message);
};

const login = async loginPayload => {
  const { token, isNewUser, user } = await authService.login(loginPayload).catch(err => {
    logger(`Login error: ${JSON.stringify(err)}`);
  });
  await storeAuthDataToStorage({ token, user });
  let config = null;
  if (!isNewUser) {
    const { latestConfig } = await fetchLatestConfigOnLogin();
    config = latestConfig;
  }
  return { token, isNewUser, user, config };
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
  logger(`[background] Get login payload: ${loginPayload}`);

  if (isObjectEmpty(loginPayload)) {
    return { payload: null };
  }
  const data = await login(loginPayload);
  logger(`[background] Get login result: ${data}`);

  return { payload: data }; // Just return the value, sendResponse({ payload: userInfo }) is not working
};
