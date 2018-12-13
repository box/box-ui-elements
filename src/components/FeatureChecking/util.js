// @flow
import get from 'lodash/get';

export type FeatureOptions = {
    [key: string]: any,
};

export type FeatureConfig = {
    [key: string]: FeatureOptions,
};

function isFeatureEnabled(features: FeatureConfig, featureName: string) {
    return !!get(features, `${featureName}`, false);
}

function getFeatureConfig(features: FeatureConfig, featureName: string) {
    return get(features, `${featureName}`, {});
}

export { isFeatureEnabled, getFeatureConfig };
