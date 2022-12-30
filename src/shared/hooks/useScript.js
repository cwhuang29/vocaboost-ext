import { useEffect } from 'react';

const useScript = ({ id, src, body }) => {
  useEffect(() => {
    const script = document.createElement('script');

    script.id = id;
    if (src) {
      script.src = src;
      script.async = true;
    }
    script.innerHTML = body || '';

    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, [id, src, body]);
};

export default useScript;
