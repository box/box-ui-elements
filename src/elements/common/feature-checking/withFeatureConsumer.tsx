import * as React from 'react';
import FeatureConsumer from './FeatureConsumer';
import { FeatureConfig } from './types';

function withFeatureConsumer<P extends object>(WrappedComponent: React.ComponentType<P>) {
    function wrapComponent(props: P, ref: React.Ref<HTMLElement>) {
        return (
            <FeatureConsumer>
                {(features: FeatureConfig) => <WrappedComponent {...props} ref={ref} features={features} />}
            </FeatureConsumer>
        );
    }
    const wrappedName = WrappedComponent.displayName || WrappedComponent.name || 'component';
    wrapComponent.displayName = `withFeatureConsumer(${wrappedName})`;
    return React.forwardRef(wrapComponent);
}

export default withFeatureConsumer;
