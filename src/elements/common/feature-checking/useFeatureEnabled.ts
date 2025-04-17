import { useContext } from 'react';
import FeatureContext from './FeatureContext';
import { isFeatureEnabled } from './util';

/**
 * Hook to access feature flags from the FeatureProvider
 * @param featureName - The name of the feature flag to check
 * @returns boolean - indicating if the feature is enabled
 */
const useFeatureEnabled = (featureName: string): boolean => {
    const features = useContext(FeatureContext);
    return isFeatureEnabled(features, featureName);
};

export default useFeatureEnabled;
