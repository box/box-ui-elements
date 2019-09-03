// @flow
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

type MetadataQueryResponse = {
    entries: Array<MetadataQueryResponseEntry>,
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

type MetadataColumnsToShow = Array<string>;

type FlattenedMetadataQueryResponseEntry = {
    id: typeof undefined | string,
    metadata: {
        data?: StringAnyMap,
        id?: string,
        metadataTemplate?: {
            templateKey: string,
            type: string,
        },
    },
    name: typeof undefined | string,
    size: typeof undefined | number,
};

type FlattenedMetadataQueryResponseCollection = {
    items: Array<FlattenedMetadataQueryResponseEntry>,
    nextMarker: string,
    percentLoaded: Number,
};

export type {
    FlattenedMetadataQueryResponseCollection,
    FlattenedMetadataQueryResponseEntry,
    MetadataColumnsToShow,
    MetadataQuery,
    MetadataQueryOrderByClause,
    MetadataQueryResponse,
    MetadataQueryResponseEntry,
    MetadataQueryResponseEntryEnterprise,
    MetadataQueryResponseEntryMetadata,
};
