/**
 * @flow
 * @file Drop down part of breadcrumbs
 * @author Box
 */

import React from 'react';
import DropdownMenu from '../DropdownMenu';
import { Menu, MenuItem } from '../Menu';
import { PlainButton } from '../Button';
import type { Crumb } from '../../flowTypes';
import './BreadcrumbDropdown.scss';

type Props = {
    className: string,
    onCrumbClick: Function,
    crumbs: Crumb[]
};

const BreadcrumbDropdown = ({ crumbs, onCrumbClick, className = '' }: Props) =>
    <DropdownMenu constrainToScrollParent>
        <PlainButton className={`buik-breadcrumbs-drop-down ${className}`}>
            ···
        </PlainButton>
        <Menu>
            {crumbs.map(({ id, name }: Crumb) =>
                <MenuItem key={id} onClick={() => onCrumbClick(id)}>
                    {name}
                </MenuItem>
            )}
        </Menu>
    </DropdownMenu>;

export default BreadcrumbDropdown;
