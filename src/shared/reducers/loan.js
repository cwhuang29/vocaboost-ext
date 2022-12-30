import { LOAN_STATUS } from '@constants/actionTypes';

const initialState = {};
const { FETCH_LOAN_SUCCESS, FETCH_LOAN_FAILED } = LOAN_STATUS;

const loan = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_LOAN_SUCCESS:
      return { loan: payload.load };
    case FETCH_LOAN_FAILED:
      return state;
    default:
      return state;
  }
};

export default loan;
