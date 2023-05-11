import jwtDecode from 'jwt-decode';

import config from '@/config.js';
import { getAuthToken, getOauthClientId, getOauthRedirectUrl, getOauthScopes, launchWebAuthFlow } from '@browsers/identity';
import { logger } from '@utils/logger';
import { transformGoogleLoginResp } from '@utils/loginFormatter';
import { genShortRandomString } from '@utils/misc';

const GOOGLE_OAUTH_AUTH_ENDPOINT = 'https://accounts.google.com';

const GOOGLE_OAUTH_AUTH_PATH = '/o/oauth2/v2/auth';

const GOOGLE_PEOPLE_ENDPOINT = 'https://people.googleapis.com/v1/people/me';

const GOOGLE_PEOPLE_FIELDS = { NAME: 'names', EMAIL: 'emailAddresses', PHOTO: 'photos' };

const constructGoogleAPIURL = ({ field, key }) => `${GOOGLE_PEOPLE_ENDPOINT}?personFields=${field}&key=${key}`;

const getGoogleUserInfoHeader = ({ accessToken }) => ({
  method: 'GET',
  async: true,
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
  contentType: 'json',
});

const getGoogleUserNameCb = json => ({
  accountId: json.resourceName.split('/')[1],
  firstName: json[GOOGLE_PEOPLE_FIELDS.NAME][0].givenName,
  lastName: json[GOOGLE_PEOPLE_FIELDS.NAME][0].familyName,
});

const getGoogleUserEmailCb = json => ({
  email: json[GOOGLE_PEOPLE_FIELDS.EMAIL][0].value,
});

const getGoogleUserPhotoCb = json => ({
  avatar: json[GOOGLE_PEOPLE_FIELDS.PHOTO][0].url,
});

const fetchGoogleAPI = ({ accessToken, url, cb }) => {
  const header = getGoogleUserInfoHeader({ accessToken });
  return fetch(url, header)
    .then(resp => resp.json())
    .then(json => cb(json));
};

export const fetchGoogleUserInfo = async ({ accessToken }) => {
  const key = config.googleApiKey;

  const [dataName, dataEmail, dataPhoto] = await Promise.all([
    fetchGoogleAPI({ accessToken, cb: getGoogleUserNameCb, url: constructGoogleAPIURL({ key, field: GOOGLE_PEOPLE_FIELDS.NAME }) }),
    fetchGoogleAPI({ accessToken, cb: getGoogleUserEmailCb, url: constructGoogleAPIURL({ key, field: GOOGLE_PEOPLE_FIELDS.EMAIL }) }),
    fetchGoogleAPI({ accessToken, cb: getGoogleUserPhotoCb, url: constructGoogleAPIURL({ key, field: GOOGLE_PEOPLE_FIELDS.PHOTO }) }),
  ]);

  return { ...dataName, ...dataEmail, ...dataPhoto };
};

// Issue: no id_token is returned so we won't be able to identify user's identity in the bakcend
export const getGoogleUserInfo = async () => {
  const { token, scopes } = await getAuthToken();
  const uInfo = await fetchGoogleUserInfo({ accessToken: token });
  const loginPayload = transformGoogleLoginResp({ ...uInfo, scopes });

  logger(`Google Oauth login payload: ${JSON.stringify(loginPayload)}`);
  return loginPayload;
};

const isValidIdToken = (claims, nonce) => {
  if (claims.nonce !== nonce) {
    return false;
  }
  return true;
};

// Result is an url with the following format: https://gfkmbmplhjdoejicgmaldndkcnnpplho.chromiumapp.org/#access_token=<...>&token_type=Bearer&expires_in=3599&scope=email%20profile%20openid%20https://www.googleapis.com/auth/userinfo.email%20https://www.googleapis.com/auth/userinfo.profile&id_token=<...>&authuser=0&prompt=none
const extractAuthResult = ({ result }) => {
  const url = new URL(result);
  const searchParams = new URLSearchParams(url.hash.substr(1));
  const accessToken = searchParams.get('access_token');
  const idToken = searchParams.get('id_token');
  const scope = searchParams.get('scope');
  return { accessToken, idToken, scope };
};

// See https://developers.google.com/identity/openid-connect/openid-connect#authenticationuriparameters
export const authorize = async ({ nonce }) => {
  const url = new URL(GOOGLE_OAUTH_AUTH_PATH, GOOGLE_OAUTH_AUTH_ENDPOINT);
  url.searchParams.set('client_id', getOauthClientId());
  url.searchParams.set('redirect_uri', getOauthRedirectUrl());
  url.searchParams.set('scope', getOauthScopes());
  url.searchParams.set('response_type', encodeURIComponent('token id_token'));
  url.searchParams.set('nonce', nonce);

  const decodedUrl = decodeURIComponent(url.toString());
  const result = await launchWebAuthFlow({ url: decodedUrl });
  if (chrome.runtime.lastError) {
    logger(chrome.runtime.lastError.message); // Example: Authorization page could not be loaded
  }

  return extractAuthResult({ result });
};

export const oauthGoogleSignIn = async () => {
  const nonce = genShortRandomString();
  const { idToken, scope } = await authorize({ nonce });
  const claims = jwtDecode(idToken);
  if (!isValidIdToken(claims, nonce)) {
    return null;
  }
  const loginPayload = transformGoogleLoginResp({ ...claims, idToken, scope });
  logger(`Google Oauth login payload: ${JSON.stringify(loginPayload)}`);
  return loginPayload;
};
