import * as React from 'react';
import FeatureContext from './FeatureContext';
import * as types from './flowTypes';
function FeatureProvider({
  features = {},
  children
}) {
  return /*#__PURE__*/React.createElement(FeatureContext.Provider, {
    value: features
  }, children);
}
export default FeatureProvider;
//# sourceMappingURL=FeatureProvider.js.map