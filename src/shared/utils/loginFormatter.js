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
