import React from 'react';
import { shallow } from 'enzyme';

import SubmenuItem from '../SubmenuItem';

jest.mock('lodash/debounce', () =>
    jest.fn(fn => {
        fn.cancel = jest.fn();
        return fn;
    }),
);

describe('components/menu/SubmenuItem', () => {
    const getWrapper = (props = {}) => {
        return shallow<SubmenuItem>(
            <SubmenuItem {...props}>
                <div />
                <div />
            </SubmenuItem>,
        );
    };

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
            instance.submenuTriggerEl = document.createElement('input');
            instance.submenuTriggerEl.focus = focusSpy;

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
            instance.submenuTriggerEl = document.createElement('input');
            instance.submenuTriggerEl.focus = focusSpy;

            instance.closeSubmenuAndFocusTrigger(true);

            expect(wrapper.state('isSubmenuOpen')).toBe(false);
            expect(focusSpy).toHaveBeenCalled();
        });
    });

    describe('handleKeyDown()', () => {
        test.each([' ', 'Enter', 'ArrowRight'])('should call openSubmenu() when the %s key is pressed', key => {
            const wrapper = getWrapper();
            const instance = wrapper.instance();
            const openSubmenuSpy = jest.fn();
            const stopPropagationSpy = jest.fn();
            const preventDefaultSpy = jest.fn();
            instance.openSubmenuAndFocus = openSubmenuSpy;
            wrapper.find('li').simulate('keydown', {
                key,
                stopPropagation: stopPropagationSpy,
                preventDefault: preventDefaultSpy,
            });
            expect(openSubmenuSpy).toHaveBeenCalled();
            expect(stopPropagationSpy).toHaveBeenCalled();
            expect(preventDefaultSpy).toHaveBeenCalled();
        });
    });

    describe('handleMenuItemClick()', () => {
        test('should call onClick() when isDisable is false', () => {
            const onClickSpy = jest.fn();
            const wrapper = getWrapper({
                isDisabled: false,
                onClick: onClickSpy,
            });
            wrapper.find('li').simulate('click', {});
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
            wrapper.find('li').simulate('click', {
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

        test.each`
            alignment   | specifiedElement           | submenuElRect      | submenuTriggerElRect                     | expectedClass
            ${'left'}   | ${'rightBoundaryElement'}  | ${{ width: 600 }}  | ${{ right: 100, bottom: 200 }}           | ${SUBMENU_LEFT_ALIGNED_CLASS}
            ${'bottom'} | ${'bottomBoundaryElement'} | ${{ height: 600 }} | ${{ right: 100, bottom: 200, top: 100 }} | ${SUBMENU_BOTTOM_ALIGNED_CLASS}
        `(
            'should set $expectedClass to true when submenu should be $alignment aligned and $specifiedElement is specified',
            ({ specifiedElement, submenuElRect, submenuTriggerElRect, expectedClass }) => {
                const wrapper = getWrapper({
                    [specifiedElement]: {
                        getBoundingClientRect: jest.fn(() => ({
                            right: 500,
                            bottom: 500,
                        })),
                    },
                });
                const instance = wrapper.instance();
                instance.submenuEl = document.createElement('li');
                instance.submenuEl.getBoundingClientRect = jest.fn(() => submenuElRect as DOMRect);
                instance.submenuTriggerEl = document.createElement('li');
                instance.submenuTriggerEl.getBoundingClientRect = jest.fn(() => submenuTriggerElRect as DOMRect);
                const classes = instance.getMenuAlignmentClasses();
                expect(classes[expectedClass]).toBe(true);
            },
        );

        test.each`
            alignment   | unspecifiedElement         | submenuElRect      | submenuTriggerElRect                     | expectedClass
            ${'left'}   | ${'rightBoundaryElement'}  | ${{ width: 600 }}  | ${{ right: 100, bottom: 200 }}           | ${SUBMENU_LEFT_ALIGNED_CLASS}
            ${'bottom'} | ${'bottomBoundaryElement'} | ${{ height: 600 }} | ${{ right: 100, bottom: 200, top: 100 }} | ${SUBMENU_BOTTOM_ALIGNED_CLASS}
        `(
            'should set SUBMENU_LEFT_ALIGNED_CLASS to true when submenu should be $alignment aligned and $unspecifiedElement is not specified',
            ({ submenuElRect, submenuTriggerElRect, expectedClass }) => {
                const wrapper = getWrapper();
                Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
                Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 500 });
                const instance = wrapper.instance();
                instance.submenuEl = document.createElement('li');
                instance.submenuEl.getBoundingClientRect = jest.fn(() => submenuElRect as DOMRect);
                instance.submenuTriggerEl = document.createElement('li');
                instance.submenuTriggerEl.getBoundingClientRect = jest.fn(() => submenuTriggerElRect as DOMRect);
                const classes = instance.getMenuAlignmentClasses();
                expect(classes[expectedClass]).toBe(true);
            },
        );
    });
});
