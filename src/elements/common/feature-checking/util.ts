import * as types from './flowTypes';
// Use require instead of import to avoid TypeScript error
// eslint-disable-next-line @typescript-eslint/no-var-requires
const get = require('lodash/get');

function isFeatureEnabled(features: types.FeatureConfig, featureName: string) {
    return !!get(features, featureName, false);
}

function getFeatureConfig(features: types.FeatureConfig, featureName: string) {
    return get(features, featureName, {});
}

export { isFeatureEnabled, getFeatureConfig };
