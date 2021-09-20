import React from 'react';
import { shallow } from 'enzyme';

import TrialBadge from '../TrialBadge';

describe('components/badge/TrialBadge', () => {
    test('should render a trial badge', () => {
        const wrapper = shallow(<TrialBadge />);

        expect(wrapper).toMatchSnapshot();
    });
});
