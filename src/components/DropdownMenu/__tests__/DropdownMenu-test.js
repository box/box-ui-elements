import React from 'react';
import { mount, shallow } from 'enzyme';
import { withData } from 'leche';
import DropdownMenu from '../DropdownMenu';

const sandbox = sinon.sandbox.create();

describe('DropdownMenu/DropdownMenu', () => {
    const FakeButton = (props) => <button {...props}>Some Button</button>;
    FakeButton.displayName = 'FakeButton';

    // eslint-disable-next-line
    const FakeMenu = ({ initialFocusIndex = 0, onClose = () => {}, ...rest }) =>
        <ul {...rest} role='menu'>Some Menu</ul>;
    FakeMenu.displayName = 'FakeMenu';

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        it('should throw an error when passed less than 2 children', () => {
            assert.throws(() => {
                shallow(
                    <DropdownMenu>
                        <FakeButton />
                    </DropdownMenu>
                );
            }, /DropdownMenu must have exactly two children/);
        });

        it('should throw an error when passed more than 2 children', () => {
            assert.throws(() => {
                shallow(
                    <DropdownMenu>
                        <FakeButton />
                        <FakeMenu />
                        <div />
                    </DropdownMenu>
                );
            }, /DropdownMenu must have exactly two children/);
        });

        it('should correctly render a single child button with correct props', () => {
            const wrapper = shallow(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );

            const instance = wrapper.instance();
            const button = wrapper.find(FakeButton);
            assert.lengthOf(button, 1, 'should contain 1 button');

            assert.equal(button.prop('id'), instance.menuButtonId);
            assert.equal(button.key(), instance.menuButtonId);
            assert.equal(button.prop('aria-haspopup'), 'true');
            assert.equal(button.prop('aria-expanded'), 'false');
            assert.notOk(button.prop('aria-controls'));
        });

        it('should set aria-expanded="true" and aria-controls=menuId when menu is open', () => {
            const wrapper = shallow(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );

            const instance = wrapper.instance();
            instance.openMenuAndSetFocusIndex(0);

            const button = wrapper.find(FakeButton);
            assert.equal(button.prop('aria-expanded'), 'true');
            assert.equal(button.prop('aria-controls'), instance.menuId);
        });

        it('should not render child menu when menu is closed', () => {
            const wrapper = shallow(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );

            const menu = wrapper.find(FakeMenu);
            assert.lengthOf(menu, 0, 'should contain no menu');
        });

        it('should correctly render a single child menu with correct props when menu is open', () => {
            const wrapper = shallow(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );

            const instance = wrapper.instance();
            instance.openMenuAndSetFocusIndex(1);

            const menu = wrapper.find(FakeMenu);
            assert.lengthOf(menu, 1, 'should contain 1 menu');

            assert.equal(menu.prop('id'), instance.menuId);
            assert.equal(menu.key(), instance.menuId);
            assert.equal(menu.prop('initialFocusIndex'), 1);
            assert.equal(menu.prop('aria-labelledby'), instance.menuButtonId);
        });

        it('should render TetherComponent with correct props with correct default values', () => {
            const wrapper = shallow(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );

            assert.isTrue(wrapper.is('TetherComponent'));
            assert.equal(wrapper.prop('attachment'), 'top left');
            assert.equal(wrapper.prop('targetAttachment'), 'bottom left');
            assert.deepEqual(wrapper.prop('constraints'), []);
            assert.isFalse(wrapper.prop('enabled'));
        });

        it('should render TetherComponent with correct props when right aligned', () => {
            const wrapper = shallow(
                <DropdownMenu isRightAligned>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );

            assert.equal(wrapper.prop('attachment'), 'top right');
            assert.equal(wrapper.prop('targetAttachment'), 'bottom right');
            assert.isFalse(wrapper.prop('enabled'));
        });

        it('should render TetherComponent with enabled prop when menu is open', () => {
            const wrapper = shallow(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );

            const instance = wrapper.instance();
            instance.openMenuAndSetFocusIndex(0);

            assert.isTrue(wrapper.prop('enabled'));
        });

        it('should render TetherComponent with scrollParent constraint when constrainToScrollParent=true', () => {
            const wrapper = shallow(
                <DropdownMenu constrainToScrollParent>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );

            assert.deepEqual(wrapper.prop('constraints'), [
                {
                    to: 'scrollParent',
                    attachment: 'together'
                }
            ]);
        });

        it('should render TetherComponent with window constraint when constrainToScrollParent=true', () => {
            const wrapper = shallow(
                <DropdownMenu constrainToWindow>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );

            assert.deepEqual(wrapper.prop('constraints'), [
                {
                    to: 'window',
                    attachment: 'together'
                }
            ]);
        });

        // eslint-disable-next-line
        it('should render TetherComponent with scrollParent and window constraints when constrainToScrollParent=true and constrainToWindow=true', () => {
            const wrapper = shallow(
                <DropdownMenu constrainToScrollParent constrainToWindow>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );

            assert.deepEqual(wrapper.prop('constraints'), [
                {
                    to: 'scrollParent',
                    attachment: 'together'
                },
                {
                    to: 'window',
                    attachment: 'together'
                }
            ]);
        });
    });

    describe('openMenuAndSetFocusIndex()', () => {
        it('should call setState() with correct values', () => {
            const wrapper = shallow(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );
            const instance = wrapper.instance();
            sandbox.mock(instance).expects('setState').withArgs({
                isOpen: true,
                initialFocusIndex: 1
            });
            instance.openMenuAndSetFocusIndex(1);
        });
    });

    describe('closeMenu()', () => {
        it('should call setState() with correct values', () => {
            const wrapper = shallow(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );
            const instance = wrapper.instance();
            sandbox.mock(instance).expects('setState').withArgs({
                isOpen: false
            });
            instance.closeMenu();
        });
    });

    describe('handleButtonClick()', () => {
        it('should call openMenuAndSetFocusIndex(0) when menu is currently closed', () => {
            const wrapper = shallow(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );

            const instance = wrapper.instance();
            sandbox.mock(instance).expects('openMenuAndSetFocusIndex').withArgs(0);

            wrapper.find(FakeButton).simulate('click', {
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock()
            });
        });

        it('should call closeMenu() when menu is currently open', () => {
            const wrapper = shallow(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );

            const instance = wrapper.instance();
            instance.openMenuAndSetFocusIndex(1);

            sandbox.mock(instance).expects('closeMenu');

            wrapper.find(FakeButton).simulate('click', {
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock()
            });
        });
    });

    describe('handleButtonKeyDown()', () => {
        withData(
            {
                space: ' ',
                return: 'Enter',
                down: 'ArrowDown'
            },
            (key) => {
                it('should call openMenuAndSetFocus(0) when an open keystroke is pressed', () => {
                    const wrapper = shallow(
                        <DropdownMenu>
                            <FakeButton />
                            <FakeMenu />
                        </DropdownMenu>
                    );

                    const instance = wrapper.instance();
                    sandbox.mock(instance).expects('openMenuAndSetFocusIndex').withArgs(0);

                    wrapper.find(FakeButton).simulate('keydown', {
                        key,
                        preventDefault: sandbox.mock(),
                        stopPropagation: sandbox.mock()
                    });
                });
            }
        );

        it('should call openMenuAndSetFocus(-1) to last item when "up" is pressed', () => {
            const wrapper = shallow(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );

            const instance = wrapper.instance();
            sandbox.mock(instance).expects('openMenuAndSetFocusIndex').withArgs(-1);

            wrapper.find(FakeButton).simulate('keydown', {
                key: 'ArrowUp',
                preventDefault: sandbox.mock(),
                stopPropagation: sandbox.mock()
            });
        });
    });

    describe('handleMenuClose()', () => {
        it('should call closeMenu() and focusButton() when called', () => {
            const wrapper = shallow(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );

            const instance = wrapper.instance();
            sandbox.mock(instance).expects('closeMenu');
            sandbox.mock(instance).expects('focusButton');

            instance.handleMenuClose();
        });
    });

    describe('componentDidUpdate()', () => {
        it('should add click and contextmenu listeners when opening menu', () => {
            const wrapper = mount(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );

            const instance = wrapper.instance();

            const documentMock = sandbox.mock(document);
            documentMock.expects('addEventListener').withArgs('click');
            documentMock.expects('addEventListener').withArgs('contextmenu');
            instance.openMenuAndSetFocusIndex(0);
        });

        it('should remove click and contextmenu listeners when closing menu', () => {
            const wrapper = mount(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );

            const instance = wrapper.instance();
            instance.openMenuAndSetFocusIndex(0);

            const documentMock = sandbox.mock(document);
            documentMock.expects('removeEventListener').withArgs('contextmenu');
            documentMock.expects('removeEventListener').withArgs('click');

            instance.closeMenu();
        });

        it('should not do anything opening a menu when menu is already open', () => {
            const wrapper = mount(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );

            const instance = wrapper.instance();
            instance.openMenuAndSetFocusIndex(0);

            const documentMock = sandbox.mock(document);
            documentMock.expects('addEventListener').withArgs('click').never();
            documentMock.expects('addEventListener').withArgs('contextmenu').never();
            documentMock.expects('removeEventListener').withArgs('contextmenu').never();
            documentMock.expects('removeEventListener').withArgs('click').never();

            instance.openMenuAndSetFocusIndex(1);
        });
    });

    describe('componentWillUnmount()', () => {
        it('should not do anything when menu is closed', () => {
            const wrapper = mount(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );

            const documentMock = sandbox.mock(document);
            documentMock.expects('removeEventListener').withArgs('contextmenu').never();
            documentMock.expects('removeEventListener').withArgs('click').never();

            wrapper.unmount();
        });

        it('should remove listeners when menu is open', () => {
            const wrapper = mount(
                <DropdownMenu>
                    <FakeButton />
                    <FakeMenu />
                </DropdownMenu>
            );

            const instance = wrapper.instance();
            instance.openMenuAndSetFocusIndex(0);

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
        const mountToBody = (component) => {
            wrapper = mount(component, { attachTo });
        };

        beforeEach(() => {
            // Set up a place to mount
            attachTo = document.createElement('div');
            attachTo.setAttribute('data-mounting-point');
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
            it('should call closeMenu() when event target is not within the menu or button', () => {
                mountToBody(
                    <DropdownMenu>
                        <FakeButton />
                        <FakeMenu />
                    </DropdownMenu>
                );

                const instance = wrapper.instance();
                instance.openMenuAndSetFocusIndex(0);
                sandbox.mock(instance).expects('closeMenu');

                instance.handleDocumentClick({
                    target: document.createElement('div')
                });
            });

            it('should not call closeMenu() when event target is within the button', () => {
                mountToBody(
                    <DropdownMenu>
                        <FakeButton />
                        <FakeMenu />
                    </DropdownMenu>
                );

                const instance = wrapper.instance();
                instance.openMenuAndSetFocusIndex(0);
                sandbox.mock(instance).expects('closeMenu').never();

                instance.handleDocumentClick({
                    target: document.getElementById(instance.menuButtonId)
                });
            });

            it('should not call closeMenu() when event target is within the menu', () => {
                mountToBody(
                    <DropdownMenu>
                        <FakeButton />
                        <FakeMenu />
                    </DropdownMenu>
                );

                const instance = wrapper.instance();
                instance.openMenuAndSetFocusIndex(0);
                sandbox.mock(instance).expects('closeMenu').never();

                instance.handleDocumentClick({
                    target: document.getElementById(instance.menuId)
                });
            });
        });

        describe('focusButton()', () => {
            it('should focus the menu button when called', () => {
                mountToBody(
                    <DropdownMenu>
                        <FakeButton />
                        <FakeMenu />
                    </DropdownMenu>
                );

                const instance = wrapper.instance();
                const menuButtonEl = document.getElementById(instance.menuButtonId);
                sandbox.mock(menuButtonEl).expects('focus');

                instance.focusButton();
            });
        });
    });
});
