// @flow
import * as React from 'react';
import noop from 'lodash/noop';

import LeftSidebar from '../LeftSidebar';

describe('feature/left-sidebar/LeftSidebar', () => {
    test('should render with default properties intact', () => {
        const wrapper = shallow(<LeftSidebar />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render one menu item with appropriate properties passed', () => {
        const oneMenuItem = [
            {
                id: 'all-files',
                message: 'All Files',
                htmlAttributes: {
                    href: '/folder/0',
                },
                routerLink: undefined,
                routerProps: undefined,
                showTooltip: true,
            },
        ];
        const wrapper = shallow(<LeftSidebar menuItems={oneMenuItem} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should not render nested menu items with missing properties passed', () => {
        const nestedMenuItems = [
            {
                id: 'all-files',
                message: 'All Files',
                htmlAttributes: {
                    href: '/folder/0',
                },
                routerLink: undefined,
                routerProps: undefined,
                showTooltip: true,
                menuItems: [
                    {
                        id: 'recents',
                        message: 'Recents',
                        htmlAttributes: {
                            href: '/recents',
                        },
                        showTooltip: true,
                    },
                ],
            },
        ];

        const wrapper = shallow(<LeftSidebar menuItems={nestedMenuItems} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render collapsible nested menu items with appropriate properties passed', () => {
        const nestedMenuItems = [
            {
                id: 'all-files',
                message: 'All Files',
                htmlAttributes: {
                    href: '/folder/0',
                },
                routerLink: undefined,
                routerProps: undefined,
                showTooltip: true,
                onToggleCollapse: noop,
                menuItems: [
                    {
                        id: 'recents',
                        message: 'Recents',
                        htmlAttributes: {
                            href: '/recents',
                        },
                        showTooltip: true,
                    },
                ],
            },
        ];

        const wrapper = shallow(<LeftSidebar menuItems={nestedMenuItems} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render placeholder inside nested menu items with appropriate properties passed', () => {
        const nestedMenuItems = [
            {
                id: 'all-files',
                message: 'All Files',
                htmlAttributes: {
                    href: '/folder/0',
                },
                routerLink: undefined,
                routerProps: undefined,
                showTooltip: true,
                onToggleCollapse: noop,
                placeholder: 'This is a simple placeholder text',
                menuItems: [],
            },
        ];

        const wrapper = shallow(<LeftSidebar menuItems={nestedMenuItems} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render non-collapsible nested menu items with appropriate properties passed', () => {
        const nestedMenuItems = [
            {
                id: 'all-files',
                message: 'All Files',
                htmlAttributes: {
                    href: '/folder/0',
                },
                routerLink: undefined,
                routerProps: undefined,
                showTooltip: true,
                menuItems: [
                    {
                        id: 'recents',
                        message: 'Recents',
                        htmlAttributes: {
                            href: '/recents',
                        },
                        showTooltip: true,
                    },
                ],
            },
        ];

        const wrapper = shallow(<LeftSidebar menuItems={nestedMenuItems} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should pass in custom sidebar properties as needed', () => {
        const oneMenuItem = [
            {
                id: 'all-files',
                message: 'All Files',
                htmlAttributes: {
                    href: '/folder/0',
                },
                routerLink: undefined,
                routerProps: undefined,
                selected: true,
                showTooltip: true,
            },
        ];

        const leftSidebarProps = {
            customTheme: {
                isLight: 'yes',
                primaryColorLight: '#f0f0f0', // selected menu item background color
                primaryColorLighter: '#123',
                primaryColorDark: '#123',
                primaryColorDarker: '#123',
                contrastColor: '#123',
                secondaryColor: '#123', // icons, selected menu item border, selected menu item icon
            },
            htmlAttributes: {
                'data-resin-component': 'leftnav',
            },
            copyrightFooterProps: {
                htmlAttributes: {
                    href: '/test-url',
                },
            },
        };

        const wrapper = shallow(<LeftSidebar leftSidebarProps={leftSidebarProps} menuItems={oneMenuItem} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should pass icon components appropriately based on properties', () => {
        const iconExampleComponent = () => <div id="this-is-icon" />;
        const oneMenuItem = [
            {
                iconComponent: iconExampleComponent,
                id: 'all-files',
                message: 'All Files',
                htmlAttributes: {
                    href: '/folder/0',
                },
                routerLink: undefined,
                routerProps: undefined,
                showTooltip: true,
                newItemBadge: true,
                newItemCountBadge: 3,
            },
        ];

        const wrapper = shallow(<LeftSidebar menuItems={oneMenuItem} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should pass icon elements appropriately based on properties', () => {
        const iconElement = <div id="this-is-icon" />;
        const oneMenuItem = [
            {
                iconElement,
                id: 'all-files',
                message: 'All Files',
                htmlAttributes: {
                    href: '/folder/0',
                },
                routerLink: undefined,
                routerProps: undefined,
                showTooltip: true,
                newItemBadge: true,
                newItemCountBadge: 3,
            },
        ];

        const wrapper = shallow(<LeftSidebar menuItems={oneMenuItem} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should pass badge elements appropriately based on properties', () => {
        const oneMenuItem = [
            {
                id: 'all-files',
                message: 'All Files',
                htmlAttributes: {
                    href: '/folder/0',
                },
                routerLink: undefined,
                routerProps: undefined,
                showTooltip: true,
                newItemBadge: true,
            },
        ];

        const wrapper = shallow(<LeftSidebar menuItems={oneMenuItem} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render instant login component', () => {
        const leftSidebarProps = {
            instantLoginProps: {
                hrefAttributes: {
                    href: '/master',
                },
                message: 'message',
                showTooltip: false,
            },
            isInstantLoggedIn: true,
        };

        const oneMenuItem = [
            {
                id: 'all-files',
                message: 'All Files',
                htmlAttributes: {
                    href: '/folder/0',
                },
                routerLink: undefined,
                routerProps: undefined,
                showChildIcons: false,
                showTooltip: true,
            },
        ];
        const wrapper = shallow(<LeftSidebar leftSidebarProps={leftSidebarProps} menuItems={oneMenuItem} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should render FooterIndicator if indicatorText is set', () => {
        const leftSidebarProps = {
            indicatorText: 'abcde',
        };

        const wrapper = shallow(<LeftSidebar leftSidebarProps={leftSidebarProps} />);

        expect(wrapper).toMatchSnapshot();
    });

    test('should use custom render for menu item if provided', () => {
        const oneMenuItem = [
            {
                navLinkRenderer: () => <h1>Custom Link</h1>,
                id: 'all-files',
                message: 'All Files',
                htmlAttributes: {
                    href: '/folder/0',
                },
                routerLink: undefined,
                routerProps: undefined,
                showTooltip: true,
            },
        ];

        const wrapper = shallow(<LeftSidebar menuItems={oneMenuItem} />);

        expect(wrapper.exists('h1')).toBeTruthy();
    });

    describe('checkAndChangeScrollShadows()', () => {
        [
            // isn't scrollable
            {
                isScrollableAbove: false,
                isScrollableBelow: false,
            },
            // only scrollable above
            {
                isScrollableAbove: true,
                isScrollableBelow: false,
            },
            // only scrollable below
            {
                isScrollableAbove: false,
                isScrollableBelow: true,
            },
            // scrollable above and below
            {
                isScrollableAbove: true,
                isScrollableBelow: true,
            },
        ].forEach(({ isScrollableAbove, isScrollableBelow }) => {
            test('should calculate and set overflow state', () => {
                const leftSidebarProps = {
                    instantLoginProps: {
                        hrefAttributes: {
                            href: '/master',
                        },
                        message: 'message',
                        showTooltip: false,
                    },
                    isInstantLoggedIn: true,
                };

                const oneMenuItem = [
                    {
                        id: 'all-files',
                        message: 'All Files',
                        htmlAttributes: {
                            href: '/folder/0',
                        },
                        routerLink: undefined,
                        routerProps: undefined,
                        showChildIcons: false,
                        showTooltip: true,
                    },
                ];

                const wrapper = shallow(<LeftSidebar leftSidebarProps={leftSidebarProps} menuItems={oneMenuItem} />, {
                    disableLifecycleMethods: true,
                });
                const instance = wrapper.instance();
                const calculateOverflowSpy = jest.fn().mockReturnValue({
                    isScrollableBelow,
                    isScrollableAbove,
                });
                instance.calculateOverflow = calculateOverflowSpy;
                instance.elScrollableList = true;
                instance.checkAndChangeScrollShadows();
                expect(wrapper.state().isScrollableAbove).toBe(isScrollableAbove);
                expect(wrapper.state().isScrollableBelow).toBe(isScrollableBelow);
            });
        });
    });

    describe('turnOffScrollingState()', () => {
        test('should calculate and set overflow state', () => {
            const leftSidebarProps = {
                instantLoginProps: {
                    hrefAttributes: {
                        href: '/master',
                    },
                    message: 'message',
                    showTooltip: false,
                },
                isInstantLoggedIn: true,
            };

            const oneMenuItem = [
                {
                    id: 'all-files',
                    message: 'All Files',
                    htmlAttributes: {
                        href: '/folder/0',
                    },
                    routerLink: undefined,
                    routerProps: undefined,
                    showChildIcons: false,
                    showTooltip: true,
                },
            ];

            const wrapper = shallow(<LeftSidebar leftSidebarProps={leftSidebarProps} menuItems={oneMenuItem} />, {
                disableLifecycleMethods: true,
            });
            wrapper.setState({
                isScrolling: true,
            });
            const instance = wrapper.instance();
            instance.turnOffScrollingState();

            expect(wrapper.state('isScrolling')).toEqual(false);
        });
    });
});
