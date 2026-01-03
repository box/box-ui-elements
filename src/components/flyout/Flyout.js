// @flow
import * as React from 'react';
import classNames from 'classnames';
import TetherComponent from 'react-tether';
import uniqueId from 'lodash/uniqueId';
import { KEYS } from '../../constants';

import FlyoutContext from './FlyoutContext';

import './Flyout.scss';

const BOTTOM_CENTER = 'bottom-center';
const BOTTOM_LEFT = 'bottom-left';
const BOTTOM_RIGHT = 'bottom-right';
const MIDDLE_LEFT = 'middle-left';
const MIDDLE_RIGHT = 'middle-right';
const TOP_CENTER = 'top-center';
const TOP_LEFT = 'top-left';
const TOP_RIGHT = 'top-right';

const positions = {
    [BOTTOM_CENTER]: {
        attachment: 'top center',
        targetAttachment: 'bottom center',
    },
    [BOTTOM_LEFT]: {
        attachment: 'top right',
        targetAttachment: 'bottom right',
    },
    [BOTTOM_RIGHT]: {
        attachment: 'top left',
        targetAttachment: 'bottom left',
    },
    [MIDDLE_LEFT]: {
        attachment: 'middle right',
        targetAttachment: 'middle left',
    },
    [MIDDLE_RIGHT]: {
        attachment: 'middle left',
        targetAttachment: 'middle right',
    },
    [TOP_CENTER]: {
        attachment: 'bottom center',
        targetAttachment: 'top center',
    },
    [TOP_LEFT]: {
        attachment: 'bottom right',
        targetAttachment: 'top right',
    },
    [TOP_RIGHT]: {
        attachment: 'bottom left',
        targetAttachment: 'top left',
    },
};

const OVERLAY_ROLE = 'dialog';

/**
 * Checks if there is a clickable ancestor or self
 * @param {Node} rootNode The base node we should stop at
 * @param {Node} targetNode The target node of the event
 * @returns {boolean}
 */
const hasClickableAncestor = (rootNode, targetNode) => {
    // Check if the element or any of the ancestors are click-able (stopping at the component boundary)
    let currentNode = targetNode;
    while (currentNode && currentNode instanceof Node && currentNode.parentNode && currentNode !== rootNode) {
        const nodeName = currentNode.nodeName.toUpperCase();
        if (nodeName === 'A' || nodeName === 'BUTTON') {
            return true;
        }
        currentNode = currentNode.parentNode;
    }
    return false;
};

/**
 * Checks if the target element is inside an element with the given CSS class.
 * @param {HTMLElement} targetEl The target element
 * @param {string} className A CSS class on the element to check for
 */
const hasClassAncestor = (targetEl, className) => {
    let el = targetEl;
    while (el && el instanceof HTMLElement) {
        if (el.classList.contains(className)) {
            return true;
        }
        el = el.parentNode;
    }
    return false;
};

export type FlyoutProps = {
    children: React.Node,
    /**
     * Set className to the overlay wrapper
     */
    className?: string,
    /**
     * If set to true, closes the overlay on clicking buttons/links inside
     * of it
     */
    closeOnClick?: boolean,
    /**
     * If set to true, closes the overlay on clicking outside of it
     */
    closeOnClickOutside?: boolean,
    /**
     * Function that will interrogate the click event to determine whether or not to close the overlay if closeOnClick is enabled
     */
    closeOnClickPredicate?: Function,
    /**
     * If set to true, closes the overlay when window loses focus
     */
    closeOnWindowBlur?: boolean,
    /**
     * Sets tether constrain to scrollParent
     */
    constrainToScrollParent?: boolean,
    /**
     * Sets tether constrain to window
     */
    constrainToWindow?: boolean,
    /**
     * Sets tether constrain to window with pin
     */
    constrainToWindowWithPin?: boolean,
    /**
     * Toggles responsive behavior
     */
    isResponsive?: boolean,
    /**
     * Whether overlay should be visible by default
     */
    isVisibleByDefault: boolean,
    /**
     * Will fire this callback when the flyout should open
     */
    offset?: string,
    /**
     * Will fire this callback when the flyout should close
     */
    onClose?: Function,
    /**
     * Adjusts placement of the overlay (SEE http://tether.io/#options)
     */
    onOpen?: Function,
    /**
     * Whether overlay should open on hover
     */
    openOnHover?: boolean,
    /**
     * Time in milliseconds that the button should wait before opening and closing the flyout
     */
    openOnHoverDelayTimeout?: number,
    /** An array of CSS classes for portaled elements in the overlay, used to check whether a click is inside the overlay */
    portaledClasses: Array<string>,
    /**
     * Position of the overlay
     */
    position:
        | 'bottom-center'
        | 'bottom-left'
        | 'bottom-right'
        | 'middle-left'
        | 'middle-right'
        | 'top-center'
        | 'top-left'
        | 'top-right',
    /**
     * Prop whether to focus first focusable element or not
     */
    shouldDefaultFocus?: boolean,
};

