import * as React from 'react';
import { shallow } from 'enzyme';

import ContentGhost from '../ContentGhost';

const getWrapper = () => shallow(<ContentGhost />);

describe('components/message-center/components/templates/common/ContentGhost', () => {
    test('should render correctly', () => {
        expect(getWrapper()).toMatchSnapshot();
    });
});
