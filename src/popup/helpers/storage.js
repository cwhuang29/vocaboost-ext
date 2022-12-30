const store = {
  async syncSet(key, value) {
    await chrome.storage.sync.set({ [key]: value });
  },
  async localSet(key, value) {
    await chrome.storage.local.set({ [key]: value });
  },
  async syncGet(key) {
    // key can be an array
    // Return value is {[key]: <actual value>} (type: object)
    return chrome.storage.sync.get(key);
  },
  async localGet(key) {
    return chrome.storage.local.get(key);
  },
};

export const setStorage = async ({ type, key, value }) => {
  if (!key || !value) {
    console.log(`Error! Both key and value should not be empty. Key: ${key}, Value: ${value}`);
    return;
  }
  if (type !== 'sync' && type !== 'local') {
    console.log(`Error! Type is not correct. type: ${type}`);
    return;
  }

  await store[`${type}Set`](key, value);
};

export const getStorage = async ({ type, key }) => {
  if (!key) {
    console.log(`Error! Key should not be empty. Key: ${key}`);
    return;
  }
  if (type !== 'sync' && type !== 'local') {
    console.log(`Error! Type is not correct. type: ${type}`);
    return;
  }

  // eslint-disable-next-line consistent-return
  return store[`${type}Get`](key);
};
