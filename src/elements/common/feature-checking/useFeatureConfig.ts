import { useContext } from 'react';
import FeatureContext from './FeatureContext';
import { getFeatureConfig } from './util';
import type FeatureConfig from './flowTypes';

/**
 * Hook to access feature config from the FeatureProvider
 * @param featureName - The beginning of the object path of the feature flags you want to check
 * @returns (FeatureConfig | boolean) - drilling down to the features based on the given featureName | indicating if the feature is enabled
 */
const useFeatureConfig = (featureName: string): FeatureConfig | boolean => {
    const features = useContext(FeatureContext);
    return getFeatureConfig(features, featureName);
};

export default useFeatureConfig;
