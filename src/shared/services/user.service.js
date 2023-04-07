import apis from '@constants/apis';
import fetch from '@services/roots';

const getMe = (header = {}) =>
  fetch
    .get(apis.V1.ME, { headers: header })
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));

const updateUserSetting = payload =>
  fetch
    .put(apis.V1.SETTING, payload)
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));

export default {
  getMe,
  updateUserSetting,
};
