import { AUTH_STATUS } from '@constants/actionTypes';
import { LOCAL_STORAGE_NAME } from '@constants/storage';

const authToken = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME.AUTH));

const initialState = authToken ? { ...authToken } : {}; // {jwt: '...', user: {}}

const auth = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case AUTH_STATUS.REGISTER_SUCCESS:
      return state;
    case AUTH_STATUS.REGISTER_FAIL:
      return state;
    case AUTH_STATUS.LOGIN_SUCCESS:
      return {
        ...state,
        ...payload,
      };
    case AUTH_STATUS.LOGIN_FAIL:
      return state;
    case AUTH_STATUS.LOGOUT:
      return {};
    default:
      return state;
  }
};

export default auth;
