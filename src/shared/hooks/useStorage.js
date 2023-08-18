import { useCallback, useState, useEffect } from 'react';

export const useLocalStorage = (key, defaultValue) => useStorage(key, defaultValue, window.localStorage);

export const useSessionStorage = (key, defaultValue) => useStorage(key, defaultValue, window.sessionStorage);

export default useStorage = (key, defaultValue, storageObject) => {
  const [value, setValue] = useState(() => {
    const jsonValue = storageObject.getItem(key);
    if (jsonValue !== null) {
      return JSON.parse(jsonValue);
    }

    if (typeof defaultValue === 'function') {
      return defaultValue();
    } else {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (value === undefined) return storageObject.removeItem(key);
    storageObject.setItem(key, JSON.stringify(value));
  }, [key, value, storageObject]);

  const remove = useCallback(() => {
    setValue(undefined);
  }, []);

  return [value, setValue, remove];
};
