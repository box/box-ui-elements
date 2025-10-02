// @flow
import * as React from 'react';
import FeatureContext from './FeatureContext';
import * as types from './flowTypes';

function FeatureProvider({ features = {}, children }: { children: ?React.Node, features?: types.FeatureConfig }) {
    return <FeatureContext.Provider value={features}>{children}</FeatureContext.Provider>;
}

export default FeatureProvider;
