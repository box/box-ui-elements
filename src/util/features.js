// @flow
import * as React from 'react';
import get from 'lodash/get';

export type FeatureOptions = {
    enabled: Boolean,
    [key: string]: any,
};

export type FeatureConfig = {
    [key: string]: FeatureOptions,
};

function isFeatureEnabled(features: FeatureConfig, featureName: string) {
    return !!get(features, `${featureName}.enabled`, false);
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
    disabled?: FeatureOptions => React.Node,
    children?: (Boolean, FeatureOptions) => React.Node,
}) {
    return (
        <FeatureContext.Consumer>
            {features => {
                const isEnabled = isFeatureEnabled(features, feature);
                const featureConfig = getFeatureConfig(features, feature);
                if (children) return children(isEnabled, featureConfig);
                return isEnabled ? enabled(featureConfig) : disabled(featureConfig);
            }}
        </FeatureContext.Consumer>
    );
}

export { isFeatureEnabled, FeatureContext, FeatureProvider, FeatureConsumer, FeatureFlag };
