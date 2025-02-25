import * as React from 'react';
import { isFeatureEnabled, getFeatureConfig } from './util';
import FeatureConsumer from './FeatureConsumer';
import * as types from './flowTypes';

interface FeatureFlagProps {
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
    // Using a render function pattern to avoid TypeScript errors with React.createElement
    return (
        <FeatureConsumer>
            {(features: types.FeatureConfig): React.ReactNode => {
                const isEnabled = not ? !isFeatureEnabled(features, feature) : isFeatureEnabled(features, feature);
                const featureConfig = getFeatureConfig(features, feature);
                if (children) return isEnabled && children;
                return isEnabled ? enabled(featureConfig) : disabled();
            }}
        </FeatureConsumer>
    );
}

export default FeatureFlag;
export type { FeatureFlagProps };
