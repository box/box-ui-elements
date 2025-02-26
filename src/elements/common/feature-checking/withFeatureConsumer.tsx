import * as React from 'react';
import FeatureConsumer from './FeatureConsumer';
import type { FeatureConfig } from './flowTypes';

interface WrapperProps {}

function withFeatureConsumer<T>(
    WrappedComponent: React.ComponentType<{ features: FeatureConfig } & React.RefAttributes<T>>,
) {
    function wrapComponent(props: WrapperProps, ref: React.Ref<T>) {
        // Using a function to render the wrapped component
        const renderWrappedComponent = (features: FeatureConfig): React.ReactElement => {
            return React.createElement(
                WrappedComponent as React.ComponentType<{ features: FeatureConfig } & React.RefAttributes<T>>,
                { ...props, ref, features },
            );
        };

        // Using a function component to avoid TypeScript errors
        const ConsumerWrapper = () => {
            const Consumer = FeatureConsumer as React.ExoticComponent<{
                children: (value: FeatureConfig) => React.ReactNode;
            }>;
            return React.createElement(Consumer, null, renderWrappedComponent);
        };

        return React.createElement(ConsumerWrapper, null);
    }
    const wrappedName = WrappedComponent.displayName || WrappedComponent.name || 'component';
    wrapComponent.displayName = `withFeatureConsumer(${wrappedName})`;
    return React.forwardRef<T, WrapperProps>(wrapComponent);
}

export default withFeatureConsumer;
