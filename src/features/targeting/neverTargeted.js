// @flow
import type { TargetingApi } from './types';

/**
 * Return a targetingApi that is never targeting
 */
const neverTargeted: TargetingApi = {
    canShow: false,
    onShow: () => {},
    onClose: () => {},
    onComplete: () => {},
};

export default neverTargeted;
