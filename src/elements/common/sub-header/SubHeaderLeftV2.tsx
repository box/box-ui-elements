import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { XMark } from '@box/blueprint-web-assets/icons/Fill/index';
import { IconButton, PageHeader, Text } from '@box/blueprint-web';
import type { Selection } from 'react-aria-components';
import type { Collection } from '../../../common/types/core';
import messages from '../messages';

import './SubHeaderLeftV2.scss';

export interface SubHeaderLeftV2Props {
    currentCollection: Collection;
    onClearSelectedItemIds?: () => void;
    rootName?: string;
    selectedItemIds: Selection;
    title?: string;
}

const SubHeaderLeftV2 = (props: SubHeaderLeftV2Props) => {
    const { currentCollection, onClearSelectedItemIds, rootName, selectedItemIds, title } = props;
    const { formatMessage } = useIntl();

    // Generate selected item text based on selected keys
    const selectedItemText = useMemo(() => {
        const selectedCount = selectedItemIds === 'all' ? currentCollection.items.length : selectedItemIds.size;

        if (typeof selectedCount !== 'number' || selectedCount === 0) {
            return '';
        }

        // Case 1: Single selected item - show item name
        if (selectedCount === 1) {
            const selectedKey =
                selectedItemIds === 'all' ? currentCollection.items[0].id : selectedItemIds.values().next().value;
            const selectedItem = currentCollection.items.find(item => item.id === selectedKey);
            if (typeof selectedItem?.name === 'string') {
                return selectedItem.name as string;
            }
        }
        // Case 2: Multiple selected items - show count
        if (selectedCount > 1) {
            return formatMessage(messages.numFilesSelected, { numSelected: selectedCount });
        }
        return '';
    }, [currentCollection.items, formatMessage, selectedItemIds]);

    // Case 1 and 2: selected item text with X button
    if (selectedItemText) {
        return (
            <PageHeader.Root className="be-sub-header-left-v2-selected" variant="default">
                <PageHeader.Corner>
                    <IconButton
                        aria-label="Clear selection"
                        icon={XMark}
                        onClick={onClearSelectedItemIds}
                        variant="small-utility"
                    />
                </PageHeader.Corner>

                <PageHeader.StartElements>
                    <Text as="p">{selectedItemText}</Text>
                </PageHeader.StartElements>
            </PageHeader.Root>
        );
    }

    // Case 3: No selected items - show title if provided, otherwise show root name
    return (
        <Text as="h1" variant="titleXLarge">
            {title || rootName}
        </Text>
    );
};

export default SubHeaderLeftV2;
