/**
 * @flow
 * @file Loading Indicator component
 * @author Box
 */

import React, { Children, cloneElement, PureComponent } from 'react';
import TetherComponent from 'react-tether';
import uniqueId from 'lodash.uniqueid';
import './DropdownMenu.scss';

type Props = {
    children: any,
    constrainToScrollParent: boolean,
    constrainToWindow: boolean,
    isRightAligned: boolean,
    bodyElement: string | HTMLElement
};

type DefaultProps = {|
    constrainToScrollParent: boolean,
    constrainToWindow: boolean,
    isRightAligned: boolean
|};

type State = {
    initialFocusIndex: number,
    isOpen: boolean
};

class DropdownMenu extends PureComponent<DefaultProps, Props, State> {
    props: Props;
    state: State;
    menuId: string;
    menuButtonId: string;
    state = {
        initialFocusIndex: 0,
        isOpen: false
    };

    static defaultProps = {
        constrainToScrollParent: false,
        constrainToWindow: false,
        isRightAligned: false
    };

    /**
     * Mount handler
     *
     * @private
     * @return {void}
     */
    componentWillMount() {
        this.menuId = uniqueId('buik_menu');
        this.menuButtonId = uniqueId('buik_menubutton');
    }

    /**
     * Update handler
     *
     * @private
     * @return {void}
     */
    componentDidUpdate(prevProps: Props, prevState: State) {
        if (!prevState.isOpen && this.state.isOpen) {
            // When menu is being opened
            document.addEventListener('click', this.handleDocumentClick, true);
            document.addEventListener('contextmenu', this.handleDocumentClick, true);
        } else if (prevState.isOpen && !this.state.isOpen) {
            // When menu is being closed
            this.removeEventListeners();
        }
    }

    /**
     * Unmount handler
     *
     * @private
     * @return {void}
     */
    componentWillUnmount() {
        if (this.state.isOpen) {
            this.removeEventListeners();
        }
    }

    /**
     * Removes event listeners
     *
     * @private
     * @return {void}
     */
    removeEventListeners() {
        document.removeEventListener('contextmenu', this.handleDocumentClick, true);
        document.removeEventListener('click', this.handleDocumentClick, true);
    }

    /**
     * Opens the menu
     *
     * @private
     * @return {void}
     */
    openMenuAndSetFocusIndex(initialFocusIndex: number) {
        this.setState({
            initialFocusIndex,
            isOpen: true
        });
    }

    /**
     * Closes the menu
     *
     * @private
     * @return {void}
     */
    closeMenu() {
        this.setState({
            isOpen: false
        });
    }

    /**
     * Menu button click handler
     *
     * @private
     * @return {void}
     */
    focusButton() {
        // This breaks encapsulation a bit, but the only
        // other way is passing ref functions to unknown children components
        const menuButtonEl: HTMLElement | null = document.getElementById(this.menuButtonId);
        if (menuButtonEl) {
            menuButtonEl.focus();
        }
    }

    /**
     * Menu button click handler
     *
     * @private
     * @return {void}
     */
    handleButtonClick = (event: Event) => {
        const { isOpen }: State = this.state;

        event.stopPropagation();
        event.preventDefault();

        if (isOpen) {
            this.closeMenu();
        } else {
            this.openMenuAndSetFocusIndex(0);
        }
    };

    /**
     * Keyboard handler
     *
     * @private
     * @return {void}
     */
    handleButtonKeyDown = (event: Event & { key: string }) => {
        switch (event.key) {
            case ' ': // Spacebar
            case 'Enter':
            case 'ArrowDown':
                event.stopPropagation();
                event.preventDefault();

                this.openMenuAndSetFocusIndex(0);
                break;

            case 'ArrowUp':
                event.stopPropagation();
                event.preventDefault();

                this.openMenuAndSetFocusIndex(-1);
                break;

            default:
                break;
        }
    };

    /**
     * Closes the menu and focuses the menu button
     *
     * @private
     * @return {void}
     */
    handleMenuClose = () => {
        this.closeMenu();
        this.focusButton();
    };

    /**
     * Closes the menu when clicked outside
     *
     * @private
     * @return {void}
     */
    handleDocumentClick = ({ target }: { target: any }) => {
        const menuEl = document.getElementById(this.menuId);
        const menuButtonEl = document.getElementById(this.menuButtonId);

        // Some DOM magic to get global click handlers to close menu when not interacting with menu or associated button
        if (menuEl && menuButtonEl && !menuEl.contains(target) && !menuButtonEl.contains(target)) {
            this.closeMenu();
        }
    };

    /**
     * Renders the component
     *
     * @private
     * @return {Element}
     */
    render() {
        const { children, isRightAligned, constrainToScrollParent, constrainToWindow, bodyElement }: Props = this.props;
        const { isOpen, initialFocusIndex }: State = this.state;
        const elements = Children.toArray(children);

        if (elements.length !== 2) {
            throw new Error('DropdownMenu must have exactly two children: A button component and a <Menu>');
        }

        const menuButton = elements[0];
        const menu = elements[1];

        const menuButtonProps: any = {
            id: this.menuButtonId,
            key: this.menuButtonId,
            onClick: this.handleButtonClick, // NOTE: Overrides button's handler
            onKeyDown: this.handleButtonKeyDown, // NOTE: Overrides button's handler
            'aria-haspopup': 'true',
            'aria-expanded': isOpen ? 'true' : 'false'
        };

        // Add this only when its open, otherwise the menuId element isn't rendered
        if (isOpen) {
            menuButtonProps['aria-controls'] = this.menuId;
        }

        const menuProps = {
            id: this.menuId,
            key: this.menuId,
            initialFocusIndex,
            onClose: this.handleMenuClose,
            'aria-labelledby': this.menuButtonId
        };

        let attachment: string = 'top left';
        let targetAttachment: string = 'bottom left';

        if (isRightAligned) {
            attachment = 'top right';
            targetAttachment = 'bottom right';
        }

        const constraints = [];

        if (constrainToScrollParent) {
            constraints.push({
                to: 'scrollParent',
                attachment: 'together'
            });
        }

        if (constrainToWindow) {
            constraints.push({
                to: 'window',
                attachment: 'together'
            });
        }

        return (
            <TetherComponent
                attachment={attachment}
                classPrefix='buik-dropdown-menu'
                targetAttachment={targetAttachment}
                constraints={constraints}
                enabled={isOpen}
                bodyElement={bodyElement}
            >
                {cloneElement(menuButton, menuButtonProps)}
                {isOpen ? cloneElement(menu, menuProps) : null}
            </TetherComponent>
        );
    }
}

export default DropdownMenu;
