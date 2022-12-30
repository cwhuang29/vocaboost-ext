import { useCallback, useEffect, useState } from 'react';

const initialState = {
  width: window.innerWidth,
  height: window.innerHeight,
};

export default useResize = () => {
  const [size, setSize] = useState(initialState);

  const handleResize = useCallback(() => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  return [size];
};
