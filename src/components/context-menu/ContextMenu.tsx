import * as React from 'react';
import TetherComponent, { TetherProps } from 'react-tether';
import uniqueId from 'lodash/uniqueId';

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

class ContextMenu extends React.Component<ContextMenuProps, ContextMenuState> {
    static defaultProps = {
        constraints: [],
    };

    constructor(props: ContextMenuProps) {
        super(props);

        this.menuID = uniqueId('contextmenu');
        this.menuTargetID = uniqueId('contextmenutarget');
    }

    state = {
        isOpen: false,
        targetOffset: '',
    };

    componentDidUpdate(prevProps: ContextMenuProps, prevState: ContextMenuState): void {
        const { isOpen } = this.state;
        const { isOpen: prevIsOpen } = prevState;
        const { isDisabled: prevIsDisabled } = prevProps;
        const { isDisabled } = this.props;

        if (!prevIsOpen && isOpen) {
            // When menu is being opened
            document.addEventListener('click', this.handleDocumentClick, true);
            document.addEventListener('contextmenu', this.handleDocumentClick, true);
        } else if (prevIsOpen && !isOpen) {
            // When menu is being closed
            document.removeEventListener('contextmenu', this.handleDocumentClick, true);
            document.removeEventListener('click', this.handleDocumentClick, true);
        }

        // if the menu becomes disabled while it is open, we should close it
        if (!isDisabled && prevIsDisabled && isOpen) {
            this.handleMenuClose();
        }
    }

    componentWillUnmount() {
        if (this.state.isOpen) {
            // Clean-up global click handlers
            document.removeEventListener('contextmenu', this.handleDocumentClick, true);
            document.removeEventListener('click', this.handleDocumentClick, true);
        }
    }

    menuID: string;

    menuTargetID: string;

    closeMenu = () => {
        const { onMenuClose } = this.props;

        this.setState({ isOpen: false });
        if (onMenuClose) {
            onMenuClose();
        }
    };

    focusTarget = () => {
        // breaks encapsulation but the only alternative is passing a ref to an unknown child component
        const wrapperEl = document.getElementById(this.menuTargetID);
        if (wrapperEl) {
            // The ID is now on the wrapper div, so we need to focus the first child element
            const targetEl = wrapperEl.firstElementChild as HTMLElement;
            if (targetEl && targetEl.focus) {
                targetEl.focus();
            }
        }
    };

    handleMenuClose = () => {
        this.closeMenu();
        this.focusTarget();
    };

    handleDocumentClick = (event: MouseEvent) => {
        const menuEl = document.getElementById(this.menuID);
        if (menuEl && event.target instanceof Node && menuEl.contains(event.target)) {
            return;
        }
        this.closeMenu();
    };

    handleContextMenu = (event: MouseEvent) => {
        if (this.props.isDisabled) {
            return;
        }

        const menuTargetEl = document.getElementById(this.menuTargetID);
        const targetRect = menuTargetEl ? menuTargetEl.getBoundingClientRect() : { left: 0, top: 0 };
        const verticalOffset = event.clientY - targetRect.top;
        const horizontalOffset = event.clientX - targetRect.left;

        this.setState({
            isOpen: true,
            targetOffset: `${verticalOffset}px ${horizontalOffset}px`,
        });

        const { onMenuOpen } = this.props;
        if (onMenuOpen) {
            onMenuOpen();
        }

        event.preventDefault();
    };

    render() {
        const { children, constraints } = this.props;
        const { isOpen, targetOffset } = this.state;

        const elements = React.Children.toArray(children);

        if (elements.length !== 2) {
            throw new Error('ContextMenu must have exactly two children: a target component and a <Menu>');
        }

        const menuTarget = elements[0];
        const menu = elements[1];

        const menuTargetProps = {
            key: this.menuTargetID,
            onContextMenu: this.handleContextMenu,
        };

        const menuProps = {
            key: this.menuID,
            initialFocusIndex: null,
            onClose: this.handleMenuClose,
        };

        const tetherProps: TetherProps = {
            attachment: 'top left',
            classPrefix: 'context-menu',
            constraints,
            targetAttachment: 'top left',
            targetOffset,
            renderElementTo: document.body,
        };

        return (
            <TetherComponent
                {...tetherProps}
                renderTarget={ref => {
                    return React.isValidElement(menuTarget) ? (
                        <div ref={ref} id={this.menuTargetID}>
                            {React.cloneElement(menuTarget, menuTargetProps)}
                        </div>
                    ) : null;
                }}
                renderElement={ref => {
                    return isOpen && React.isValidElement(menu) ? (
                        <div ref={ref} id={this.menuID}>
                            {React.cloneElement(menu, menuProps)}
                        </div>
                    ) : null;
                }}
            />
        );
    }
}

export default ContextMenu;
