import * as React from 'react';
import FeatureConsumer from './FeatureConsumer';
import { isFeatureEnabled, getFeatureConfig } from './util';
import * as types from './types';

export interface FeatureFlagProps {
    children?: React.ReactNode;
    disabled?: () => React.ReactNode;
    enabled?: (options: types.FeatureOptions) => React.ReactNode;
    feature: string;
    not?: boolean; // invert the flag - recommended for use with a child component, not "enabled"/"disabled"
}

function FeatureFlag({
    feature,
    enabled = () => null,
    disabled = () => null,
    children,
    not = false,
}: FeatureFlagProps) {
    return (
        <FeatureConsumer>
            {(features: types.FeatureConfig) => {
                const isEnabled = not ? !isFeatureEnabled(features, feature) : isFeatureEnabled(features, feature);
                const featureConfig = getFeatureConfig(features, feature);
                if (children) return isEnabled && children;
                return isEnabled ? enabled(featureConfig) : disabled();
            }}
        </FeatureConsumer>
    );
}

export default FeatureFlag;
