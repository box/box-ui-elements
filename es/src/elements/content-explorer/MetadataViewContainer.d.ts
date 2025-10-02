import * as React from 'react';
import { EnumType, MetadataFormFieldValue, MetadataTemplateFieldOption } from '@box/metadata-filter';
import { type FilterValues, type MetadataViewProps, type MetadataFieldType } from '@box/metadata-view';
import { type Key } from '@react-types/shared';
import type { Collection } from '../../common/types/core';
import type { MetadataTemplate } from '../../common/types/metadata';
type EnumToStringArray<T> = T extends EnumType ? string[] : T;
type ExternalMetadataFormFieldValue = EnumToStringArray<MetadataFormFieldValue>;
export type ExternalFilterValues = Record<string, {
    options?: FilterValues[string]['options'] | MetadataTemplateFieldOption[];
    fieldType: FilterValues[string]['fieldType'] | MetadataFieldType;
    value: ExternalMetadataFormFieldValue;
}>;
type ActionBarProps = Omit<MetadataViewProps['actionBarProps'], 'initialFilterValues' | 'onFilterSubmit' | 'filterGroups'> & {
    initialFilterValues?: ExternalFilterValues;
    onFilterSubmit?: (filterValues: ExternalFilterValues) => void;
};
export declare function convertFilterValuesToExternal(fields: FilterValues): ExternalFilterValues;
export interface MetadataViewContainerProps extends Omit<MetadataViewProps, 'items' | 'actionBarProps'> {
    actionBarProps?: ActionBarProps;
    currentCollection: Collection;
    metadataTemplate: MetadataTemplate;
    onMetadataFilter: (fields: ExternalFilterValues) => void;
    onSortChange?: (sortBy: Key, sortDirection: string) => void;
}
declare const MetadataViewContainer: ({ actionBarProps, columns, currentCollection, metadataTemplate, onMetadataFilter, onSortChange: onSortChangeInternal, tableProps, ...rest }: MetadataViewContainerProps) => React.JSX.Element;
export default MetadataViewContainer;
