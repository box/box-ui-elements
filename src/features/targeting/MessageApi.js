// @flow
import type { MessageID, EligibleMessageIDMap } from './types';

/**
 * Message API is provided to MessageContext as a set of persistence API that inlcudes
 * 1) getEligibleMessageHeaders -> to be added when in app message is migrated over
 * 2) markMessageAsClosed
 * 3) markMessageAsSeen
 */
export type MessageApi = $ReadOnly<{|
    eligibleMessageIDMap: EligibleMessageIDMap,
    markMessageAsClosed: MessageID => void,
    markMessageAsSeen: MessageID => void,
|}>;
