import * as React from 'react';
import './ContextMenu.scss';
export interface ContextMenuProps {
    /** children - a target component to attach to and a menu */
    children: Array<React.ReactChild> | React.ReactChild;
    /**
     * constraints - an array of tether constraints
     *
     * @see See [Tether](http://tether.io) for possible constraints
     */
    constraints: Array<unknown>;
    /** isDisabled - when disabled, native context menu behavior is applied, and the menu will close if it was open */
    isDisabled?: boolean;
    /** onMenuClose - called when menu is closed */
    onMenuClose?: Function;
    /** onMenuOpen - called when menu is opened */
    onMenuOpen?: Function;
}
export interface ContextMenuState {
    /** isOpen - whether the menu is open or not */
    isOpen: boolean;
    /** targetOffset - CSS representation of the menu's offset */
    targetOffset: string;
}
declare class ContextMenu extends React.Component<ContextMenuProps, ContextMenuState> {
    static defaultProps: {
        constraints: any[];
    };
    constructor(props: ContextMenuProps);
    state: {
        isOpen: boolean;
        targetOffset: string;
    };
    componentDidUpdate(prevProps: ContextMenuProps, prevState: ContextMenuState): void;
    componentWillUnmount(): void;
    menuID: string;
    menuTargetID: string;
    closeMenu: () => void;
    focusTarget: () => void;
    handleMenuClose: () => void;
    handleDocumentClick: (event: MouseEvent) => void;
    handleContextMenu: (event: MouseEvent) => void;
    render(): React.JSX.Element;
}
export default ContextMenu;
