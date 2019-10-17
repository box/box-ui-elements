import React from 'react';
import { mount, shallow } from 'enzyme';
import sinon from 'sinon';

import ContextMenu from '../ContextMenu';

const sandbox = sinon.sandbox.create();

describe('components/context-menu/ContextMenu', () => {
    // eslint-disable-next-line react/button-has-type
    const FakeButton = props => <button {...props}>Some Button</button>;
    FakeButton.displayName = 'FakeButton';

    /* eslint-disable */
    const FakeMenu = ({
        initialFocusIndex = null,
        onClose = () => {},
        setRef,
        ...rest
    }) => (
        <ul {...rest} role="menu">
            Some Menu
        </ul>
    );
    FakeMenu.displayName = 'FakeMenu';
    /* eslint-enable */

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
            }).toThrow();
        });

        test('should correctly render a single child button with correct props', () => {
            const wrapper = shallow(
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
            const wrapper = shallow(
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
            const wrapper = shallow(
                <ContextMenu>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );
            const instance = wrapper.instance();
            sandbox
                .mock(instance)
                .expects('setState')
                .withArgs({
                    isOpen: false,
                });
            instance.closeMenu();
        });

        test('should call onMenuClose() if onMenuClose prop is set', () => {
            const onMenuCloseSpy = jest.fn();
            const wrapper = shallow(
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
            const wrapper = shallow(
                <ContextMenu>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );
            wrapper.setState({ isOpen: true });

            const instance = wrapper.instance();
            sandbox.mock(instance).expects('closeMenu');
            sandbox.mock(instance).expects('focusTarget');

            wrapper.find(FakeMenu).prop('onClose')();
        });
    });

    describe('componentDidUpdate()', () => {
        test('should add click and contextmenu listeners when opening menu', () => {
            const wrapper = mount(
                <ContextMenu>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );

            const documentMock = sandbox.mock(document);
            documentMock.expects('addEventListener').withArgs('click');
            documentMock.expects('addEventListener').withArgs('contextmenu');
            wrapper.setState({ isOpen: true });
        });

        test('should remove click and contextmenu listeners when closing menu', () => {
            const wrapper = mount(
                <ContextMenu>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );
            wrapper.setState({ isOpen: true });

            const instance = wrapper.instance();

            const documentMock = sandbox.mock(document);
            documentMock.expects('removeEventListener').withArgs('contextmenu');
            documentMock.expects('removeEventListener').withArgs('click');

            instance.closeMenu();
        });

        test('should not do anything opening a menu when menu is already open', () => {
            const wrapper = mount(
                <ContextMenu>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );
            wrapper.setState({ isOpen: true });

            const instance = wrapper.instance();

            const documentMock = sandbox.mock(document);
            documentMock
                .expects('addEventListener')
                .withArgs('click')
                .never();
            documentMock
                .expects('addEventListener')
                .withArgs('contextmenu')
                .never();
            documentMock
                .expects('removeEventListener')
                .withArgs('contextmenu')
                .never();
            documentMock
                .expects('removeEventListener')
                .withArgs('click')
                .never();

            instance.setState({ isOpen: true });
        });

        test('should close menu when context menu becomes disabled and the menu is currently open', () => {
            const wrapper = shallow(
                <ContextMenu>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );
            wrapper.setState({ isOpen: true });

            const instance = wrapper.instance();
            sandbox.mock(instance).expects('handleMenuClose');

            instance.componentDidUpdate({ isDisabled: true }, { isOpen: true });
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
            documentMock
                .expects('removeEventListener')
                .withArgs('contextmenu')
                .never();
            documentMock
                .expects('removeEventListener')
                .withArgs('click')
                .never();

            wrapper.unmount();
        });

        test('should remove listeners when menu is open', () => {
            const wrapper = mount(
                <ContextMenu>
                    <FakeButton />
                    <FakeMenu />
                </ContextMenu>,
            );
            wrapper.setState({ isOpen: true });

            const documentMock = sandbox.mock(document);
            documentMock.expects('removeEventListener').withArgs('contextmenu');
            documentMock.expects('removeEventListener').withArgs('click');

            wrapper.unmount();
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

        describe('handleContextMenu()', () => {
            test('should be no-op when props.isDisabled is true', () => {
                mountToBody(
                    <ContextMenu isDisabled>
                        <FakeButton />
                        <FakeMenu />
                    </ContextMenu>,
                );

                wrapper.find(FakeButton).simulate('contextmenu', {
                    preventDefault: sandbox.mock().never(),
                });

                expect(wrapper.state('isOpen')).toBe(false);
            });

            test('should call setState() with correct values', () => {
                mountToBody(
                    <ContextMenu>
                        <FakeButton />
                        <FakeMenu />
                    </ContextMenu>,
                );

                const menuTargetEl = document.getElementById(wrapper.instance().menuTargetID);
                sandbox.stub(menuTargetEl, 'getBoundingClientRect').returns({ left: 5, top: 10 });

                wrapper.find(FakeButton).simulate('contextmenu', {
                    clientX: 10,
                    clientY: 20,
                    preventDefault: sandbox.mock(),
                });

                expect(wrapper.state('isOpen')).toBe(true);
                expect(wrapper.state('targetOffset')).toEqual('10px 5px');
            });

            test('should call onMenuOpen handler when given', () => {
                const onMenuOpenSpy = jest.fn();
                mountToBody(
                    <ContextMenu onMenuOpen={onMenuOpenSpy}>
                        <FakeButton />
                        <FakeMenu />
                    </ContextMenu>,
                );

                wrapper.find(FakeButton).simulate('contextmenu', {
                    preventDefault: () => {},
                });

                expect(onMenuOpenSpy).toBeCalled();
            });
        });

        describe('handleDocumentClick()', () => {
            test('should call closeMenu() when event target is not within the menu', () => {
                mountToBody(
                    <ContextMenu>
                        <FakeButton />
                        <FakeMenu />
                    </ContextMenu>,
                );

                const instance = wrapper.instance();
                instance.handleContextMenu({
                    clientX: 10,
                    clientY: 15,
                    preventDefault: sandbox.stub(),
                });
                sandbox.mock(instance).expects('closeMenu');

                instance.handleDocumentClick({
                    target: document.createElement('div'),
                });
            });

            test('should not call closeMenu() when event target is within the menu', () => {
                mountToBody(
                    <ContextMenu>
                        <FakeButton />
                        <FakeMenu />
                    </ContextMenu>,
                );

                const instance = wrapper.instance();
                instance.handleContextMenu({
                    clientX: 10,
                    clientY: 15,
                    preventDefault: sandbox.stub(),
                });
                sandbox
                    .mock(instance)
                    .expects('closeMenu')
                    .never();

                instance.handleDocumentClick({
                    target: document.getElementById(instance.menuID),
                });
            });
        });

        describe('focusTarget()', () => {
            test('should focus the menu target when called', () => {
                mountToBody(
                    <ContextMenu>
                        <FakeButton />
                        <FakeMenu />
                    </ContextMenu>,
                );

                const instance = wrapper.instance();
                const menuTargetEl = document.getElementById(instance.menuTargetID);
                sandbox.mock(menuTargetEl).expects('focus');

                instance.focusTarget();
            });
        });
    });
});
