import config from '@/config';
import { getAuthTokenFromStorage } from '@utils/auth';
import { logger } from '@utils/logger';

import axios from 'axios';

const httpConfig = {
  baseURL: config.backendURL,
  withCredentials: false, // Indicates whether or not cross-site Access-Control requests should be made using credentials
  xsrfHeaderName: 'X-CSRF-Token', // the name of the http header that carries the xsrf token value
  xsrfCookieName: 'csrftoken', // The name of the cookie to use as a value for xsrf token
  timeout: 30000, // If the request takes longer than `timeout`, the request will be aborted (Error: timeout of 1000ms exceeded)
  transformResponse: [data => ({ ...JSON.parse(data) })], // Changes to the response to be made before it is passed to then/catch
  headers: { 'X-VH-Source': 'extension' }, // Custom headers to be sent
};

const fetch = axios.create(httpConfig);

const beforeReqIsSend = async axiosConfig => {
  const token = await getAuthTokenFromStorage();

  if (token && !axiosConfig.headers.Authorization) {
    Object.assign(axiosConfig.headers, { ...axiosConfig.headers, Authorization: `Bearer ${token}` });
  }
  logger(`Going to send request: ${axiosConfig}`);
  return axiosConfig;
};

fetch.interceptors.request.use(beforeReqIsSend);

export default fetch;
