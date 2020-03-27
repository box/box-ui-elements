// @flow
/**
 * Define a state machine that is driven by events in TargetingApi
 */

import type { TargetingApi } from './TargetingApi';

export type StateMachineApi<State> = {
    canShow: (TargetingApi, State) => boolean,
    onClose: (TargetingApi, State) => State,
    onShow: (TargetingApi, State) => State,
};
