// @flow
import { MESSAGE_STATES, MESSAGE_EVENTS } from './constants';
import type { MessageApi } from './MessageApi';

export type MessageID = number;
export type MessageName = string;

export type EligibleMessageIDMap = $ReadOnly<{ [MessageName]: MessageID }>;

export type MessageState = $Values<typeof MESSAGE_STATES>;

export type MessageEvent = $Values<typeof MESSAGE_EVENTS>;

export type MessageStateMap = $ReadOnly<{ [MessageName]: MessageState }>;

export type MessageContextValue = {|
    eligibleMessageIDMap: EligibleMessageIDMap,
    messageApi: MessageApi,
    messageStateMap: MessageStateMap,
    setEligibleMessageIDMap: EligibleMessageIDMap => void,
    setMessageStateMap: MessageStateMap => void,
|};

export type FtuxContextValue = {};
