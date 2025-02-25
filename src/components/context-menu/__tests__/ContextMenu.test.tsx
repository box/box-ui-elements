// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React, { act } from 'react';
import { mount, shallow, ReactWrapper } from 'enzyme';
import sinon from 'sinon';

import ContextMenu, { ContextMenuProps, ContextMenuState } from '../ContextMenu';
import Button, { ButtonType } from '../../button/Button';
import Menu from '../../menu/Menu';

const sandbox = sinon.sandbox.create();

describe('components/context-menu/ContextMenu', () => {
    const FakeButton = (props: Record<string, string | boolean>) => (
        <Button className="bdl-FakeButton" isLoading={false} showRadar={false} type={ButtonType.BUTTON} {...props}>
            Some Button
        </Button>
    );
    FakeButton.displayName = 'FakeButton';

    const FakeMenu = (props: Record<string, string | boolean>) => (
        <Menu {...props}>
            <ul role="menu">Some Menu</ul>
        </Menu>
    );
    FakeMenu.displayName = 'FakeMenu';

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should throw an error when passed less than 2 children', () => {
            expect(() => {
                shallow(
                    <ContextMenu>
                        <FakeButton />
                    </ContextMenu>,
                );
            }).toThrow();
        });

        test('should throw an error when passed more than 2 children', () => {
            expect(() => {
                shallow(
                    <ContextMenu>
                        <FakeButton />
                        <FakeMenu />
                        <div />
                    </ContextMenu>,
                );
            }).toThrow('ContextMenu must have exactly two children: a target component and a <Menu>');
        });

        test('should correctly render a single child button with correct props', () => {
            const wrapper = shallow<ContextMenu>(
                <ContextMenu>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );

            const instance = wrapper.instance();
            const button = wrapper.find(FakeButton);
            expect(button.length).toBe(1);

            expect(button.prop('id')).toEqual(instance.menuTargetID);
            expect(button.key()).toEqual(instance.menuTargetID);
        });

        test('should not render child menu when menu is closed', () => {
            const wrapper = shallow(
                <ContextMenu>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );

            const menu = wrapper.find(FakeMenu);
            expect(menu.length).toBe(0);
        });

        test('should correctly render a single child menu with correct props when menu is open', () => {
            const wrapper = shallow<ContextMenu>(
                <ContextMenu>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );
            wrapper.setState({ isOpen: true });

            const instance = wrapper.instance();

            const menu = wrapper.find(FakeMenu);
            expect(menu.length).toBe(1);

            expect(menu.prop('id')).toEqual(instance.menuID);
            expect(menu.key()).toEqual(instance.menuID);
            expect(menu.prop('initialFocusIndex')).toEqual(null);
        });

        test('should render TetherComponent with correct props with correct default values', () => {
            const wrapper = shallow(
                <ContextMenu>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );

            expect(wrapper.is('TetherComponent')).toBe(true);
            expect(wrapper.prop('attachment')).toEqual('top left');
            expect(wrapper.prop('targetAttachment')).toEqual('top left');
            expect(wrapper.prop('constraints')).toEqual([]);
        });

        test('should render TetherComponent with constraints when specified', () => {
            const constraints = [
                {
                    to: 'window',
                    attachment: 'together',
                },
            ];
            const wrapper = shallow(
                <ContextMenu constraints={constraints}>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );

            expect(wrapper.prop('constraints')).toEqual(constraints);
        });

        test('should render TetherComponent with correct target offset when set', () => {
            const targetOffset = '10px 20px';
            const wrapper = shallow(
                <ContextMenu>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );
            wrapper.setState({ targetOffset });

            expect(wrapper.prop('targetOffset')).toEqual(targetOffset);
        });
    });

    describe('closeMenu()', () => {
        test('should call setState() with correct values', () => {
            const wrapper = shallow<ContextMenu>(
                <ContextMenu>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );
            const instance = wrapper.instance();
            sandbox.mock(instance).expects('setState').withArgs({
                isOpen: false,
            });
            instance.closeMenu();
        });

        test('should call onMenuClose() if onMenuClose prop is set', () => {
            const onMenuCloseSpy = jest.fn();
            const wrapper = shallow<ContextMenu>(
                <ContextMenu onMenuClose={onMenuCloseSpy}>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );
            wrapper.instance().closeMenu();

            expect(onMenuCloseSpy).toBeCalled();
        });
    });

    describe('handleMenuClose()', () => {
        test('should call closeMenu() and focusTarget() when called', () => {
            const onMenuCloseSpy = jest.fn();
            const onFocusTargetSpy = jest.fn();
            const wrapper = shallow<ContextMenu>(
                <ContextMenu onMenuClose={onMenuCloseSpy}>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );
            wrapper.setState({ isOpen: true });
            const instance = wrapper.instance();
            instance.focusTarget = onFocusTargetSpy;
            instance.handleMenuClose();
            expect(onMenuCloseSpy).toHaveBeenCalled();
            expect(onFocusTargetSpy).toHaveBeenCalled();
        });
    });

    describe('componentDidUpdate()', () => {
        test('should add click and contextmenu listeners when opening menu', () => {
            const wrapper = mount<ContextMenu>(
                <ContextMenu>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );
            document.addEventListener = jest.fn();
            act(() => {
                wrapper.setState({ isOpen: true });
            });
            expect(document.addEventListener).toHaveBeenCalledWith('click', expect.anything(), expect.anything());
            expect(document.addEventListener).toHaveBeenCalledWith('contextmenu', expect.anything(), expect.anything());
        });

        test('should remove click and contextmenu listeners when closing menu', () => {
            const wrapper = mount<ContextMenu>(
                <ContextMenu>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );
            act(() => {
                wrapper.setState({ isOpen: true });
            });
            const instance = wrapper.instance();
            document.removeEventListener = jest.fn();
            act(() => {
                instance.closeMenu();
            });
            expect(document.removeEventListener).toHaveBeenCalledWith(
                'contextmenu',
                expect.anything(),
                expect.anything(),
            );
            expect(document.removeEventListener).toHaveBeenCalledWith('click', expect.anything(), expect.anything());
        });

        test('should not do anything opening a menu when menu is already open', () => {
            const wrapper = mount(
                <ContextMenu>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );
            act(() => {
                wrapper.setState({ isOpen: true });
            });
            const instance = wrapper.instance();
            document.addEventListener = jest.fn();
            document.removeEventListener = jest.fn();
            instance.setState({ isOpen: true });
            expect(document.addEventListener).not.toHaveBeenCalledWith('click', expect.anything(), expect.anything());
            expect(document.addEventListener).not.toHaveBeenCalledWith(
                'contextmenu',
                expect.anything(),
                expect.anything(),
            );
            expect(document.removeEventListener).not.toHaveBeenCalledWith(
                'contextmenu',
                expect.anything(),
                expect.anything(),
            );
            expect(document.removeEventListener).not.toHaveBeenCalledWith(
                'click',
                expect.anything(),
                expect.anything(),
            );
        });

        test('should close menu when context menu becomes disabled and the menu is currently open', () => {
            const wrapper = shallow(
                <ContextMenu>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );
            wrapper.setState({ isOpen: true });
            const instance = wrapper.instance() as ContextMenu;
            sandbox.mock(instance).expects('handleMenuClose');
            instance.componentDidUpdate({ isDisabled: true } as ContextMenuProps, { isOpen: true } as ContextMenuState);
        });
    });

    describe('componentWillUnmount()', () => {
        test('should not do anything when menu is closed', () => {
            const wrapper = mount(
                <ContextMenu>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );

            const documentMock = sandbox.mock(document);
            documentMock.expects('removeEventListener').withArgs('contextmenu').never();
            documentMock.expects('removeEventListener').withArgs('click').never();

            wrapper.unmount();
        });

        test('should remove listeners when menu is open', () => {
            const wrapper = mount(
                <ContextMenu>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );
            act(() => {
                wrapper.setState({ isOpen: true });
            });

            const documentMock = sandbox.mock(document);
            documentMock.expects('removeEventListener').withArgs('contextmenu');
            documentMock.expects('removeEventListener').withArgs('click');

            wrapper.unmount();
        });
    });

    describe('tests requiring body mounting', () => {
        let attachTo: HTMLDivElement;
        let wrapper: ReactWrapper | null = null;

        /**
         * Helper method to mount things to the correct DOM element
         * This makes it easier to clean up after ourselves after each test
         */
        const mountToBody = (component: React.ReactElement) => mount(component, { attachTo });
        const preventDefaultSpy = jest.fn();

        beforeEach(() => {
            // Set up a place to mount
            attachTo = document.createElement('div');
            attachTo.setAttribute('data-mounting-point', '');
            document.body.appendChild(attachTo);
        });

        afterEach(() => {
            // Unmount and remove the mounting point after each test
            if (wrapper) {
                wrapper.unmount();
                wrapper = null;
            }
            document.body.removeChild(attachTo);
        });

        describe('handleContextMenu()', () => {
            test('should be no-op when props.isDisabled is true', () => {
                wrapper = mountToBody(
                    <ContextMenu isDisabled>
                        <FakeButton />
                        <FakeMenu />
                    </ContextMenu>,
                );
                wrapper.find(FakeButton).simulate('contextmenu', {
                    preventDefault: preventDefaultSpy,
                });
                expect(wrapper.state('isOpen')).toBe(false);
                expect(preventDefaultSpy).not.toHaveBeenCalled();
            });

            test('should call setState() with correct values', () => {
                wrapper = mountToBody(
                    <ContextMenu>
                        <FakeButton />
                        <FakeMenu />
                    </ContextMenu>,
                );
                const instance = wrapper.instance() as ContextMenu;
                const menuTargetEl = document.getElementById(instance.menuTargetID) as HTMLDivElement;
                menuTargetEl.getBoundingClientRect = jest.fn(() => {
                    return { left: 5, top: 10 } as DOMRect;
                });
                wrapper.find(FakeButton).simulate('contextmenu', {
                    clientX: 10,
                    clientY: 20,
                    preventDefault: preventDefaultSpy,
                });
                expect(wrapper.state('isOpen')).toBe(true);
                expect(wrapper.state('targetOffset')).toEqual('10px 5px');
            });

            test('should call onMenuOpen handler when given', () => {
                const onMenuOpenSpy = jest.fn();
                wrapper = mountToBody(
                    <ContextMenu onMenuOpen={onMenuOpenSpy}>
                        <FakeButton />
                        <FakeMenu />
                    </ContextMenu>,
                );
                wrapper.find(FakeButton).simulate('contextmenu', {
                    preventDefault: () => null,
                });
                expect(onMenuOpenSpy).toBeCalled();
            });
        });

        describe('handleDocumentClick()', () => {
            test('should call closeMenu() when event target is not within the menu', () => {
                const closeMenuSpy = jest.fn();
                wrapper = mountToBody(
                    <ContextMenu>
                        <FakeButton />
                        <FakeMenu />
                    </ContextMenu>,
                );
                const instance = wrapper.instance() as ContextMenu;
                instance.closeMenu = closeMenuSpy;

                const handleContextMenuEvent = {
                    clientX: 10,
                    clientY: 15,
                    preventDefault: preventDefaultSpy,
                } as unknown as MouseEvent;
                act(() => {
                    instance.handleContextMenu(handleContextMenuEvent);
                });

                const documentClickEvent = {
                    target: document.createElement('div'),
                } as unknown as MouseEvent;
                instance.handleDocumentClick(documentClickEvent);
                expect(closeMenuSpy).toHaveBeenCalled();
            });

            test('should not call closeMenu() when event target is within the menu', () => {
                const closeMenuSpy = jest.fn();
                wrapper = mountToBody(
                    <ContextMenu>
                        <FakeButton />
                        <FakeMenu />
                    </ContextMenu>,
                );
                const instance = wrapper.instance() as ContextMenu;
                instance.closeMenu = closeMenuSpy;

                const handleContextMenuEvent = {
                    clientX: 10,
                    clientY: 15,
                    preventDefault: preventDefaultSpy,
                } as unknown as MouseEvent;
                act(() => {
                    instance.handleContextMenu(handleContextMenuEvent);
                });

                const documentClickEvent = {
                    target: document.getElementById(instance.menuID),
                } as unknown as MouseEvent;
                instance.handleDocumentClick(documentClickEvent);
                expect(closeMenuSpy).not.toHaveBeenCalled();
            });
        });

        describe('focusTarget()', () => {
            test('should focus the menu target when called', () => {
                const onFocusTargetSpy = jest.fn();
                wrapper = mountToBody(
                    <ContextMenu>
                        <FakeButton />
                        <FakeMenu />
                    </ContextMenu>,
                );
                const instance = wrapper.instance() as ContextMenu;
                const menuTargetEl = document.getElementById(instance.menuTargetID) as HTMLButtonElement;
                menuTargetEl.focus = onFocusTargetSpy;
                instance.focusTarget();
                expect(onFocusTargetSpy).toHaveBeenCalled();
            });
        });
    });
});
