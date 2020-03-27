import React from 'react';
import { shallow } from 'enzyme';

import MenuSectionHeader from '../MenuSectionHeader';

describe('components/menu/MenuSectionHeader', () => {
    test('should render a disabled MenuItem and pass props', () => {
        const wrapper = shallow(
            <MenuSectionHeader className="hey" data-resin-test="hola">
                hi
            </MenuSectionHeader>,
        );

        const menuItem = wrapper.find('MenuItem');
        expect(menuItem.length).toBe(1);
        expect(menuItem.prop('isDisabled')).toBe(true);
        expect(menuItem.hasClass('hey')).toBe(true);
        expect(menuItem.hasClass('menu-section-header')).toBe(true);
        expect(menuItem.prop('data-resin-test')).toEqual('hola');
    });
});
