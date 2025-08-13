import * as React from 'react';
import { MetadataView, type MetadataViewProps } from '@box/metadata-view';
import { FloatType, MetadataFormFieldValue, RangeType } from '@box/metadata-filter';

import type { MetadataTemplate } from '../../common/types/metadata';
import type { Collection } from '../../common/types/core';

// Public-friendly metadata value shape (array value for enum type, range/float objects stay the same)
export type MetadataFormFieldValuePublic = string[] | RangeType | FloatType;

export type FilterValuesPublic = Record<
    string,
    {
        value: MetadataFormFieldValuePublic;
    }
>;

export type ActionBarProps = Omit<
    MetadataViewProps['actionBarProps'],
    'initialFilterValues' | 'onFilterSubmit' | 'filterGroups'
> & {
    initialFilterValues?: FilterValuesPublic;
    onFilterSubmit?: (filterValues: FilterValuesPublic) => void;
};

export interface MetadataViewContainerProps extends Omit<MetadataViewProps, 'items' | 'actionBarProps'> {
    actionBarProps?: ActionBarProps;
    currentCollection: Collection;
    metadataTemplate: MetadataTemplate;
}

const MetadataViewContainer = ({
    actionBarProps,
    columns,
    currentCollection,
    metadataTemplate,
    ...rest
}: MetadataViewContainerProps) => {
    const { items = [] } = currentCollection;

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
    const initialFilterValues = React.useMemo(() => {
        const filterValues = actionBarProps?.initialFilterValues;
        if (!filterValues) return undefined;

        const transformed: Record<string, { value: MetadataFormFieldValue }> = {};
        Object.entries(filterValues).forEach(([key, filterValue]) => {
            const { value } = filterValue;
            if (Array.isArray(value)) {
                // Convert customer-friendly array to internal enum shape
                transformed[key] = { value: { enum: value } };
            } else {
                // Keep range/float as-is
                transformed[key] = { value };
            }
        });
        return transformed;
    }, [actionBarProps?.initialFilterValues]);

    // Transform field values to public-friendly format
    const onFilterSubmit = React.useCallback(
        (fields: Record<string, { value: MetadataFormFieldValue }>) => {
            if (!actionBarProps?.onFilterSubmit) return;

            const transformed: Record<string, { value: MetadataFormFieldValuePublic }> = {};
            Object.entries(fields).forEach(([key, filterValue]) => {
                const { value } = filterValue;
                if (value && typeof value === 'object' && 'enum' in value && Array.isArray(value.enum)) {
                    transformed[key] = { value: value.enum };
                } else {
                    transformed[key] = { value: value as RangeType | FloatType };
                }
            });
            actionBarProps.onFilterSubmit(transformed);
        },
        [actionBarProps],
    );

    const transformedActionBarProps = React.useMemo(() => {
        return {
            ...actionBarProps,
            initialFilterValues,
            onFilterSubmit,
            filterGroups,
        };
    }, [actionBarProps, initialFilterValues, onFilterSubmit, filterGroups]);

    return <MetadataView actionBarProps={transformedActionBarProps} columns={columns} items={items} {...rest} />;
};

export default MetadataViewContainer;
