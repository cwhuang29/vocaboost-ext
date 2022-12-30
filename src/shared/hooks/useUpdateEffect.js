import { useEffect, useRef } from 'react';

// Only triggers on updates, not on initial mount
export default useUpdateEffect = (effect, deps = []) => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      effect();
    }
  }, deps);
};
