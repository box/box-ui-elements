// @flow
import * as React from 'react';
import FeatureProvider from './FeatureProvider';
import type { FeatureConfig } from './flowTypes';

type WrapperProps = {
    features: FeatureConfig,
};

function withFeatureProvider(WrappedComponent: React.ComponentType<any>) {
    function WrapperComponent({ features, ...props }: WrapperProps) {
        return (
            <FeatureProvider features={features}>
                <WrappedComponent {...props} />
            </FeatureProvider>
        );
    }
    const wrappedName = WrappedComponent.displayName || WrappedComponent.name || '';
    WrapperComponent.displayName = `withFeatureProvider(${wrappedName})`;
    return WrapperComponent;
}

export default withFeatureProvider;
