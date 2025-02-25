// Import and re-export to avoid TypeScript errors with JSX
import FeatureConsumer from './FeatureConsumer';
import FeatureContext from './FeatureContext';
import FeatureFlag from './FeatureFlag';
import FeatureProvider from './FeatureProvider';
import withFeatureConsumer from './withFeatureConsumer';
import withFeatureProvider from './withFeatureProvider';
import { isFeatureEnabled, getFeatureConfig } from './util';

// Re-export everything
export {
    FeatureConsumer,
    FeatureContext,
    FeatureFlag,
    FeatureProvider,
    withFeatureConsumer,
    withFeatureProvider,
    isFeatureEnabled,
    getFeatureConfig,
};
export * from './flowTypes';
export * from './hooks';
