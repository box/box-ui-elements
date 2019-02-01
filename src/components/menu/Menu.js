// @flow
import * as React from 'react';
import omit from 'lodash/omit';
import classNames from 'classnames';

import './Menu.scss';

const MENU_ITEM_SELECTOR = '.menu-item:not([aria-disabled])';
const TOP_LEVEL_MENU_ITEM_SELECTOR = `ul:not(.submenu) > ${MENU_ITEM_SELECTOR}, ul:not(.submenu) > li > ${MENU_ITEM_SELECTOR}`;
const SUBMENU_ITEM_SELECTOR = `ul.submenu > ${MENU_ITEM_SELECTOR}, ul.submenu > li > ${MENU_ITEM_SELECTOR}`;

function stopPropagationAndPreventDefault(event) {
    event.stopPropagation();
    event.preventDefault();
}

type Props = {
    children: React.Node,
    className: string,
    /** Focuses a specific menu item index when menu is mounted */
    initialFocusIndex?: number,
    isHidden?: boolean,
    isSubmenu?: boolean,
    onClose?: Function,
    /** Will fire this callback when menu should "close' */
    setRef?: Function,
    shouldOutlineFocus?: boolean,
};

class Menu extends React.Component<Props> {
    static defaultProps = {
        className: '',
        isSubmenu: false,
        isHidden: false,
    };

    constructor(props: Props) {
        super(props);

        this.menuEl = null;
        this.focusIndex = 0;
        this.menuItemEls = [];
    }

    componentDidMount() {
        this.setInitialFocusIndex();
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.isSubmenu && !nextProps.isHidden && this.props.isHidden) {
            // If updating submenu, use the upcoming props instead of current props.
            this.setInitialFocusIndex(nextProps);
        }
    }

    componentDidUpdate(prevProps: Props) {
        // update focus index and menu item elements when the number of children changes
        if (React.Children.toArray(prevProps.children).length !== React.Children.toArray(this.props.children).length) {
            const focusedMenuItemEl = this.menuItemEls[this.focusIndex];
            this.setMenuItemEls();
            const { menuIndex } = this.getMenuItemElFromEventTarget(focusedMenuItemEl);
            this.setFocus(menuIndex);
        }
    }

    setInitialFocusIndex = (props: ?Props) => {
        if (!props) {
            props = this.props;
        }
        const { initialFocusIndex } = props;

        this.setMenuItemEls();

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
        const { isSubmenu } = this.props;

        const selector = isSubmenu ? SUBMENU_ITEM_SELECTOR : TOP_LEVEL_MENU_ITEM_SELECTOR;
        // Keep track of all the valid menu items that were rendered (querySelector since we don't want to pass ref functions to every single child)
        this.menuItemEls = this.menuEl ? [].slice.call(this.menuEl.querySelectorAll(selector)) : [];
    };

    getMenuItemElFromEventTarget = (target: Node) => {
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

    keyboardPressed: ?boolean;

    menuEl: ?HTMLUListElement;

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

    fireOnCloseHandler = (isKeyboardEvent: ?boolean) => {
        const { onClose } = this.props;

        if (onClose) {
            // We need to pass the event type so we know which item to focus.
            onClose(isKeyboardEvent);
        }
    };

    handleClick = (event: SyntheticEvent<HTMLUListElement>) => {
        const { menuItemEl } = event.target instanceof Node ? this.getMenuItemElFromEventTarget(event.target) : {};

        if (!menuItemEl) {
            return;
        }

        this.fireOnCloseHandler(false);
    };

    handleKeyDown = (event: SyntheticKeyboardEvent<>) => {
        const { isSubmenu, initialFocusIndex } = this.props;

        switch (event.key) {
            case 'ArrowDown':
                stopPropagationAndPreventDefault(event);

                // If it's first keyboard event, focus on first item.
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
                this.fireOnCloseHandler(true);
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

                this.fireOnCloseHandler(true);
                break;

            case 'Tab':
                // DO NOT PREVENT DEFAULT OR STOP PROPAGATION - This should move focus natively
                this.fireOnCloseHandler(true);
                break;

            case ' ': // Spacebar
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

        const menuProps = omit(rest, ['onClose', 'initialFocusIndex', 'isSubmenu']);
        menuProps.className = classNames('aria-menu', className, {
            'is-hidden': isHidden,
            'should-outline-focus': shouldOutlineFocus,
        });
        menuProps.ref = ref => {
            this.menuEl = ref;
            if (setRef) {
                setRef(ref);
            }
        };
        menuProps.role = 'menu';
        menuProps.tabIndex = -1;
        menuProps.onClick = this.handleClick;
        menuProps.onKeyDown = this.handleKeyDown;

        return <ul {...menuProps}>{children}</ul>;
    }
}

export default Menu;
