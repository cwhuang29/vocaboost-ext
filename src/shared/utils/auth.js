import { getStorage, setStorage } from '@browsers/storage';
import { EXT_STORAGE_AUTH_TOKEN, EXT_STORAGE_USER } from '@constants/storage';

export const storeAuthDataToStorage = async ({ token, user }) => {
  await Promise.all([
    setStorage({ type: 'local', key: EXT_STORAGE_AUTH_TOKEN, value: token }),
    setStorage({ type: 'local', key: EXT_STORAGE_USER, value: user }),
  ]);
};

export const clearAuthDataFromStorage = async () => {
  await Promise.all([
    setStorage({ type: 'local', key: EXT_STORAGE_AUTH_TOKEN, value: null }),
    setStorage({ type: 'local', key: EXT_STORAGE_USER, value: null }),
  ]);
};

export const getAuthTokenFromStorage = async () => {
  const cache = await getStorage({ type: 'local', key: EXT_STORAGE_AUTH_TOKEN });
  const token = cache[EXT_STORAGE_AUTH_TOKEN] ?? null;
  return token;
};

export const getUserInfoFromStorage = async () => {
  const cache = await getStorage({ type: 'local', key: EXT_STORAGE_USER });
  const uInfo = cache[EXT_STORAGE_USER] ?? null;
  return uInfo;
};
