import apis from '@constants/apis';
import axiosFetch from '@services/roots';
import { getAuthHeader, getEndpointUrl, headers } from '@utils/network';

const getMe = (header = {}) =>
  axiosFetch
    .get(apis.V1.ME, { headers: header })
    .then(resp => resp.data)
    .catch(err => Promise.reject(err));

const updateUserSetting = async payload => {
  const authHeaders = await getAuthHeader();

  return fetch(getEndpointUrl({ path: apis.V1.SETTING }), {
    method: 'PUT',
    headers: { ...headers, ...authHeaders },
    body: JSON.stringify(payload),
  })
    .then(resp => resp.json())
    .catch(err => Promise.reject(err));
};

// const updateUserSetting = payload =>
//   axiosFetch
//     .put(apis.V1.SETTING, payload)
//     .then(resp => resp.data)
//     .catch(err => Promise.reject(err));

export default {
  getMe,
  updateUserSetting,
};
