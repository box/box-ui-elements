// @flow
import * as React from 'react';
import FeatureContext from './FeatureContext';
import * as types from './flowTypes';

function FeatureProvider({ features = {}, children }: { features?: types.FeatureConfig, children: ?React.Node }) {
    return <FeatureContext.Provider value={features}>{children}</FeatureContext.Provider>;
}

export default FeatureProvider;
