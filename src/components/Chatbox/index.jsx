import React from 'react';
import Proptypes from 'prop-types';

import { ibmChatBox } from '@components/Chatbox/ibmChatBox';
import useScript from '@hooks/useScript';
import { MAX_Z_INDEX } from '@shared/constants/styles';

const Chatbox = ({ children }) => {
  useScript({ body: ibmChatBox });
  return (
    <>
      <img
        id='chatBoxIcon'
        src='/assets/mascot/mascot_rocket.png'
        alt=''
        width='130'
        style={{ position: 'fixed', bottom: 16, right: 12, zIndex: MAX_Z_INDEX }}
      />
      {children}
    </>
  );
};

Chatbox.propTypes = {
  children: Proptypes.element.isRequired,
};

export default Chatbox;
