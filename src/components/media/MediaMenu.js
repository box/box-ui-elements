// @flow
import * as React from 'react';
import classnames from 'classnames';
import IconEllipsis from '../../icons/general/IconEllipsis';
import PlainButton from '../plain-button';
import DropdownMenu from '../dropdown-menu';
import { Menu } from '../menu';
import { bdlGray62 } from '../../styles/variables';
import './Media.scss';

type Props = {
    /** Child elements */
    children: React.Node,
    /** Additional class names */
    className?: string,
    /** is the dropdown menu button disabled */
    isDisabled: boolean,
    /** aria-label prop for button icon */
    label?: string,
};

const MediaMenu = ({ className, children, isDisabled, label, ...rest }: Props) => (
    <div className={classnames('bdl-Media-menu', className)} {...rest}>
        <DropdownMenu constrainToScrollParent isRightAligned>
            <PlainButton isDisabled={isDisabled} type="button" aria-label={label}>
                <IconEllipsis color={bdlGray62} height={16} width={16} />
            </PlainButton>
            <Menu>{children}</Menu>
        </DropdownMenu>
    </div>
);

MediaMenu.defaultProps = {
    isDisabled: false,
};

export default MediaMenu;
