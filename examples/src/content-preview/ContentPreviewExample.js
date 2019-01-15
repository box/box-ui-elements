import * as React from 'react';
import ContentPreview from '../../../src/elements/content-preview';
import withConfig from '../withConfig';
import './ContentPreviewExample.scss';

const ContentPreviewExample = props => <ContentPreview {...props} />;

export default withConfig(ContentPreviewExample);
