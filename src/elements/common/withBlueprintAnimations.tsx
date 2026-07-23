import React from 'react';
import { BlueprintProvider, useNoopTreatment } from '@box/blueprint-web';

export type BlueprintAnimationPhases = {
    animationsPhase1Enabled?: boolean;
    animationsPhase2Enabled?: boolean;
};

export type BlueprintAnimationsProps = {
    /**
     * Blueprint component animations for this element.
     * - omitted / `true`: all phases on (default)
     * - `false`: all phases off
     * - object: per-phase overrides (omitted keys default on)
     */
    animationsEnabled?: boolean | BlueprintAnimationPhases;
};

export function resolveAnimationPhases(
    value: boolean | BlueprintAnimationPhases | undefined,
): Required<BlueprintAnimationPhases> {
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
        const { animationsEnabled, ...rest } = props;

        return (
            <BlueprintProvider
                useTreatment={useNoopTreatment}
                configurationOverrides={resolveAnimationPhases(animationsEnabled)}
            >
                <Component {...(rest as P)} />
            </BlueprintProvider>
        );
    };
}
