import API from '@constants/apis';
import fetch from '@services/roots';
import userService from '@services/user.service';

const register = ({ firstName, lastName, email, password /* , role */ }) =>
  fetch.post(API.V2.REGISTER, {
    first_name: firstName,
    last_name: lastName,
    email,
    password,
    role: 0, // TODO remove this attribute
  });

const login = ({ email, password }) =>
  fetch
    .post(API.V2.LOGIN, {
      email,
      password,
    })
    .then(async resp => {
      const { token: jwtToken } = resp.data;
      let userData = {}; // The user data stores in user table

      if (jwtToken) {
        const header = { Authorization: `Bearer ${resp.data.token}` };
        const user = await userService.getCurrentUserData(header).catch(error => Promise.reject(error));
        userData = { ...user.data };
      }

      return { jwt: jwtToken, user: userData };
    });

export default {
  register,
  login,
};
