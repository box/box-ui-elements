import React from 'react';

import TableCell from '../TableCell';

const TEST_CHILDREN = 'test';

describe('components/table/TableCell', () => {
    const render = (props = {}) => shallow(<TableCell {...props}>{TEST_CHILDREN}</TableCell>);

    test('should render default component', () => {
        const wrapper = render();

        expect(wrapper.is('td')).toBe(true);
        expect(wrapper.contains(TEST_CHILDREN)).toBe(true);
    });

    test('should render the correct classes when className is specified', () => {
        const className = 'class';
        const wrapper = render({ className });

        expect(wrapper.hasClass('table-cell')).toBe(true);
        expect(wrapper.hasClass(className)).toBe(true);
    });

    test('should add the is-fixed-width class when isFixedWidth prop is true', () => {
        const wrapper = render({ isFixedWidth: true });

        expect(wrapper.hasClass('is-fixed-width')).toBe(true);
    });

    test('should render custom attributes when specified', () => {
        const wrapper = render({ 'data-resin-feature': 'feature' });

        expect(wrapper.prop('data-resin-feature')).toEqual('feature');
    });
});
