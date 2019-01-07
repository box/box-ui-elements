import getProp from 'lodash/get';
import BoxToolsInstallMessage from './BoxToolsInstallMessage';

/**
 * @flow
 * @file Skills utils
 * @author Box
 */

/**
 * Determines if the integration is disabled because Box Tools is not installed.
 *
 * @private
 * @return {object} Object of display related props
 */
const isDisabledBecauseBoxToolsNotInstalled = (disabledReasons: Array<DisabledReason> = []): Object => {
    const disabledReasonType = getProp(disabledReasons, '0.type');
    return disabledReasonType === BoxToolsInstallMessage;
};

export { isDisabledBecauseBoxToolsNotInstalled as default };
