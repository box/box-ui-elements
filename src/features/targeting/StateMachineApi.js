// @flow
/**
 * Define a state machine that is driven by events in TargetingApi
 */

import type { TargetingApi } from './TargetingApi';
import type { MessageEvent } from './types';

export type StateMachineApi<State> = {
    canShow: (TargetingApi, State) => boolean,
    onEvent: (TargetingApi, State, MessageEvent) => State,
};
