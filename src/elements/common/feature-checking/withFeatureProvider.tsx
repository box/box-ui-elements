import * as React from 'react';
import FeatureProvider from './FeatureProvider';
import type { FeatureConfig } from './flowTypes';

interface WrapperProps {
    features: FeatureConfig;
}

function withFeatureProvider<T>(WrappedComponent: React.ComponentType<React.RefAttributes<T>>) {
    function wrapComponent({ features, ...props }: WrapperProps, ref: React.Ref<T>) {
        // Using a function component to avoid TypeScript errors
        const ProviderWrapper = () => {
            const Provider = FeatureProvider as React.ComponentType<{
                features: FeatureConfig;
                children: React.ReactNode;
            }>;

            const WrappedWithProps = React.createElement(
                WrappedComponent as React.ComponentType<React.RefAttributes<T>>,
                {
                    ...props,
                    ref,
                },
            );

            return React.createElement(Provider, { features }, WrappedWithProps);
        };

        return React.createElement(ProviderWrapper, null);
    }
    const wrappedName = WrappedComponent.displayName || WrappedComponent.name || 'component';
    wrapComponent.displayName = `withFeatureProvider(${wrappedName})`;
    return React.forwardRef<T, WrapperProps>(wrapComponent);
}

export default withFeatureProvider;
