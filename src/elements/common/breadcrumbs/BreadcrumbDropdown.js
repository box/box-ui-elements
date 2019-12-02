/**
 * @flow
 * @file Drop down part of breadcrumbs
 * @author Box
 */

import React from 'react';
import PlainButton from '../../../components/plain-button/PlainButton';
import DropdownMenu from '../../../components/dropdown-menu/DropdownMenu';
import Menu from '../../../components/menu/Menu';
import MenuItem from '../../../components/menu/MenuItem';
import type { Crumb } from '../../../common/types/core';
import './BreadcrumbDropdown.scss';

type Props = {
    className: string,
    crumbs: Crumb[],
    onCrumbClick: Function,
};

const BreadcrumbDropdown = ({ crumbs, onCrumbClick, className = '' }: Props) => (
    <DropdownMenu constrainToScrollParent>
        <PlainButton className={`be-breadcrumbs-drop-down ${className}`} type="button">
            ···
        </PlainButton>
        <Menu>
            {crumbs.map(({ id, name }: Crumb) => (
                <MenuItem key={id} onClick={() => onCrumbClick(id)}>
                    {name}
                </MenuItem>
            ))}
        </Menu>
    </DropdownMenu>
);

export default BreadcrumbDropdown;
