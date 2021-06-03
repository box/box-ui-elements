import * as React from 'react';
import FeatureProvider from './FeatureProvider';
import { FeatureConfig } from './types';

type WrapperProps = {
    features: FeatureConfig;
};

function withFeatureProvider<P extends WrapperProps>(WrappedComponent: React.ComponentType<P>) {
    function wrapComponent({ features, ...rest }: P, ref: React.Ref<HTMLElement>) {
        return (
            <FeatureProvider features={features}>
                <WrappedComponent {...(rest as P)} ref={ref} />
            </FeatureProvider>
        );
    }
    const wrappedName = WrappedComponent.displayName || WrappedComponent.name || 'component';
    wrapComponent.displayName = `withFeatureProvider(${wrappedName})`;
    return React.forwardRef(wrapComponent);
}

export default withFeatureProvider;
