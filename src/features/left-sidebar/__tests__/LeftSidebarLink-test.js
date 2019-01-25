// @flow
import React from 'react';

import LeftSidebarLink from '../LeftSidebarLink';

describe('feature/left-sidebar/LeftSidebarLink', () => {
    const getWrapper = (props = {}) => shallow(<LeftSidebarLink message="Feed" {...props} />);

    test('should render a LinkComponent component', () => {
        const wrapper = getWrapper();

        expect(wrapper).toMatchSnapshot();
    });

    test('should render without a tooltip wrapper', () => {
        const showTooltip = false;
        const wrapper = getWrapper({ showTooltip });

        expect(wrapper).toMatchSnapshot();
    });

    test('should use a custom className', () => {
        const className = 'custom-className';
        const wrapper = getWrapper({ className });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render the IconComponent', () => {
        const icon = <div id="its-an-icon" />;
        const wrapper = getWrapper({ icon });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render BadgeElement', () => {
        const newItemBadge = <div id="newItemBadge" />;
        const wrapper = getWrapper({ newItemBadge });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render BadgeCountElement', () => {
        const newItemCountBadge = <div id="newItemCountBadge" />;
        const wrapper = getWrapper({ newItemCountBadge });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render the router link', () => {
        const routerLink = () => <div id="router-link-mock" />;
        const routerProps = { isNavLink: true };

        const wrapper = getWrapper({
            routerLink,
            routerProps,
        });

        expect(wrapper).toMatchSnapshot();
    });

    test('should render RemoveButton', () => {
        const onClickRemove = () => {};
        const wrapper = getWrapper({ onClickRemove });

        expect(wrapper).toMatchSnapshot();
    });

    test('tooltip should take class from state', () => {
        const isTextOverflowed = true;
        const isScrolling = false;
        const wrapper = getWrapper({ isScrolling });
        wrapper.setState({ isTextOverflowed });

        expect(wrapper).toMatchSnapshot();
    });
    [
        // selected and theme
        {
            selected: true,
            customTheme: {
                primaryColorLight: '#987654',
                secondaryColor: '#345678',
            },
        },
        // not selected and theme
        {
            selected: false,
            customTheme: {
                primaryColorLight: '#987654',
                secondaryColor: '#345678',
            },
        },
        // selected and no theme
        {
            selected: true,
            customTheme: {},
        },
        // not selected and no theme
        {
            selected: false,
            customTheme: {},
        },
    ].forEach(({ selected, customTheme }) => {
        test('should use custom theme based on selected link and theme', () => {
            const wrapper = getWrapper({
                selected,
                customTheme,
            });

            expect(wrapper).toMatchSnapshot();
        });
    });
});
