// @flow
import * as React from 'react';
import FeatureContext from './FeatureContext';
import { getFeatureConfig, isFeatureEnabled } from './util';

export function useFeatureConfig(featureName: string) {
    const features = React.useContext(FeatureContext);
    return getFeatureConfig(features, featureName);
}

export function useFeatureEnabled(featureName: string) {
    const features = React.useContext(FeatureContext);
    return isFeatureEnabled(features, featureName);
}
