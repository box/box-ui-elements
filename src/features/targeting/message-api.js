// @flow
import type { MessageName } from './types';

/**
 * Message API is provided to TargetingContext as a set of persistence API that inlcudes
 * 1) getEligibleMessageHeaders -> to be added when in app message is migrated to use Targeting
 * 2) markMessageAsClosed
 * 3) markMessageAsSeen
 */
export type MessageApi = {|
    markMessageAsClosed: MessageName => void,
    markMessageAsSeen: MessageName => void,
|};