type State = {
    isButtonClicked: boolean,
    isVisible: boolean,
};

type Props = FlyoutProps;

class Flyout extends React.Component<Props, State> {
    static defaultProps = {
        className: '',
        closeOnClick: true,
        closeOnClickOutside: true,
        closeOnWindowBlur: false,
        constrainToScrollParent: true,
        constrainToWindow: false,
        isResponsive: false,
        isVisibleByDefault: false,
        openOnHover: false,
        openOnHoverDelayTimeout: 300,
        portaledClasses: [],
        position: BOTTOM_RIGHT,
    };

    constructor(props: Props) {
        super(props);

        this.overlayID = uniqueId('overlay');
        this.overlayButtonID = uniqueId('flyoutbutton');
        this.state = {
            isVisible: props.isVisibleByDefault,
            isButtonClicked: false,
        };
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (!prevState.isVisible && this.state.isVisible) {
            const { closeOnClickOutside, closeOnWindowBlur } = this.props;
            // When overlay is being opened
            if (closeOnClickOutside) {
                document.addEventListener('click', this.handleDocumentClickOrWindowBlur, true);
                document.addEventListener('contextmenu', this.handleDocumentClickOrWindowBlur, true);
            }
            if (closeOnWindowBlur) {
                window.addEventListener('blur', this.handleDocumentClickOrWindowBlur, true);
            }
        } else if (prevState.isVisible && !this.state.isVisible) {
            // When overlay is being closed
            document.removeEventListener('contextmenu', this.handleDocumentClickOrWindowBlur, true);
            document.removeEventListener('click', this.handleDocumentClickOrWindowBlur, true);
            window.removeEventListener('blur', this.handleDocumentClickOrWindowBlur, true);
        }
    }

    componentWillUnmount() {
        if (this.state.isVisible) {
            // Clean-up global click handlers
            document.removeEventListener('contextmenu', this.handleDocumentClickOrWindowBlur, true);
            document.removeEventListener('click', this.handleDocumentClickOrWindowBlur, true);
            window.removeEventListener('blur', this.handleDocumentClickOrWindowBlur, true);
        }

        if (this.props.openOnHover && this.hoverDelay) {
            clearTimeout(this.hoverDelay);
        }
    }

    overlayButtonID: string;

    overlayID: string;

    handleOverlayClick = (event: SyntheticEvent<>) => {
        const overlayNode = document.getElementById(this.overlayID);
        const { closeOnClick, closeOnClickPredicate } = this.props;
        if (!closeOnClick || !hasClickableAncestor(overlayNode, event.target)) {
            return;
        }
        if (closeOnClickPredicate && !closeOnClickPredicate(event)) {
            return;
        }

        this.handleOverlayClose();
    };

    handleButtonClick = (event: SyntheticUIEvent<>) => {
        const { isVisible } = this.state;
        if (isVisible) {
            this.closeOverlay();
        } else {
            this.openOverlay();
        }

        // In at least one place, .click() is called programmatically
        //     src/features/presence/Presence.js
        // In the programmatic case, the event is not supposed to trigger
        // autofocus of the content (TBD if this is truly correct behavior).
        // This line was using "event.detail > 0"
        // to detect if a click event was from a user, but that made keyboard
        // triggers of the button click behave differently than the mouse.
        // So, we use "isTrusted" instead. Note: React polyfills for IE11.
        // https://developer.mozilla.org/en-US/docs/Web/API/Event/isTrusted
        // https://reactjs.org/docs/events.html

        const isButtonClicked = event.isTrusted;

        this.setState({ isButtonClicked });

        event.preventDefault();
    };

    hoverDelay: TimeoutID | void;

    handleButtonHover = () => {
        const { openOnHover, openOnHoverDelayTimeout } = this.props;
        if (openOnHover) {
            clearTimeout(this.hoverDelay);
            this.hoverDelay = setTimeout(() => {
                this.openOverlay();
            }, openOnHoverDelayTimeout);
        }
    };

    handleButtonHoverLeave = () => {
        const { openOnHover, openOnHoverDelayTimeout } = this.props;
        if (openOnHover) {
            clearTimeout(this.hoverDelay);

            this.hoverDelay = setTimeout(() => {
                this.closeOverlay();
            }, openOnHoverDelayTimeout);
        }
    };

    handleKeyPress = (event: SyntheticKeyboardEvent<>) => {
        if (event.key === KEYS.enter) {
            event.preventDefault();
            this.openOverlay();
            this.focusButton();
        }
    };

    openOverlay = () => {
        this.setState({
            isVisible: true,
        });

        const { onOpen } = this.props;
        if (onOpen) {
            onOpen();
        }
    };

    closeOverlay = () => {
        this.setState({
            isVisible: false,
        });

        const { onClose } = this.props;
        if (onClose) {
            onClose();
        }
    };

