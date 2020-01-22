// @flow
import { createContext } from 'react';

import type { MessageContextValue } from './types';

const defaultMessageContextValue = {
    messageStateMap: {},
    messageApi: {
        eligibleMessageIDMap: {},
        markMessageAsSeen: () => {},
        markMessageAsClosed: () => {},
    },
    setMessageStateMap: () => {},
};

const MessageContext = createContext<MessageContextValue>(defaultMessageContextValue);

export default MessageContext;
