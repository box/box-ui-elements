import * as React from 'react';
import classnames from 'classnames';

import IconEllipsis from '../../icons/general/IconEllipsis';
import { ButtonType } from '../button';
import PlainButton from '../plain-button';
import { PlainButtonProps } from '../plain-button/PlainButton';
// @ts-ignore TODO: migrate DropdownMenu to typescript
import DropdownMenu from '../dropdown-menu';
import { Menu } from '../menu';
import { bdlGray50 } from '../../styles/variables';
import './Media.scss';

type Props = {
    /** Child elements */
    children: Array<React.ReactNode> | React.ReactChild;

    /** Additional class names for the menu button */
    className?: string;

    /** Additional props for the DropdownMenu */
    dropdownProps?: {};

    /** is the dropdown menu button disabled */
    isDisabled?: boolean;

    /** Additional props for the Menu */
    menuProps?: {};
} & PlainButtonProps;

const MediaMenu = ({ className, children, isDisabled = false, dropdownProps = {}, menuProps = {}, ...rest }: Props) => (
    <DropdownMenu constrainToScrollParent isRightAligned {...dropdownProps}>
        <PlainButton
            isDisabled={isDisabled}
            className={classnames('bdl-Media-menu', className)}
            type={ButtonType.BUTTON}
            {...rest}
        >
            <IconEllipsis color={bdlGray50} height={16} width={16} />
        </PlainButton>
        <Menu {...menuProps}>{children}</Menu>
    </DropdownMenu>
);

export default MediaMenu;
