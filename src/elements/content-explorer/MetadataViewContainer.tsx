import * as React from 'react';
import type { EnumType, FloatType, MetadataFormFieldValue, RangeType } from '@box/metadata-filter';
import { MetadataView, type MetadataViewProps } from '@box/metadata-view';

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
}

const MetadataViewContainer = ({
    actionBarProps,
    columns,
    currentCollection,
    metadataTemplate,
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

    return <MetadataView actionBarProps={transformedActionBarProps} columns={columns} items={items} {...rest} />;
};

export default MetadataViewContainer;
