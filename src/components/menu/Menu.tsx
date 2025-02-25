import * as React from 'react';
import omit from 'lodash/omit';
import classNames from 'classnames';

import MenuContext from './MenuContext';

import './Menu.scss';

/**
 * The selectors are used to identify the menu item that is selected. We need to eventually
 * rewrite this logic as there seem to be strong coupling between the selector and MenuItem
 * that we want to decouple. The span is here to allow Menu to recognize MenuItem even if it is
 * wrapped by a span coming from a tooltip.
 */
const MENU_ITEM_SELECTOR = '.menu-item:not([aria-disabled])';
const TOP_LEVEL_MENU_ITEM_SELECTOR = `ul:not(.submenu) > ${MENU_ITEM_SELECTOR}, ul:not(.submenu) > li > ${MENU_ITEM_SELECTOR}, ul:not(.submenu) > span > ${MENU_ITEM_SELECTOR}`;
const SUBMENU_ITEM_SELECTOR = `ul.submenu > ${MENU_ITEM_SELECTOR}, ul.submenu > li > ${MENU_ITEM_SELECTOR}, ul.submenu > span > ${MENU_ITEM_SELECTOR}`;

function stopPropagationAndPreventDefault(event: React.KeyboardEvent<HTMLElement>) {
    event.stopPropagation();
    event.preventDefault();
}

interface MenuProps {
    /** children - menu items */
    children: Array<React.ReactNode> | React.ReactNode;
    /** className - CSS class name for the menu */
    className: string;
    /** initialFocusIndex - focuses a specific menu item index when menu is mounted */
    initialFocusIndex?: number;
    /** isHidden - whether the menu’s content is hidden */
    isHidden?: boolean;
    /** isSubmenu - whether this is a submenu of another menu */
    isSubmenu?: boolean;
    /** menuItemSelector - overrides the default menu selector */
    menuItemSelector?: string;
    /** onClick - function called when the menu is clicked */
    onClick?: (event: React.MouseEvent<HTMLUListElement, MouseEvent>) => void;
    /** onClick - function called when the menu is closed */
    onClose?: (
        isKeyboardEvent?: boolean,
        event?: React.MouseEvent<HTMLUListElement, MouseEvent> | React.KeyboardEvent<HTMLElement>,
    ) => void;
    /** onClick - function called when a key is pressed within the menu */
    onKeyDown?: (event: React.KeyboardEvent<HTMLUListElement>) => void;
    /** ref - reference to the menu element in the DOM */
    ref?: string | ((instance: HTMLUListElement | null) => void) | React.RefObject<HTMLUListElement> | null | undefined;
    /** role - ARIA role for the menu */
    role?: string;
    /** setRef - will fire this callback when menu should "close' */
    setRef?: Function;
    /** shouldOutlineFocus - whether the focused menu item should have an outline */
    shouldOutlineFocus?: boolean;
    /** tabIndex - indicator of whether the menu is focusable */
    tabIndex?: number;
}

class Menu extends React.Component<MenuProps> {
    static defaultProps = {
        className: '',
        isSubmenu: false,
        isHidden: false,
    };

    constructor(props: MenuProps) {
        super(props);

        this.focusIndex = 0;
        this.menuEl = null;
        this.menuItemEls = [];
    }

    componentDidMount() {
        this.setMenuItemEls();
        this.setInitialFocusIndex();
    }

    componentDidUpdate({ isHidden: prevIsHidden, children: prevChildren }: MenuProps) {
        const { children, isHidden, isSubmenu } = this.props;

        if (isSubmenu && prevIsHidden && !isHidden) {
            // If updating submenu, use the current props instead of previous props.
            this.setMenuItemEls();
            this.setInitialFocusIndex(this.props);
        }

        // update focus index and menu item elements when the number of children changes
        if (React.Children.toArray(prevChildren).length !== React.Children.toArray(children).length) {
            const focusedMenuItemEl = this.menuItemEls[this.focusIndex];
            this.setMenuItemEls();
            const { menuIndex } = this.getMenuItemElFromEventTarget(focusedMenuItemEl);

            const isFocusedElementMissing = menuIndex === -1;
            const isFocusIndexOutOfBounds = this.focusIndex >= this.menuItemEls.length;

            this.setFocus(isFocusedElementMissing && !isFocusIndexOutOfBounds ? this.focusIndex : menuIndex);
        }
    }

    setInitialFocusIndex = (props: MenuProps = this.props) => {
        const { initialFocusIndex, isHidden } = props;

        if (isHidden || initialFocusIndex === undefined) {
            return;
        }

        // If an initialFocusIndex was specified, attempt to use it to focus
        if (typeof initialFocusIndex === 'number') {
            // We do this after a timeout so that the menu is properly mounted before we attempt to focus it
            setTimeout(() => {
                this.setFocus(initialFocusIndex);
            }, 0);
        } else if (initialFocusIndex === null) {
            // If no initial focus index is set, focus on the menu itself so that keyboard shortcut still works after a mouse click.
            setTimeout(() => {
                if (this.menuEl) {
                    this.menuEl.focus();
                }
            }, 0);
        }
    };

