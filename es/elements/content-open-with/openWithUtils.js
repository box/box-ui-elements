/**
 * 
 * @file Open With utils
 * @author Box
 */

import getProp from 'lodash/get';
import BoxToolsInstallMessage from './BoxToolsInstallMessage';
const isDisabledBecauseBoxToolsIsNotInstalled = integration => {
  const disabledReasonType = getProp(integration, 'disabledReasons.0.type');
  return disabledReasonType === BoxToolsInstallMessage;
};
export default {
  isDisabledBecauseBoxToolsIsNotInstalled
};
//# sourceMappingURL=openWithUtils.js.map