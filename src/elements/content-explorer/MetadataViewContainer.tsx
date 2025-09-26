import * as React from 'react';
import { useIntl } from 'react-intl';
import {
    EnumType,
    FloatType,
    MetadataFormFieldValue,
    MetadataTemplateFieldOption,
    RangeType,
} from '@box/metadata-filter';
import {
    IconColumnVariant,
    MetadataView,
    PredefinedFilterName,
    type FilterValues,
    type MetadataViewProps,
    type MetadataFieldType,
    type Column,
} from '@box/metadata-view';
import { type Key } from '@react-types/shared';
import cloneDeep from 'lodash/cloneDeep';

import { SortDescriptor } from 'react-aria-components';

import { FIELD_ITEM_NAME } from '../../constants';
import type { Collection } from '../../common/types/core';
import type { MetadataTemplate, MetadataTemplateField } from '../../common/types/metadata';

import messages from '../common/messages';

// Public-friendly version of MetadataFormFieldValue from @box/metadata-filter
// (string[] for enum type, range/float objects stay the same)
type EnumToStringArray<T> = T extends EnumType ? string[] : T;
type ExternalMetadataFormFieldValue = EnumToStringArray<MetadataFormFieldValue>;

export type ExternalFilterValues = Record<
    string,
    {
        options?: FilterValues[string]['options'] | MetadataTemplateFieldOption[];
        fieldType: FilterValues[string]['fieldType'] | MetadataFieldType;
        value: ExternalMetadataFormFieldValue;
    }
>;

type ActionBarProps = Omit<
    MetadataViewProps['actionBarProps'],
    'initialFilterValues' | 'onFilterSubmit' | 'filterGroups'
> & {
    initialFilterValues?: ExternalFilterValues;
    onFilterSubmit?: (filterValues: ExternalFilterValues) => void;
};

const ITEM_FILTER_NAME = 'item_name';

/**
 * Helper function to trim metadataFieldNamePrefix from column names
 * For example: 'metadata.enterprise_1515946.mdViewTemplate1.industry' -> 'industry'
 */
function trimMetadataFieldPrefix(column: string): string {
    // Check if the column starts with 'metadata.' and contains at least 2 dots
    if (column.startsWith('metadata.') && column.split('.').length >= 3) {
        // Split by dots and take everything after the first 3 parts
        // metadata.enterprise_1515946.mdViewTemplate1.industry -> industry
        const parts = column.split('.');
        return parts.slice(3).join('.');
    }
    return column;
}

function transformInitialFilterValuesToInternal(
    publicValues?: ExternalFilterValues,
): Record<string, { value: MetadataFormFieldValue }> | undefined {
    if (!publicValues) return undefined;

    return Object.entries(publicValues).reduce<Record<string, { value: MetadataFormFieldValue }>>(
        (acc, [key, { value }]) => {
            acc[key] = Array.isArray(value) ? { value: { enum: value } } : { value };
            return acc;
        },
        {},
    );
}

export function convertFilterValuesToExternal(fields: FilterValues): ExternalFilterValues {
    return Object.entries(fields).reduce<ExternalFilterValues>((acc, [key, field]) => {
        const { value, options, fieldType } = field;

        // Transform the value based on its type
        const transformedValue: ExternalMetadataFormFieldValue =
            'enum' in value && Array.isArray(value.enum)
                ? value.enum // Convert enum type to string array
                : (value as RangeType | FloatType); // Keep range/float objects as-is

        acc[key === ITEM_FILTER_NAME ? FIELD_ITEM_NAME : key] = {
            options,
            fieldType,
            value: transformedValue,
        };

        return acc;
    }, {});
}

// Internal helper function for component use
function transformInternalFieldsToPublic(fields: FilterValues): ExternalFilterValues {
    return convertFilterValuesToExternal(fields);
}

export interface MetadataViewContainerProps extends Omit<MetadataViewProps, 'items' | 'actionBarProps'> {
    actionBarProps?: ActionBarProps;
    currentCollection: Collection;
    metadataTemplate: MetadataTemplate;
    onMetadataFilter: (fields: ExternalFilterValues) => void;
    /* Internally controlled onSortChange prop for the MetadataView component. */
    onSortChange?: (sortBy: Key, sortDirection: string) => void;
}

