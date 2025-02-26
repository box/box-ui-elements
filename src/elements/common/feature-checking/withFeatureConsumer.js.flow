// @flow strict
import * as React from 'react';
import FeatureConsumer from './FeatureConsumer';
import type { FeatureConfig } from './flowTypes';

type WrapperProps = {};

function withFeatureConsumer(WrappedComponent: React.ComponentType<{ features: FeatureConfig }>) {
    function wrapComponent(props: WrapperProps, ref) {
        return (
            <FeatureConsumer>
                {(features: FeatureConfig) => <WrappedComponent {...props} ref={ref} features={features} />}
            </FeatureConsumer>
        );
    }
    const wrappedName = WrappedComponent.displayName || WrappedComponent.name || 'component';
    wrapComponent.displayName = `withFeatureConsumer(${wrappedName})`;
    return React.forwardRef<WrapperProps, HTMLElement>(wrapComponent);
}

export default withFeatureConsumer;
