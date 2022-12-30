import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { logout } from '@actions/auth';
import { useGlobalMessageContext } from '@hooks/useGlobalMessageContext';

const Logout = () => {
  const dispatch = useDispatch();
  const { clearAllGlobalMessages } = useGlobalMessageContext();

  useEffect(() => {
    clearAllGlobalMessages();
    dispatch(logout());
  }, []);

  return (
    <div>
      <h2>You have logout!</h2>
      <p>
        <Link to='/login'>Go to the login page</Link>
      </p>
    </div>
  );
};

export default Logout;
