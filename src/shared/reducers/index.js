import { combineReducers } from 'redux';

import auth from '@reducers/auth';
import forms from '@reducers/forms';
import messages from '@reducers/messages';

export default combineReducers({
  auth,
  messages,
  forms,
});
