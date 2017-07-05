/**
 * @flow
 * @file Menu Item component
 * @author Box
 */

import React, { PureComponent } from 'react';
import omit from 'lodash.omit';
import './Menu.scss';

type Props = {
    className: string,
    initialFocusIndex?: number,
    onClose?: Function,
    children: any
};

type DefaultProps = {|
    className: string
|};

function stopPropagationAndPreventDefault(event: Event) {
    event.stopPropagation();
    event.preventDefault();
}

class Menu extends PureComponent<DefaultProps, Props, void> {
    props: Props;
    menuEl: HTMLUListElement;
    focusIndex: number = 0;
    menuItemEls: HTMLLIElement[] = [];

    static defaultProps = {
        className: ''
    };

    componentDidMount() {
        const { initialFocusIndex } = this.props;

        // Keep track of all the valid menu items that were rendered
        // (querySelector since we don't want to pass ref functions to every single child)
        this.menuItemEls = [].slice.call(this.menuEl.querySelectorAll('[role="menuitem"]:not([aria-disabled])'));

        // If an initialFocusIndex was specified, attempt to use it to focus
        if (typeof initialFocusIndex === 'number') {
            // We do this after a timeout so that the menu is properly mounted before we attempt to focus it
            setTimeout(() => {
                this.setFocus(initialFocusIndex);
            }, 0);
        }
    }

    getMenuItemElFromEventTarget(target: HTMLLIElement) {
        let menuItemEl = null;

        for (let i = 0; i < this.menuItemEls.length; i += 1) {
            if (this.menuItemEls[i].contains(target)) {
                menuItemEl = this.menuItemEls[i];
                break;
            }
        }
        return menuItemEl;
    }

    setFocus(index: number): void {
        if (!this.menuItemEls.length) {
            return;
        }

        const numMenuItems = this.menuItemEls.length;

        if (index >= numMenuItems) {
            this.focusIndex = 0;
        } else if (index < 0) {
            this.focusIndex = numMenuItems - 1;
        } else {
            this.focusIndex = index;
        }

        this.menuItemEls[this.focusIndex].focus();
    }

    /**
     * Focuses the 1st item
     *
     * @private
     * @return {void}
     */
    focusFirstItem(): void {
        this.setFocus(0);
    }

    /**
     * Focuses the last item
     *
     * @private
     * @return {void}
     */
    focusLastItem(): void {
        this.setFocus(-1);
    }

    /**
     * Focuses the next item
     *
     * @private
     * @return {void}
     */
    focusNextItem(): void {
        this.setFocus(this.focusIndex + 1);
    }

    /**
     * Focuses the previous item
     *
     * @private
     * @return {void}
     */
    focusPreviousItem(): void {
        this.setFocus(this.focusIndex - 1);
    }

    /**
     * Focuses the 1st item
     *
     * @private
     * @return {void}
     */
    fireOnCloseHandler(): void {
        const { onClose }: Props = this.props;
        if (onClose) {
            onClose();
        }
    }

    /**
     * Click handler
     *
     * @private
     * @return {void}
     */
    handleClick = ({ target }: { target: HTMLLIElement }): void => {
        const menuItemEl = this.getMenuItemElFromEventTarget(target);

        if (!menuItemEl) {
            return;
        }

        this.fireOnCloseHandler();
    };

    /**
     * Handles key down
     *
     * @private
     * @return {void}
     */
    handleKeyDown = (event: Event & { target: HTMLLIElement, key: string }) => {
        switch (event.key) {
            case 'ArrowDown':
                stopPropagationAndPreventDefault(event);

                this.focusNextItem();
                break;

            case 'ArrowUp':
                stopPropagationAndPreventDefault(event);

                this.focusPreviousItem();
                break;

            case 'Home':
            case 'PageUp':
                stopPropagationAndPreventDefault(event);

                this.focusFirstItem();
                break;

            case 'End':
            case 'PageDown':
                stopPropagationAndPreventDefault(event);

                this.focusLastItem();
                break;

            case 'Escape':
                stopPropagationAndPreventDefault(event);

                this.fireOnCloseHandler();
                break;

            case 'Tab':
                // DO NOT PREVENT DEFAULT OR STOP PROPAGATION - This should move focus natively
                this.fireOnCloseHandler();
                break;

            case ' ': // Spacebar
            case 'Enter':
                stopPropagationAndPreventDefault(event);

                event.target.click();
                break;

            default:
                break;
        }
    };

    render() {
        const { children, className, ...rest }: Props = this.props;

        const menuProps = omit(rest, ['onClose', 'initialFocusIndex']);
        menuProps.className = `buik-aria-menu ${className}`;
        menuProps.ref = (ref) => {
            this.menuEl = ref;
        };
        menuProps.role = 'menu';
        menuProps.tabIndex = -1;
        menuProps.onClick = this.handleClick;
        menuProps.onKeyDown = this.handleKeyDown;

        return (
            <ul {...menuProps}>
                {children}
            </ul>
        );
    }
}

export default Menu;
