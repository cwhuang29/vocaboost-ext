import { createContext, useContext } from 'react';

const defaultValue = null;

export const GlobalMessageContext = createContext(defaultValue);
GlobalMessageContext.displayName = 'Global Message';

export const useGlobalMessageContext = () => useContext(GlobalMessageContext);
