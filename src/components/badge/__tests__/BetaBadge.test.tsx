import React from 'react';
import { shallow } from 'enzyme';

import BetaBadge from '../BetaBadge';

describe('components/badge/BetaBadge', () => {
    test('should render a beta badge', () => {
        const wrapper = shallow(<BetaBadge />);

        expect(wrapper).toMatchSnapshot();
    });
});
