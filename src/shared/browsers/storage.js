import Browser from 'webextension-polyfill';

import { logger } from '@utils/logger';

const store = {
  async syncSet(key, value) {
    await Browser.storage.sync.set({ [key]: value });
  },
  async localSet(key, value) {
    await Browser.storage.local.set({ [key]: value });
  },
  async syncGet(key) {
    // key can be an array
    // Return value is {[key]: <actual value>} (type: object)
    return Browser.storage.sync.get(key);
  },
  async localGet(key) {
    return Browser.storage.local.get(key);
  },
};

export const setStorage = async ({ type, key, value }) => {
  if (!key || !value) {
    logger(`Error! Both key and value should not be empty. Key: ${key}, Value: ${value}`);
    return;
  }
  if (type !== 'sync' && type !== 'local') {
    logger(`Error! Type should be either "sync" or "local". type: ${type}`);
    return;
  }

  await store[`${type}Set`](key, value);
};

export const getStorage = async ({ type, key }) => {
  if (!key) {
    logger(`Error! Key should not be empty. Key: ${key}`);
    return;
  }
  if (type !== 'sync' && type !== 'local') {
    logger(`Error! Type should be either "sync" or "local". type: ${type}`);
    return;
  }

  // eslint-disable-next-line consistent-return
  return store[`${type}Get`](key);
};
