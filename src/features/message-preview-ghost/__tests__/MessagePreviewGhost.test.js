import * as React from 'react';
import { shallow } from 'enzyme';

import MessagePreviewGhost from '../MessagePreviewGhost';

const getWrapper = () => shallow(<MessagePreviewGhost />);

describe('components/message-preview-ghost/MessagePreviewGhost.js', () => {
    test('should render correctly', () => {
        expect(getWrapper()).toMatchSnapshot();
    });
});
