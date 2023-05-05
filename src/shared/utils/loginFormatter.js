import { LOGIN_METHOD } from '@constants/loginType';

export const transformGoogleLoginResp = ({ accountId, email, firstName, lastName, avatar, scopes }) => ({
  loginMethod: LOGIN_METHOD.GOOGLE,
  accountId,
  detail: {
    email,
    firstName,
    lastName,
    scopes: JSON.stringify(scopes),
    avatar,
  },
});

export const transformAzureLoginResp = data => ({
  loginMethod: LOGIN_METHOD.AZURE,
  accountId: data.oid,
  detail: {
    email: data.email,
    firstName: data.given_name,
    lastName: data.family_name,
    scopes: data.scope,
    avatar: data.avatar,
  },
});
