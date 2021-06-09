import * as React from 'react';
import { shallow } from 'enzyme';

import PreviewErrorNotification from '../PreviewErrorNotification';

const getWrapper = () => shallow(<PreviewErrorNotification />);

describe('components/message-preview-content/PreviewErrorNotification.js', () => {
    test('should render correctly', () => {
        expect(getWrapper()).toMatchSnapshot();
    });
});
