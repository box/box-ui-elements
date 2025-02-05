import * as React from 'react';
import FeatureConsumer from './FeatureConsumer';
import type { FeatureConfig } from './flowTypes';

function withFeatureConsumer<P extends { features: FeatureConfig }>(
    WrappedComponent: React.ComponentType<P>,
): React.ForwardRefExoticComponent<React.PropsWithoutRef<Omit<P, 'features'>> & React.RefAttributes<HTMLElement>> {
    function wrapComponent(props: Omit<P, 'features'>, ref: React.Ref<HTMLElement>) {
        return (
            <FeatureConsumer>
                {(features: FeatureConfig) => <WrappedComponent {...(props as P)} ref={ref} features={features} />}
            </FeatureConsumer>
        );
    }
    const wrappedName = WrappedComponent.displayName || WrappedComponent.name || 'component';
    wrapComponent.displayName = `withFeatureConsumer(${wrappedName})`;
    return React.forwardRef(wrapComponent);
}

export default withFeatureConsumer;
