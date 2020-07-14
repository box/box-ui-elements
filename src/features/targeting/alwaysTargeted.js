// @flow
import type { TargetingApi } from './types';

/**
 * Return a targetingApi that is always targeting
 */
const alwaysTargeted: TargetingApi = {
    canShow: true,
    onShow: () => {},
    onClose: () => {},
    onComplete: () => {},
};

export default alwaysTargeted;
