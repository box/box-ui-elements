// @flow
import React from 'react';
import FeatureContext from './FeatureContext';
import { isFeatureEnabled, getFeatureConfig } from './util';

export function useFeatureEnabled(featureName: string) {
    const features = React.useContext(FeatureContext);
    return isFeatureEnabled(features, featureName);
}

export function useFeatureConfig(featureName: string) {
    const features = React.useContext(FeatureContext);
    return getFeatureConfig(features, featureName);
}
