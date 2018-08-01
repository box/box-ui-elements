import * as React from 'react';
import ContentPicker from '../../../src/components/ContentPicker/ContentPicker';
import withConfig from '../withConfig';
import './ContentPickerExample.scss';

const ContentPickerExample = (props) => <ContentPicker {...props} />;

export default withConfig(ContentPickerExample);
