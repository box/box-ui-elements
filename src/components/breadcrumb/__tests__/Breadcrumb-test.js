/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import { Link } from '../../link';

import { BreadcrumbCore as Breadcrumb } from '../Breadcrumb';

let wrapper;
const intl = {
    formatMessage: jest.fn().mockReturnValue('breadcrumb'),
};

describe('components/breadcrumb/Breadcrumb', () => {
    test('should render correct breadcrumbs', () => {
        wrapper = shallow(
            <Breadcrumb className="my-breadcrumbs" intl={intl}>
                <Link>Home</Link>
                <Link>Box Engineering</Link>
                <Link>Frameworks</Link>
            </Breadcrumb>,
        );

        expect(wrapper.is('nav')).toBe(true);
        expect(wrapper.prop('aria-label')).toEqual('breadcrumb');
        expect(wrapper.hasClass('my-breadcrumbs')).toBe(true);
        expect(wrapper.find('ol').length).toBe(1);
        expect(wrapper.find('Crumb').length).toBe(3);
    });

    test('should render dotdotdot crumbs if number of children exceeds threshold', () => {
        wrapper = shallow(
            <Breadcrumb threshold={4} intl={intl}>
                <Link>Home</Link>
                <Link>Box Engineering</Link>
                <Link>Frameworks</Link>
                <Link>Front End</Link>
                <Link>React</Link>
            </Breadcrumb>,
        );

        // test that the ellipsis is inside a Crumb with the "no-shrink" class
        const noShrinkCrumb = wrapper.find('Crumb').at(1);
        expect(noShrinkCrumb.prop('className')).toEqual('no-shrink');
        expect(noShrinkCrumb.find('EllipsisCrumb').length).toBe(1);
        expect(wrapper.find('MenuLinkItem').length).toBe(1);
        expect(wrapper.find('Crumb').length).toBe(5);
    });
});
