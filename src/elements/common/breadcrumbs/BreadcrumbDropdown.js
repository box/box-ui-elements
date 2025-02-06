/**
 * @flow
 * @file Drop down part of breadcrumbs
 * @author Box
 */

import * as React from 'react';
import { DropdownMenu, IconButton } from '@box/blueprint-web';
import { Ellipsis } from '@box/blueprint-web-assets/icons/Fill';
import type { Crumb } from '../../../common/types/core';

type Props = {
    className: string,
    crumbs: Crumb[],
    onCrumbClick: Function,
};

const BreadcrumbDropdown = ({ crumbs, onCrumbClick }: Props) => (
    <DropdownMenu.Root>
        <DropdownMenu.Trigger>
            <IconButton icon={Ellipsis} />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
            {crumbs.map(({ id, name }: Crumb) => (
                <DropdownMenu.Item key={id} onClick={() => onCrumbClick(id)}>
                    {name}
                </DropdownMenu.Item>
            ))}
        </DropdownMenu.Content>
    </DropdownMenu.Root>
);

export default BreadcrumbDropdown;
