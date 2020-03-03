import React from 'react';
import { shallow } from 'enzyme';

import IconPageBack from '../IconPageBack';

describe('icons/general/IconPageBack', () => {
    test('should correctly render default paging back icon', () => {
        const wrapper = shallow(<IconPageBack />);

        expect(wrapper.hasClass('icon-page-back')).toBe(true);
    });
});
