import React from 'react';

import { NavSidebar } from '..';

describe('components/nav-sidebar/NavSidebar', () => {
    test('should render nav sidebar and children', () => {
        const children = 'hootie hoo';
        const sidebar = shallow(<NavSidebar>{children}</NavSidebar>);

        expect(sidebar.type()).toEqual('aside');
        expect(sidebar.hasClass('nav-sidebar')).toBe(true);
        expect(sidebar.children().text()).toEqual(children);
    });

    test('should render class and custom attributes when specified', () => {
        const sidebar = shallow(
            <NavSidebar className="nav" data-resin-component="leftnav">
                hootie hoo
            </NavSidebar>,
        );

        expect(sidebar.hasClass('nav')).toBe(true);
        expect(sidebar.find('aside').prop('data-resin-component')).toEqual('leftnav');
    });
});
