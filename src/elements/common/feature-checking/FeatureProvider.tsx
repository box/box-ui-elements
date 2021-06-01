// @flow
import * as React from 'react';
import * as types from './types';
import FeatureContext from './FeatureContext';

function FeatureProvider({ features = {}, children }: { children?: React.ReactNode; features?: types.FeatureConfig }) {
    return <FeatureContext.Provider value={features}>{children}</FeatureContext.Provider>;
}

export default FeatureProvider;
