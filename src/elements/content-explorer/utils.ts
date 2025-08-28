import React, { useMemo } from 'react';
import { useIntl } from 'react-intl';
import isNil from 'lodash/isNil';
import xor from 'lodash/xor';

import {
    MULTI_VALUE_DEFAULT_OPTION,
    MULTI_VALUE_DEFAULT_VALUE,
    type MetadataTemplate,
    type MetadataFormFieldValue,
} from '@box/metadata-editor';
import type { MetadataFieldType } from '@box/metadata-view';
import type { Selection } from 'react-aria-components';
import type { BoxItem, Collection } from '../../common/types/core';

import messages from '../common/messages';

// Specific type for metadata field value in the item
// Note: Item doesn't have field value in metadata object if that field is not set, so the value will be undefined in this case
type ItemMetadataFieldValue = string | number | Array<string> | null | undefined;

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

// Check if the field value is empty.
// Note: 0 doesn't represent empty here because of float type field
export function isEmptyValue(value: ItemMetadataFieldValue) {
    if (isNil(value)) {
        return true;
    }

    // date, string, enum
    if (value === '') {
        return true;
    }

    // multiSelect
    if (Array.isArray(value) && value.length === 0) {
        return true;
    }

    // float
    if (Number.isNaN(value)) {
        return true;
    }

    return false;
}

// Check if the field values are equal based on the field types
export function areFieldValuesEqual(value1: ItemMetadataFieldValue, value2: ItemMetadataFieldValue) {
    if (isEmptyValue(value1) && isEmptyValue(value2)) {
        return true;
    }

    // Handle multiSelect arrays comparison
    if (Array.isArray(value1) && Array.isArray(value2)) {
        return xor(value1, value2).length === 0;
    }

    return value1 === value2;
}

// Return default form value by field type
function getDefaultValueByFieldType(fieldType: MetadataFieldType) {
    if (fieldType === 'date' || fieldType === 'enum' || fieldType === 'float' || fieldType === 'string') {
        return '';
    }
    if (fieldType === 'multiSelect') {
        return [];
    }
    return undefined;
}

// Set the field value in Metadata Form based on the field type
function getFieldValue(fieldType: MetadataFieldType, fieldValue: ItemMetadataFieldValue) {
    if (isNil(fieldValue)) {
        return getDefaultValueByFieldType(fieldType);
    }
    return fieldValue;
}

// Check if the field value in Metadata Form is multi-values such as "Multiple values"
export function isMultiValuesField(fieldType: MetadataFieldType, fieldValue: MetadataFormFieldValue) {
    if (fieldType === 'multiSelect') {
        return Array.isArray(fieldValue) && fieldValue.length === 1 && fieldValue[0] === MULTI_VALUE_DEFAULT_VALUE;
    }
    if (fieldType === 'enum') {
        return fieldValue === MULTI_VALUE_DEFAULT_VALUE;
    }
    return false;
}

// Get template instance based on metadata template and selected items
export function useTemplateInstance(metadataTemplate: MetadataTemplate, selectedItems: BoxItem[], isEditing: boolean) {
    const { formatMessage } = useIntl();
    const { displayName, fields, hidden, id, scope, templateKey, type } = metadataTemplate;

    const selectedItemsFields = fields.map(
        ({ displayName: fieldDisplayName, hidden: fieldHidden, id: fieldId, key, options, type: fieldType }) => {
            const defaultItemField = {
                displayName: fieldDisplayName,
                hidden: fieldHidden,
                id: fieldId,
                key,
                options,
                type: fieldType,
                value: getFieldValue(fieldType as MetadataFieldType, undefined),
            };

            const firstSelectedItem = selectedItems[0];
            const firstSelectedItemFieldValue = firstSelectedItem.metadata[scope][templateKey][key];

            // Case 1: Single selected item
            if (selectedItems.length <= 1) {
                return {
                    ...defaultItemField,
                    value: firstSelectedItemFieldValue,
                };
            }

            // Case 2.1: Multiple selected items, but all have the same initial value
            const allItemsHaveSameInitialValue = selectedItems.every(selectedItem =>
                areFieldValuesEqual(selectedItem.metadata[scope][templateKey][key], firstSelectedItemFieldValue),
            );

            if (allItemsHaveSameInitialValue) {
                return {
                    ...defaultItemField,
                    value: getFieldValue(fieldType as MetadataFieldType, firstSelectedItemFieldValue),
                };
            }

            // Case 2.2: Multiple selected items, but some have different initial values
            // Case 2.2.1: Edit Mode
            if (isEditing) {
                let fieldValue = getFieldValue(fieldType as MetadataFieldType, undefined);
                // Add MultiValue Option if the field is multiSelect or enum
                if (fieldType === 'multiSelect' || fieldType === 'enum') {
                    fieldValue = fieldType === 'enum' ? MULTI_VALUE_DEFAULT_VALUE : [MULTI_VALUE_DEFAULT_VALUE];
                    const multiValueOption = options?.find(option => option.key === MULTI_VALUE_DEFAULT_VALUE);
                    if (!multiValueOption) {
                        options?.push(MULTI_VALUE_DEFAULT_OPTION);
                    }
                }
                return {
                    ...defaultItemField,
                    value: fieldValue,
                };
            }

            /**
             * Case: 2.2.2 View Mode
             *
             * We want to show "Multiple values" label for multiple dates across files selection.
             * We use fragment here to bypass check in shared feature.
             * This feature tries to parse string as date if the string is passed as value.
             */
            const multipleValuesText = formatMessage(messages.multipleValues);
            return {
                ...defaultItemField,
                value: React.createElement(React.Fragment, null, multipleValuesText),
            };
        },
    );

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
