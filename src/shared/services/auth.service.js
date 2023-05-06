import API from '@constants/apis';
import axiosFetch from '@services/roots';
import { extractErrorMessage } from '@utils/handleErrorMessage';
import { getEndpointUrl, headers } from '@utils/network';

const login = async payload =>
  fetch(getEndpointUrl({ path: API.V1.LOGIN }), {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
    .then(async resp => resp.json())
    .then(async json => {
      const { token, isNewUser } = json;
      let userData = {};

      if (token.accessToken) {
        const data = await fetch(getEndpointUrl({ path: API.V1.ME }), { headers: { ...headers, Authorization: `Bearer ${token.accessToken}` } })
          .then(r => r.json())
          .catch(error => Promise.reject(error));
        userData = { ...data };
      }
      return { token: token.accessToken, isNewUser, user: userData };
    })
    .catch(err => Promise.reject(extractErrorMessage(err)));

// const login = async payload =>
//   axiosFetch
//     .post(API.V1.LOGIN, payload)
//     .then(async resp => {
//       const { token, isNewUser } = resp.data;
//       let userData = {};
//       if (token.accessToken) {
//         const header = { Authorization: `Bearer ${token.accessToken}` };
//         const data = await userService.getMe(header).catch(error => Promise.reject(error));
//         userData = { ...data };
//       }
//       return { token: token.accessToken, isNewUser, user: userData };
//     })
//     .catch(err => Promise.reject(extractErrorMessage(err)));

const logout = () =>
  axiosFetch
    .post(`${API.V1.LOGOUT}`)
    .then(resp => resp.data)
    .catch(err => Promise.reject(extractErrorMessage(err)));

export default {
  login,
  logout,
};
