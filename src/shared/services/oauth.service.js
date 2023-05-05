import API from '@constants/apis';
import { extractErrorMessage } from '@utils/handleErrorMessage';

import axios from 'axios';

const getAzureUserPhoto = ({ accessToken }) =>
  axios
    .get(API.OAUTH.AZURE.AVATAR_360, {
      headers: { Authorization: `Bearer ${accessToken}` },
      responseType: 'arraybuffer',
    })
    .then(resp => resp.data)
    .catch(err => Promise.reject(extractErrorMessage(err)));

export default {
  getAzureUserPhoto,
};
