import { LOGIN_METHOD } from '@constants/loginType';

// See https://developers.google.com/identity/openid-connect/openid-connect#obtainuserinfo
export const transformGoogleLoginResp = data => ({
  loginMethod: LOGIN_METHOD.GOOGLE,
  idToken: data.idToken,
  accountId: data.sub,
  detail: {
    email: data.email,
    firstName: data.given_name,
    lastName: data.family_name,
    scopes: data.scope,
    avatar: data.picture, // A https url
  },
});

export const transformAzureLoginResp = data => ({
  loginMethod: LOGIN_METHOD.AZURE,
  idToken: data.idToken,
  accountId: data.oid,
  detail: {
    email: data.email,
    firstName: data.given_name,
    lastName: data.family_name,
    scopes: data.scope,
    avatar: data.avatar, // A base64 encoded string
  },
});
