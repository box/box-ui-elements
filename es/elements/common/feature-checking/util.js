import get from 'lodash/get';
import * as types from './flowTypes';
function isFeatureEnabled(features, featureName) {
  return !!get(features, featureName, false);
}
function getFeatureConfig(features, featureName) {
  return get(features, featureName, {});
}
export { isFeatureEnabled, getFeatureConfig };
//# sourceMappingURL=util.js.map