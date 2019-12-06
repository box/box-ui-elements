/**
 * @flow
 * @file Open With utils
 * @author Box
 */

import getProp from 'lodash/get';
import BoxToolsInstallMessage from './BoxToolsInstallMessage';
import type { Integration } from '../../common/types/integrations';

const isDisabledBecauseBoxToolsIsNotInstalled = (integration: ?Integration): boolean => {
    const disabledReasonType = getProp(integration, 'disabledReasons.0.type');
    return disabledReasonType === BoxToolsInstallMessage;
};

export default { isDisabledBecauseBoxToolsIsNotInstalled };
