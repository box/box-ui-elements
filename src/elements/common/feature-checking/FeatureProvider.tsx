import * as React from 'react';
import FeatureContext from './FeatureContext';
import * as types from './flowTypes';

interface FeatureProviderProps {
    children: React.ReactNode | null;
    features?: types.FeatureConfig;
}

function FeatureProvider({ features = {}, children }: FeatureProviderProps) {
    return React.createElement(FeatureContext.Provider, { value: features }, children);
}

export default FeatureProvider;
export type { FeatureProviderProps };