    focusButton = () => {
        const buttonEl = document.getElementById(this.overlayButtonID);
        if (buttonEl) {
            buttonEl.focus();
        }
    };

    handleOverlayClose = () => {
        this.focusButton();
        this.closeOverlay();
    };

    handleDocumentClickOrWindowBlur = (event: MouseEvent | FocusEvent) => {
        const { portaledClasses, closeOnClickOutside, closeOnWindowBlur } = this.props;
        const { isVisible } = this.state;

        if (!isVisible || !(closeOnClickOutside || closeOnWindowBlur)) {
            return;
        }

        const overlayNode = document.getElementById(this.overlayID);
        const buttonNode = document.getElementById(this.overlayButtonID);

        const isInsideToggleButton =
            (buttonNode && event.target instanceof Node && buttonNode.contains(event.target)) ||
            buttonNode === event.target;
        const isInsideOverlay =
            (overlayNode && event.target instanceof Node && overlayNode.contains(event.target)) ||
            overlayNode === event.target;
        const isInside = isInsideToggleButton || isInsideOverlay;

        if (isInside || portaledClasses.some(className => hasClassAncestor(event.target, className))) {
            return;
        }

        // Only close overlay when the click is outside of the flyout or window loses focus
        this.closeOverlay();
    };

    render() {
        const {
            children,
            className = '',
            constrainToScrollParent,
            constrainToWindow,
            constrainToWindowWithPin,
            isResponsive,
            offset,
            openOnHover,
            position,
            shouldDefaultFocus,
        } = this.props;
        const { isButtonClicked, isVisible } = this.state;
        const elements = React.Children.toArray(children);
        const tetherPosition = positions[position];

        if (elements.length !== 2) {
            throw new Error('Flyout must have exactly two children: A button component and a <Overlay>');
        }

        const overlayButton = elements[0];
        const overlayContent = elements[1];

        const overlayButtonProps: Object = {
            id: this.overlayButtonID,
            key: this.overlayButtonID,
            onClick: this.handleButtonClick,
            onKeyPress: this.handleKeyPress,
            onMouseEnter: this.handleButtonHover,
            onMouseLeave: this.handleButtonHoverLeave,
            role: 'button',
            tabIndex: '0',
            'aria-haspopup': OVERLAY_ROLE,
            'aria-expanded': isVisible ? 'true' : 'false',
        };

        if (isVisible) {
            overlayButtonProps['aria-controls'] = this.overlayID;
        }

        const overlayProps = {
            id: this.overlayID,
            key: this.overlayID,
            role: OVERLAY_ROLE,
            onClick: this.handleOverlayClick,
            onClose: this.handleOverlayClose,
            onMouseEnter: this.handleButtonHover,
            onMouseLeave: this.handleButtonHoverLeave,
            shouldDefaultFocus: shouldDefaultFocus || (!isButtonClicked && !openOnHover),
            'aria-labelledby': this.overlayButtonID,
        };

        const constraints = [];

        if (constrainToScrollParent) {
            constraints.push({
                to: 'scrollParent',
                attachment: 'together',
            });
        }

        if (constrainToWindow) {
            constraints.push({
                to: 'window',
                attachment: 'together',
            });
        }

        if (constrainToWindowWithPin) {
            constraints.push({
                to: 'window',
                attachment: 'together',
                pin: true,
            });
        }

        const tetherProps: Object = {
            classPrefix: 'flyout-overlay',
            attachment: tetherPosition.attachment,
            targetAttachment: tetherPosition.targetAttachment,
            enabled: isVisible,
            classes: {
                element: classNames('flyout-overlay', { 'bdl-Flyout--responsive': isResponsive }, className),
            },
            constraints,
        };

        if (offset) {
            tetherProps.offset = offset;
        } else {
            switch (position) {
                case BOTTOM_CENTER:
                case BOTTOM_LEFT:
                case BOTTOM_RIGHT:
                    tetherProps.offset = '-10px 0';
                    break;
                case TOP_CENTER:
                case TOP_LEFT:
                case TOP_RIGHT:
                    tetherProps.offset = '10px 0';
                    break;
                case MIDDLE_LEFT:
                    tetherProps.offset = '0 10px';
                    break;
                case MIDDLE_RIGHT:
                    tetherProps.offset = '0 -10px';
                    break;
                default:
                // no default
            }
        }

        return (
            <TetherComponent
                {...tetherProps}
                renderTarget={ref => (
                    <div ref={ref} className="bdl-Flyout-target">
                        {React.cloneElement(overlayButton, overlayButtonProps)}
                    </div>
                )}
                renderElement={ref => {
                    return isVisible ? (
                        <div ref={ref} className="bdl-Flyout-element">
                            <FlyoutContext.Provider value={{ closeOverlay: this.closeOverlay }}>
                                {React.cloneElement(overlayContent, overlayProps)}
                            </FlyoutContext.Provider>
                        </div>
                    ) : null;
                }}
            />
        );
    }
}

export default Flyout;
