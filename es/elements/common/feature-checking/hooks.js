import * as React from 'react';
import FeatureContext from './FeatureContext';
import { getFeatureConfig, isFeatureEnabled } from './util';
export function useFeatureConfig(featureName) {
  const features = React.useContext(FeatureContext);
  return getFeatureConfig(features, featureName);
}
export function useFeatureEnabled(featureName) {
  const features = React.useContext(FeatureContext);
  return isFeatureEnabled(features, featureName);
}
//# sourceMappingURL=hooks.js.map