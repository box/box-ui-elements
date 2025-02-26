import * as React from 'react';
import type { FeatureConfig } from './flowTypes';

// Explicitly type the context to include Consumer and Provider properties
const FeatureContext = React.createContext<FeatureConfig>({});

export default FeatureContext;
