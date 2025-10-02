import React from 'react';
import { BlueprintModernizationContextValue } from '@box/blueprint-web';
export declare function withBlueprintModernization<P>(Component: React.ComponentType<P & BlueprintModernizationContextValue>): React.FC<(P & BlueprintModernizationContextValue) | P>;
