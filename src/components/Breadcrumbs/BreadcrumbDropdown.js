/**
 * @flow
 * @file Drop down part of breadcrumbs
 * @author Box
 */

import React from 'react';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import DropdownMenu from 'box-react-ui/lib/components/dropdown-menu/DropdownMenu';
import Menu from 'box-react-ui/lib/components/menu/Menu';
import MenuItem from 'box-react-ui/lib/components/menu/MenuItem';
import type { Crumb } from '../../flowTypes';
import './BreadcrumbDropdown.scss';

type Props = {
    className: string,
    onCrumbClick: Function,
    crumbs: Crumb[],
    rootElement: HTMLElement
};

const BreadcrumbDropdown = ({ crumbs, onCrumbClick, className = '', rootElement }: Props) => (
    <DropdownMenu constrainToScrollParent bodyElement={rootElement}>
        <PlainButton type='button' className={`buik-breadcrumbs-drop-down ${className}`}>
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
