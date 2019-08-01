// @flow
type MetadataQeuryResponseEntryEnterprise = {
    [string]: MetadataInstanceV2,
};

type MetadataQeuryResponseEntryMetadata = {
    [string]: MetadataQeuryResponseEntryEnterprise,
};

type MetadataQeuryResponseEntry = {
    item: BoxItem,
    metadata: MetadataQeuryResponseEntryMetadata,
};

type MetadataQueryResponse = {
    entries: Array<MetadataQeuryResponseEntry>,
    next_marker?: string,
};

type MetadataQueryOrderByClause = {
    direction: SortDirection,
    field_key: string,
};

type MetadataQuery = {
    ancestor_folder_id: string,
    limit?: number,
    next_marker?: string,
    order_by?: Array<MetadataQueryOrderByClause>,
    query: string,
    query_params: Object,
};

export type {
    MetadataQuery,
    MetadataQueryOrderByClause,
    MetadataQueryResponse,
    MetadataQeuryResponseEntry,
    MetadataQeuryResponseEntryMetadata,
    MetadataQeuryResponseEntryEnterprise,
};
