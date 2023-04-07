import API from '@constants/apis';
import fetch from '@services/roots';
import userService from '@services/user.service';
import { extractErrorMessage } from '@utils/handleErrorMessage';

const login = async payload =>
  fetch
    .post(API.V1.LOGIN, payload)
    .then(async resp => {
      const { accessToken } = resp.data;
      let userData = {};

      if (accessToken) {
        const header = { Authorization: `Bearer ${accessToken}` };
        const data = await userService.getMe(header).catch(error => Promise.reject(error));
        userData = { ...data };
      }
      return { token: accessToken, user: userData };
    })
    .catch(err => Promise.reject(extractErrorMessage(err)));

const logout = () =>
  fetch
    .post(`${API.V1.LOGOUT}`)
    .then(resp => resp.data)
    .catch(err => Promise.reject(extractErrorMessage(err)));

export default {
  login,
  logout,
};
