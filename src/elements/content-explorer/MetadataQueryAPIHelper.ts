import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import getProp from 'lodash/get';
import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import isNil from 'lodash/isNil';

import API from '../../api';

import {
    JSON_PATCH_OP_ADD,
    JSON_PATCH_OP_REMOVE,
    JSON_PATCH_OP_REPLACE,
    JSON_PATCH_OP_TEST,
    METADATA_FIELD_TYPE_ENUM,
    METADATA_FIELD_TYPE_MULTISELECT,
} from '../../common/constants';
import { FIELD_NAME, FIELD_METADATA, FIELD_EXTENSION } from '../../constants';

import type { MetadataQuery as MetadataQueryType, MetadataQueryResponseData } from '../../common/types/metadataQueries';
import type {
    MetadataTemplateSchemaResponse,
    MetadataTemplate,
    MetadataFieldValue,
    MetadataType,
    MetadataQueryInstanceTypeField,
} from '../../common/types/metadata';
import type { ElementsXhrError, JSONPatchOperations } from '../../common/types/api';
import type { Collection, BoxItem } from '../../common/types/core';
import {
    getMimeTypeFilter,
    getRangeFilter,
    getSelectFilter,
    getStringFilter,
    mergeQueries,
    mergeQueryParams,
} from './MetadataQueryBuilder';
import { ExternalFilterValues } from './MetadataViewContainer';

type SuccessCallback = (metadataQueryCollection: Collection, metadataTemplate: MetadataTemplate) => void;
type ErrorCallback = (e: ElementsXhrError) => void;

const SELECT_TYPES: Array<typeof METADATA_FIELD_TYPE_ENUM | typeof METADATA_FIELD_TYPE_MULTISELECT> = [
    METADATA_FIELD_TYPE_ENUM,
    METADATA_FIELD_TYPE_MULTISELECT,
];

export default class MetadataQueryAPIHelper {
    api: API;

    metadataQueryResponseData: MetadataQueryResponseData;

    metadataTemplate: MetadataTemplate;

    templateKey: string;

    templateScope: string;

    metadataQuery: MetadataQueryType;

    constructor(api: API) {
        this.api = api;
    }

    createJSONPatchOperations = (
        field: string,
        oldValue: MetadataFieldValue | null,
        newValue: MetadataFieldValue | null,
    ): JSONPatchOperations => {
        let operation = JSON_PATCH_OP_REPLACE;

        if (isNil(oldValue) && newValue) {
            operation = JSON_PATCH_OP_ADD;
        }

        if (oldValue && isNil(newValue)) {
            operation = JSON_PATCH_OP_REMOVE;
        }

        const testOp = {
            op: JSON_PATCH_OP_TEST,
            path: `/${field}`,
            value: oldValue,
        };
        const patchOp = {
            op: operation,
            path: `/${field}`,
            value: newValue,
        };

        if (operation === JSON_PATCH_OP_REMOVE) {
            delete patchOp.value;
        }

        return operation === JSON_PATCH_OP_ADD ? [patchOp] : [testOp, patchOp];
    };

    getMetadataQueryFields = (): string[] => {
        /*
            Example metadata query:
            const query = {
                from: 'enterprise_12345.myAwesomeTemplateKey',
                fields: [
                    'name', // base representation field for an item (name, size, etag etc.)
                    'metadata.enterprise_12345.myAwesomeTemplateKey.field_1', // metadata instance field
                    'metadata.enterprise_12345.myAwesomeTemplateKey.field_2', // metadata instance field
                    'metadata.enterprise_12345.myAwesomeTemplateKey.field_3' // metadata instance field
                ],
                ancestor_folder_id: 0,
            };

            This function will return ['field_1', 'field_2', 'field_3']
        */
        const { fields = [], from } = this.metadataQuery;
        return fields.filter(field => field.includes(from)).map(field => field.split('.').pop());
    };

    flattenMetadata = (metadata?: MetadataType): MetadataType => {
        const templateFields = getProp(this.metadataTemplate, 'fields', []);
        const instance = getProp(metadata, `${this.templateScope}.${this.templateKey}`);

        if (!instance) {
            return {};
        }

        const queryFields = this.getMetadataQueryFields();

        const fields = queryFields.map((queryField: string) => {
            const templateField = find(templateFields, ['key', queryField]);
            const type = getProp(templateField, 'type'); // get data type
            const displayName = getProp(templateField, 'displayName', queryField); // get displayName, defaults to key

            const field: MetadataQueryInstanceTypeField = {
                key: `${FIELD_METADATA}.${this.templateScope}.${this.templateKey}.${queryField}`,
                value: instance[queryField],
                type,
                displayName,
            };

            if (includes(SELECT_TYPES, type)) {
                // get "options" for enums or multiselects
                field.options = getProp(templateField, 'options');
            }

            return field;
        });

        return {
            enterprise: {
                fields,
                id: instance.$id,
            },
        };
    };

    getDataWithTypes = (templateSchemaResponse?: MetadataTemplateSchemaResponse): Collection => {
        this.metadataTemplate = getProp(templateSchemaResponse, 'data');

        const { entries: items, next_marker: nextMarker }: MetadataQueryResponseData = this.metadataQueryResponseData;

        return {
            items,
            nextMarker,
        };
    };

