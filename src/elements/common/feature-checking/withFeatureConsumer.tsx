import * as React from 'react';
import FeatureConsumer from './FeatureConsumer';
import type { FeatureConfig } from './flowTypes';

interface WrapperProps {}

function withFeatureConsumer<T>(
    WrappedComponent: React.ComponentType<{ features: FeatureConfig } & React.RefAttributes<T>>,
) {
    function wrapComponent(props: WrapperProps, ref: React.Ref<T>) {
        return (
            <FeatureConsumer>
                {(features: FeatureConfig) => <WrappedComponent {...props} ref={ref} features={features} />}
            </FeatureConsumer>
        );
    }
    const wrappedName = WrappedComponent.displayName || WrappedComponent.name || 'component';
    wrapComponent.displayName = `withFeatureConsumer(${wrappedName})`;
    return React.forwardRef<T, WrapperProps>(wrapComponent);
}

export default withFeatureConsumer;
