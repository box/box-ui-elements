// @flow strict
import * as React from 'react';
import FeatureProvider from './FeatureProvider';
import type { FeatureConfig } from './flowTypes';

type WrapperProps = {
    features: FeatureConfig,
};

function withFeatureProvider(WrappedComponent: React.ComponentType<{}>) {
    function wrapComponent({ features, ...props }: WrapperProps, ref) {
        return (
            <FeatureProvider features={features}>
                <WrappedComponent {...props} ref={ref} />
            </FeatureProvider>
        );
    }
    const wrappedName = WrappedComponent.displayName || WrappedComponent.name || 'component';
    wrapComponent.displayName = `withFeatureProvider(${wrappedName})`;
    // $FlowFixMe forwardRef not supported until Flow 0.89.0
    return React.forwardRef(wrapComponent);
}

export default withFeatureProvider;
