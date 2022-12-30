import { useEffect } from 'react';

// https://usehooks.com/useDebounce/
export default useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Prevent debounced value from updating if value is changed within the delay period
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};
