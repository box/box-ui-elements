import React from 'react';

import TableHeaderCell from '../TableHeaderCell';

const TEST_CHILDREN = 'test';

describe('components/table/TableHeaderCell', () => {
    const render = (props = {}) => shallow(<TableHeaderCell {...props}>{TEST_CHILDREN}</TableHeaderCell>);

    test('should render default component', () => {
        const wrapper = render();

        expect(wrapper.is('th')).toBe(true);
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

    test('should render additional attributes when specified', () => {
        const wrapper = render({ colSpan: 2 });

        expect(wrapper.prop('colSpan')).toEqual(2);
    });
});
