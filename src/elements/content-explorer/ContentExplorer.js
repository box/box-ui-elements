/**
 * @file Content Explorer Component
 * @author Box
 */

import { ContentExplorerComponent } from './ContentExplorer.tsx';
import makeResponsive from '../common/makeResponsive';
import withFeatureConsumer from '../common/feature-checking/withFeatureConsumer';
import withFeatureProvider from '../common/feature-checking/withFeatureProvider';

const enhance = BaseComponent => {
    const ResponsiveComponent = makeResponsive(BaseComponent);
    const WithFeatureConsumer = withFeatureConsumer(ResponsiveComponent);
    const WithFeatureProvider = withFeatureProvider(WithFeatureConsumer);
    return WithFeatureProvider;
};

export default enhance(ContentExplorerComponent);
