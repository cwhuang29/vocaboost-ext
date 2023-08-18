import { useCallback, useEffect, useState } from 'react';

export default useAsync = (callback, deps = []) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [value, setValue] = useState();

  const callbackMemoized = useCallback(() => {
    setLoading(true);
    setError(null);
    setValue(null);

    callback()
      .then(setValue)
      .catch(setError)
      .finally(() => setLoading(false));
  }, deps);

  useEffect(() => {
    callbackMemoized();
  }, [callbackMemoized]);

  return { loading, error, value };
};
