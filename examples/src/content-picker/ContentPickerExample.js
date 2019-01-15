import * as React from 'react';
import ContentPicker from '../../../src/elements/content-picker';
import withConfig from '../withConfig';
import './ContentPickerExample.scss';

const ContentPickerExample = props => <ContentPicker {...props} />;

export default withConfig(ContentPickerExample);
