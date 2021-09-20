import React from 'react';
import { shallow } from 'enzyme';

import UpgradeBadge from '../UpgradeBadge';

describe('components/badge/UpgradeBadge', () => {
    test('should render a upgrade badge', () => {
        const wrapper = shallow(<UpgradeBadge />);

        expect(wrapper).toMatchSnapshot();
    });
});
