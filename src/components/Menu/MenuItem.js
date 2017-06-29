/**
 * @flow
 * @file Menu Item component
 * @author Box
 */

import React, { PureComponent } from 'react';
import omit from 'lodash.omit';

type Props = {
    isDisabled?: boolean,
    onClick?: Function,
    children: any
};

class MenuItem extends PureComponent<void, Props, void> {
    props: Props;

    onClickHandler = (event: Event) => {
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
    };

    render() {
        const { children, isDisabled, ...rest }: Props = this.props;
        const menuItemProps = omit(rest, ['role', 'tabIndex', 'onClick']);

        menuItemProps.role = 'menuitem';
        menuItemProps.tabIndex = -1;
        menuItemProps.onClick = this.onClickHandler;

        if (isDisabled) {
            menuItemProps['aria-disabled'] = 'true';
        }

        return (
            <li {...menuItemProps}>
                {children}
            </li>
        );
    }
}

export default MenuItem;
