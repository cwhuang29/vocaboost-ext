import { LOGIN_METHOD } from '@constants/loginType';

export const transformGoogleLoginResp = ({ scopes, email, firstName, lastName, avatar }) => ({
  loginMethod: LOGIN_METHOD.GOOGLE,
  detail: {
    email,
    firstName,
    lastName,
    scopes: JSON.stringify(scopes),
    serverAuthCode: null,
    avatar,
  },
});
