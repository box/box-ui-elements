import * as React from 'react';
import ContentPreview from '../../../src/components/ContentPreview/ContentPreview';
import withConfig from '../withConfig';
import './ContentPreviewExample.scss';

const ContentPreviewExample = props => <ContentPreview {...props} />;

export default withConfig(ContentPreviewExample);
