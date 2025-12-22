import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import debounce from 'lodash/debounce';

import './SubmenuItem.scss';
import Arrow16 from '../../icon/fill/Arrow16';

const SUBMENU_LEFT_ALIGNED_CLASS = 'is-left-aligned';
const SUBMENU_BOTTOM_ALIGNED_CLASS = 'is-bottom-aligned';
const SUBMENU_RIGHT_BOTTOM_ALIGNED_CLASS = 'is-right-bottom-aligned';

export interface SubmenuItemProps {
    /** 'aria-disabled' - ARIA attribute describing whether the submenu item is disabled */
    'aria-disabled'?: boolean | 'true' | 'false';
    /** 'aria-disabled' - ARIA attribute describing whether the submenu item is expanded */
    'aria-expanded'?: boolean | 'true' | 'false';
    /** 'aria-disabled' - ARIA attribute describing whether the submenu item has a popup */
    'aria-haspopup'?: boolean | 'true' | 'false';
    /** bottomBoundaryElement - an HTMLElement defining the bottom boundary for the submenu item */
    bottomBoundaryElement?: HTMLElement;
    /** children - submenu item content */
    children?: Array<React.ReactChild> | React.ReactChild;
    /** className - CSS class name for the submenu item */
    className?: string;
    /** isDisabled - whether the submenu item is disabled */
    isDisabled?: boolean;
    /** onClick - function called when the submenu item is clicked */
    onClick?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
    /** onClick - function called when a key is pressed within the submenu item */
    onKeyDown?: (event: React.KeyboardEvent<HTMLLIElement>) => void;
    /** onClick - function called when the mouse enters the submenu item */
    onMouseEnter?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
    /** onClick - function called when the mouse leaves the submenu item */
    onMouseLeave?: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
    /** onOpen - function called when the submenu opens */
    onOpen?: () => void;
    /** ref - reference to the menu element in the DOM */
    ref?: string | ((instance: HTMLLIElement | null) => void) | React.RefObject<HTMLLIElement> | null | undefined;
    /** rightBoundaryElement - an HTMLElement defining the right boundary for the submenu item */
    rightBoundaryElement?: HTMLElement;
    /** role - ARIA role for the submenu item */
    role?: string;
    /** tabIndex - indicator of whether the submenu item is focusable */
    tabIndex?: number;
}

interface SubmenuItemState {
    /** isSubmenuOpen - whether the submenu is open */
    isSubmenuOpen: boolean;
    /** isSubmenuOpen - index of the focused submenu item */
    submenuFocusIndex: number | null | undefined;
}

/**
 * A menu-item component which triggers open a submenu
 *
 * @NOTE: Nested submenus are NOT currently supported, switching
 * focus with arrow keys in the subsubmenu is not working properly.
 */
class SubmenuItem extends React.Component<SubmenuItemProps, SubmenuItemState> {
    state = {
        isSubmenuOpen: false,
        submenuFocusIndex: null,
    };

    getMenuAlignmentClasses = (): Record<string, boolean> => {
        if (!this.submenuTriggerEl || !this.submenuEl) {
            return {};
        }

        const { rightBoundaryElement, bottomBoundaryElement } = this.props;
        const submenuElBounding = this.submenuEl.getBoundingClientRect();
        const submenuTriggerElBounding = this.submenuTriggerEl.getBoundingClientRect();
        const rightBoundaryElementBounding = rightBoundaryElement
            ? rightBoundaryElement.getBoundingClientRect()
            : { right: window.innerWidth };
        const bottomBoundaryElementBounding = bottomBoundaryElement
            ? bottomBoundaryElement.getBoundingClientRect()
            : { bottom: window.innerHeight };

        const isLeftAligned =
            submenuTriggerElBounding.right + submenuElBounding.width > rightBoundaryElementBounding.right;
        const isBottomAligned =
            submenuTriggerElBounding.top + submenuElBounding.height > bottomBoundaryElementBounding.bottom;
        const isRightBottomAligned =
            submenuTriggerElBounding.bottom + submenuElBounding.height > bottomBoundaryElementBounding.bottom;
        return {
            [SUBMENU_LEFT_ALIGNED_CLASS]: isLeftAligned,
            [SUBMENU_BOTTOM_ALIGNED_CLASS]: isBottomAligned,
            [SUBMENU_RIGHT_BOTTOM_ALIGNED_CLASS]: isRightBottomAligned, // Used only in medium-screen viewport sizes
        };
    };

    handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        const { isDisabled, onClick } = this.props;

        // If aria-disabled is passed as a prop, we should ignore clicks on this menu item
        if (isDisabled) {
            event.stopPropagation();
            event.preventDefault();

            return;
        }

        if (onClick) {
            onClick(event);
        }

        // If event target is triggering submenu element, do not propagate to close menu
        if (this.submenuEl && !this.submenuEl.contains(event.target as Node)) {
            event.stopPropagation();
            event.preventDefault();
        }
    };

    submenuTriggerEl: HTMLElement | null | undefined;

    submenuEl: HTMLElement | null | undefined;

    handleKeyDown = (event: React.KeyboardEvent<HTMLLIElement>) => {
        switch (event.key) {
            case ' ':
            case 'Enter':
            case 'ArrowRight':
                event.stopPropagation();
                event.preventDefault();
                this.openSubmenuAndFocus();
                break;
            default:
                break;
        }
    };

    closeSubmenu: ReturnType<typeof debounce> = debounce(() => {
        this.setState({
            isSubmenuOpen: false,
        });
    }, 50);

    closeSubmenuAndFocusTrigger = (isKeyboardEvent: boolean | null | undefined) => {
        this.closeSubmenu();
        if (this.submenuTriggerEl && isKeyboardEvent) {
            this.submenuTriggerEl.focus();
        }
    };

    openSubmenu = () => {
        this.closeSubmenu.cancel();
        const { onOpen } = this.props;
        if (onOpen) {
            onOpen();
        }
        this.setState({
            isSubmenuOpen: true,
            submenuFocusIndex: null,
        });
    };

    openSubmenuAndFocus = () => {
        const { onOpen } = this.props;
        if (onOpen) {
            onOpen();
        }

        this.setState({
            isSubmenuOpen: true,
            submenuFocusIndex: 0,
        });
    };

    render() {
        const { children, className, isDisabled, ...rest } = this.props;
        const { isSubmenuOpen, submenuFocusIndex } = this.state;

        const elements = React.Children.toArray(children);
        const submenuTriggerContent = elements[0];
        const submenu = elements[1] as React.ReactElement;
        if (elements.length !== 2 || !submenuTriggerContent || !submenu) {
            throw new Error('SubmenuItem must have exactly two children, a trigger component and a <Menu>');
        }

        const chevron = <Arrow16 className="menu-item-arrow" width={12} height={12} />;

        const menuItemProps: SubmenuItemProps = {
            ...omit(rest, ['bottomBoundaryElement', 'onClick', 'onOpen', 'rightBoundaryElement', 'role', 'tabIndex']),
            'aria-disabled': isDisabled ? 'true' : undefined,
            'aria-expanded': isSubmenuOpen ? 'true' : 'false',
            'aria-haspopup': 'true',

            className: classNames('menu-item', 'submenu-target', className),
            onClick: this.handleMenuItemClick,
            onMouseLeave: this.closeSubmenu,
            onMouseEnter: this.openSubmenu,
            onKeyDown: this.handleKeyDown,
            ref: (ref: HTMLLIElement | null) => {
                this.submenuTriggerEl = ref;
            },
            role: 'menuitem',
            tabIndex: -1,
        };

        const submenuProps = {
            className: classNames(submenu.props.className, 'submenu', this.getMenuAlignmentClasses()),
            initialFocusIndex: submenuFocusIndex,
            // Hide the menu instead of unmounting it. Otherwise onMouseLeave won't work.
            isHidden: !isSubmenuOpen,
            isSubmenu: true,
            onClose: this.closeSubmenuAndFocusTrigger,
            setRef: (ref: HTMLLIElement) => {
                this.submenuEl = ref;
            },
        };

        return (
            <li {...menuItemProps}>
                {submenuTriggerContent}
                {chevron}
                {React.cloneElement(submenu, submenuProps)}
            </li>
        );
    }
}

export default SubmenuItem;
