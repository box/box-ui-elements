import * as React from 'react';
import { isFeatureEnabled, getFeatureConfig } from './util';
import FeatureConsumer from './FeatureConsumer';
import * as types from './flowTypes';
function FeatureFlag({
  feature,
  enabled = () => null,
  disabled = () => null,
  children,
  not = false
}) {
  return /*#__PURE__*/React.createElement(FeatureConsumer, null, features => {
    const isEnabled = not ? !isFeatureEnabled(features, feature) : isFeatureEnabled(features, feature);
    const featureConfig = getFeatureConfig(features, feature);
    if (children) return isEnabled && children;
    return isEnabled ? enabled(featureConfig) : disabled();
  });
}
export default FeatureFlag;
//# sourceMappingURL=FeatureFlag.js.map