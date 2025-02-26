import * as React from 'react';
import FeatureContext from './FeatureContext';
import type { FeatureConfig } from './flowTypes';

// Explicitly type the Consumer to avoid TypeScript errors
const FeatureConsumer = FeatureContext.Consumer as React.Consumer<FeatureConfig>;

export default FeatureConsumer;
