import * as React from 'react';
import TetherComponent from 'react-tether';
import uniqueId from 'lodash/uniqueId';
import noop from 'lodash/noop';

import { KEYS } from '../../constants';
import './DropdownMenu.scss';

export interface DropdownMenuProps {
    bodyElement?: HTMLElement;
    children: React.ReactNode;
    /** Forces menu to render within the scroll parent */
    className?: string;
    /** Forces menu to render within the visible window */
    constrainToScrollParent: boolean;
    /** Right aligns menu to button */
    constrainToWindow: boolean;
    /** Function called when menu is opened */
    isRightAligned: boolean;
    /** Handler for dropdown menu close events */
    onMenuClose?: (event: React.SyntheticEvent | MouseEvent) => void;
    /** Handler for dropdown menu open events */
    onMenuOpen?: () => void;
    /** Set true to close dropdown menu on event bubble instead of event capture */
    useBubble?: boolean;
}

export interface DropdownMenuState {
    initialFocusIndex: number | null | undefined;
    isOpen: boolean;
}

export interface MenuButtonProps {
    id?: string;
    key?: string;
    onClick?: (event: React.SyntheticEvent | MouseEvent) => void;
    onKeyDown?: (event: React.KeyboardEvent) => void;
    'aria-controls'?: string;
    'aria-expanded'?: boolean | 'false' | 'true';
    'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
}

export interface MenuProps {
    id?: string;
    key?: string;
    initialFocusIndex?: number | null | undefined;
    onClose?: (isKeyboardEvent: boolean, event: React.SyntheticEvent | MouseEvent) => void;
    'aria-labelledby'?: string;
}

class DropdownMenu extends React.Component<DropdownMenuProps, DropdownMenuState> {
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

    componentDidUpdate(prevProps: DropdownMenuProps, prevState: DropdownMenuState) {
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

    openMenuAndSetFocusIndex = (initialFocusIndex?: number | null) => {
        this.setState({
            initialFocusIndex,
            isOpen: true,
        });
    };

    closeMenu = (event: React.SyntheticEvent | MouseEvent) => {
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

    handleButtonClick = (event: React.SyntheticEvent | MouseEvent) => {
        const { isOpen } = this.state;

        event.stopPropagation();
        event.preventDefault();

        if (isOpen) {
            this.closeMenu(event);
        } else {
            this.openMenuAndSetFocusIndex(null);
        }
    };

    handleButtonKeyDown = (event: React.KeyboardEvent) => {
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

    handleMenuClose = (isKeyboardEvent: boolean, event: React.SyntheticEvent | MouseEvent) => {
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

        const menuButton = elements[0] as React.ReactElement<MenuButtonProps>;
        const menu = elements[1] as React.ReactElement<MenuProps>;

        const menuButtonProps: MenuButtonProps = {
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

        const menuProps: MenuProps = {
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

        const constraints: Array<{
            attachment: string;
            to: string;
        }> = [];

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
                // @ts-ignore attachment is missing in TetherComponent types
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
