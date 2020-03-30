// @flow
import * as React from 'react';
import TetherComponent from 'react-tether';
import uniqueId from 'lodash/uniqueId';
import noop from 'lodash/noop';

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
    /** Function called when menu is opened */
    isRightAligned: boolean,
    /** Handler for dropdown menu close events */
    onMenuClose?: (event: SyntheticEvent<> | MouseEvent) => void,
    /** Handler for dropdown menu open events */
    onMenuOpen?: () => void,
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
        isRightAligned: false,
    };

    menuID = uniqueId('menu');

    menuButtonID = uniqueId('menubutton');

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

    menuID: string;

    menuButtonID: string;

    openMenuAndSetFocusIndex = (initialFocusIndex: ?number) => {
        this.setState({
            initialFocusIndex,
            isOpen: true,
        });
    };

    closeMenu = () => {
        this.setState({
            isOpen: false,
        });
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
            this.closeMenu();
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
                this.closeMenu();
                break;

            default:
                break;
        }
    };

    handleMenuClose = (isKeyboardEvent: boolean, event: SyntheticEvent<> | MouseEvent) => {
        const { onMenuClose = noop } = this.props;
        this.closeMenu();
        this.focusButton();
        onMenuClose(event);
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
            const { onMenuClose = noop } = this.props;
            this.closeMenu();
            onMenuClose(event);
        }
    };

    render() {
        const {
            bodyElement,
            children,
            isRightAligned,
            constrainToScrollParent,
            constrainToWindow,
            className,
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
            'aria-haspopup': 'true',
            'aria-expanded': isOpen ? 'true' : 'false',
        };

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

        const bodyEl = bodyElement instanceof HTMLElement ? bodyElement : document.body;

        return (
            <TetherComponent
                attachment={attachment}
                bodyElement={bodyEl}
                className={className}
                classPrefix="dropdown-menu"
                constraints={constraints}
                enabled={isOpen}
                targetAttachment={targetAttachment}
            >
                {React.cloneElement(menuButton, menuButtonProps)}
                {isOpen ? React.cloneElement(menu, menuProps) : null}
            </TetherComponent>
        );
    }
}

export default DropdownMenu;
