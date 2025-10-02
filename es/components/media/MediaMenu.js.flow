// @flow
import * as React from 'react';
import classnames from 'classnames';
import IconEllipsis from '../../icons/general/IconEllipsis';
import PlainButton from '../plain-button';
import DropdownMenu from '../dropdown-menu';
import { Menu } from '../menu';
import { bdlGray50 } from '../../styles/variables';
import './Media.scss';

type Props = {
    /** Child elements */
    children: React.Node,
    /** Additional class names for the menu button */
    className?: string,
    /** Additional props for the DropdownMenu */
    dropdownProps?: {},
    /** is the dropdown menu button disabled */
    isDisabled: boolean,
    /** Additional props for the Menu */
    menuProps?: {},
};

const MediaMenu = ({ className, children, isDisabled, dropdownProps, menuProps, ...rest }: Props) => (
    <DropdownMenu constrainToScrollParent isRightAligned {...dropdownProps}>
        <PlainButton
            isDisabled={isDisabled}
            className={classnames('bdl-Media-menu', className)}
            type="button"
            {...rest}
        >
            <IconEllipsis color={bdlGray50} height={16} width={16} />
        </PlainButton>
        <Menu {...menuProps}>{children}</Menu>
    </DropdownMenu>
);

MediaMenu.defaultProps = {
    dropdownProps: {},
    isDisabled: false,
    menuProps: {},
};

export default MediaMenu;