    setMenuItemEls = () => {
        const { isSubmenu, menuItemSelector } = this.props;

        const selector = menuItemSelector || (isSubmenu ? SUBMENU_ITEM_SELECTOR : TOP_LEVEL_MENU_ITEM_SELECTOR);
        // Keep track of all the valid menu items that were rendered (querySelector since we don't want to pass ref functions to every single child)
        this.menuItemEls = this.menuEl ? [].slice.call(this.menuEl.querySelectorAll(selector)) : [];
    };

    getMenuItemElFromEventTarget = (
        target: Node,
    ): {
        menuItemEl?: HTMLElement | null;
        menuIndex: number;
    } => {
        let menuItemEl = null;
        let menuIndex = -1;

        for (let i = 0; i < this.menuItemEls.length; i += 1) {
            if (this.menuItemEls[i].contains(target)) {
                menuItemEl = this.menuItemEls[i];
                menuIndex = i;
                break;
            }
        }
        return { menuItemEl, menuIndex };
    };

    setFocus = (index: number) => {
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
    };

    focusIndex: number;

    keyboardPressed: boolean | null | undefined;

    menuEl: HTMLUListElement | null | undefined;

    menuItemEls: Array<HTMLElement>;

    focusFirstItem = () => {
        this.setFocus(0);
    };

    focusLastItem = () => {
        this.setFocus(-1);
    };

    focusNextItem = () => {
        this.setFocus(this.focusIndex + 1);
    };

    focusPreviousItem = () => {
        this.setFocus(this.focusIndex - 1);
    };

    fireOnCloseHandler = (
        isKeyboardEvent?: boolean,
        event?: React.MouseEvent<HTMLUListElement, MouseEvent> | React.KeyboardEvent<HTMLElement>,
    ) => {
        const { onClose } = this.props;

        if (onClose) {
            // We need to pass the event type so we know which item to focus.
            onClose(isKeyboardEvent, event);
        }
    };

    handleClick = (event: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
        const { menuItemEl }: { menuItemEl?: HTMLElement | null } =
            event.target instanceof Node ? this.getMenuItemElFromEventTarget(event.target) : {};

        if (!menuItemEl) {
            return;
        }
        this.fireOnCloseHandler(false, event);
    };

    handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        const { isSubmenu, initialFocusIndex } = this.props;

        switch (event.key) {
            case 'ArrowDown':
                stopPropagationAndPreventDefault(event); // If it's first keyboard event, focus on first item.

                if (initialFocusIndex === null && !this.keyboardPressed) {
                    this.focusFirstItem();
                } else {
                    this.focusNextItem();
                }

                break;

            case 'ArrowUp':
                stopPropagationAndPreventDefault(event);
                this.focusPreviousItem();
                break;

            case 'ArrowLeft':
                // Close submenu when arrow-left is clicked
                if (!isSubmenu) {
                    return;
                }

                stopPropagationAndPreventDefault(event);
                this.fireOnCloseHandler(true, event);
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
                this.fireOnCloseHandler(true, event);
                break;

            case 'Tab':
                // DO NOT PREVENT DEFAULT OR STOP PROPAGATION - This should move focus natively
                this.fireOnCloseHandler(true, event);
                break;

            case ' ':
            case 'Enter':
                stopPropagationAndPreventDefault(event);

                if (event.target instanceof HTMLElement) {
                    event.target.click();
                }

                break;

            default:
                break;
        }

        this.keyboardPressed = true;
    };

    render() {
        const { children, className, isHidden, setRef, shouldOutlineFocus, ...rest } = this.props;

        const menuProps = {
            ...omit(rest, ['onClose', 'initialFocusIndex', 'isSubmenu', 'menuItemSelector']),
            className: classNames('aria-menu', className, {
                'is-hidden': isHidden,
                'should-outline-focus': shouldOutlineFocus,
            }),
            ref: (ref: HTMLUListElement | null) => {
                this.menuEl = ref;
                if (setRef) {
                    setRef(ref);
                }
            },
        } as React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>;
        if (menuProps.role === undefined) {
            menuProps.role = 'menu';
        }
        menuProps.tabIndex = -1;
        menuProps.onClick = this.handleClick;
        menuProps.onKeyDown = this.handleKeyDown;

        return (
            <ul {...menuProps}>
                <MenuContext.Provider value={{ closeMenu: this.fireOnCloseHandler }}>{children}</MenuContext.Provider>
            </ul>
        );
    }
}

export default Menu;
