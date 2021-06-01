import * as React from 'react';
import * as types from './types';
import FeatureConsumer from './FeatureConsumer';
import { isFeatureEnabled, getFeatureConfig } from './util';

function FeatureFlag({
    feature,
    enabled = () => null,
    disabled = () => null,
    children,
    not = false,
}: {
    children?: React.ReactNode;
    disabled?: () => React.ReactNode;
    enabled?: (arg0: types.FeatureConfig) => React.ReactNode;
    feature: string;
    not?: boolean; // invert the flag - recommended for use with a child component, not "enabled"/"disabled"
}) {
    return (
        <FeatureConsumer>
            {features => {
                const isEnabled = not ? !isFeatureEnabled(features, feature) : isFeatureEnabled(features, feature);
                const featureConfig = getFeatureConfig(features, feature);
                if (children) return isEnabled && children;
                return isEnabled ? enabled(featureConfig) : disabled();
            }}
        </FeatureConsumer>
    );
}

export default FeatureFlag;
