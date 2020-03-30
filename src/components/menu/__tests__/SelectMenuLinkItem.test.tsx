import React from 'react';
import { shallow } from 'enzyme';

import SelectMenuLinkItem from '../SelectMenuLinkItem';

describe('components/menu/SelectMenuLinkItem', () => {
    test('should correctly render default component', () => {
        const wrapper = shallow(
            <SelectMenuLinkItem>
                <a href="/awesome">Foo</a>
            </SelectMenuLinkItem>,
        );

        expect(wrapper.is('MenuLinkItem')).toBe(true);
        expect(wrapper.prop('isSelectItem')).toBe(true);
    });

    test('should correctly pass through props', () => {
        const wrapper = shallow(
            <SelectMenuLinkItem isSelected>
                <a href="/awesome">Foo</a>
            </SelectMenuLinkItem>,
        );

        expect(wrapper.prop('isSelected')).toBe(true);
    });
});
