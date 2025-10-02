// @flow
import type { MetadataInstanceV2 } from './metadata';
import type { SortDirection, BoxItem } from './core';

type MetadataQueryResponseEntryEnterprise = {
    [string]: MetadataInstanceV2,
};

type MetadataQueryResponseData = {
    entries: Array<BoxItem>,
    next_marker?: string,
};

type MetadataQueryOrderByClause = {
    direction: SortDirection,
    field_key: string,
};

type MetadataFieldConfig = {
    canEdit?: boolean,
    displayName?: string,
    key: string,
};

// FieldsToShow array items could be simple strings or objects
// e.g. const fieldsToShow: FieldsToShow = [ 'name', { key: 'desc', displayName: 'Desc', canEdit: true } ];
type FieldsToShow = Array<MetadataFieldConfig | string>;

type MetadataQuery = {
    ancestor_folder_id: string,
    fields?: Array<string>,
    from: string,
    limit?: number,
    marker?: string,
    order_by?: Array<MetadataQueryOrderByClause>,
    query?: string,
    query_params?: {
        [string]: boolean | number | string,
    },
    use_index?: string,
};

export type {
    MetadataFieldConfig,
    FieldsToShow,
    MetadataQuery,
    MetadataQueryOrderByClause,
    MetadataQueryResponseData,
    MetadataQueryResponseEntryEnterprise,
};
