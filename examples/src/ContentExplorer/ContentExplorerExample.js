import * as React from 'react';
import ContentExplorer from '../../../src/components/ContentExplorer/ContentExplorer';
import withConfig from '../withConfig';
import './ContentExplorerExample.scss';

const ContentExplorerExample = (props) => <ContentExplorer {...props} />;

export default withConfig(ContentExplorerExample);
