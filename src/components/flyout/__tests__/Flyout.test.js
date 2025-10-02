import React, { act } from 'react';
import { mount, shallow } from 'enzyme';
import TetherComponent from 'react-tether';
import sinon from 'sinon';

import Flyout from '../Flyout';

const sandbox = sinon.sandbox.create();

const BOTTOM_CENTER = 'bottom-center';
const BOTTOM_LEFT = 'bottom-left';
const BOTTOM_RIGHT = 'bottom-right';
const MIDDLE_LEFT = 'middle-left';
const MIDDLE_RIGHT = 'middle-right';
const TOP_CENTER = 'top-center';
const TOP_LEFT = 'top-left';
const TOP_RIGHT = 'top-right';

describe('components/flyout/Flyout', () => {
    const FakeButton = props => (
        // eslint-disable-next-line react/button-has-type
        <button className="fake-button" {...props}>
            Some Button
        </button>
    );
    FakeButton.displayName = 'FakeButton';
    /* eslint-disable */
    const FakeOverlay = ({ onClick = () => {}, onClose = () => {}, shouldDefaultFocus = false, ...rest }) => (
        <div {...rest} className="overlay-wrapper is-visible">
            <div className="overlay">
                <input type="text" />
                <span id="span" />
                <button id="button" />
            </div>
        </div>
    );
    FakeOverlay.displayName = 'FakeOverlay';
    /* eslint-enable */

    const renderWrapper = (props = {}) => {
        return mount(
            <Flyout {...props}>
                <FakeButton />
                <FakeOverlay />
            </Flyout>,
        );
    };

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    describe('render()', () => {
        test('should throw an error when passed less than 2 children', () => {
            expect(() => {
                shallow(
                    <Flyout>
                        <FakeButton />
                    </Flyout>,
                );
            }).toThrow();
        });

        test('should throw an error when passed more than 2 children', () => {
            expect(() => {
                shallow(
                    <Flyout>
                        <FakeButton />
                        <FakeOverlay />
                        <div />
                    </Flyout>,
                );
            }).toThrow();
        });

        test('should correctly render a single child button with correct props', () => {
            const wrapper = renderWrapper();

            const instance = wrapper.instance();
            const button = wrapper.find(FakeButton);
            expect(button.length).toBe(1);

            expect(button.prop('id')).toEqual(instance.overlayButtonID);
            expect(button.key()).toEqual(instance.overlayButtonID);
            expect(button.prop('aria-haspopup')).toEqual('dialog');
            expect(button.prop('aria-expanded')).toEqual('false');
            expect(button.prop('aria-controls')).toBeFalsy();
        });

        test('should set aria-expanded="true" and aria-controls=overlayID when overlay is visible', () => {
            const wrapper = renderWrapper();

            act(() => {
                wrapper.setState({
                    isVisible: true,
                });
            });
            wrapper.update();

            const button = wrapper.find(FakeButton);
            expect(button.prop('aria-expanded')).toEqual('true');
            expect(button.prop('aria-controls')).toEqual(wrapper.instance().overlayID);
        });

        test('should not render child overlay when overlay is closed', () => {
            const wrapper = shallow(
                <Flyout>
                    <FakeButton />
                    <FakeOverlay />
                </Flyout>,
            );

            const overlay = wrapper.find(FakeOverlay);
            expect(overlay.length).toBe(0);
        });

        test('should correctly render a single child overlay with correct props when overlay is open', () => {
            const wrapper = renderWrapper();

            const instance = wrapper.instance();
            act(() => {
                wrapper.setState({
                    isVisible: true,
                });
            });
            wrapper.update();

            const overlay = wrapper.find(FakeOverlay);
            expect(overlay.length).toBe(1);

            expect(overlay.prop('id')).toEqual(instance.overlayID);
            expect(overlay.key()).toEqual(instance.overlayID);
            expect(overlay.prop('role')).toEqual('dialog');
            expect(overlay.prop('onClick')).toEqual(instance.handleOverlayClick);
            expect(overlay.prop('onClose')).toEqual(instance.handleOverlayClose);
            expect(overlay.prop('aria-labelledby')).toEqual(instance.overlayButtonID);
        });

        test('should render TetherComponent with correct props with correct default values', () => {
            const wrapper = renderWrapper();

            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.length).toBe(1);
            expect(tetherComponent.prop('attachment')).toEqual('top left');
            expect(tetherComponent.prop('targetAttachment')).toEqual('bottom left');
            expect(tetherComponent.prop('classPrefix')).toEqual('flyout-overlay');
            expect(tetherComponent.prop('enabled')).toBe(false);
        });

        test('should render TetherComponent with correct enable prop when overlay is visible', () => {
            const wrapper = renderWrapper();

            act(() => {
                wrapper.setState({
                    isVisible: true,
                });
            });
            wrapper.update();

            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.prop('enabled')).toBe(true);
        });

        test('should render TetherComponent with offset when offset is passed in as a prop', () => {
            const offset = 'wooot';
            const wrapper = renderWrapper({ offset });

            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.prop('offset')).toEqual(offset);
        });

        test('should render TetherComponent with passed in className', () => {
            const className = 'the-class-name';
            const wrapper = renderWrapper({ className });

            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.prop('classes')).toEqual({
                element: `flyout-overlay ${className}`,
            });
        });

        test('should render TetherComponent without scrollParent constraint when constrainToScrollParent=false', () => {
            const wrapper = renderWrapper({ constrainToScrollParent: false });

            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.prop('constraints')).toEqual([]);
        });

        test('should render TetherComponent with window constraint when constrainToWindow=true', () => {
            const wrapper = renderWrapper({ constrainToWindow: true });

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

        test('should render TetherComponent with window constraint when constrainToWindowWithPin=true', () => {
            const wrapper = renderWrapper({ constrainToWindowWithPin: true });

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

        [
            {
                position: BOTTOM_CENTER,
                offset: '-10px 0',
            },
            {
                position: BOTTOM_LEFT,
                offset: '-10px 0',
            },
            {
                position: BOTTOM_RIGHT,
                offset: '-10px 0',
            },
            {
                position: TOP_CENTER,
                offset: '10px 0',
            },
            {
                position: TOP_LEFT,
                offset: '10px 0',
            },
            {
                position: TOP_RIGHT,
                offset: '10px 0',
            },
            {
                position: MIDDLE_LEFT,
                offset: '0 10px',
            },
            {
                position: MIDDLE_RIGHT,
                offset: '0 -10px',
            },
        ].forEach(({ position, offset }) => {
            test('should set tether offset correctly when offset props is not passed in', () => {
                const wrapper = renderWrapper({ position });

                const tetherComponent = wrapper.find(TetherComponent);
                expect(tetherComponent.prop('offset')).toEqual(offset);
            });
        });
    });

    describe('handleOverlayClick()', () => {
        test.each([
            {
                closeOnClick: true,
                hasClickableAncestor: true,
                shouldCloseOverlay: true,
            },
            {
                closeOnClick: true,
                hasClickableAncestor: false,
                shouldCloseOverlay: false,
            },
            {
                closeOnClick: false,
                hasClickableAncestor: true,
                shouldCloseOverlay: false,
            },
            {
                closeOnClick: false,
                hasClickableAncestor: false,
                shouldCloseOverlay: false,
            },
        ])(
            'should handle clicks within overlay properly %s',
            ({ closeOnClick, hasClickableAncestor, shouldCloseOverlay }) => {
                const wrapper = renderWrapper({ closeOnClick });
                const instance = wrapper.instance();
                act(() => {
                    instance.setState({
                        isVisible: true,
                    });
                });

                const event = {};
                if (hasClickableAncestor) {
                    event.target = document.getElementById('button');
                } else {
                    event.target = document.getElementById('span');
                }

                if (shouldCloseOverlay) {
                    sandbox.mock(instance).expects('handleOverlayClose');
                } else {
                    sandbox.mock(instance).expects('handleOverlayClose').never();
                }
                act(() => {
                    instance.handleOverlayClick(event);
                });
            },
        );
    });

    describe('handleButtonClick()', () => {
        let instance;
        let wrapper = null;

        beforeEach(() => {
            wrapper = renderWrapper();
            instance = wrapper.instance();
        });

        afterEach(() => {
            if (wrapper) {
                wrapper.unmount();
                wrapper = null;
            }
        });

        [
            {
                currentIsVisible: true,
                isVisibleAfterToggle: false,
            },
            {
                currentIsVisible: false,
                isVisibleAfterToggle: true,
            },
        ].forEach(({ currentIsVisible, isVisibleAfterToggle }) => {
            test('should toggle isVisible state when called', () => {
                const event = {
                    preventDefault: sandbox.stub(),
                };
                act(() => {
                    instance.setState({
                        isVisible: currentIsVisible,
                    });
                });
                act(() => {
                    instance.handleButtonClick(event);
                });
                expect(instance.state.isVisible).toEqual(isVisibleAfterToggle);
            });
        });

        test('should prevent default when called', () => {
            const event = {
                preventDefault: sandbox.mock(),
            };
            instance.handleButtonClick(event);
        });
    });

    describe('handleButtonHover()', () => {
        test('should call openOverlay() when props.openOnHover is true', () => {
            const event = {};
            const wrapper = renderWrapper({ openOnHover: true });

            const instance = wrapper.instance();
            setTimeout(() => {
                sandbox.mock(instance).expects('openOverlay');
            }, 310); // default timeout is 300ms

            instance.handleButtonHover(event);
        });

        test('should not call openOverlay() when props.openOnHover is false', () => {
            const event = {};
            const wrapper = renderWrapper({ openOnHover: false });

            const instance = wrapper.instance();
            setTimeout(() => {
                sandbox.mock(instance).expects('openOverlay').never();
            }, 310); // default timeout is 300ms

            instance.handleButtonHover(event);
        });

        test('should be able to set custom timeouts for the openOnHover', () => {
            const timeout = 100;
            const wrapper = renderWrapper({ openOnHover: false, openOnHoverDebounceTimeout: timeout });

            const instance = wrapper.instance();
            setTimeout(() => {
                sandbox.mock(instance).expects('openOverlay').never();
            }, timeout - 10);

            setTimeout(() => {
                sandbox.mock(instance).expects('openOverlay');
            }, timeout + 10);

            instance.handleButtonHover({});
        });
    });

    describe('handleButtonHoverLeave()', () => {
        test('should call closeOverlay', () => {
            const wrapper = renderWrapper({ openOnHover: false });

            const instance = wrapper.instance();

            setTimeout(() => {
                sandbox.mock(instance).expects('closeOverlay');
            }, 310);

            instance.handleButtonHoverLeave({});
        });
    });

    describe('handleKeyPress()', () => {
        test('should call openOverlay() and focusButton() when enter key is pressed', () => {
            const wrapper = shallow(
                <Flyout>
                    <FakeButton />
                    <FakeOverlay />
                </Flyout>,
            );

            const instance = wrapper.instance();
            const openOverlaySpy = sandbox.spy(instance, 'openOverlay');
            const focusButtonSpy = sandbox.spy(instance, 'focusButton');

            const event = {
                key: 'Enter',
                preventDefault: sandbox.spy(),
            };

            instance.handleKeyPress(event);

            expect(openOverlaySpy.calledOnce).toBe(true);
            expect(focusButtonSpy.calledOnce).toBe(true);
            expect(event.preventDefault.calledOnce).toBe(true);
        });
    });

    describe('closeOverlay()', () => {
        [
            {
                currentIsVisible: true,
                isVisibleAfterOverlayClosed: false,
            },
            {
                currentIsVisible: false,
                isVisibleAfterOverlayClosed: false,
            },
        ].forEach(({ currentIsVisible, isVisibleAfterOverlayClosed }) => {
            test('should toggle isVisible state when called', () => {
                const wrapper = renderWrapper();
                const instance = wrapper.instance();
                const event = {
                    preventDefault: sandbox.stub(),
                };
                act(() => {
                    instance.setState({
                        isVisible: currentIsVisible,
                    });
                });
                act(() => {
                    instance.closeOverlay(event);
                });
                expect(instance.state.isVisible).toEqual(isVisibleAfterOverlayClosed);
            });
        });

        test('should call onClose when closeOverlay gets called', () => {
            const onClose = sandbox.mock();
            const wrapper = renderWrapper({ onClose });
            const instance = wrapper.instance();
            const event = {
                preventDefault: sandbox.stub(),
            };
            instance.closeOverlay(event);
        });
    });

    describe('openOverlay()', () => {
        [
            {
                currentIsVisible: true,
                isVisibleAfterOverlayOpened: true,
            },
            {
                currentIsVisible: false,
                isVisibleAfterOverlayOpened: true,
            },
        ].forEach(({ currentIsVisible, isVisibleAfterOverlayOpened }) => {
            test('should toggle isVisible state when called', () => {
                const wrapper = renderWrapper();
                const instance = wrapper.instance();
                const event = {
                    preventDefault: sandbox.stub(),
                };
                act(() => {
                    instance.setState({
                        isVisible: currentIsVisible,
                    });
                });
                act(() => {
                    instance.openOverlay(event);
                });
                expect(instance.state.isVisible).toEqual(isVisibleAfterOverlayOpened);
            });
        });

        test('should call onOpen when openOverlay gets called', () => {
            const onOpen = sandbox.mock();
            const wrapper = renderWrapper({ onOpen });
            const instance = wrapper.instance();
            const event = {
                preventDefault: sandbox.stub(),
            };
            instance.openOverlay(event);
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

        describe('focusButton()', () => {
            test('should focus the flyout button when called', () => {
                mountToBody(
                    <Flyout>
                        <FakeButton />
                        <FakeOverlay />
                    </Flyout>,
                );

                const instance = wrapper.instance();
                const overlayButtonEl = document.getElementById(instance.overlayButtonID);
                sandbox.mock(overlayButtonEl).expects('focus');

                instance.focusButton();
            });
        });

        describe('handleDocumentClickOrWindowBlur()', () => {
            [
                {
                    isInsideToggleButton: true,
                    isInsideOverlay: false,
                    isVisible: false,
                    closeOnClickOutside: false,
                    closeOnWindowBlur: false,
                    shouldCallCloseOverlay: false,
                },
                {
                    isInsideToggleButton: true,
                    isInsideOverlay: false,
                    isVisible: true,
                    closeOnClickOutside: false,
                    closeOnWindowBlur: false,
                    shouldCallCloseOverlay: false,
                },
                {
                    isInsideToggleButton: false,
                    isInsideOverlay: true,
                    isVisible: false,
                    closeOnClickOutside: false,
                    closeOnWindowBlur: false,
                    shouldCallCloseOverlay: false,
                },
                {
                    isInsideToggleButton: false,
                    isInsideOverlay: true,
                    isVisible: true,
                    closeOnClickOutside: false,
                    closeOnWindowBlur: false,
                    shouldCallCloseOverlay: false,
                },
                {
                    isInsideToggleButton: false,
                    isInsideOverlay: false,
                    isVisible: false,
                    closeOnClickOutside: false,
                    closeOnWindowBlur: false,
                    shouldCallCloseOverlay: false,
                },
                {
                    isInsideToggleButton: false,
                    isInsideOverlay: false,
                    isVisible: true,
                    closeOnClickOutside: false,
                    closeOnWindowBlur: false,
                    shouldCallCloseOverlay: false,
                },
                {
                    isInsideToggleButton: false,
                    isInsideOverlay: false,
                    isVisible: false,
                    closeOnClickOutside: false,
                    closeOnWindowBlur: false,
                    shouldCallCloseOverlay: false,
                },
                {
                    isInsideToggleButton: true,
                    isInsideOverlay: false,
                    isVisible: false,
                    closeOnClickOutside: true,
                    closeOnWindowBlur: false,
                    shouldCallCloseOverlay: false,
                },
                {
                    isInsideToggleButton: true,
                    isInsideOverlay: false,
                    isVisible: true,
                    closeOnClickOutside: true,
                    closeOnWindowBlur: false,
                    shouldCallCloseOverlay: false,
                },
                {
                    isInsideToggleButton: false,
                    isInsideOverlay: true,
                    isVisible: false,
                    closeOnClickOutside: true,
                    closeOnWindowBlur: false,
                    shouldCallCloseOverlay: false,
                },
                {
                    isInsideToggleButton: false,
                    isInsideOverlay: true,
                    isVisible: true,
                    closeOnClickOutside: true,
                    closeOnWindowBlur: false,
                    shouldCallCloseOverlay: false,
                },
                {
                    isInsideToggleButton: false,
                    isInsideOverlay: false,
                    isVisible: false,
                    closeOnClickOutside: true,
                    closeOnWindowBlur: false,
                    shouldCallCloseOverlay: false,
                },
                {
                    isInsideToggleButton: false,
                    isInsideOverlay: false,
                    isVisible: true,
                    closeOnClickOutside: true,
                    closeOnWindowBlur: false,
                    shouldCallCloseOverlay: true,
                },
                {
                    isInsideToggleButton: true,
                    isInsideOverlay: false,
                    isVisible: false,
                    closeOnClickOutside: false,
                    closeOnWindowBlur: true,
                    shouldCallCloseOverlay: false,
                },
                {
                    isInsideToggleButton: true,
                    isInsideOverlay: false,
                    isVisible: true,
                    closeOnClickOutside: false,
                    closeOnWindowBlur: true,
                    shouldCallCloseOverlay: false,
                },
                {
                    isInsideToggleButton: false,
                    isInsideOverlay: true,
                    isVisible: false,
                    closeOnClickOutside: false,
                    closeOnWindowBlur: true,
                    shouldCallCloseOverlay: false,
                },
                {
                    isInsideToggleButton: false,
                    isInsideOverlay: false,
                    isVisible: false,
                    closeOnClickOutside: false,
                    closeOnWindowBlur: true,
                    shouldCallCloseOverlay: false,
                },
                {
                    isInsideToggleButton: false,
                    isInsideOverlay: false,
                    isVisible: true,
                    closeOnClickOutside: false,
                    closeOnWindowBlur: true,
                    shouldCallCloseOverlay: true,
                },
            ].forEach(
                ({
                    isInsideToggleButton,
                    isInsideOverlay,
                    isVisible,
                    closeOnClickOutside,
                    closeOnWindowBlur,
                    shouldCallCloseOverlay,
                }) => {
                    test('should handle document click or window blur correctly', () => {
                        mountToBody(
                            <Flyout closeOnClickOutside={closeOnClickOutside} closeOnWindowBlur={closeOnWindowBlur}>
                                <FakeButton />
                                <FakeOverlay />
                            </Flyout>,
                        );

                        const instance = wrapper.instance();
                        const event = {};

                        act(() => {
                            instance.setState({
                                isVisible,
                            });
                        });

                        if (shouldCallCloseOverlay) {
                            sandbox.mock(instance).expects('closeOverlay');
                        } else {
                            sandbox.mock(instance).expects('closeOverlay').never();
                        }

                        if (isInsideToggleButton) {
                            event.target = document.getElementById(instance.overlayButtonID);
                        } else if (isInsideOverlay) {
                            event.target = document.getElementById(instance.overlayID);
                        } else {
                            event.target = document.createElement('div');
                        }

                        instance.handleDocumentClickOrWindowBlur(event);
                    });
                },
            );

            test('should not close overlay when event target is inside portaled classes element', () => {
                mountToBody(
                    <Flyout isVisibleByDefault portaledClasses={['fake', 'class']}>
                        <FakeButton />
                        <FakeOverlay />
                    </Flyout>,
                );
                const instance = wrapper.instance();
                const el = document.createElement('div');
                el.innerHTML = '<div class="class"><div class="target"></div></div>';

                sandbox.mock(instance).expects('closeOverlay').never();

                instance.handleDocumentClickOrWindowBlur({
                    target: el.querySelector('.target'),
                });
            });

            test('should close overlay when event target is not inside portaled classes element', () => {
                mountToBody(
                    <Flyout isVisibleByDefault portaledClasses={['fake', 'class']}>
                        <FakeButton />
                        <FakeOverlay />
                    </Flyout>,
                );
                const instance = wrapper.instance();

                sandbox.mock(instance).expects('closeOverlay');

                instance.handleDocumentClickOrWindowBlur({
                    target: document.createElement('div'),
                });
            });
        });
    });

    describe('componentDidUpdate()', () => {
        [
            {
                prevIsVisible: true,
                currIsVisible: true,
                shouldAddEventListener: false,
                shouldRemoveEventListener: false,
            },
            {
                prevIsVisible: false,
                currIsVisible: false,
                shouldAddEventListener: false,
                shouldRemoveEventListener: false,
            },
            {
                prevIsVisible: true,
                currIsVisible: false,
                shouldAddEventListener: false,
                shouldRemoveEventListener: true,
            },
            {
                prevIsVisible: false,
                currIsVisible: true,
                shouldAddEventListener: true,
                shouldRemoveEventListener: false,
            },
        ].forEach(({ prevIsVisible, currIsVisible, shouldAddEventListener, shouldRemoveEventListener }) => {
            test('should remove and add event listeners properly', () => {
                const wrapper = renderWrapper({ isVisibleByDefault: prevIsVisible });
                const instance = wrapper.instance();
                const documentMock = sandbox.mock(document);

                if (shouldAddEventListener) {
                    documentMock.expects('addEventListener').withArgs('click');
                    documentMock.expects('addEventListener').withArgs('contextmenu');
                    documentMock.expects('removeEventListener').never();
                } else if (shouldRemoveEventListener) {
                    documentMock.expects('removeEventListener').withArgs('click');
                    documentMock.expects('removeEventListener').withArgs('contextmenu');
                    documentMock.expects('addEventListener').never();
                }

                act(() => {
                    instance.setState({
                        isVisible: currIsVisible,
                    });
                });
            });
        });
    });

    describe('componentWillUnmount()', () => {
        [
            {
                isVisible: true,
                shouldRemoveEventListener: true,
            },
            {
                isVisible: false,
                shouldRemoveEventListener: false,
            },
        ].forEach(({ isVisible, shouldRemoveEventListener }) => {
            test('should remove event listeners only when the overlay is visible', () => {
                const wrapper = renderWrapper();
                const instance = wrapper.instance();
                const documentMock = sandbox.mock(document);

                act(() => {
                    instance.setState({
                        isVisible,
                    });
                });

                if (shouldRemoveEventListener) {
                    documentMock.expects('removeEventListener').withArgs('click');
                    documentMock.expects('removeEventListener').withArgs('contextmenu');
                } else {
                    documentMock.expects('removeEventListener').never();
                }

                wrapper.unmount();
            });
        });
    });

    describe('handleOverlayClose()', () => {
        test('should call focusButton() and closeOverlay() when called', () => {
            const wrapper = renderWrapper();
            const instance = wrapper.instance();

            sandbox.mock(instance).expects('focusButton');
            sandbox.mock(instance).expects('closeOverlay');

            instance.handleOverlayClose();
        });
    });

    describe('isResponsive', () => {
        test('should have correct className when isResponsive is true', () => {
            const wrapper = renderWrapper({ isResponsive: true });

            const tetherComponent = wrapper.find(TetherComponent);
            expect(tetherComponent.prop('classes')).toEqual({
                element: `flyout-overlay bdl-Flyout--responsive`,
            });
        });
    });
});
