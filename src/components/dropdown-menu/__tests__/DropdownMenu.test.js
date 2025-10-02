import React, { act } from 'react';
import { mount, shallow } from 'enzyme';
import TetherComponent from 'react-tether';
import sinon from 'sinon';

import DropdownMenu from '../DropdownMenu';
import { KEYS } from '../../../constants';

const sandbox = sinon.sandbox.create();

describe('components/dropdown-menu/DropdownMenu', () => {
    // eslint-disable-next-line react/button-has-type
    const FakeButton = props => <button {...props}>Some Button</button>;
    FakeButton.displayName = 'FakeButton';

    /* eslint-disable */
    const FakeMenu = ({ initialFocusIndex = 0, onClose = () => {}, ...rest }) => (
        <ul {...rest} role="menu">
            Some Menu
        </ul>
    );
    FakeMenu.displayName = 'FakeMenu';
    /* eslint-enable */

    const renderWrapper = (props = {}) => {
        return mount(
            <DropdownMenu {...props}>
                <FakeButton />
                <FakeMenu />
            </DropdownMenu>,
        );
    };

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should throw an error when passed less than 2 children', () => {
            expect(() => {
                shallow(
                    <DropdownMenu>
                        <FakeButton />
                    </DropdownMenu>,
                );
            }).toThrow();
        });

        test('should throw an error when passed more than 2 children', () => {
            expect(() => {
                shallow(
                    <DropdownMenu>
                        <FakeButton />
                        <FakeMenu />
                        <div />
                    </DropdownMenu>,
                );
            }).toThrow();
        });

        test('should correctly render a single child button with correct props', () => {
            const wrapper = mount(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>,
            );

            const instance = wrapper.instance();
            const button = wrapper.find(FakeButton);
            expect(button.length).toBe(1);

            expect(button.prop('id')).toEqual(instance.menuButtonID);
            expect(button.key()).toEqual(instance.menuButtonID);
            expect(button.prop('aria-haspopup')).toEqual('true');
            expect(button.prop('aria-expanded')).toEqual('false');
            expect(button.prop('aria-controls')).toBeFalsy();
        });

        test('should set aria-expanded="true" and aria-controls=menuID when menu is open', () => {
            const wrapper = mount(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>,
            );

            const instance = wrapper.instance();
            act(() => {
                instance.openMenuAndSetFocusIndex(0);
            });
            wrapper.update();

            const button = wrapper.find(FakeButton);
            expect(button.prop('aria-expanded')).toEqual('true');
            expect(button.prop('aria-controls')).toEqual(instance.menuID);
        });

        test('should not render child menu when menu is closed', () => {
            const wrapper = mount(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>,
            );

            const menu = wrapper.find(FakeMenu);
            expect(menu.length).toBe(0);
        });

        test('should correctly render a single child menu with correct props when menu is open', () => {
            const wrapper = mount(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>,
            );

            const instance = wrapper.instance();
            act(() => {
                instance.openMenuAndSetFocusIndex(1);
            });
            wrapper.update();

            const menu = wrapper.find(FakeMenu);
            expect(menu.length).toBe(1);

            expect(menu.prop('id')).toEqual(instance.menuID);
            expect(menu.key()).toEqual(instance.menuID);
            expect(menu.prop('initialFocusIndex')).toEqual(1);
            expect(menu.prop('aria-labelledby')).toEqual(instance.menuButtonID);
        });

        test('should render TetherComponent with correct props with correct default values', () => {
            const wrapper = renderWrapper();

            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.length).toBe(1);
            expect(tetherComponent.prop('attachment')).toEqual('top left');
            expect(tetherComponent.prop('renderElementTo')).toEqual(document.body);
            expect(tetherComponent.prop('classPrefix')).toEqual('dropdown-menu');
            expect(tetherComponent.prop('targetAttachment')).toEqual('bottom left');
            expect(tetherComponent.prop('constraints')).toEqual([]);
            expect(tetherComponent.prop('enabled')).toBe(false);
        });

        test('should render TetherComponent in the body if invalid body element is specified', () => {
            const wrapper = renderWrapper({ bodyElement: 'foo' });

            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.length).toBe(1);
            expect(tetherComponent.prop('attachment')).toEqual('top left');
            expect(tetherComponent.prop('renderElementTo')).toEqual(document.body);
            expect(tetherComponent.prop('classPrefix')).toEqual('dropdown-menu');
            expect(tetherComponent.prop('targetAttachment')).toEqual('bottom left');
            expect(tetherComponent.prop('constraints')).toEqual([]);
            expect(tetherComponent.prop('enabled')).toBe(false);
        });

        test('should render className in the className is specified', () => {
            const wrapper = renderWrapper({ className: 'foo' });

            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.length).toBe(1);
            expect(tetherComponent.prop('className')).toEqual('foo');
        });

        test('should render TetherComponent with a specific body element', () => {
            const bodyEl = document.createElement('div');

            const wrapper = renderWrapper({ bodyElement: bodyEl });

            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.length).toBe(1);
            expect(tetherComponent.prop('attachment')).toEqual('top left');
            expect(tetherComponent.prop('renderElementTo')).toEqual(bodyEl);
            expect(tetherComponent.prop('classPrefix')).toEqual('dropdown-menu');
            expect(tetherComponent.prop('targetAttachment')).toEqual('bottom left');
            expect(tetherComponent.prop('constraints')).toEqual([]);
            expect(tetherComponent.prop('enabled')).toBe(false);
        });

        test('should render TetherComponent with correct props when right aligned', () => {
            const wrapper = renderWrapper({ isRightAligned: true });

            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.prop('attachment')).toEqual('top right');
            expect(tetherComponent.prop('targetAttachment')).toEqual('bottom right');
            expect(tetherComponent.prop('enabled')).toBe(false);
        });

        test('should render TetherComponent with attachment and targetAttachment props passed in as tetherAttachment and tetherTargetAttachment', () => {
            const tetherAttachment = 'middle left';
            const tetherTargetAttachment = 'middle right';
            const wrapper = renderWrapper({
                isRightAligned: true,
                tetherAttachment,
                tetherTargetAttachment,
            });

            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.prop('attachment')).toEqual(tetherAttachment);
            expect(tetherComponent.prop('targetAttachment')).toEqual(tetherTargetAttachment);
        });

        test('should render TetherComponent with enabled prop when menu is open', () => {
            const wrapper = renderWrapper();

            const instance = wrapper.instance();
            act(() => {
                instance.openMenuAndSetFocusIndex(0);
            });
            wrapper.update();

            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.prop('enabled')).toBe(true);
        });

        test('should render TetherComponent with scrollParent constraint when constrainToScrollParent=true', () => {
            const wrapper = renderWrapper({ constrainToScrollParent: true });

            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.prop('constraints')).toEqual([
                {
                    to: 'scrollParent',
                    attachment: 'together',
                },
            ]);
        });

        test('should render TetherComponent with window constraint when constrainToScrollParent=true', () => {
            const wrapper = renderWrapper({ constrainToWindow: true });

            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.prop('constraints')).toEqual([
                {
                    to: 'window',
                    attachment: 'together',
                },
            ]);
        });

        test('should render TetherComponent with scrollParent and window constraints when constrainToScrollParent=true and constrainToWindow=true', () => {
            const wrapper = renderWrapper({ constrainToScrollParent: true, constrainToWindow: true });

            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.prop('constraints')).toEqual([
                {
                    to: 'scrollParent',
                    attachment: 'together',
                },
                {
                    to: 'window',
                    attachment: 'together',
                },
            ]);
        });

        test('should render TetherComponent with window constraints and pinned when constrainToWindowWithPin=true', () => {
            const wrapper = renderWrapper({ constrainToWindowWithPin: true });

            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.prop('constraints')).toEqual([
                {
                    to: 'window',
                    attachment: 'together',
                    pin: true,
                },
            ]);
        });

        test('should render TetherComponent with window constraints, pinned and scroll parent when constrainToWindowWithPin=true and constrainToScrollParent=true', () => {
            const wrapper = renderWrapper({ constrainToScrollParent: true, constrainToWindowWithPin: true });

            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.prop('constraints')).toEqual([
                {
                    to: 'scrollParent',
                    attachment: 'together',
                },
                {
                    to: 'window',
                    attachment: 'together',
                    pin: true,
                },
            ]);
        });
    });

    describe('openMenuAndSetFocusIndex()', () => {
        test('should call setState() with correct values', () => {
            const wrapper = renderWrapper();
            const instance = wrapper.instance();
            sandbox.mock(instance).expects('setState').withArgs({
                isOpen: true,
                initialFocusIndex: 1,
            });
            instance.openMenuAndSetFocusIndex(1);
        });
    });

    describe('closeMenu()', () => {
        test('should call setState() with correct values', () => {
            const wrapper = renderWrapper();
            const instance = wrapper.instance();
            sandbox.mock(instance).expects('setState').withArgs({
                isOpen: false,
            });
            instance.closeMenu();
        });
    });

    describe('handleButtonClick()', () => {
        test('should call openMenuAndSetFocusIndex(null) when menu is currently closed', () => {
            const wrapper = mount(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>,
            );

            const instance = wrapper.instance();
            sandbox.mock(instance).expects('openMenuAndSetFocusIndex').withArgs(null);

            wrapper.find(FakeButton).simulate('click', {
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
        });

        test('should call closeMenu() when menu is currently open', () => {
            const event = {
                preventDefault: jest.fn(),
                stopPropagation: jest.fn(),
            };
            const onMenuClose = jest.fn();
            const wrapper = mount(
                <DropdownMenu onMenuClose={onMenuClose}>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>,
            );

            const instance = wrapper.instance();
            act(() => {
                instance.openMenuAndSetFocusIndex(1);
            });

            wrapper.find(FakeButton).simulate('click', event);

            expect(event.stopPropagation).toBeCalled();
            expect(event.preventDefault).toBeCalled();
            expect(onMenuClose).toBeCalled();
        });
    });

    describe('handleButtonKeyDown()', () => {
        [
            {
                key: KEYS.space,
            },
            {
                key: KEYS.enter,
            },
            {
                key: KEYS.arrowDown,
            },
        ].forEach(({ key }) => {
            test('should call openMenuAndSetFocus(0) when an open keystroke is pressed', () => {
                const wrapper = mount(
                    <DropdownMenu>
                        <FakeButton />
                        <FakeMenu />
                    </DropdownMenu>,
                );

                const instance = wrapper.instance();
                sandbox.mock(instance).expects('openMenuAndSetFocusIndex').withArgs(0);

                wrapper.find(FakeButton).simulate('keydown', {
                    key,
                    preventDefault: sandbox.mock(),
                    stopPropagation: sandbox.mock(),
                });
            });
        });

        test('should not stop esc propagation if dropdown is closed', () => {
            const onMenuClose = jest.fn();
            const wrapper = mount(
                <DropdownMenu onMenuClose={onMenuClose}>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>,
            );
            act(() => {
                wrapper.setState({ isOpen: false });
            });

            wrapper.find(FakeButton).simulate('keydown', {
                key: KEYS.escape,
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock().never(),
            });

            expect(onMenuClose).toBeCalled();
        });

        test('should stop esc propagation if dropdown is open', () => {
            const onMenuClose = jest.fn();
            const wrapper = mount(
                <DropdownMenu onMenuClose={onMenuClose}>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>,
            );
            act(() => {
                wrapper.setState({ isOpen: true });
            });

            wrapper.find(FakeButton).simulate('keydown', {
                key: KEYS.escape,
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });

            expect(onMenuClose).toBeCalled();
        });

        test('should call openMenuAndSetFocus(-1) to last item when "up" is pressed', () => {
            const wrapper = mount(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>,
            );

            const instance = wrapper.instance();
            sandbox.mock(instance).expects('openMenuAndSetFocusIndex').withArgs(-1);

            wrapper.find(FakeButton).simulate('keydown', {
                key: 'ArrowUp',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock(),
            });
        });
    });

    describe('handleMenuClose()', () => {
        test('should call closeMenu() and focusButton() when called', () => {
            const wrapper = renderWrapper();

            const instance = wrapper.instance();
            sandbox.mock(instance).expects('closeMenu');
            sandbox.mock(instance).expects('focusButton');

            instance.handleMenuClose();
        });
    });

    describe('componentDidUpdate()', () => {
        describe.each([[false], [true]])('when useBubble=%o', useBubble => {
            test('should add click and contextmenu listeners when opening menu', () => {
                const wrapper = mount(
                    <DropdownMenu useBubble={useBubble}>
                        <FakeButton />
                        <FakeMenu />
                    </DropdownMenu>,
                );
                const instance = wrapper.instance();
                const documentMock = sandbox.mock(document);
                documentMock.expects('addEventListener').withArgs('click', sinon.match.any, !useBubble);
                documentMock.expects('addEventListener').withArgs('contextmenu', sinon.match.any, !useBubble);
                documentMock.expects('removeEventListener').never();
                act(() => {
                    instance.openMenuAndSetFocusIndex(0);
                });
            });
            test('should remove click and contextmenu listeners when closing menu', () => {
                const wrapper = mount(
                    <DropdownMenu useBubble={useBubble}>
                        <FakeButton />
                        <FakeMenu />
                    </DropdownMenu>,
                );
                const instance = wrapper.instance();
                act(() => {
                    instance.openMenuAndSetFocusIndex(0);
                });
                const documentMock = sandbox.mock(document);
                documentMock.expects('removeEventListener').withArgs('contextmenu', sinon.match.any, !useBubble);
                documentMock.expects('removeEventListener').withArgs('click', sinon.match.any, !useBubble);
                documentMock.expects('addEventListener').never();
                act(() => {
                    instance.closeMenu();
                });
            });
            test('should not do anything opening a menu when menu is already open', () => {
                const wrapper = mount(
                    <DropdownMenu useBubble={useBubble}>
                        <FakeButton />
                        <FakeMenu />
                    </DropdownMenu>,
                );
                const instance = wrapper.instance();
                const documentMock = sandbox.mock(document);
                instance.openMenuAndSetFocusIndex(0);
                documentMock.expects('addEventListener').never();
                documentMock.expects('removeEventListener').never();
                instance.openMenuAndSetFocusIndex(1);
            });
        });
    });

    describe('componentWillUnmount()', () => {
        describe.each([[false], [true]])('when useBubble=%o', useBubble => {
            test('should not do anything when menu is closed', () => {
                const wrapper = mount(
                    <DropdownMenu useBubble={useBubble}>
                        <FakeButton />
                        <FakeMenu />
                    </DropdownMenu>,
                );
                const documentMock = sandbox.mock(document);
                documentMock.expects('removeEventListener').never();
                wrapper.unmount();
            });
            test('should remove listeners when menu is open', () => {
                const wrapper = mount(
                    <DropdownMenu useBubble={useBubble}>
                        <FakeButton />
                        <FakeMenu />
                    </DropdownMenu>,
                );
                const documentMock = sandbox.mock(document);
                const instance = wrapper.instance();
                act(() => {
                    instance.openMenuAndSetFocusIndex(0);
                });
                documentMock.expects('removeEventListener').withArgs('contextmenu', sinon.match.any, !useBubble);
                documentMock.expects('removeEventListener').withArgs('click', sinon.match.any, !useBubble);
                wrapper.unmount();
            });
        });
    });

    describe('tests requiring body mounting', () => {
        let attachTo;
        let wrapper = null;

        /**
         * Helper method to mount things to the correct DOM element
         * this makes it easier to clean up after ourselves after each test.
         */
        const mountToBody = component => {
            wrapper = mount(component, { attachTo });
        };

        beforeEach(() => {
            // Set up a place to mount
            attachTo = document.createElement('div');
            attachTo.setAttribute('data-mounting-point', '');
            document.body.appendChild(attachTo);
        });

        afterEach(() => {
            sandbox.verifyAndRestore();

            // Unmount and remove the mounting point after each test
            if (wrapper) {
                wrapper.unmount();
                wrapper = null;
            }
            document.body.removeChild(attachTo);
        });

        describe('handleDocumentClick()', () => {
            const closeMenuSpy = jest.fn();
            test('should call closeMenu() when event target is not within the menu or button', () => {
                mountToBody(
                    <DropdownMenu>
                        <FakeButton />
                        <FakeMenu />
                    </DropdownMenu>,
                );

                const instance = wrapper.instance();
                act(() => {
                    instance.openMenuAndSetFocusIndex(0);
                });
                instance.closeMenu = closeMenuSpy;
                const handleDocumentClickEvent = {
                    target: document.createElement('div'),
                };
                instance.handleDocumentClick(handleDocumentClickEvent);

                expect(closeMenuSpy).toHaveBeenCalled();
            });

            test('should call onMenuClose() when provided', () => {
                const onMenuCloseSpy = jest.fn();
                mountToBody(
                    <DropdownMenu onMenuClose={onMenuCloseSpy}>
                        <FakeButton />
                        <FakeMenu />
                    </DropdownMenu>,
                );

                const instance = wrapper.instance();
                act(() => {
                    instance.openMenuAndSetFocusIndex(0);
                });

                const handleDocumentClickEvent = {
                    target: document.createElement('div'),
                };
                act(() => {
                    instance.handleDocumentClick(handleDocumentClickEvent);
                });

                expect(onMenuCloseSpy).toHaveBeenCalledWith(handleDocumentClickEvent);
            });

            test.each`
                elementID         | description
                ${'menuButtonID'} | ${'button'}
                ${'menuID'}       | ${'menu'}
            `('should not call handleMenuClose() when event target is within the $description', ({ elementID }) => {
                mountToBody(
                    <DropdownMenu>
                        <FakeButton />
                        <FakeMenu />
                    </DropdownMenu>,
                );

                const instance = wrapper.instance();
                instance.openMenuAndSetFocusIndex(0);
                instance.closeMenu = closeMenuSpy;
                const handleDocumentClickEvent = {
                    target: document.getElementById(instance[elementID]),
                };

                instance.handleDocumentClick(handleDocumentClickEvent);
                expect(closeMenuSpy).not.toHaveBeenCalled();
            });
        });

        describe('focusButton()', () => {
            test('should focus the menu button when called', () => {
                mountToBody(
                    <DropdownMenu>
                        <FakeButton />
                        <FakeMenu />
                    </DropdownMenu>,
                );

                const instance = wrapper.instance();
                const menuButtonEl = document.getElementById(instance.menuButtonID);
                sandbox.mock(menuButtonEl).expects('focus');

                instance.focusButton();
            });
        });
    });
});
