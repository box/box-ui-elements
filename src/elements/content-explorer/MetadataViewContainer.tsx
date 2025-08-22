import * as React from 'react';
import {
    EnumType,
    FloatType,
    MetadataFormFieldValue,
    MetadataTemplateFieldOption,
    RangeType,
} from '@box/metadata-filter';
import { MetadataView, type FilterValues, type MetadataViewProps, type MetadataFieldType } from '@box/metadata-view';

import type { Collection } from '../../common/types/core';
import type { MetadataTemplate } from '../../common/types/metadata';

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

        acc[key] = {
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
}

const MetadataViewContainer = ({
    actionBarProps,
    columns,
    currentCollection,
    metadataTemplate,
    onMetadataFilter,
    ...rest
}: MetadataViewContainerProps) => {
    const { items = [] } = currentCollection;
    const { initialFilterValues: initialFilterValuesProp, onFilterSubmit } = actionBarProps ?? {};

    const filterGroups = React.useMemo(
        () => [
            {
                toggleable: true,
                filters:
                    metadataTemplate?.fields?.map(field => {
                        return {
                            id: `${field.key}`,
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

    const transformedActionBarProps = React.useMemo(() => {
        return {
            ...actionBarProps,
            initialFilterValues,
            onFilterSubmit: handleFilterSubmit,
            filterGroups,
        };
    }, [actionBarProps, initialFilterValues, handleFilterSubmit, filterGroups]);

    return <MetadataView actionBarProps={transformedActionBarProps} columns={columns} items={items} {...rest} />;
};

export default MetadataViewContainer;
