import { MESSAGE_STATUS } from '@constants/actionTypes';

const initialState = {};

const messages = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case MESSAGE_STATUS.SET_MESSAGE:
      return { message: payload.message };
    case MESSAGE_STATUS.CLEAR_MESSAGE:
      return { message: '' };
    default:
      return state;
  }
};

export default messages;
