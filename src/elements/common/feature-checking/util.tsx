import get from 'lodash/get';
import * as types from './types';

function isFeatureEnabled(features: types.FeatureConfig, featureName: string) {
    return !!get(features, featureName, false);
}

function getFeatureConfig(features: types.FeatureConfig, featureName: string) {
    return get(features, featureName, {});
}

export { isFeatureEnabled, getFeatureConfig };
