import React from 'react';
import { shallow } from 'enzyme';

import SelectMenuItem from '../SelectMenuItem';

describe('components/menu/SelectMenuItem', () => {
    test('should render a MenuItem with correct props', () => {
        const wrapper = shallow(<SelectMenuItem isSelected>Hello</SelectMenuItem>);

        expect(wrapper.is('MenuItem')).toBe(true);
        expect(wrapper.prop('isSelectItem')).toBe(true);
        expect(wrapper.prop('isSelected')).toBe(true);
    });
});
