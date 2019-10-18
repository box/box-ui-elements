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

type MetadataColumnConfig = {
    canEdit?: boolean,
    name: string,
};

type MetadataColumnsToShow = Array<MetadataColumnConfig | string>;

type FlattenedMetadataQueryResponseEntryMetadataField = {
    name: string,
    options?: MetadataTemplateFieldOption,
    type: string,
    value: string,
};

type FlattenedMetadataQueryResponseEntryMetadata = {
    fields?: Array<FlattenedMetadataQueryResponseEntryMetadataField>,
    id?: string,
};

type FlattenedMetadataQueryResponseEntry = {
    id: string,
    metadata: FlattenedMetadataQueryResponseEntryMetadata,
    name?: string,
    permissions?: BoxItemPermission,
    size?: number,
};

type FlattenedMetadataQueryResponse = {
    items: Array<FlattenedMetadataQueryResponseEntry>,
    nextMarker?: string,
};

type FlattenedMetadataQueryResponseCollection = {
    items: Array<FlattenedMetadataQueryResponseEntry>,
    nextMarker: string,
    percentLoaded: Number,
};

type MetadataTemplateSchemaResponse = {
    data?: MetadataTemplate,
};

export type {
    FlattenedMetadataQueryResponse,
    FlattenedMetadataQueryResponseCollection,
    FlattenedMetadataQueryResponseEntry,
    FlattenedMetadataQueryResponseEntryMetadata,
    FlattenedMetadataQueryResponseEntryMetadataField,
    MetadataColumnConfig,
    MetadataColumnsToShow,
    MetadataTemplateSchemaResponse,
    MetadataQuery,
    MetadataQueryOrderByClause,
    MetadataQueryResponse,
    MetadataQueryResponseEntry,
    MetadataQueryResponseEntryEnterprise,
    MetadataQueryResponseEntryMetadata,
};
