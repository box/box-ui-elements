import React from 'react';

import TableRow from '../TableRow';

const TEST_CHILDREN = 'test';

describe('components/table/TableRow', () => {
    const render = (props = {}) => shallow(<TableRow {...props}>{TEST_CHILDREN}</TableRow>);

    test('should render default component', () => {
        const wrapper = render();

        expect(wrapper.is('tr')).toBe(true);
        expect(wrapper.contains(TEST_CHILDREN)).toBe(true);
    });

    test('should render the correct classes when className is specified', () => {
        const className = 'class';
        const wrapper = render({ className });

        expect(wrapper.hasClass('table-row')).toBe(true);
        expect(wrapper.hasClass(className)).toBe(true);
    });
});
