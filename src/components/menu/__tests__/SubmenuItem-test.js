import React from 'react';

import SubmenuItem from '../SubmenuItem';

describe('components/menu/SubmenuItem', () => {
    const getWrapper = (props = {}) =>
        shallow(
            <SubmenuItem {...props}>
                <div />
                <div />
            </SubmenuItem>,
        );

    describe('render()', () => {
        test('should correctly render default component', () => {
            const wrapper = getWrapper();

            expect(wrapper).toMatchSnapshot();
        });

        test('should correctly render correctly when isDisabled is true', () => {
            const wrapper = getWrapper({
                isDisabled: true,
            });

            expect(wrapper).toMatchSnapshot();
        });

        test('should correctly render correctly when isSubmenuOpen is true', () => {
            const wrapper = getWrapper({});
            wrapper.setState({
                isSubmenuOpen: true,
            });

            expect(wrapper).toMatchSnapshot();
        });
    });

    describe('openSubmenu()', () => {
        test('should set isSubmenuOpen state to true', () => {
            const wrapper = getWrapper();
            wrapper.instance().openSubmenu();

            expect(wrapper.state('isSubmenuOpen')).toBe(true);
        });
    });

    describe('closeSubmenuAndFocusTrigger()', () => {
        test('should set isSubmenuOpen state to false and not focus trigger element if not keyboard event', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const focusSpy = jest.fn();
            wrapper.setState({
                isSubmenuOpen: true,
            });
            instance.submenuTriggerEl = {
                focus: focusSpy,
            };

            instance.closeSubmenuAndFocusTrigger(false);

            expect(wrapper.state('isSubmenuOpen')).toBe(false);
            expect(focusSpy).not.toHaveBeenCalled();
        });

        test('should set isSubmenuOpen state to false and focus trigger element if keyboard event', () => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const focusSpy = jest.fn();
            wrapper.setState({
                isSubmenuOpen: true,
            });
            instance.submenuTriggerEl = {
                focus: focusSpy,
            };

            instance.closeSubmenuAndFocusTrigger(true);

            expect(wrapper.state('isSubmenuOpen')).toBe(false);
            expect(focusSpy).toHaveBeenCalled();
        });
    });

    describe('handleKeyDown()', () => {
        [
            {
                key: ' ',
            },
            {
                key: 'Enter',
            },
            {
                key: 'ArrowRight',
            },
        ].forEach(({ key }) => {
            test('should call openSubmenu() when certain keys pressed', () => {
                const wrapper = getWrapper();
                const instance = wrapper.instance();
                const openSubmenuSpy = jest.fn();
                const stopPropagationSpy = jest.fn();
                const preventDefaultSpy = jest.fn();

                instance.openSubmenuAndFocus = openSubmenuSpy;

                instance.handleKeyDown({
                    key,
                    stopPropagation: stopPropagationSpy,
                    preventDefault: preventDefaultSpy,
                });
                expect(openSubmenuSpy).toHaveBeenCalled();
                expect(stopPropagationSpy).toHaveBeenCalled();
                expect(preventDefaultSpy).toHaveBeenCalled();
            });
        });
    });

    describe('handleMenuItemClick()', () => {
        test('should call onClick() when isDisable is false', () => {
            const onClickSpy = jest.fn();
            const wrapper = getWrapper({
                isDisabled: false,
                onClick: onClickSpy,
            });
            const instance = wrapper.instance();

            instance.handleMenuItemClick({});

            expect(onClickSpy).toHaveBeenCalled();
        });

        test('should not call onClick() and stop propagation and prevent default when isDisable is true', () => {
            const onClickSpy = jest.fn();
            const stopPropagationSpy = jest.fn();
            const preventDefaultSpy = jest.fn();

            const wrapper = getWrapper({
                isDisabled: true,
                onClick: onClickSpy,
            });
            const instance = wrapper.instance();

            instance.handleMenuItemClick({
                stopPropagation: stopPropagationSpy,
                preventDefault: preventDefaultSpy,
            });

            expect(onClickSpy).not.toHaveBeenCalled();
            expect(stopPropagationSpy).toHaveBeenCalled();
            expect(preventDefaultSpy).toHaveBeenCalled();
        });
    });

    describe('getMenuAlignmentClasses()', () => {
        const SUBMENU_LEFT_ALIGNED_CLASS = 'is-left-aligned';
        const SUBMENU_BOTTOM_ALIGNED_CLASS = 'is-bottom-aligned';
        test('should set SUBMENU_LEFT_ALIGNED_CLASS to true when submenu should be left aligned and rightBoundaryElement specified', () => {
            const wrapper = getWrapper({
                rightBoundaryElement: {
                    getBoundingClientRect: jest.fn(() => ({
                        right: 500,
                        bottom: 500,
                    })),
                },
            });
            const instance = wrapper.instance();
            instance.submenuEl = {
                getBoundingClientRect: jest.fn(() => ({
                    width: 600,
                })),
            };
            instance.submenuTriggerEl = {
                getBoundingClientRect: jest.fn(() => ({
                    right: 100,
                    bottom: 200,
                })),
            };

            const classes = instance.getMenuAlignmentClasses();

            expect(classes[SUBMENU_LEFT_ALIGNED_CLASS]).toBe(true);
        });

        test('should set SUBMENU_BOTTOM_ALIGNED_CLASS to true when submenu should be bottom aligned and bottomBoundaryElement specified', () => {
            const wrapper = getWrapper({
                bottomBoundaryElement: {
                    getBoundingClientRect: jest.fn(() => ({
                        right: 500,
                        bottom: 500,
                    })),
                },
            });
            const instance = wrapper.instance();
            instance.submenuEl = {
                getBoundingClientRect: jest.fn(() => ({
                    height: 600,
                })),
            };
            instance.submenuTriggerEl = {
                getBoundingClientRect: jest.fn(() => ({
                    right: 100,
                    bottom: 200,
                    top: 100,
                })),
            };

            const classes = instance.getMenuAlignmentClasses();

            expect(classes[SUBMENU_BOTTOM_ALIGNED_CLASS]).toBe(true);
        });

        test('should set SUBMENU_LEFT_ALIGNED_CLASS to true when submenu should be left aligned and rightBoundaryElement not specified', () => {
            const wrapper = getWrapper();
            window.innerWidth = 500;
            window.innerHeight = 500;
            const instance = wrapper.instance();
            instance.submenuEl = {
                getBoundingClientRect: jest.fn(() => ({
                    width: 600,
                })),
            };
            instance.submenuTriggerEl = {
                getBoundingClientRect: jest.fn(() => ({
                    right: 100,
                    bottom: 200,
                })),
            };

            const classes = instance.getMenuAlignmentClasses();

            expect(classes[SUBMENU_LEFT_ALIGNED_CLASS]).toBe(true);
        });

        test('should set SUBMENU_BOTTOM_ALIGNED_CLASS to true when submenu should be bottom aligned and bottomBoundaryElement not specified', () => {
            const wrapper = getWrapper();
            window.innerWidth = 500;
            window.innerHeight = 500;
            const instance = wrapper.instance();
            instance.submenuEl = {
                getBoundingClientRect: jest.fn(() => ({
                    height: 600,
                })),
            };
            instance.submenuTriggerEl = {
                getBoundingClientRect: jest.fn(() => ({
                    right: 100,
                    bottom: 200,
                    top: 100,
                })),
            };

            const classes = instance.getMenuAlignmentClasses();

            expect(classes[SUBMENU_BOTTOM_ALIGNED_CLASS]).toBe(true);
        });
    });
});
