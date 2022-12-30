import { LOCAL_STORAGE_NAME } from '@constants/storage';

// const csrfToken = '';
// const headers = { 'X-CSRF-TOKEN': csrfToken };

const authHeader = () => {
  const auth = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME.AUTH));
  const header = {};

  if (auth?.jwt) {
    Object.assign(header, { Authorization: `Bearer ${auth.jwt}` });
  }

  return header;
};

export default authHeader;
