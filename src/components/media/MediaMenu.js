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
};

function MediaMenu({ className, children, isDisabled = false, ...rest }: Props) {
    return (
        <div className={classnames('bdl-Media-menu', className)} {...rest}>
            <DropdownMenu constrainToScrollParent isRightAligned>
                <PlainButton isDisabled={isDisabled} type="button">
                    <IconEllipsis color={bdlGray62} height={16} width={16} />
                </PlainButton>
                <Menu>{children}</Menu>
            </DropdownMenu>
        </div>
    );
}

export default MediaMenu;
