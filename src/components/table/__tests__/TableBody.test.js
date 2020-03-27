import React from 'react';

import TableBody from '../TableBody';

const TEST_CHILDREN = 'test';

describe('components/table/TableBody', () => {
    const render = (props = {}) => shallow(<TableBody {...props}>{TEST_CHILDREN}</TableBody>);

    test('should render default component', () => {
        const wrapper = render();

        expect(wrapper.is('tbody')).toBe(true);
        expect(wrapper.contains(TEST_CHILDREN)).toBe(true);
    });

    test('should render the correct classes when className is specified', () => {
        const className = 'class';
        const wrapper = render({ className });

        expect(wrapper.hasClass('table-body')).toBe(true);
        expect(wrapper.hasClass(className)).toBe(true);
    });
});
