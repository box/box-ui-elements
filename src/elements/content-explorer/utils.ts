import { useMemo } from 'react';
import { useIntl } from 'react-intl';

import { MetadataTemplate } from '@box/metadata-editor';
import type { Selection } from 'react-aria-components';
import type { BoxItem, Collection } from '../../common/types/core';

import messages from '../common/messages';

// Get selected item text
export function useSelectedItemText(currentCollection: Collection, selectedItemIds: Selection): string {
    const { formatMessage } = useIntl();

    return useMemo(() => {
        const selectedCount = selectedItemIds === 'all' ? currentCollection.items.length : selectedItemIds.size;
        if (selectedCount === 0) return '';

        // Case 1: Single selected item - show item name
        if (selectedCount === 1) {
            const selectedKey =
                selectedItemIds === 'all' ? currentCollection.items[0].id : selectedItemIds.values().next().value;
            const selectedItem = currentCollection.items.find(item => item.id === selectedKey);
            return selectedItem?.name ?? '';
        }

        // Case 2: Multiple selected items - show count
        return formatMessage(messages.numFilesSelected, { numSelected: selectedCount });
    }, [currentCollection.items, formatMessage, selectedItemIds]);
}

// Get template instance based on metadata template and selected items
export function getTemplateInstance(metadataTemplate: MetadataTemplate, selectedItems: BoxItem[]) {
    const { displayName, fields, hidden, id, scope, templateKey, type } = metadataTemplate;

    const selectedItemsFields = fields.map(field => {
        const {
            displayName: fieldDisplayName,
            hidden: fieldHidden,
            id: fieldId,
            key,
            options,
            type: fieldType,
        } = field;
        return {
            displayName: fieldDisplayName,
            hidden: fieldHidden,
            id: fieldId,
            key,
            options,
            type: fieldType,
            // TODO: Add support for multiple selected items
            value: selectedItems[0].metadata[scope][templateKey][key],
        };
    });

    return {
        canEdit: true,
        displayName,
        hidden,
        id,
        fields: selectedItemsFields,
        scope,
        templateKey,
        type,
    };
}
