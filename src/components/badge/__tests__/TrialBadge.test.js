import React from 'react';

import TrialBadge from '../TrialBadge';

describe('components/badge/TrialBadge', () => {
    test('should render a trial badge', () => {
        const wrapper = shallow(<TrialBadge />);

        expect(wrapper).toMatchSnapshot();
    });
});
