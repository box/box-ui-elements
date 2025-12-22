import * as React from 'react';
import { tabbable } from 'tabbable';

import FocusTrap from '../FocusTrap';

jest.mock('tabbable', () => ({ tabbable: jest.fn() }));

jest.useFakeTimers();

describe('components/focus-trap/FocusTrap', () => {
    const getWrapper = (props = {}) =>
        shallow(
            <FocusTrap {...props}>
                <div className="trap-children" />
            </FocusTrap>,
            { disableLifecycleMethods: true },
        );

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks();
    });

    describe('componentDidMount()', () => {
        test('should call focusFirstElement when defaultFocus is true', () => {
            const instance = getWrapper({
                shouldDefaultFocus: true,
            }).instance();

            instance.focusFirstElement = jest.fn();
            instance.componentDidMount();

            jest.runAllTimers();

            expect(instance.focusFirstElement).toHaveBeenCalled();
        });

        test('should not call focusFirstElement when defaultFocus is false', () => {
            const instance = getWrapper({
                shouldDefaultFocus: false,
            }).instance();

            instance.focusFirstElement = jest.fn();
            instance.el = { focus: jest.fn() };
            instance.componentDidMount();

            jest.runAllTimers();

            expect(instance.focusFirstElement).not.toHaveBeenCalled();
        });
    });

    describe('componentWillUnmount()', () => {
        test('should focus on previousFocusEl', () => {
            const instance = getWrapper().instance();

            instance.previousFocusEl = { focus: jest.fn() };
            instance.componentWillUnmount();

            jest.runAllTimers();

            expect(instance.previousFocusEl.focus).toHaveBeenCalled();
        });
    });

    describe('focusFirstElement()', () => {
        test('should focus on the first tabbable non-trap element when it exists', () => {
            const shouldNotCallStub = jest.fn();
            const shouldCallStub = jest.fn();

            tabbable.mockReturnValueOnce([
                { focus: shouldNotCallStub }, // trap el
                { focus: shouldCallStub }, // first real el
                { focus: shouldNotCallStub }, // real el
                { focus: shouldNotCallStub }, // real el
                { focus: shouldNotCallStub }, // trap el
                { focus: shouldNotCallStub }, // trap el
            ]);

            const instance = getWrapper().instance();
            instance.el = {};
            instance.focusFirstElement();

            expect(shouldNotCallStub).not.toHaveBeenCalled();
            expect(shouldCallStub).toHaveBeenCalled();
        });

        test('should focus on the trap element when no focusable children exist', () => {
            const shouldNotCallStub = jest.fn();

            tabbable.mockReturnValueOnce([
                { focus: shouldNotCallStub }, // trap el
                { focus: shouldNotCallStub }, // trap el
                { focus: shouldNotCallStub }, // trap el
            ]);

            const instance = getWrapper().instance();
            instance.el = {};
            instance.trapEl = { focus: jest.fn() };
            instance.focusFirstElement();

            expect(shouldNotCallStub).not.toHaveBeenCalled();
            expect(instance.trapEl.focus).toHaveBeenCalled();
        });
    });

    describe('focusLastElement()', () => {
        test('should focus on the last tabbable non-trap element when it exists', () => {
            const shouldNotCallStub = jest.fn();
            const shouldCallStub = jest.fn();

            tabbable.mockReturnValueOnce([
                { focus: shouldNotCallStub }, // trap el
                { focus: shouldNotCallStub }, // real el
                { focus: shouldNotCallStub }, // real el
                { focus: shouldCallStub }, // last real el
                { focus: shouldNotCallStub }, // trap el
                { focus: shouldNotCallStub }, // trap el
            ]);

            const instance = getWrapper().instance();
            instance.el = {};
            instance.focusLastElement();

            expect(shouldNotCallStub).not.toHaveBeenCalled();
            expect(shouldCallStub).toHaveBeenCalled();
        });

        test('should focus on the trap element when no focusable children exist', () => {
            const shouldNotCallStub = jest.fn();

            tabbable.mockReturnValueOnce([
                { focus: shouldNotCallStub }, // trap el
                { focus: shouldNotCallStub }, // trap el
                { focus: shouldNotCallStub }, // trap el
            ]);

            const instance = getWrapper().instance();
            instance.el = {};
            instance.trapEl = { focus: jest.fn() };
            instance.focusLastElement();

            expect(shouldNotCallStub).not.toHaveBeenCalled();
            expect(instance.trapEl.focus).toHaveBeenCalled();
        });
    });

    describe('handleTrapElKeyDown()', () => {
        test('should return without doing anything when key is not Tab', () => {
            const instance = getWrapper().instance();

            const event = {
                key: 'Enter',
                stopPropagation: jest.fn(),
                preventDefault: jest.fn(),
            };
            instance.handleTrapElKeyDown(event);

            expect(event.stopPropagation).not.toHaveBeenCalled();
            expect(event.preventDefault).not.toHaveBeenCalled();
        });

        test('should stop event propagatioan and prevent default when key is Tab', () => {
            const instance = getWrapper().instance();

            const event = {
                key: 'Tab',
                stopPropagation: jest.fn(),
                preventDefault: jest.fn(),
            };
            instance.handleTrapElKeyDown(event);

            expect(event.stopPropagation).toHaveBeenCalled();
            expect(event.preventDefault).toHaveBeenCalled();
        });
    });

    describe('render()', () => {
        test('should render a div, the three trap els, and children', () => {
            const wrapper = getWrapper({
                className: 'focus-trap',
                'data-resin-thing': 'test',
            });

            expect(wrapper).toMatchSnapshot();
        });
    });
});
