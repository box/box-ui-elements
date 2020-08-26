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

// MetadataFieldsToShow array items could be simple strings or objects
// e.g. const metadataFieldsToShow: MetadataFieldsToShow = [ 'name', { key: 'desc', displayName: 'Desc', canEdit: true } ];
type MetadataFieldsToShow = Array<MetadataFieldConfig | string>;

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
    MetadataFieldsToShow,
    MetadataQuery,
    MetadataQueryOrderByClause,
    MetadataQueryResponseData,
    MetadataQueryResponseEntryEnterprise,
};
