import * as React from 'react';
import { useIntl } from 'react-intl';
import { DropdownMenu, IconButton } from '@box/blueprint-web';
import { Ellipsis } from '@box/blueprint-web-assets/icons/Fill';
import type { Crumb } from '../../../common/types/core';

import messages from '../messages';

export interface BreadcrumbDropdownProps {
    className: string;
    crumbs: Crumb[];
    onCrumbClick: (id: string) => void;
}

const BreadcrumbDropdown = ({ crumbs, onCrumbClick }: BreadcrumbDropdownProps) => {
    const { formatMessage } = useIntl();

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <IconButton aria-label={formatMessage(messages.breadcrumbLabel)} icon={Ellipsis} />
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
};

export default BreadcrumbDropdown;
