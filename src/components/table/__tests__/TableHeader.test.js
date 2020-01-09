import React from 'react';

import TableHeader from '../TableHeader';

const TEST_CHILDREN = 'test';

describe('components/table/TableHeader', () => {
    const render = (props = {}) => shallow(<TableHeader {...props}>{TEST_CHILDREN}</TableHeader>);

    test('should render default component', () => {
        const wrapper = render();
        const row = wrapper.children();

        expect(wrapper.is('thead')).toBe(true);
        expect(row.is('TableRow')).toBe(true);
        expect(row.contains(TEST_CHILDREN)).toBe(true);
    });

    test('should render the correct classes when className is specified', () => {
        const className = 'class';
        const wrapper = render({ className });

        expect(wrapper.hasClass('table-header')).toBe(true);
        expect(wrapper.hasClass(className)).toBe(true);
    });

    test('should render the correct classes when rowClassName is specified', () => {
        const rowClassName = 'class';
        const wrapper = render({ rowClassName });

        expect(wrapper.find('TableRow').prop('className')).toEqual(rowClassName);
    });
});
