import * as React from 'react';
import { shallow } from 'enzyme';

import PreviewGhost from '../PreviewGhost';

const getWrapper = () => shallow(<PreviewGhost />);

describe('components/message-center/components/templates/common/PreviewGhost', () => {
    test('should render correctly', () => {
        expect(getWrapper()).toMatchSnapshot();
    });
});
