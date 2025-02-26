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
    // Using a function to render the consumer content
    const renderConsumerContent = (features: types.FeatureConfig): React.ReactNode => {
        const isEnabled = not ? !isFeatureEnabled(features, feature) : isFeatureEnabled(features, feature);
        const featureConfig = getFeatureConfig(features, feature);
        if (children) return isEnabled && children;
        return isEnabled ? enabled(featureConfig) : disabled();
    };

    // Using a function component to avoid TypeScript errors
    const ConsumerWrapper = () => {
        const Consumer = FeatureConsumer as React.ExoticComponent<{
            children: (value: types.FeatureConfig) => React.ReactNode;
        }>;
        return React.createElement(Consumer, null, renderConsumerContent);
    };

    return React.createElement(ConsumerWrapper, null);
}

export default FeatureFlag;
export type { FeatureFlagProps };
