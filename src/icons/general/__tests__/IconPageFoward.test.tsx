import React from 'react';
import { shallow } from 'enzyme';

import IconPageForward from '../IconPageForward';

describe('icons/general/IconPageForward', () => {
    test('should correctly render default paging forward icon', () => {
        const wrapper = shallow(<IconPageForward />);

        expect(wrapper.hasClass('icon-page-forward')).toBe(true);
    });
});
