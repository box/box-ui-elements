import React from 'react';
import { shallow } from 'enzyme';

import IconAlert from '../IconAlert';

describe('icons/general/IconAlert', () => {
    test('should correctly render default alert icon', () => {
        const wrapper = shallow(<IconAlert />);

        expect(wrapper.hasClass('icon-alert')).toBe(true);
    });
});