const MetadataViewContainer = ({
    actionBarProps,
    columns,
    currentCollection,
    metadataTemplate,
    onMetadataFilter,
    onSortChange: onSortChangeInternal,
    tableProps,
    ...rest
}: MetadataViewContainerProps) => {
    const { formatMessage } = useIntl();
    const { items = [] } = currentCollection;
    const { initialFilterValues: initialFilterValuesProp, onFilterSubmit } = actionBarProps ?? {};

    const newColumns = React.useMemo(() => {
        let clonedColumns = cloneDeep(columns);

        const hasItemNameField = clonedColumns.some((col: Column) => col.id === FIELD_ITEM_NAME);

        if (!hasItemNameField) {
            clonedColumns = [
                {
                    allowsSorting: true,
                    id: FIELD_ITEM_NAME,
                    isItemMetadata: true,
                    isRowHeader: true,
                    minWidth: 300,
                    textValue: formatMessage(messages.name),
                    type: 'string',
                },
                ...clonedColumns,
            ];
        }

        return clonedColumns;
    }, [columns, formatMessage]);

    const filterGroups = React.useMemo(() => {
        const clonedTemplate = cloneDeep(metadataTemplate);
        let fields = clonedTemplate?.fields || [];

        // Filter fields to only include those that have corresponding columns
        const columnIds = newColumns.map(col => col.id);
        fields = fields.filter((field: MetadataTemplateField) => {
            // For metadata fields, check if the column ID matches the field key
            // Column IDs for metadata fields are typically in format: metadata.template.fieldKey
            return columnIds.some(columnId => {
                const trimmedColumnId = trimMetadataFieldPrefix(columnId);
                return trimmedColumnId === field.key;
            });
        });

        // Check if item_name field already exists to avoid duplicates
        const hasItemNameField = fields.some((field: MetadataTemplateField) => field.key === ITEM_FILTER_NAME);

        if (!hasItemNameField) {
            fields = [
                {
                    key: ITEM_FILTER_NAME,
                    displayName: formatMessage(messages.name),
                    type: 'string',
                    shouldRenderChip: true,
                },
                ...fields,
            ];
        }

        return [
            {
                toggleable: true,
                filters:
                    fields?.map(field => {
                        return {
                            id: field.key,
                            name: field.displayName,
                            fieldType: field.type,
                            options: field.options?.map(({ key }) => key) || [],
                            shouldRenderChip: true,
                        };
                    }) || [],
            },
        ];
    }, [formatMessage, metadataTemplate, newColumns]);

    const initialFilterValues = React.useMemo(
        () => transformInitialFilterValuesToInternal(initialFilterValuesProp),
        [initialFilterValuesProp],
    );

    const handleFilterSubmit = React.useCallback(
        (fields: FilterValues) => {
            const transformed = transformInternalFieldsToPublic(fields);
            onMetadataFilter(transformed);
            if (onFilterSubmit) {
                onFilterSubmit(transformed);
            }
        },
        [onFilterSubmit, onMetadataFilter],
    );

    // Create a wrapper function that calls both. The wrapper function should follow the signature of onSortChange from RAC
    const handleSortChange = React.useCallback(
        ({ column, direction }: SortDescriptor) => {
            // Call the internal onSortChange first
            // API accepts asc/desc "https://developer.box.com/reference/post-metadata-queries-execute-read/"
            if (onSortChangeInternal) {
                const trimmedColumn = trimMetadataFieldPrefix(String(column));
                onSortChangeInternal(trimmedColumn, direction === 'ascending' ? 'ASC' : 'DESC');
            }
            const onSortChangeExternal = tableProps?.onSortChange;
            // Then call the original customer-provided onSortChange if it exists
            // Accepts "ascending" / "descending" (https://react-spectrum.adobe.com/react-aria/Table.html)
            if (onSortChangeExternal) {
                onSortChangeExternal({
                    column,
                    direction,
                });
            }
        },
        [onSortChangeInternal, tableProps],
    );

    const transformedActionBarProps = React.useMemo(() => {
        return {
            ...actionBarProps,
            initialFilterValues,
            onFilterSubmit: handleFilterSubmit,
            filterGroups,
            sortDropdownProps: {
                onSortChange: handleSortChange,
            },
            predefinedFilterOptions: {
                [PredefinedFilterName.KeywordSearchFilterGroup]: { isDisabled: true },
                [PredefinedFilterName.LocationFilterGroup]: { isDisabled: true },
            },
        };
    }, [actionBarProps, initialFilterValues, handleFilterSubmit, handleSortChange, filterGroups]);

    // Create new tableProps with our wrapper function
    const newTableProps = {
        ...tableProps,
        iconColumnVariant: IconColumnVariant.INLINE,
        onSortChange: handleSortChange,
    };

    return (
        <MetadataView
            actionBarProps={transformedActionBarProps}
            columns={newColumns}
            items={items}
            tableProps={newTableProps}
            {...rest}
        />
    );
};

export default MetadataViewContainer;
