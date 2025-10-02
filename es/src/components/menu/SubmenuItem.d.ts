/// <reference types="lodash" />
import * as React from 'react';
import './SubmenuItem.scss';
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
declare class SubmenuItem extends React.Component<SubmenuItemProps, SubmenuItemState> {
    state: {
        isSubmenuOpen: boolean;
        submenuFocusIndex: any;
    };
    getMenuAlignmentClasses: () => Record<string, boolean>;
    handleMenuItemClick: (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => void;
    submenuTriggerEl: HTMLElement | null | undefined;
    submenuEl: HTMLElement | null | undefined;
    handleKeyDown: (event: React.KeyboardEvent<HTMLLIElement>) => void;
    closeSubmenu: import("lodash").DebouncedFunc<() => void>;
    closeSubmenuAndFocusTrigger: (isKeyboardEvent: boolean | null | undefined) => void;
    openSubmenu: () => void;
    openSubmenuAndFocus: () => void;
    render(): React.JSX.Element;
}
export default SubmenuItem;
