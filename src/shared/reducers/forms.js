import { FORM_STATUS } from '@constants/actionTypes';

const initialState = { forms: [] };
const { FETCH_FORMS_SUCCESS, FETCH_FORM_SUCCESS, FETCH_TODO_FORMS_SUCCESS: FETCH_USER_FORMS_SUCCESS } = FORM_STATUS;

const forms = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case FETCH_FORMS_SUCCESS:
      return { ...state, ...payload };
    case FETCH_FORM_SUCCESS:
      return { ...state, forms: state.forms.map(form => (form.id === payload.form.id ? payload.form : form)) };
    case FETCH_USER_FORMS_SUCCESS:
      return { ...state, todoForms: payload.forms };
    default:
      return state;
  }
};

export default forms;
