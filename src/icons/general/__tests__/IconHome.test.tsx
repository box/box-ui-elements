import React from 'react';
import { shallow } from 'enzyme';

import IconHome from '../IconHome';

describe('icons/general/IconHome', () => {
    test('should correctly render default home icon', () => {
        const wrapper = shallow(<IconHome />);

        expect(wrapper.hasClass('icon-home')).toBe(true);
    });

    test('should correctly render IconHome specified color', () => {
        const color = '#ffffff';
        const wrapper = shallow(<IconHome color={color} />);

        expect(wrapper.find('path').prop('fill')).toEqual(color);
    });
});
