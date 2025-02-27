import * as React from 'react';
import type { FeatureConfig } from './types';

const FeatureContext = React.createContext<FeatureConfig>({});

export default FeatureContext;
