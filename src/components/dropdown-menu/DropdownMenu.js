// @flow
import * as React from 'react';
import TetherComponent from 'react-tether';
import classNames from 'classnames';
import noop from 'lodash/noop';
import uniqueId from 'lodash/uniqueId';

import { KEYS } from '../../constants';
import './DropdownMenu.scss';

type Props = {
    bodyElement?: HTMLElement,
    children: React.Node,
    /** Forces menu to render within the scroll parent */
    className?: string,
    /** Forces menu to render within the visible window */
    constrainToScrollParent: boolean,
    /** Right aligns menu to button */
    constrainToWindow: boolean,
    /** Forces menu to render within the visible window and pins the dropdown if scrolled */
    constrainToWindowWithPin?: boolean,
    /** Enables responsive behaviors for this component */
    isResponsive?: boolean,
    /** Function called when menu is opened */
    isRightAligned: boolean,
    /** Handler for dropdown menu close events */
    onMenuClose?: (event: SyntheticEvent<> | MouseEvent) => void,
    /** Handler for dropdown menu open events */
    onMenuOpen?: () => void,
    /** Optional class name for the target wrapper element */
    targetWrapperClassName?: string,
    /** "attachment" prop for the TetherComponent, will overwrite the default settings and ignore isRightAligned option */
    tetherAttachment?: string,
    /** "targetAttachment" prop for the TetherComponent, will overwrite the default settings and ignore isRightAligned option */
    tetherTargetAttachment?: string,
    /** Set true to close dropdown menu on event bubble instead of event capture */
    useBubble?: boolean,
};

type State = {
    initialFocusIndex: ?number,
    isOpen: boolean,
};

class DropdownMenu extends React.Component<Props, State> {
    static defaultProps = {
        constrainToScrollParent: false,
        constrainToWindow: false,
        isResponsive: false,
        isRightAligned: false,
    };

    menuID: string = uniqueId('menu');

    menuButtonID: string = uniqueId('menubutton');

    state = {
        initialFocusIndex: null,
        isOpen: false,
    };

    componentDidUpdate(prevProps: Props, prevState: State) {
        const { useBubble } = this.props;
        if (!prevState.isOpen && this.state.isOpen) {
            // When menu is being opened
            document.addEventListener('click', this.handleDocumentClick, !useBubble);
            document.addEventListener('contextmenu', this.handleDocumentClick, !useBubble);

            const { onMenuOpen } = this.props;
            if (onMenuOpen) {
                onMenuOpen();
            }
        } else if (prevState.isOpen && !this.state.isOpen) {
            // When menu is being closed
            document.removeEventListener('contextmenu', this.handleDocumentClick, !useBubble);
            document.removeEventListener('click', this.handleDocumentClick, !useBubble);
        }
    }

    componentWillUnmount() {
        const { useBubble } = this.props;
        if (this.state.isOpen) {
            // Clean-up global click handlers
            document.removeEventListener('contextmenu', this.handleDocumentClick, !useBubble);
            document.removeEventListener('click', this.handleDocumentClick, !useBubble);
        }
    }

    openMenuAndSetFocusIndex = (initialFocusIndex: ?number) => {
        this.setState({
            initialFocusIndex,
            isOpen: true,
        });
    };

    closeMenu = (event: SyntheticEvent<> | MouseEvent) => {
        const { onMenuClose = noop } = this.props;
        this.setState(
            {
                isOpen: false,
            },
            () => onMenuClose(event),
        );
    };

    focusButton = () => {
        // @NOTE: This breaks encapsulation a bit, but the only other way is passing ref functions to unknown children components
        const menuButtonEl = document.getElementById(this.menuButtonID);
        if (menuButtonEl) {
            menuButtonEl.focus();
        }
    };

    handleButtonClick = (event: SyntheticEvent<>) => {
        const { isOpen } = this.state;

        event.stopPropagation();
        event.preventDefault();

        if (isOpen) {
            this.closeMenu(event);
        } else {
            this.openMenuAndSetFocusIndex(null);
        }
    };