    getTemplateSchemaInfo = (data: MetadataQueryResponseData): Promise<MetadataTemplateSchemaResponse | void> => {
        const { entries } = data;
        this.metadataQueryResponseData = data;
        if (!entries || entries.length === 0) {
            // Don't make metadata API call to get template info
            return Promise.resolve();
        }

        const metadata = getProp(entries, '[0].metadata');
        this.templateScope = Object.keys(metadata)[0];
        const instance = metadata[this.templateScope];
        this.templateKey = Object.keys(instance)[0];

        return this.api.getMetadataAPI(true).getSchemaByTemplateKey(this.templateKey);
    };

    queryMetadata = (): Promise<MetadataQueryResponseData> => {
        return new Promise((resolve, reject) => {
            this.api.getMetadataQueryAPI().queryMetadata(this.metadataQuery, resolve, reject, { forceFetch: true });
        });
    };

    fetchMetadataQueryResults = (
        metadataQuery: MetadataQueryType,
        successCallback: SuccessCallback,
        errorCallback: ErrorCallback,
        fields?: ExternalFilterValues,
    ): Promise<void> => {
        this.metadataQuery = this.verifyQueryFields(metadataQuery, fields);

        return this.queryMetadata()
            .then(this.getTemplateSchemaInfo)
            .then(this.getDataWithTypes)
            .then((collection: Collection) => {
                return successCallback(collection, this.metadataTemplate);
            })
            .catch(errorCallback);
    };

    updateMetadata = (
        file: BoxItem,
        field: string,
        oldValue: MetadataFieldValue | null,
        newValue: MetadataFieldValue | null,
        successCallback: () => void,
        errorCallback: ErrorCallback,
    ): Promise<void> => {
        const operations = this.createJSONPatchOperations(field, oldValue, newValue);
        return this.api
            .getMetadataAPI(true)
            .updateMetadata(file, this.metadataTemplate, operations, successCallback, errorCallback);
    };

    buildMDQueryParams = (filters: ExternalFilterValues) => {
        let argIndex = 0;
        let queries: string[] = [];
        let queryParams: { [key: string]: number | Date | string } = {};

        if (filters) {
            Object.keys(filters).forEach(key => {
                const filter = filters[key];
                if (!filter) {
                    return;
                }

                const { fieldType, value } = filter;

                switch (fieldType) {
                    case 'date':
                    case 'float': {
                        if (typeof value === 'object' && value !== null && 'range' in value) {
                            const result = getRangeFilter(value, key, argIndex);
                            queryParams = mergeQueryParams(queryParams, result.queryParams);
                            queries = mergeQueries(queries, result.queries);
                            argIndex += result.keysGenerated;
                            break;
                        }
                        break;
                    }
                    case 'enum':
                    case 'multiSelect': {
                        const arrayValue = Array.isArray(value) ? value.map(v => String(v)) : [String(value)];
                        let result;
                        if (key === 'mimetype-filter') {
                            result = getMimeTypeFilter(arrayValue, key, argIndex);
                        } else {
                            result = getSelectFilter(arrayValue, key, argIndex);
                        }
                        queryParams = mergeQueryParams(queryParams, result.queryParams);
                        queries = mergeQueries(queries, result.queries);
                        argIndex += result.keysGenerated;
                        break;
                    }

                    case 'string': {
                        if (value && value[0]) {
                            const result = getStringFilter(value[0], key, argIndex);
                            queryParams = mergeQueryParams(queryParams, result.queryParams);
                            queries = mergeQueries(queries, result.queries);
                            argIndex += result.keysGenerated;
                        }
                        break;
                    }

                    default:
                        break;
                }
            });
        }

        const query = queries.reduce((acc, curr, index) => {
            if (index > 0) {
                acc += ` AND ${curr}`;
            } else {
                acc = curr;
            }
            return acc;
        }, '');

        return {
            queryParams,
            query,
        };
    };

    mergeQuery = (customQuery: string, filterQuery: string): string => {
        if (!customQuery) {
            return filterQuery;
        }
        if (!filterQuery) {
            return customQuery;
        }
        // Merge queries with AND operator
        return `${customQuery} AND ${filterQuery}`;
    };

    /**
     * Verify that the metadata query has required fields and update it if necessary
     * For a file item, default fields included in the response are "type", "id", "etag"
     *
     * @param {MetadataQueryType} metadataQuery metadata query object
     * @param fields
     * @return {MetadataQueryType} updated metadata query object with required fields
     */
    verifyQueryFields = (metadataQuery: MetadataQueryType, fields?: ExternalFilterValues): MetadataQueryType => {
        const clonedQuery = cloneDeep(metadataQuery);
        const clonedFields = isArray(clonedQuery.fields) ? clonedQuery.fields : [];

        if (fields) {
            const { query: filterQuery, queryParams: filteredQueryParams } = this.buildMDQueryParams(fields);
            const { query: customQuery, query_params: customQueryParams } = clonedQuery;
            const query = this.mergeQuery(customQuery, filterQuery);
            const queryParams = mergeQueryParams(filteredQueryParams, customQueryParams);
            if (query) {
                clonedQuery.query = query;
                clonedQuery.query_params = queryParams;
            }
        }
        // Make sure the query fields array has "name" field which is necessary to display info.
        if (!clonedFields.includes(FIELD_NAME)) {
            clonedFields.push(FIELD_NAME);
        }

        if (!clonedFields.includes(FIELD_EXTENSION)) {
            clonedFields.push(FIELD_EXTENSION);
        }

        clonedQuery.fields = clonedFields;

        return clonedQuery;
    };
}
