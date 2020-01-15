// @flow
import type { MessageHeader } from './types';

/**
 * TargetingApi is provided by TargetingContext. It is provided on a per message basis.
 * const { getTargetingApi } = useContext(TargetingContext);
 * const targetingApi = getTargetingApi(messageName)
 * will return the TargetingApi for the given message. See README.
 */
export type TargetingApi = {|
    onClosed: () => void,
    // call to onSeen will cause the message seen count to increment
    onSeen: () => void,
    // call to onClosed will cause shouldShow to be false for the rest of the session, and
    // message close count to increment.
    shouldShow: () => boolean,
|};

/**
 * SetEligibleMessageHeaders call back is provided to Context component in in-app-messenger to get a
 * copy of eligible messages.
 */
export type SetEligibleMessageHeaders = (Array<MessageHeader>) => void;