    handleButtonKeyDown = (event: SyntheticKeyboardEvent<>) => {
        const { isOpen } = this.state;

        switch (event.key) {
            case KEYS.space:
            case KEYS.enter:
            case KEYS.arrowDown:
                event.stopPropagation();
                event.preventDefault();

                this.openMenuAndSetFocusIndex(0);
                break;

            case KEYS.arrowUp:
                event.stopPropagation();
                event.preventDefault();

                this.openMenuAndSetFocusIndex(-1);
                break;

            case KEYS.escape:
                if (isOpen) {
                    event.stopPropagation();
                }

                event.preventDefault();
                this.closeMenu(event);
                break;

            default:
                break;
        }
    };

    handleMenuClose = (isKeyboardEvent: boolean, event: SyntheticEvent<> | MouseEvent) => {
        this.closeMenu(event);
        this.focusButton();
    };

    handleDocumentClick = (event: MouseEvent) => {
        const menuEl = document.getElementById(this.menuID);
        const menuButtonEl = document.getElementById(this.menuButtonID);

        // Some DOM magic to get global click handlers to close menu when not interacting with menu or associated button
        if (
            menuEl &&
            menuButtonEl &&
            event.target instanceof Node &&
            !menuEl.contains(event.target) &&
            !menuButtonEl.contains(event.target)
        ) {
            this.closeMenu(event);
        }
    };

    render() {
        const {
            bodyElement,
            children,
            className,
            constrainToScrollParent,
            constrainToWindow,
            constrainToWindowWithPin,
            isResponsive,
            isRightAligned,
            targetWrapperClassName,
            tetherAttachment,
            tetherTargetAttachment,
        } = this.props;

        const { isOpen, initialFocusIndex } = this.state;

        const elements = React.Children.toArray(children);

        if (elements.length !== 2) {
            throw new Error('DropdownMenu must have exactly two children: A button component and a <Menu>');
        }

        const menuButton = elements[0];
        const menu = elements[1];

        const menuButtonProps: Object = {
            id: this.menuButtonID,
            key: this.menuButtonID,
            onClick: this.handleButtonClick, // NOTE: Overrides button's handler
            onKeyDown: this.handleButtonKeyDown, // NOTE: Overrides button's handler
            'aria-expanded': isOpen ? 'true' : 'false',
        };

        if (menuButton.props['aria-haspopup'] === undefined) {
            menuButtonProps['aria-haspopup'] = 'true';
        }

        // Add this only when its open, otherwise the menuID element isn't rendered
        if (isOpen) {
            menuButtonProps['aria-controls'] = this.menuID;
        }

        const menuProps = {
            id: this.menuID,
            key: this.menuID,
            initialFocusIndex,
            onClose: this.handleMenuClose,
            'aria-labelledby': this.menuButtonID,
        };

        let attachment = 'top left';
        let targetAttachment = 'bottom left';

        if (isRightAligned) {
            attachment = 'top right';
            targetAttachment = 'bottom right';
        }

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

        const bodyEl = bodyElement instanceof HTMLElement ? bodyElement : document.body;

        return (
            <TetherComponent
                attachment={tetherAttachment || attachment}
                className={classNames({ 'bdl-DropdownMenu--responsive': isResponsive }, className)}
                classPrefix="dropdown-menu"
                constraints={constraints}
                enabled={isOpen}
                renderElementTo={bodyEl}
                targetAttachment={tetherTargetAttachment || targetAttachment}
                renderTarget={ref => (
                    <div ref={ref} className={classNames('bdl-DropdownMenu-target', targetWrapperClassName)}>
                        {React.cloneElement(menuButton, menuButtonProps)}
                    </div>
                )}
                renderElement={ref => {
                    return isOpen ? (
                        <div ref={ref} className="bdl-DropdownMenu-element">
                            {React.cloneElement(menu, menuProps)}
                        </div>
                    ) : null;
                }}
            />
        );
    }
}

export default DropdownMenu;
