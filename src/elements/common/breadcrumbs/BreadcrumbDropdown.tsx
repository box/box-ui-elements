import * as React from 'react';
import { DropdownMenu, IconButton } from '@box/blueprint-web';
import { Ellipsis } from '@box/blueprint-web-assets/icons/Fill';
import type { Crumb } from '../../../common/types/core';

export interface BreadcrumbDropdownProps {
    className?: string;
    crumbs: Crumb[];
    onCrumbClick: (crumb: Crumb) => void;
    'data-testid'?: string;
}

const BreadcrumbDropdown = ({ className, crumbs, onCrumbClick }: BreadcrumbDropdownProps) => (
    <div className={className}>
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <IconButton icon={Ellipsis} aria-label="More breadcrumb items" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                {crumbs.map(crumb => (
                    <DropdownMenu.Item key={crumb.id} onSelect={() => onCrumbClick(crumb)}>
                        {crumb.name}
                    </DropdownMenu.Item>
                ))}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    </div>
);

export default BreadcrumbDropdown;
