import * as React from 'react';
import ContentOpenWith from '../../../src/components/ContentOpenWith/ContentOpenWith';
import './ContentOpenWithExample.scss';
import withConfig from '../withConfig';

const ContentOpenWithExample = props => <ContentOpenWith {...props} />;

export default withConfig(ContentOpenWithExample);
