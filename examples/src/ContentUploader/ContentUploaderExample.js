import * as React from 'react';
import ContentUploader from '../../../src/components/ContentUploader/ContentUploader';
import withConfig from '../withConfig';
import './ContentUploaderExample.scss';

const ContentUploaderExample = (props) => <ContentUploader {...props} />;

export default withConfig(ContentUploaderExample);
