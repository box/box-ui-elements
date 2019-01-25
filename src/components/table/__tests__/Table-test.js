import React from 'react';

import Table from '../Table';

const TEST_CHILDREN = 'test';

describe('components/table/Table', () => {
    const render = (props = {}) => shallow(<Table {...props}>{TEST_CHILDREN}</Table>);

    test('should render default component', () => {
        const wrapper = render();

        expect(wrapper.is('table')).toBe(true);
        expect(wrapper.contains(TEST_CHILDREN)).toBe(true);
    });

    test('should render the correct classes when className is specified', () => {
        const className = 'class';
        const wrapper = render({ className });

        expect(wrapper.hasClass('table')).toBe(true);
        expect(wrapper.hasClass(className)).toBe(true);
    });

    test('should add the is-compact class when isCompact prop is true', () => {
        const wrapper = render({ isCompact: true });

        expect(wrapper.hasClass('is-compact')).toBe(true);
    });

    test('should pass along other props when specified', () => {
        const wrapper = render({ 'data-resin-feature': 'test' });

        expect(wrapper.prop('data-resin-feature')).toEqual('test');
    });
});
