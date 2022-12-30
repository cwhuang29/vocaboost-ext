import apis from '@constants/apis';
import authHeader from '@services/auth-header';
import fetch from '@services/roots';
import { extractErrorMessage } from '@utils/handleErrorMessage';

const getAllForms = (token = authHeader()) => fetch.get(apis.V2.FORMS, { headers: token });

const getFormById = (id, token = authHeader()) => fetch.get(`${apis.V2.FORMS}/${id}`, { headers: token });

const getTodoForms = (token = authHeader()) => fetch.get(`${apis.V2.TODO_FORMS}`, { headers: token });

const createForm = (data, token = authHeader()) => fetch.post(apis.V2.CREATE_FORM, data, { headers: token });

const updateForm = (id, data, token = authHeader()) => fetch.post(`${apis.V2.UPDATE_FORM}/${id}`, data, { headers: token });

const createFormStatus = (id, data, token = authHeader()) =>
  fetch
    .post(`${apis.V2.FORM_STATUS}/${id}`, data, { headers: token })
    .then(resp => Promise.resolve(resp.data))
    .catch(err => Promise.reject(extractErrorMessage(err)));

const getFormStatus = (id, token = authHeader()) =>
  fetch
    .get(`${apis.V2.FORM_STATUS}/${id}`, { headers: token })
    .then(resp => Promise.resolve(resp.data))
    .catch(err => Promise.reject(extractErrorMessage(err))); // http://127.0.0.1/v2/form/status/6

const getFormResult = (id, token = authHeader()) =>
  fetch
    .get(`${apis.V2.FORM_RESULT}/${id}`, { headers: token })
    .then(resp => Promise.resolve(resp.data))
    .catch(err => Promise.reject(extractErrorMessage(err)));

const getAnswerForm = (id, token = authHeader()) =>
  fetch
    .get(`${apis.V2.ANSWER_FORMS}/${id}`, { headers: token })
    .then(resp => Promise.resolve(resp.data))
    .catch(err => Promise.reject(extractErrorMessage(err)));

const sendFormAnswer = (id, data, token = authHeader()) =>
  fetch
    .post(`${apis.V2.ANSWER_FORMS}/${id}`, data, { headers: token })
    .then(resp => Promise.resolve(resp.data))
    .catch(err => Promise.reject(extractErrorMessage(err)));

const deleteFormStatus = (id, payload, token = authHeader()) =>
  fetch
    // .delete(`${apis.V2.FORM_STATUS}/${id}`, { data: payload }, { headers: token }) // Error: header is not sent
    // .delete(`${apis.V2.FORM_STATUS}/${id}`, { headers: token }, { data: payload }) // Error: request body is not sent
    .delete(`${apis.V2.FORM_STATUS}/${id}`, { headers: token, data: { payload } }) // Request body: {payload: {email: 'a1@abc.com'}}
    .then(resp => Promise.resolve(resp.data))
    .catch(err => Promise.reject(extractErrorMessage(err)));

const exportSelectedForms = (payload, token = authHeader()) =>
  fetch
    .post(apis.V2.EXPORT_FORMS, { formIds: payload }, { headers: token })
    .then(resp => Promise.resolve(resp.data))
    .catch(err => Promise.reject(extractErrorMessage(err)));

// const getTodoForms = (data, token = authHeader()) => {
//   const url = new URL(apis.V2.TODO_FORMS, window.location.href);
//   Object.entries(data).forEach(([key, val]) => url.searchParams.set(key, val));
//   const path = url.pathname + url.search;
//   console.log(data);
//   console.log(path);
//   return fetch
//     .post(path, data, { headers: token })
//     .then((resp) => Promise.resolve(resp.data))
//     .catch((err) => Promise.reject(extractErrorMessage(err))); // http://127.0.0.1/v2/form/assign?formId=6
// };

export default {
  getAllForms,
  getFormById,
  getTodoForms,
  getAnswerForm,
  getFormResult,
  sendFormAnswer,

  createForm,
  updateForm,
  getFormStatus,
  createFormStatus,
  deleteFormStatus,

  exportSelectedForms,
};
