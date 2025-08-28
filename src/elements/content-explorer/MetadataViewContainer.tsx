import * as React from 'react';
import type { EnumType, FloatType, MetadataFormFieldValue, RangeType } from '@box/metadata-filter';
import { MetadataView, type MetadataViewProps } from '@box/metadata-view';
import { type Key } from '@react-types/shared';

import { SortDescriptor } from 'react-aria-components';
import type { Collection } from '../../common/types/core';
import type { MetadataTemplate } from '../../common/types/metadata';

// Public-friendly version of MetadataFormFieldValue from @box/metadata-filter
// (string[] for enum type, range/float objects stay the same)
type EnumToStringArray<T> = T extends EnumType ? string[] : T;
type ExternalMetadataFormFieldValue = EnumToStringArray<MetadataFormFieldValue>;

type ExternalFilterValues = Record<
    string,
    {
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

function transformInternalFieldsToPublic(
    fields: Record<string, { value: MetadataFormFieldValue }>,
): ExternalFilterValues {
    return Object.entries(fields).reduce<ExternalFilterValues>((acc, [key, { value }]) => {
        acc[key] =
            'enum' in value && Array.isArray(value.enum)
                ? { value: value.enum }
                : { value: value as RangeType | FloatType };
        return acc;
    }, {});
}

export interface MetadataViewContainerProps extends Omit<MetadataViewProps, 'items' | 'actionBarProps'> {
    actionBarProps?: ActionBarProps;
    currentCollection: Collection;
    metadataTemplate: MetadataTemplate;
    /* Internally controlled onSortChange prop for the MetadataView component. */
    onSortChange?: (sortBy: Key, sortDirection: string) => void;
}

const MetadataViewContainer = ({
    actionBarProps,
    columns,
    currentCollection,
    metadataTemplate,
    onSortChange: onSortChangeInternal,
    ...rest
}: MetadataViewContainerProps) => {
    const { items = [] } = currentCollection;
    const { initialFilterValues: initialFilterValuesProp, onFilterSubmit: onFilterSubmitProp } = actionBarProps ?? {};

    const filterGroups = React.useMemo(
        () => [
            {
                toggleable: true,
                filters:
                    metadataTemplate?.fields?.map(field => {
                        return {
                            id: `${field.key}-filter`,
                            name: field.displayName,
                            fieldType: field.type,
                            options: field.options?.map(({ key }) => key) || [],
                            shouldRenderChip: true,
                        };
                    }) || [],
            },
        ],
        [metadataTemplate],
    );

    // Transform initial filter values to internal field format
    const initialFilterValues = React.useMemo(
        () => transformInitialFilterValuesToInternal(initialFilterValuesProp),
        [initialFilterValuesProp],
    );

    // Transform field values to public-friendly format
    const onFilterSubmit = React.useCallback(
        (fields: Record<string, { value: MetadataFormFieldValue }>) => {
            if (!onFilterSubmitProp) return;
            const transformed = transformInternalFieldsToPublic(fields);
            onFilterSubmitProp(transformed);
        },
        [onFilterSubmitProp],
    );

    const transformedActionBarProps = React.useMemo(() => {
        return {
            ...actionBarProps,
            initialFilterValues,
            onFilterSubmit,
            filterGroups,
        };
    }, [actionBarProps, initialFilterValues, onFilterSubmit, filterGroups]);

    // Extract the original tableProps.onSortChange from rest
    const { tableProps, ...otherRest } = rest;
    const onSortChangeExternal = tableProps?.onSortChange;

    // Create a wrapper function that calls both. The wrapper function should follow the signature of onSortChange from RAC
    const handleSortChange = React.useCallback(
        ({ column, direction }: SortDescriptor) => {
            // Call the internal onSortChange first
            // API accepts asc/desc "https://developer.box.com/reference/post-metadata-queries-execute-read/"
            if (onSortChangeInternal) {
                const trimmedColumn = trimMetadataFieldPrefix(String(column));
                onSortChangeInternal(trimmedColumn, direction === 'ascending' ? 'ASC' : 'DESC');
            }

            // Then call the original customer-provided onSortChange if it exists
            // Accepts "ascending" / "descending" (https://react-spectrum.adobe.com/react-aria/Table.html)
            if (onSortChangeExternal) {
                onSortChangeExternal({
                    column,
                    direction,
                });
            }
        },
        [onSortChangeInternal, onSortChangeExternal],
    );

    // Create new tableProps with our wrapper function
    const newTableProps = {
        ...tableProps,
        onSortChange: handleSortChange,
    };

    return (
        <MetadataView
            actionBarProps={transformedActionBarProps}
            columns={columns}
            items={items}
            tableProps={newTableProps}
            {...otherRest}
        />
    );
};

export default MetadataViewContainer;
