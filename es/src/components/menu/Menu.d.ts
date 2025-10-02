import * as React from 'react';
import './Menu.scss';
interface MenuProps {
    /** children - menu items */
    children: Array<React.ReactNode> | Array<React.ReactChild> | React.ReactChild;
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
    onClose?: (isKeyboardEvent?: boolean, event?: React.MouseEvent<HTMLUListElement, MouseEvent> | React.KeyboardEvent<HTMLElement>) => void;
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
declare class Menu extends React.Component<MenuProps> {
    static defaultProps: {
        className: string;
        isSubmenu: boolean;
        isHidden: boolean;
    };
    constructor(props: MenuProps);
    componentDidMount(): void;
    componentDidUpdate({ isHidden: prevIsHidden, children: prevChildren }: MenuProps): void;
    setInitialFocusIndex: (props?: MenuProps) => void;
    setMenuItemEls: () => void;
    getMenuItemElFromEventTarget: (target: Node) => {
        menuItemEl?: HTMLElement | null;
        menuIndex: number;
    };
    setFocus: (index: number) => void;
    focusIndex: number;
    keyboardPressed: boolean | null | undefined;
    menuEl: HTMLUListElement | null | undefined;
    menuItemEls: Array<HTMLElement>;
    focusFirstItem: () => void;
    focusLastItem: () => void;
    focusNextItem: () => void;
    focusPreviousItem: () => void;
    fireOnCloseHandler: (isKeyboardEvent?: boolean, event?: React.MouseEvent<HTMLUListElement, MouseEvent> | React.KeyboardEvent<HTMLElement>) => void;
    handleClick: (event: React.MouseEvent<HTMLUListElement, MouseEvent>) => void;
    handleKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
    render(): React.JSX.Element;
}
export default Menu;
