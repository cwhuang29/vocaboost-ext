import React, { useCallback, useEffect, useRef, useState } from 'react';
import Proptypes from 'prop-types';
import styled from 'styled-components';

import { MessageBarItem } from '@components/MessageBar/MessageBarItem';
import { GLOBAL_MESSAGE_DISPLAY_PERIOD, MAX_Z_INDEX } from '@constants/styles';
import { GlobalMessageContext } from '@hooks/useGlobalMessageContext';

import { Stack } from '@mui/material';

const MessageBarWrapper = styled.div`
  z-index: ${MAX_Z_INDEX};
  position: fixed;
  top: 4.3rem;
  right: 0.55rem;
  max-width: min(500px, 70%);
  cursor: default;
  > * {
    margin: 5px 0;
  }
`;

const GlobalMessageBar = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isClosedManually, setIsClosedManually] = useState(false);
  const [startNextTimer, setStartNextTimer] = useState(true);
  const generateKey = ({ timestamp, title, content = '' }) => `${timestamp}${title}${content.slice(0, 20)}`;

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }
    if (isClosedManually) {
      // Prevent the first message lasts more than GLOBAL_MESSAGE_DISAPPEAR_PERIOD when user removes messages manually
      setIsClosedManually(false);
      return;
    }
    if (!startNextTimer) {
      // Prevent the first message lasts more than GLOBAL_MESSAGE_DISAPPEAR_PERIOD when new message is added
      return;
    }
    setTimeout(() => {
      setStartNextTimer(true);
      setMessages(prevMessages => prevMessages.slice(1));
    }, GLOBAL_MESSAGE_DISPLAY_PERIOD);
    setStartNextTimer(false);
  }, [isClosedManually, messages]);

  const onClose = msg => () => {
    setIsClosedManually(true);
    setMessages(prevMessages => prevMessages.filter(prevMsg => generateKey(prevMsg) !== generateKey(msg)));
  };

  const addGlobalMessage = useCallback(message => setMessages(prevMessages => [...prevMessages, message]), []);

  const clearAllGlobalMessages = useCallback(() => setMessages([]), []);

  // Context uses reference identity (Object.is) to determine when to re-render
  // Whenever the Provider's value changes, the whole component (and its children) rerender
  // Use useRef to prevent the whole children/tree re-render (mutating the .current property doesn’t cause a re-render)
  const globalMessageValue = useRef({ addGlobalMessage, clearAllGlobalMessages });

  return (
    <>
      <MessageBarWrapper>
        <Stack spacing={1}>
          {messages.map(message => (
            <MessageBarItem key={`${generateKey(message)}`} message={message} onClose={onClose} />
          ))}
        </Stack>
      </MessageBarWrapper>
      <GlobalMessageContext.Provider value={globalMessageValue.current}>{children}</GlobalMessageContext.Provider>
    </>
  );
};

GlobalMessageBar.propTypes = {
  children: Proptypes.element.isRequired,
};

export default GlobalMessageBar;
