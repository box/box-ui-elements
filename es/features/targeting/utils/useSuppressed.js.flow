// @flow
import neverTargeted from '../neverTargeted';
import { type TargetingApi } from '../types';

/**
 * Returns a targetingApi that will be targeted as long as the input targeting api is targeted
 * and should suppress is false.
 */
const useSuppressed = (useTargetingApi: () => TargetingApi, useShouldSuppress: () => boolean): TargetingApi => {
    const targetingApi = useTargetingApi();
    const shouldSuppress = useShouldSuppress();
    if (shouldSuppress) {
        return neverTargeted;
    }
    return targetingApi;
};

export default useSuppressed;
