/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import Menu from '../Menu';

const sandbox = sinon.sandbox.create();

describe('components/menu/Menu', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should render a unordered list with correct props when called', () => {
            const wrapper = mount<Menu>(
                <Menu className="awesome-menu">
                    <li />
                    <li />
                </Menu>,
            );

            expect(wrapper.find('ul').length).toBe(1);
            expect(wrapper.find('ul').prop('role')).toEqual('menu');
            expect(wrapper.find('ul').prop('className')).toEqual('aria-menu awesome-menu');
            expect(wrapper.find('ul').prop('tabIndex')).toEqual(-1);
        });
    });

    describe('setInitialFocusIndex()', () => {
        test('should set internal menuItemEls to valid items after mount', () => {
            const wrapper = mount<Menu>(
                <Menu>
                    <li className="menu-item" role="menuitem" />
                    <li role="separator" />
                    <li className="menu-item" role="menuitem" />
                    <li aria-disabled="true" className="menu-item" role="menuitem" />
                    <li>
                        <a className="menu-item" role="menuitem">
                            Link
                        </a>
                    </li>
                </Menu>,
            );

            const instance = wrapper.instance();
            // Should have 3 items (li, li, a)
            expect(instance.menuItemEls.length).toBe(3);
        });

        test('should set internal menuItemEls with specified menu item selector after mount', () => {
            const selector = 'div .customized-menu-item:not([aria-disabled])';
            const wrapper = mount<Menu>(
                <Menu menuItemSelector={selector}>
                    <div className="wrapper">
                        <div className="customized-menu-item" role="menuitem" />
                        <div role="separator" />
                        <div className="customized-menu-item" role="menuitem" />
                        <div aria-disabled="true" className="customized-menu-item" role="menuitem" />
                        <div>
                            <a className="customized-menu-item" role="menuitem">
                                Link
                            </a>
                        </div>
                        <div className="menu-item" role="menuitem" />
                    </div>
                </Menu>,
            );

            const instance = wrapper.instance();
            // Should have 3 items (div, div, a)
            expect(instance.menuItemEls.length).toBe(3);
        });

        test('should call setFocus() asynchronously when initialFocusIndex is set to 0', () => {
            const clock = sandbox.useFakeTimers();
            const wrapper = shallow<Menu>(
                <Menu initialFocusIndex={0}>
                    <li role="menuitem" />
                </Menu>,
                { disableLifecycleMethods: true },
            );

            const instance = wrapper.instance();
            instance.setInitialFocusIndex();
            sandbox
                .mock(instance)
                .expects('setFocus')
                .withArgs(0);

            clock.tick(100);
        });

        test('should call setFocus() asynchronously when initialFocusIndex is set to -1', () => {
            const clock = sandbox.useFakeTimers();
            const wrapper = shallow<Menu>(
                <Menu initialFocusIndex={-1}>
                    <li role="menuitem" />
                </Menu>,
                { disableLifecycleMethods: true },
            );

            const instance = wrapper.instance();
            instance.setInitialFocusIndex();
            sandbox
                .mock(instance)
                .expects('setFocus')
                .withArgs(-1);

            clock.tick(100);
        });

        test('should not call setFocus() when no initialFocusIndex prop is passed', () => {
            const clock = sandbox.useFakeTimers();
            const wrapper = shallow<Menu>(
                <Menu>
                    <li role="menuitem" />
                </Menu>,
                { disableLifecycleMethods: true },
            );

            const instance = wrapper.instance();
            instance.setInitialFocusIndex();
            sandbox
                .mock(instance)
                .expects('setFocus')
                .never();

            clock.tick(100);
        });
    });

    describe('componentDidMount()', () => {
        test('should call setInitialFocusIndex()', () => {
            const wrapper = shallow<Menu>(
                <Menu className="awesome-menu">
                    <li />
                </Menu>,
            );

            const instance = wrapper.instance();
            instance.setInitialFocusIndex = sandbox.mock();

            instance.componentDidMount();
        });
    });

    describe('componentDidUpdate()', () => {
        test('should call setMenuItemEls() and setFocus() when the number of children changes', () => {
            const clock = sandbox.useFakeTimers();
            const wrapper = mount(
                <Menu initialFocusIndex={1}>
                    <li key="1" className="menu-item" role="menuitem" />
                    <li key="2" role="separator" />
                    {false}
                </Menu>,
            );
            clock.tick(0);

            const instance = wrapper.instance();
            const instanceMock = sandbox.mock(instance);
            instanceMock.expects('setMenuItemEls');
            instanceMock.expects('getMenuItemElFromEventTarget').returns({ menuIndex: 2 });
            instanceMock.expects('setFocus').withExactArgs(2);

            wrapper.setProps({
                children: [
                    <li key="1" className="menu-item" role="menuitem" />,
                    <li key="2" role="separator" />,
                    <li key="3" className="menu-item" role="menuitem" />,
                ],
            });
        });

        test('should not call setMenuItemEls() when the number of children stays the same', () => {
            const wrapper = mount(
                <Menu>
                    <li role="menuitem" />
                </Menu>,
            );

            const instance = wrapper.instance();
            sandbox
                .mock(instance)
                .expects('setMenuItemEls')
                .never();

            wrapper.setProps({ className: 'test' });
        });

        test('should call setInitialFocusIndex() when isSubmenu is true and isHidden changes from false to true', () => {
            const wrapper = shallow(
                <Menu className="awesome-menu" isHidden>
                    <li />
                </Menu>,
            );

            const instance = wrapper.instance();
            sandbox.mock(instance).expects('setInitialFocusIndex');

            wrapper.setProps({
                isHidden: false,
                isSubmenu: true,
            });
        });
    });

    describe('handleClick()', () => {
        test('should not call fireOnCloseHandler() when click did not occur on a valid menu item', () => {
            const wrapper = mount(
                <Menu>
                    <li role="menuitem" />
                    <li role="separator" />
                </Menu>,
            );

            const listItems = wrapper.find('li');
            const separatorEl = listItems.at(1).getDOMNode();

            const instance = wrapper.instance();
            sandbox
                .mock(instance)
                .expects('getMenuItemElFromEventTarget')
                .withArgs(separatorEl)
                .returns({ menuItemEl: null, menuIndex: -1 });
            sandbox
                .mock(instance)
                .expects('fireOnCloseHandler')
                .never();

            wrapper.simulate('click', {
                target: separatorEl,
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });

        test('should call fireOnCloseHandler() when click occurred on a valid menu item', () => {
            const wrapper = mount(
                <Menu>
                    <li role="menuitem" />
                    <li role="separator" />
                </Menu>,
            );

            const listItems = wrapper.find('li');
            const menuItemEl = listItems.at(0).getDOMNode();

            const instance = wrapper.instance();
            sandbox
                .mock(instance)
                .expects('getMenuItemElFromEventTarget')
                .withArgs(menuItemEl)
                .returns({ menuItemEl });
            sandbox.mock(instance).expects('fireOnCloseHandler');

            wrapper.simulate('click', {
                target: menuItemEl,
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });
    });

    describe('handleKeyDown()', () => {
        test('should focusNextItem() when "down" key is pressed', () => {
            const wrapper = mount(
                <Menu>
                    <li role="menuitem" />
                </Menu>,
            );
            const instance = wrapper.instance();
            sandbox.mock(instance).expects('focusNextItem');
            wrapper.simulate('keydown', {
                key: 'ArrowDown',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
        });

        test('should focusPreviousItem() when "up" key is pressed', () => {
            const wrapper = mount(
                <Menu>
                    <li role="menuitem" />
                </Menu>,
            );
            const instance = wrapper.instance();
            sandbox.mock(instance).expects('focusPreviousItem');
            wrapper.simulate('keydown', {
                key: 'ArrowUp',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
        });

        test('should call fireOnCloseHandler() when "ArrowLeft" key is pressed and isSubmenu prop is true', () => {
            const wrapper = mount(
                <Menu isSubmenu>
                    <li role="menuitem" />
                </Menu>,
            );

            const instance = wrapper.instance();

            sandbox.mock(instance).expects('fireOnCloseHandler');

            wrapper.simulate('keydown', {
                key: 'ArrowLeft',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
        });

        test('should not call fireOnCloseHandler() when "ArrowLeft" key is pressed and isSubmenu prop is false', () => {
            const wrapper = mount(
                <Menu>
                    <li role="menuitem" />
                </Menu>,
            );

            const instance = wrapper.instance();

            sandbox
                .mock(instance)
                .expects('fireOnCloseHandler')
                .never();

            wrapper.simulate('keydown', {
                key: 'ArrowLeft',
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });

        [
            {
                key: 'Home',
            },
            {
                key: 'PageUp',
            },
        ].forEach(({ key }) => {
            test('should focusFirstItem() when "home" or "pageup" key is pressed', () => {
                const wrapper = mount(
                    <Menu>
                        <li role="menuitem" />
                    </Menu>,
                );
                const instance = wrapper.instance();
                sandbox.mock(instance).expects('focusFirstItem');
                wrapper.simulate('keydown', {
                    key,
                    preventDefault: sandbox.mock(),
                    stopPropagation: sandbox.mock(),
                });
            });
        });

        [
            {
                key: 'End',
            },
            {
                key: 'PageDown',
            },
        ].forEach(({ key }) => {
            test('should focusLastItem() when "end" or "pagedown" key is pressed', () => {
                const wrapper = mount(
                    <Menu>
                        <li role="menuitem" />
                    </Menu>,
                );
                const instance = wrapper.instance();
                sandbox.mock(instance).expects('focusLastItem');
                wrapper.simulate('keydown', {
                    key,
                    preventDefault: sandbox.mock(),
                    stopPropagation: sandbox.mock(),
                });
            });
        });

        test('should call fireOnCloseHandler() when "esc" key is pressed', () => {
            const wrapper = mount(
                <Menu>
                    <li role="menuitem" />
                </Menu>,
            );

            const instance = wrapper.instance();

            sandbox.mock(instance).expects('fireOnCloseHandler');

            wrapper.simulate('keydown', {
                key: 'Escape',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
        });

        test('should call fireOnCloseHandler() but NOT preventDefault() or stopPropagation() when "tab" key is pressed', () => {
            const wrapper = mount(
                <Menu>
                    <li role="menuitem" />
                </Menu>,
            );

            const instance = wrapper.instance();

            sandbox.mock(instance).expects('fireOnCloseHandler');

            wrapper.simulate('keydown', {
                key: 'Tab',
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never(),
            });
        });

        [
            {
                key: ' ',
            },
            {
                key: 'Enter',
            },
        ].forEach(({ key }) => {
            test('should trigger click event on event target when "space" or "enter" key is pressed', () => {
                const wrapper = mount(
                    <Menu>
                        <li role="menuitem" />
                    </Menu>,
                );
                const menuItemEl = wrapper.find('li').getDOMNode();
                sandbox.mock(menuItemEl).expects('click');
                wrapper.simulate('keydown', {
                    target: menuItemEl,
                    key,
                    preventDefault: sandbox.mock(),
                    stopPropagation: sandbox.mock(),
                });
            });
        });
    });

    describe('setFocus()', () => {
        test('should not do anything when there are no valid menu items', () => {
            const wrapper = mount<Menu>(
                <Menu>
                    <li role="separator" />
                </Menu>,
            );
            const instance = wrapper.instance();
            expect(instance.menuItemEls.length).toBe(0);

            instance.setFocus(1);

            expect(instance.focusIndex).toEqual(0);
        });

        test('should wrap to beginning when index is greater than number of items', () => {
            const wrapper = mount<Menu>(
                <Menu>
                    <li className="menu-item" role="menuitem" />
                    <li className="menu-item" role="menuitem" />
                </Menu>,
            );
            const instance = wrapper.instance();
            const listItems = wrapper.find('li');

            sandbox.mock(listItems.at(0).getDOMNode()).expects('focus');

            instance.setFocus(2);

            expect(instance.focusIndex).toEqual(0);
        });

        test('should wrap to end when index is less than 0', () => {
            const wrapper = mount<Menu>(
                <Menu>
                    <li className="menu-item" role="menuitem" />
                    <li className="menu-item" role="menuitem" />
                </Menu>,
            );
            const instance = wrapper.instance();
            const listItems = wrapper.find('li');

            sandbox.mock(listItems.at(1).getDOMNode()).expects('focus');

            instance.setFocus(-2);

            expect(instance.focusIndex).toEqual(1);
        });

        test('should move to specific index when index is in bounds', () => {
            const wrapper = mount<Menu>(
                <Menu>
                    <li className="menu-item" role="menuitem" />
                    <li className="menu-item" role="menuitem" />
                </Menu>,
            );
            const instance = wrapper.instance();
            const listItems = wrapper.find('li');

            sandbox.mock(listItems.at(1).getDOMNode()).expects('focus');

            instance.setFocus(1);

            expect(instance.focusIndex).toEqual(1);
        });
    });

    describe('focusFirstItem()', () => {
        test('should call setFocus(0) when called', () => {
            const wrapper = mount<Menu>(
                <Menu>
                    <li role="menuitem" />
                </Menu>,
            );
            const instance = wrapper.instance();
            sandbox
                .mock(instance)
                .expects('setFocus')
                .withArgs(0);
            instance.focusFirstItem();
        });
    });

    describe('focusLastItem()', () => {
        test('should call setFocus(-1) when called', () => {
            const wrapper = mount<Menu>(
                <Menu>
                    <li role="menuitem" />
                    <li role="menuitem" />
                    <li role="menuitem" />
                </Menu>,
            );
            const instance = wrapper.instance();
            sandbox
                .mock(instance)
                .expects('setFocus')
                .withArgs(-1);
            instance.focusLastItem();
        });
    });

    describe('focusNextItem()', () => {
        test('should call setFocus(current+1) when called', () => {
            const wrapper = mount<Menu>(
                <Menu>
                    <li role="menuitem" />
                    <li role="menuitem" />
                    <li role="menuitem" />
                </Menu>,
            );
            const instance = wrapper.instance();
            instance.focusIndex = 1;
            sandbox
                .mock(instance)
                .expects('setFocus')
                .withArgs(2);
            instance.focusNextItem();
        });
    });

    describe('focusPreviousItem()', () => {
        test('should call setFocus(current-1) when called', () => {
            const wrapper = mount<Menu>(
                <Menu>
                    <li role="menuitem" />
                    <li role="menuitem" />
                    <li role="menuitem" />
                </Menu>,
            );
            const instance = wrapper.instance();
            instance.focusIndex = 2;
            sandbox
                .mock(instance)
                .expects('setFocus')
                .withArgs(1);
            instance.focusPreviousItem();
        });
    });

    describe('getMenuItemElFromEventTarget()', () => {
        test('should return valid menu item when target is contained in a menu item', () => {
            const wrapper = mount<Menu>(
                <Menu>
                    <li className="menu-item" role="menuitem" />
                    <li className="menu-item" role="menuitem">
                        <span>Awesome</span>
                    </li>
                    <li className="menu-item" role="menuitem" />
                </Menu>,
            );
            const instance = wrapper.instance();
            const listWrapper = wrapper.find('li');
            const spanWrapper = wrapper.find('span');
            const result = instance.getMenuItemElFromEventTarget(spanWrapper.at(0).getDOMNode());
            const expectedResult = {
                menuItemEl: listWrapper.at(1).getDOMNode(),
                menuIndex: 1,
            };
            expect(result.menuItemEl).toEqual(expectedResult.menuItemEl);
            expect(result.menuIndex).toEqual(expectedResult.menuIndex);
        });

        test('should return null when target is not in a valid menu item', () => {
            const wrapper = mount<Menu>(
                <Menu>
                    <li role="menuitem" />
                    <li role="menuitem" />
                    <li role="menuitem" />
                    <li>
                        <span>Awesome</span>
                    </li>
                </Menu>,
            );
            const instance = wrapper.instance();
            const spanWrapper = wrapper.find('span');
            const result = instance.getMenuItemElFromEventTarget(spanWrapper.at(0).getDOMNode());
            expect(result.menuItemEl).toBeNull();
        });
    });

    describe('fireOnCloseHandler()', () => {
        test('should call onClose() when prop exists', () => {
            const wrapper = mount<Menu>(
                <Menu onClose={sandbox.mock()}>
                    <li role="menuitem" />
                </Menu>,
            );

            const instance = wrapper.instance();

            instance.fireOnCloseHandler();
        });
    });
});
