// @flow
import { createContext } from 'react';

import type { MessageContextValue } from './types';

const defaultMessageContextValue = {
    eligibleMessageIDMap: {},
    messageStateMap: {},
    setEligibleMessageIDMap: () => {},
    setMessageStateMap: () => {},
    messageApi: {
        markMessageAsSeen: () => {},
        markMessageAsClosed: () => {},
    },
};

const MessageContext = createContext<MessageContextValue>(defaultMessageContextValue);

export default MessageContext;
