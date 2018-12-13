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
}: {
    feature: string,
    enabled?: types.FeatureOptions => React.Node,
    disabled?: () => React.Node,
    children?: React.Node,
}) {
    return (
        <FeatureConsumer>
            {features => {
                const isEnabled = isFeatureEnabled(features, feature);
                const featureConfig = getFeatureConfig(features, feature);
                if (children) return isEnabled && children;
                return isEnabled ? enabled(featureConfig) : disabled();
            }}
        </FeatureConsumer>
    );
}

export default FeatureFlag;
