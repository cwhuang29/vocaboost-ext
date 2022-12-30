import { createContext, useContext } from 'react';

const defaultValue = null;

export const ExtensionMessageContext = createContext(defaultValue);
ExtensionMessageContext.displayName = 'Extension Message';

export const useExtensionMessageContext = () => useContext(ExtensionMessageContext);
