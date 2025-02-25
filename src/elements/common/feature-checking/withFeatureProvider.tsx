import * as React from 'react';
import FeatureProvider from './FeatureProvider';
import type { FeatureConfig } from './flowTypes';

interface WrapperProps {
    features: FeatureConfig;
}

function withFeatureProvider<T>(WrappedComponent: React.ComponentType<React.RefAttributes<T>>) {
    function wrapComponent({ features, ...props }: WrapperProps, ref: React.Ref<T>) {
        return React.createElement(
            FeatureProvider,
            { features },
            React.createElement(WrappedComponent, { ...props, ref }),
        );
    }
    const wrappedName = WrappedComponent.displayName || WrappedComponent.name || 'component';
    wrapComponent.displayName = `withFeatureProvider(${wrappedName})`;
    return React.forwardRef<T, WrapperProps>(wrapComponent);
}

export default withFeatureProvider;
