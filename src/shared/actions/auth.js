import { AUTH_STATUS } from '@constants/actionTypes';
import { COOKIE_NAMES, LOCAL_STORAGE_NAME } from '@constants/storage';
import AuthService from '@services/auth.service';
import { extractErrorMessage } from '@utils/handleErrorMessage';

export const register = data => dispatch =>
  AuthService.register(data)
    .then(() => {
      dispatch({
        type: AUTH_STATUS.REGISTER_SUCCESS,
      });

      return Promise.resolve();
    })
    .catch(err => {
      dispatch({ type: AUTH_STATUS.REGISTER_FAIL });
      return Promise.reject(extractErrorMessage(err));
    });

export const login = data => dispatch =>
  AuthService.login(data)
    .then(resp => {
      dispatch({
        type: AUTH_STATUS.LOGIN_SUCCESS,
        payload: { ...resp },
      });

      // TODO write csrf token to cookie
      localStorage.setItem(LOCAL_STORAGE_NAME.AUTH, JSON.stringify(resp));

      return Promise.resolve();
    })
    .catch(err => {
      dispatch({ type: AUTH_STATUS.LOGIN_FAIL });
      return Promise.reject(extractErrorMessage(err));
    });

export const logout = () => dispatch => {
  localStorage.removeItem(LOCAL_STORAGE_NAME.AUTH);
  document.cookie = `${COOKIE_NAMES.IS_ADMIN}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

  dispatch({
    type: AUTH_STATUS.LOGOUT,
  });
};
