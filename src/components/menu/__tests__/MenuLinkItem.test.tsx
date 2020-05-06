import React from 'react';
import { shallow } from 'enzyme';

import MenuLinkItem from '../MenuLinkItem';

describe('components/menu/MenuLinkItem', () => {
    test('should correctly render a list element and link with correct props', () => {
        const wrapper = shallow(
            <MenuLinkItem>
                <a className="test" href="/awesome">
                    Foo
                </a>
            </MenuLinkItem>,
        );

        expect(wrapper.is('li')).toBe(true);
        expect(wrapper.prop('role')).toEqual('none');

        const link = wrapper.find('a');
        expect(link.length).toBe(1);
        expect(link.hasClass('menu-item')).toBe(true);
        expect(link.hasClass('test')).toBe(true);
        expect(link.prop('role')).toEqual('menuitem');
        expect(link.prop('tabIndex')).toEqual(-1);
    });

    test('should correctly render a selectable item', () => {
        const wrapper = shallow(
            <MenuLinkItem isSelectItem>
                <a href="/awesome">Foo</a>
            </MenuLinkItem>,
        );

        const link = wrapper.find('a');
        expect(link.length).toBe(1);
        expect(link.hasClass('is-select-item')).toBe(true);
        expect(link.prop('role')).toEqual('menuitemradio');
        expect(link.prop('aria-checked')).toBe(false);
    });

    test('should correctly render a selected item', () => {
        const wrapper = shallow(
            <MenuLinkItem isSelected isSelectItem>
                <a href="/awesome">Foo</a>
            </MenuLinkItem>,
        );

        const link = wrapper.find('a');
        expect(link.length).toBe(1);
        expect(link.hasClass('is-selected')).toBe(true);
        expect(link.prop('aria-checked')).toBe(true);
    });
});
