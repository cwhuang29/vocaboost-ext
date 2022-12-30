import { useCallback, useState } from 'react';

export default useToggle = initialState => {
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => setState(_state => !_state), []);
  return [state, toggle];
};
