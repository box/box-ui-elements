import React from 'react';
import { BlueprintProvider, useNoopTreatment } from '@box/blueprint-web';
import type { BlueprintConfigurationOverrides } from '@box/blueprint-web';

export type BlueprintAnimationsProps = {
    /**
     * Blueprint component animations for this element.
     * - omitted / `true`: all phases on (default)
     * - `false`: all phases off
     * - object: per-phase overrides from Blueprint `configurationOverrides` (omitted keys default on)
     */
    enableBlueprintAnimations?: boolean | BlueprintConfigurationOverrides;
};

export function getBlueprintAnimationOverrides(
    value: boolean | BlueprintConfigurationOverrides | undefined,
): Pick<BlueprintConfigurationOverrides, 'animationsPhase1Enabled' | 'animationsPhase2Enabled'> {
    if (value === false) {
        return {
            animationsPhase1Enabled: false,
            animationsPhase2Enabled: false,
        };
    }

    if (value === true || value == null) {
        return {
            animationsPhase1Enabled: true,
            animationsPhase2Enabled: true,
        };
    }

    return {
        animationsPhase1Enabled: value.animationsPhase1Enabled !== false,
        animationsPhase2Enabled: value.animationsPhase2Enabled !== false,
    };
}

export function withBlueprintAnimations<P>(
    Component: React.ComponentType<P>,
): React.FC<P & BlueprintAnimationsProps> {
    return function WithBlueprintAnimations(props: P & BlueprintAnimationsProps) {
        const { enableBlueprintAnimations, ...rest } = props;

        return (
            <BlueprintProvider
                useTreatment={useNoopTreatment}
                configurationOverrides={getBlueprintAnimationOverrides(enableBlueprintAnimations)}
            >
                <Component {...(rest as P)} />
            </BlueprintProvider>
        );
    };
}
