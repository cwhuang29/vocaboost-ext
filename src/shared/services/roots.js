import axios from 'axios';
import config from 'config.js';

// https://axios-http.com/docs/req_config
const httpConfig = {
  baseURL: config.baseURL,
  withCredentials: true, // Indicates whether or not cross-site Access-Control requests should be made using credentials
  xsrfHeaderName: 'X-CSRF-Token', // the name of the http header that carries the xsrf token value
  xsrfCookieName: 'csrftoken', // The name of the cookie to use as a value for xsrf token
  timeout: 30000, // If the request takes longer than `timeout`, the request will be aborted (Error: timeout of 1000ms exceeded)
  headers: { 'X-Questionnaire-Header': 'ntnu' }, // Custom headers to be sent
  validateStatus: status => status >= 200 && status <= 302, // Defines whether to resolve or reject the promise for a given response
  transformResponse: [data => ({ ...JSON.parse(data) /* , timeStamp: new Date() */ })], // Changes to the response to be made before it is passed to then/catch
};

// const token = document.head.querySelector('meta[name="csrf-token"]')?.content;
// if(token) {
//   axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
// }

const fetch = axios.create(httpConfig);

// fetch.interceptors.request.use(function () {/*...*/});

export default fetch;
