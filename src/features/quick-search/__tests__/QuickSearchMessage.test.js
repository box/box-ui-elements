import React from 'react';

import QuickSearchMessage from '../QuickSearchMessage';

describe('features/quick-search/QuickSearchMessage', () => {
    test('should render default component', () => {
        const children = 'hi';
        const wrapper = shallow(<QuickSearchMessage>{children}</QuickSearchMessage>);
        const overlay = wrapper.children();

        expect(wrapper.hasClass('overlay-wrapper')).toBe(true);
        expect(wrapper.hasClass('is-visible')).toBe(false);
        expect(wrapper.hasClass('quick-search-message')).toBe(true);
        expect(overlay.is('p')).toBe(true);
        expect(overlay.hasClass('overlay')).toBe(true);
        expect(overlay.text()).toEqual(children);
    });

    test('should show overlay when isShown prop is true', () => {
        const wrapper = shallow(<QuickSearchMessage isShown>hi</QuickSearchMessage>);

        expect(wrapper.hasClass('is-visible')).toBe(true);
    });
});
