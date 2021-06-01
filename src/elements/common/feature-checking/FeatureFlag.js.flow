// @flow
import * as React from 'react';
import { isFeatureEnabled, getFeatureConfig } from './util';
import FeatureConsumer from './FeatureConsumer';
import * as types from './flowTypes';

function FeatureFlag({
    feature,
    enabled = () => null,
    disabled = () => null,
    children,
    not = false,
}: {
    children?: React.Node,
    disabled?: () => React.Node,
    enabled?: types.FeatureOptions => React.Node,
    feature: string,
    not?: boolean, // invert the flag - recommended for use with a child component, not "enabled"/"disabled"
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
