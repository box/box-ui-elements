// @flow
import neverTargeted from '../neverTargeted';
import { type TargetingApi, type UseTargetingApi } from '../types';

/**
 * Returns a targetingApi that will be targeted as long as the input targeting api is targeted
 * and should suppress is false.
 */
const useSuppressed = (
    useTargetingApi: UseTargetingApi,
    useShouldSuppress: () => boolean,
    shouldTarget: boolean,
): TargetingApi => {
    const targetingApi = useTargetingApi(shouldTarget);
    const shouldSuppress = useShouldSuppress();
    if (shouldSuppress) {
        return neverTargeted;
    }
    return targetingApi;
};

export default useSuppressed;
