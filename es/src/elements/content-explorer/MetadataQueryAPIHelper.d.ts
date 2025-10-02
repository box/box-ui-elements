import type { MetadataTemplateField } from '@box/metadata-editor';
import API from '../../api';
import type { MetadataQuery as MetadataQueryType, MetadataQueryResponseData } from '../../common/types/metadataQueries';
import type { MetadataTemplateSchemaResponse, MetadataTemplate, MetadataFieldValue } from '../../common/types/metadata';
import type { ElementsXhrError } from '../../common/types/api';
import type { Collection, BoxItem } from '../../common/types/core';
import type { ExternalFilterValues } from './MetadataViewContainer';
type SuccessCallback = (metadataQueryCollection: Collection, metadataTemplate: MetadataTemplate) => void;
type ErrorCallback = (e: ElementsXhrError) => void;
export default class MetadataQueryAPIHelper {
    api: API;
    metadataQueryResponseData: MetadataQueryResponseData;
    metadataTemplate: MetadataTemplate;
    templateKey: string;
    templateScope: string;
    metadataQuery: MetadataQueryType;
    constructor(api: API);
    createJSONPatchOperations: (field: string, oldValue: MetadataFieldValue | null, newValue: MetadataFieldValue | null) => JSONPatchOperations;
    getMetadataQueryFields: () => string[];
    flattenMetadata: (metadata?: MetadataType) => MetadataType;
    getDataWithTypes: (templateSchemaResponse?: MetadataTemplateSchemaResponse) => Collection;
    getTemplateSchemaInfo: (data: MetadataQueryResponseData) => Promise<MetadataTemplateSchemaResponse | void>;
    /**
     * Generate operations for all fields update in the metadata sidepanel
     *
     * @private
     * @return {JSONPatchOperations}
     */
    generateOperations: (item: BoxItem, templateOldFields: MetadataTemplateField[], templateNewFields: MetadataTemplateField[]) => JSONPatchOperations;
    queryMetadata: () => Promise<MetadataQueryResponseData>;
    fetchMetadataQueryResults: (metadataQuery: MetadataQueryType, successCallback: SuccessCallback, errorCallback: ErrorCallback, fields?: ExternalFilterValues) => Promise<void>;
    updateMetadata: (file: BoxItem, field: string, oldValue: MetadataFieldValue | null, newValue: MetadataFieldValue | null, successCallback: () => void, errorCallback: ErrorCallback) => Promise<void>;
    updateMetadataWithOperations: (item: BoxItem, operations: JSONPatchOperations, successCallback: () => void, errorCallback: ErrorCallback) => Promise<void>;
    bulkUpdateMetadata: (items: BoxItem[], templateOldFields: MetadataTemplateField[], templateNewFields: MetadataTemplateField[], successCallback: () => void, errorCallback: ErrorCallback) => Promise<void>;
    buildMetadataQueryParams: (filters: ExternalFilterValues) => {
        queryParams: {
            [key: string]: string | number | Date;
        };
        query: string;
    };
    mergeQuery: (customQuery: string, filterQuery: string) => string;
    /**
     * Verify that the metadata query has required fields and update it if necessary
     * For a file item, default fields included in the response are "type", "id", "etag"
     *
     * @param {MetadataQueryType} metadataQuery metadata query object
     * @param {ExternalFilterValues} [fields] optional filter values to apply to the metadata query
     * @return {MetadataQueryType} updated metadata query object with required fields
     */
    verifyQueryFields: (metadataQuery: MetadataQueryType, fields?: ExternalFilterValues) => MetadataQueryType;
}
export {};
