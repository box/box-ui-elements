// @flow
import * as React from 'react';

import type { EligibleMessageIDMap, MessageStateMap } from './types';
import type { MessageApi } from './MessageApi';
import MessageContext from './MessageContext';

const MessageContextProvider = ({ children, messageApi }: { children: React.Node, messageApi: MessageApi }) => {
    const [eligibleMessageIDMap, setEligibleMessageIDMap] = React.useState<EligibleMessageIDMap>({});
    const [messageStateMap, setMessageStateMap] = React.useState<MessageStateMap>({});

    const value = {
        eligibleMessageIDMap,
        messageStateMap,
        messageApi,
        setEligibleMessageIDMap,
        setMessageStateMap,
    };

    return <MessageContext.Provider value={value}>{children}</MessageContext.Provider>;
};

export default MessageContextProvider;
