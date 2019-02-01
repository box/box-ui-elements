/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';

import { NavList } from '..';
import { Link } from '../../link';

describe('components/nav-sidebar/NavList', () => {
    test('should render nav list and nest children', () => {
        const children = <Link>Test</Link>;
        const nav = shallow(<NavList>{children}</NavList>);

        expect(nav.type()).toEqual('nav');
        expect(nav.hasClass('nav-list')).toBe(true);
        expect(nav.childAt(0).type()).toEqual('ul');
        expect(
            nav
                .childAt(0)
                .childAt(0)
                .type(),
        ).toEqual('li');
        expect(
            nav
                .childAt(0)
                .childAt(0)
                .contains(children),
        ).toBe(true);
    });

    test('should render heading when specified', () => {
        const heading = 'Title';
        const nav = shallow(
            <NavList heading={heading}>
                <Link>Test</Link>
            </NavList>,
        );

        expect(nav.childAt(0).type()).toEqual('h2');
        expect(
            nav
                .childAt(0)
                .children()
                .text(),
        ).toEqual(heading);
    });

    test('should render nav list when one child is null', () => {
        const nav = shallow(
            <NavList>
                <Link>Test</Link>
                {null}
            </NavList>,
        );

        expect(nav.find('li').length).toEqual(1);
    });

    test('should pass down optional ul props', () => {
        const ulProps = {
            hello: 'world',
        };
        const nav = shallow(
            <NavList ulProps={ulProps}>
                <Link>Test</Link>
                {null}
            </NavList>,
        );

        expect(nav.find('ul').props().hello).toEqual('world');
    });
});
