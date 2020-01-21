// @flow
import type { MetadataInstanceV2 } from './metadata';
import type { SortDirection, BoxItem } from './core';

type MetadataQueryResponseEntryEnterprise = {
    [string]: MetadataInstanceV2,
};

type MetadataQueryResponseEntryMetadata = {
    [string]: MetadataQueryResponseEntryEnterprise,
};

type MetadataQueryResponseEntry = {
    item: BoxItem,
    metadata: MetadataQueryResponseEntryMetadata,
};

type MetadataQueryResponseData = {
    entries: Array<MetadataQueryResponseEntry>,
    next_marker?: string,
};

type MetadataQueryOrderByClause = {
    direction: SortDirection,
    field_key: string,
};

type MetadataQuery = {
    ancestor_folder_id: string,
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

type MetadataColumnConfig = {
    canEdit?: boolean,
    name: string,
};

type MetadataColumnsToShow = Array<MetadataColumnConfig | string>;

export type {
    MetadataColumnConfig,
    MetadataColumnsToShow,
    MetadataQuery,
    MetadataQueryOrderByClause,
    MetadataQueryResponseData,
    MetadataQueryResponseEntry,
    MetadataQueryResponseEntryEnterprise,
    MetadataQueryResponseEntryMetadata,
};
