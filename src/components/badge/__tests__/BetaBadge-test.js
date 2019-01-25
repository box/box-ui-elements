import React from 'react';

import BetaBadge from '../BetaBadge';

describe('components/badge/BetaBadge', () => {
    test('should render a beta badge', () => {
        const wrapper = shallow(<BetaBadge />);

        expect(wrapper).toMatchSnapshot();
    });
});
