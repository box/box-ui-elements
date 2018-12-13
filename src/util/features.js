// @flow
import * as React from 'react';
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

const FeatureContext = React.createContext({});

function FeatureProvider({ features = {}, children }: { features?: FeatureConfig, children: ?React.Node }) {
    return <FeatureContext.Provider value={features}>{children}</FeatureContext.Provider>;
}

const FeatureConsumer = FeatureContext.Consumer;

function FeatureFlag({
    feature,
    enabled = () => null,
    disabled = () => null,
    children,
}: {
    feature: string,
    enabled?: FeatureOptions => React.Node,
    disabled?: () => React.Node,
    children?: React.Node,
}) {
    return (
        <FeatureContext.Consumer>
            {features => {
                const isEnabled = isFeatureEnabled(features, feature);
                const featureConfig = getFeatureConfig(features, feature);
                if (children) return isEnabled && children;
                return isEnabled ? enabled(featureConfig) : disabled();
            }}
        </FeatureContext.Consumer>
    );
}

export { isFeatureEnabled, FeatureContext, FeatureProvider, FeatureConsumer, FeatureFlag };
