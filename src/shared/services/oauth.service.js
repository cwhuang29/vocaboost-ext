import API from '@constants/apis';
import { extractErrorMessage } from '@utils/handleErrorMessage';

const getAzureUserPhoto = ({ accessToken }) =>
  fetch(API.OAUTH.AZURE.AVATAR_360, { headers: { Authorization: `Bearer ${accessToken}` } })
    .then(resp => resp.arrayBuffer())
    .catch(err => Promise.reject(extractErrorMessage(err)));

// const getAzureUserPhoto = ({ accessToken }) =>
//   axios
//     .get(API.OAUTH.AZURE.AVATAR_360, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//       responseType: 'arraybuffer',
//     })
//     .then(resp => resp.data)
//     .catch(err => Promise.reject(extractErrorMessage(err)));

export default {
  getAzureUserPhoto,
};
