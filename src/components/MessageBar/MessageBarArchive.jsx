import React, { useState } from 'react';
import Proptypes from 'prop-types';
import styled from 'styled-components';

import { CrossButton } from '@components/styledComponents/CrossButton';
import { RoundButton } from '@components/styledComponents/RoundButton';

const Wrapper = styled.div`
  display: block;
  background-color: #f8cdbb;
  box-shadow: 3px 5px 2px 1px #555555;
  position: fixed;
  width: 510px;
  max-width: 94%; /* For mobile devices */
  margin-left: max(-47%, -255px);
  height: 160px;
  margin-top: max(-50%, -80px);
  left: 50%;
  top: 50%;
  cursor: default;
  z-index: 2147483647;
`;

const MessageHead = styled.p`
  margin-top: 25px;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
`;

const MessageBody = styled.p`
  text-align: center;
  font-size: 17px;
  word-break: break-all;
  margin-left: 20px;
  margin-right: 20px;
`;

const MessageBarArchive = ({ isShow, isShowButton, msgHead, msgBody }) => {
  const [showMsgBar, setShowMsgBar] = useState(isShow);
  const crossOnClick = () => setShowMsgBar(!showMsgBar);

  return (
    showMsgBar && (
      <Wrapper>
        <RoundButton warning isShow={isShowButton} disabled>
          <CrossButton onClick={crossOnClick} />
        </RoundButton>
        <MessageHead>{msgHead}</MessageHead>
        <MessageBody>{msgBody}</MessageBody>
      </Wrapper>
    )
  );
};

MessageBarArchive.defaultProps = {
  msgHead: '',
  msgBody: '',
};

MessageBarArchive.propTypes = {
  isShow: Proptypes.bool.isRequired,
  isShowButton: Proptypes.bool.isRequired,
  msgHead: Proptypes.string,
  msgBody: Proptypes.string,
};

export default MessageBarArchive;
