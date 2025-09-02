import React, { useContext } from 'react';
import {
    BlueprintModernizationContext,
    BlueprintModernizationContextValue,
    BlueprintModernizationProvider,
} from '@box/blueprint-web';

export function withBlueprintModernization<P>(
    Component: React.ComponentType<P & BlueprintModernizationContextValue>,
): React.FC<(P & BlueprintModernizationContextValue) | P> {
    return function WithBlueprintModernization(props: P & BlueprintModernizationContextValue) {
        const context = useContext(BlueprintModernizationContext);
        // no context found from the parent component, so we need to provide our own
        if (!context.enableModernizedComponents) {
            return (
                <BlueprintModernizationProvider enableModernizedComponents={!!props.enableModernizedComponents}>
                    <Component {...props} />
                </BlueprintModernizationProvider>
            );
        }
        // context found, so load the component with the existing context
        return <Component {...props} />;
    };
}
