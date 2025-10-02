// @flow
import * as React from 'react';

import type { MessageStateMap } from './types';
import type { MessageApi } from './MessageApi';
import MessageContext from './MessageContext';

const MessageContextProvider = ({ children, messageApi }: { children: React.Node, messageApi: MessageApi }) => {
    const [messageStateMap, setMessageStateMap] = React.useState<MessageStateMap>({});

    const value = {
        messageStateMap,
        messageApi,
        setMessageStateMap,
    };

    return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
};

export default MessageContextProvider;
