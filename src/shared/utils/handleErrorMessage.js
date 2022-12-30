import msg from '@constants/messages';

// https://axios-http.com/docs/handling_errors
export const extractErrorMessage = err => {
  let errMsg;

  if (err.response) {
    // The request was made and the server responded with a status code that falls out of the range
    // errHead and errBody are the most common keys I set in backend when an error occurs
    errMsg = { status: err.response.status, title: err.response.data.errHead || '', content: err.response.data.errBody || '', ...err.response.data };
  } else if (err.request) {
    // The request was made but no response was received
    errMsg = { title: msg.UNKNOWN_ERROR, content: msg.SERVER_CRASH };
  } else {
    // Something happened in setting up the request that triggered an Error
    errMsg = { title: `${msg.UNKNOWN_ERROR} (${err.message})`, content: msg.TRY_AGAIN };
  }

  return errMsg;
};
