import React from 'react';
import { mount, shallow } from 'enzyme';
import { withData } from 'leche';

import Menu from '../Menu';

const sandbox = sinon.sandbox.create();

describe('box-react-ui-overlays/Menu/Menu', () => {
    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        it('should render a unordered list with correct props when called', () => {
            const wrapper = shallow(
                <Menu className='awesome-menu'>
                    <li />
                    <li />
                </Menu>
            );

            assert.isTrue(wrapper.is('ul'), 'unordered list rendered');
            assert.equal(wrapper.prop('role'), 'menu');
            assert.equal(wrapper.prop('className'), 'buik-aria-menu awesome-menu');
            assert.equal(wrapper.prop('tabIndex'), -1);
        });
    });

    describe('componentDidMount()', () => {
        it('should set internal menuItemEls to valid items after mount', () => {
            const wrapper = mount(
                <Menu>
                    <li role='menuitem' />
                    <li role='separator' />
                    <li role='menuitem' />
                    <li role='menuitem' aria-disabled='true' />
                    <li>
                        <a role='menuitem'>Link</a>
                    </li>
                </Menu>
            );

            const instance = wrapper.instance();
            // Should have 3 items (li, li, a)
            assert.lengthOf(instance.menuItemEls, 3);
        });

        it('should call setFocus() asynchronously when initialFocusIndex is set to 0', () => {
            const clock = sandbox.useFakeTimers();
            const wrapper = mount(
                <Menu initialFocusIndex={0}>
                    <li role='menuitem' />
                </Menu>
            );

            const instance = wrapper.instance();
            sandbox.mock(instance).expects('setFocus').withArgs(0);

            clock.tick(100);
        });

        it('should call setFocus() asynchronously when initialFocusIndex is set to -1', () => {
            const clock = sandbox.useFakeTimers();
            const wrapper = mount(
                <Menu initialFocusIndex={-1}>
                    <li role='menuitem' />
                </Menu>
            );

            const instance = wrapper.instance();
            sandbox.mock(instance).expects('setFocus').withArgs(-1);

            clock.tick(100);
        });

        it('should not call setFocus() when no initialFocusIndex prop is passed', () => {
            const clock = sandbox.useFakeTimers();
            const wrapper = mount(
                <Menu>
                    <li role='menuitem' />
                </Menu>
            );

            const instance = wrapper.instance();
            sandbox.mock(instance).expects('setFocus').never();

            clock.tick(100);
        });
    });

    describe('handleClick()', () => {
        it('should not call fireOnCloseHandler() when click did not occur on a valid menu item', () => {
            const wrapper = mount(
                <Menu>
                    <li role='menuitem' />
                    <li role='separator' />
                </Menu>
            );

            const listItems = wrapper.find('li');
            const separatorEl = listItems.get(1);

            const instance = wrapper.instance();
            sandbox.mock(instance).expects('getMenuItemElFromEventTarget').withArgs(separatorEl).returns(null);
            sandbox.mock(instance).expects('fireOnCloseHandler').never();

            wrapper.simulate('click', {
                target: separatorEl,
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never()
            });
        });

        it('should call fireOnCloseHandler() when click occurred on a valid menu item', () => {
            const wrapper = mount(
                <Menu>
                    <li role='menuitem' />
                    <li role='separator' />
                </Menu>
            );

            const listItems = wrapper.find('li');
            const menuItemEl = listItems.get(0);

            const instance = wrapper.instance();
            sandbox.mock(instance).expects('getMenuItemElFromEventTarget').withArgs(menuItemEl).returns(menuItemEl);
            sandbox.mock(instance).expects('fireOnCloseHandler');

            wrapper.simulate('click', {
                target: menuItemEl,
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never()
            });
        });
    });

    describe('handleKeyDown()', () => {
        it('should focusNextItem() when "down" key is pressed', () => {
            const wrapper = shallow(
                <Menu>
                    <li role='menuitem' />
                </Menu>
            );
            const instance = wrapper.instance();
            sandbox.mock(instance).expects('focusNextItem');
            wrapper.simulate('keydown', {
                key: 'ArrowDown',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock()
            });
        });

        it('should focusPreviousItem() when "up" key is pressed', () => {
            const wrapper = shallow(
                <Menu>
                    <li role='menuitem' />
                </Menu>
            );
            const instance = wrapper.instance();
            sandbox.mock(instance).expects('focusPreviousItem');
            wrapper.simulate('keydown', {
                key: 'ArrowUp',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock()
            });
        });

        withData(
            {
                home: 'Home',
                pageup: 'PageUp'
            },
            (key) => {
                it('should focusFirstItem() when "home" or "pageup" key is pressed', () => {
                    const wrapper = shallow(
                        <Menu>
                            <li role='menuitem' />
                        </Menu>
                    );
                    const instance = wrapper.instance();
                    sandbox.mock(instance).expects('focusFirstItem');
                    wrapper.simulate('keydown', {
                        key,
                        preventDefault: sandbox.mock(),
                        stopPropagation: sandbox.mock()
                    });
                });
            }
        );

        withData(
            {
                end: 'End',
                pagedown: 'PageDown'
            },
            (key) => {
                it('should focusLastItem() when "end" or "pagedown" key is pressed', () => {
                    const wrapper = shallow(
                        <Menu>
                            <li role='menuitem' />
                        </Menu>
                    );
                    const instance = wrapper.instance();
                    sandbox.mock(instance).expects('focusLastItem');
                    wrapper.simulate('keydown', {
                        key,
                        preventDefault: sandbox.mock(),
                        stopPropagation: sandbox.mock()
                    });
                });
            }
        );

        it('should call fireOnCloseHandler() when "esc" key is pressed', () => {
            const wrapper = shallow(
                <Menu>
                    <li role='menuitem' />
                </Menu>
            );

            const instance = wrapper.instance();

            sandbox.mock(instance).expects('fireOnCloseHandler');

            wrapper.simulate('keydown', {
                key: 'Escape',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock()
            });
        });

        // eslint-disable-next-line
        it('should call fireOnCloseHandler() but NOT preventDefault() or stopPropagation() when "tab" key is pressed', () => {
            const wrapper = shallow(
                <Menu>
                    <li role='menuitem' />
                </Menu>
            );

            const instance = wrapper.instance();

            sandbox.mock(instance).expects('fireOnCloseHandler');

            wrapper.simulate('keydown', {
                key: 'Tab',
                preventDefault: sandbox.mock().never(),
                stopPropagation: sandbox.mock().never()
            });
        });

        withData(
            {
                space: ' ',
                return: 'Enter'
            },
            (key) => {
                it('should trigger click event on event target when "space" or "enter" key is pressed', () => {
                    const wrapper = shallow(
                        <Menu>
                            <li role='menuitem' />
                        </Menu>
                    );
                    wrapper.simulate('keydown', {
                        target: {
                            click: sandbox.mock()
                        },
                        key,
                        preventDefault: sandbox.mock(),
                        stopPropagation: sandbox.mock()
                    });
                });
            }
        );
    });

    describe('setFocus()', () => {
        it('should not do anything when there are no valid menu items', () => {
            const wrapper = mount(
                <Menu>
                    <li role='separator' />
                </Menu>
            );
            const instance = wrapper.instance();
            assert.lengthOf(instance.menuItemEls, 0);

            instance.setFocus(1);

            assert.equal(instance.focusIndex, 0);
        });

        it('should wrap to beginning when index is greater than number of items', () => {
            const wrapper = mount(
                <Menu>
                    <li role='menuitem' />
                    <li role='menuitem' />
                </Menu>
            );
            const instance = wrapper.instance();
            const listItems = wrapper.find('li');

            sandbox.mock(listItems.get(0)).expects('focus');

            instance.setFocus(2);

            assert.equal(instance.focusIndex, 0);
        });

        it('should wrap to end when index is less than 0', () => {
            const wrapper = mount(
                <Menu>
                    <li role='menuitem' />
                    <li role='menuitem' />
                </Menu>
            );
            const instance = wrapper.instance();
            const listItems = wrapper.find('li');

            sandbox.mock(listItems.get(1)).expects('focus');

            instance.setFocus(-2);

            assert.equal(instance.focusIndex, 1);
        });

        it('should move to specific index when index is in bounds', () => {
            const wrapper = mount(
                <Menu>
                    <li role='menuitem' />
                    <li role='menuitem' />
                </Menu>
            );
            const instance = wrapper.instance();
            const listItems = wrapper.find('li');

            sandbox.mock(listItems.get(1)).expects('focus');

            instance.setFocus(1);

            assert.equal(instance.focusIndex, 1);
        });
    });

    describe('focusFirstItem()', () => {
        it('should call setFocus(0) when called', () => {
            const wrapper = shallow(
                <Menu>
                    <li role='menuitem' />
                </Menu>
            );
            const instance = wrapper.instance();
            sandbox.mock(instance).expects('setFocus').withArgs(0);
            instance.focusFirstItem();
        });
    });

    describe('focusLastItem()', () => {
        it('should call setFocus(-1) when called', () => {
            const wrapper = shallow(
                <Menu>
                    <li role='menuitem' />
                    <li role='menuitem' />
                    <li role='menuitem' />
                </Menu>
            );
            const instance = wrapper.instance();
            sandbox.mock(instance).expects('setFocus').withArgs(-1);
            instance.focusLastItem();
        });
    });

    describe('focusNextItem()', () => {
        it('should call setFocus(current+1) when called', () => {
            const wrapper = shallow(
                <Menu>
                    <li role='menuitem' />
                    <li role='menuitem' />
                    <li role='menuitem' />
                </Menu>
            );
            const instance = wrapper.instance();
            instance.focusIndex = 1;
            sandbox.mock(instance).expects('setFocus').withArgs(2);
            instance.focusNextItem();
        });
    });

    describe('focusPreviousItem()', () => {
        it('should call setFocus(current-1) when called', () => {
            const wrapper = shallow(
                <Menu>
                    <li role='menuitem' />
                    <li role='menuitem' />
                    <li role='menuitem' />
                </Menu>
            );
            const instance = wrapper.instance();
            instance.focusIndex = 2;
            sandbox.mock(instance).expects('setFocus').withArgs(1);
            instance.focusPreviousItem();
        });
    });

    describe('getMenuItemElFromEventTarget()', () => {
        it('should return valid menu item when target is contained in a menu item', () => {
            const wrapper = mount(
                <Menu>
                    <li role='menuitem' />
                    <li role='menuitem'>
                        <span>Awesome</span>
                    </li>
                    <li role='menuitem' />
                </Menu>
            );
            const instance = wrapper.instance();
            const listWrapper = wrapper.find('li');
            const spanWrapper = wrapper.find('span');
            const result = instance.getMenuItemElFromEventTarget(spanWrapper.get(0));
            assert.equal(result, listWrapper.get(1));
        });

        it('should return null when target is not in a valid menu item', () => {
            const wrapper = mount(
                <Menu>
                    <li role='menuitem' />
                    <li role='menuitem' />
                    <li role='menuitem' />
                    <li>
                        <span>Awesome</span>
                    </li>
                </Menu>
            );
            const instance = wrapper.instance();
            const spanWrapper = wrapper.find('span');
            const result = instance.getMenuItemElFromEventTarget(spanWrapper.get(0));
            assert.isNull(result);
        });
    });

    describe('fireOnCloseHandler()', () => {
        it('should call onClose() when prop exists', () => {
            const wrapper = mount(
                <Menu onClose={sandbox.mock()}>
                    <li role='menuitem' />
                </Menu>
            );

            const instance = wrapper.instance();

            instance.fireOnCloseHandler();
        });
    });
});
