import * as React from 'react';
import { FeatureConfig } from './types';

const FeatureContext = React.createContext<FeatureConfig>({});

export default FeatureContext;
