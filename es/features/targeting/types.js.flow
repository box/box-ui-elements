// @flow
import * as React from 'react';

import { MESSAGE_STATES, MESSAGE_EVENTS } from './constants';
import type { MessageApi } from './MessageApi';

export type MessageID = number;
export type MessageName = string;

export type EligibleMessageIDMap = $ReadOnly<{ [MessageName]: MessageID }>;

export type MessageState = $Values<typeof MESSAGE_STATES>;

export type MessageEvent = $Values<typeof MESSAGE_EVENTS>;

export type MessageStateMap = $ReadOnly<{ [MessageName]: MessageState }>;

export type MessageContextValue = {|
    messageApi: MessageApi,
    messageStateMap: MessageStateMap,
    setMessageStateMap: MessageStateMap => void,
|};

export type FtuxContextValue = {};

export type TargetingApi = $ReadOnly<{
    canShow: boolean,
    onClose: () => void,
    onComplete: () => void,
    onShow: () => void,
}>;

export type UseTargetingApi = () => TargetingApi;

export type TargetedComponentProps = {
    children: React.Node,
    closeOnClickOutside?: boolean,
    onDismiss?: Function,
    shouldTarget: boolean,
    useTargetingApi: () => TargetingApi,
};
