import * as React from 'react';
import { useIntl } from 'react-intl';

import { Button, DropdownMenu } from '@box/blueprint-web';
import { Ellipsis } from '@box/blueprint-web-assets/icons/Fill/index';
import type { Selection } from 'react-aria-components';

import messages from '../../common/sub-header/messages';

export interface BulkItemAction {
    label: string;
    onClick: (selectedItemIds: Selection) => void;
}

export interface BulkItemActionMenuProps {
    actions: BulkItemAction[];
    selectedItemIds: Selection;
}

export const BulkItemActionMenu = ({ actions, selectedItemIds }: BulkItemActionMenuProps) => {
    const { formatMessage } = useIntl();

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger className="be-bulkItemActionMenu-trigger">
                <Button
                    role="button"
                    aria-label={formatMessage(messages.bulkItemActionMenuAriaLabel)}
                    icon={Ellipsis}
                    size="large"
                    variant="secondary"
                />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="end">
                {actions.map(({ label, onClick }) => {
                    return (
                        <DropdownMenu.Item key={label} onSelect={() => onClick(selectedItemIds)}>
                            {label}
                        </DropdownMenu.Item>
                    );
                })}
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};
