/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import EllipsisCrumb from '../EllipsisCrumb';

let wrapper;

describe('components/breadcrumb/EllipsisCrumb', () => {
    beforeEach(() => {
        wrapper = shallow(
            <EllipsisCrumb>
                <a href="#">Home</a>
                <a href="#">Box</a>
            </EllipsisCrumb>,
        );
    });

    test('should render correct EllipsisCrumb', () => {
        const menu = wrapper.find('Menu');
        expect(wrapper.find('DropdownMenu').length).toBe(1);
        expect(wrapper.find('.breadcrumb-toggler').length).toBe(1);
        expect(menu.length).toBe(1);
        expect(menu.find('a').length).toBe(2);
    });
});
