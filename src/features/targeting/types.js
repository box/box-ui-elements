// @flow
import type { SetEligibleMessageHeaders, TargetingApi } from './targeting-api';
import { MESSAGE_TYPES } from './constants';

export type MessageType = $Values<typeof MESSAGE_TYPES>;

export type MessageID = number;

export type MessageName = string;

export type MessageHeader = {|
    // an integer used to load message in getMessageRepresentation
    canBeShownMultipleTimes: boolean,
    // used to form messageIdentifier where namespace is 'contextual'
    createdDate: number,
    // whether it can be shown again
    id: MessageID,
    isCustomMessage: boolean,
    // if it is custom message, custom message maker must exist to show
    isExemptFromSuppression: boolean,
    // is this message exempt from suppression
    isMessageTypeSuppressed: boolean,
    // is this message type suppressed for the user
    name: MessageName,
    priority: number,
    shouldAutoShow: boolean,
    type: MessageType,
|};

export type FtuxContextValue = {};

export type TargetingContextValue = {|
    getTargetingApi: MessageName => TargetingApi,
    setEligibleMessageHeaders: SetEligibleMessageHeaders,
|};
