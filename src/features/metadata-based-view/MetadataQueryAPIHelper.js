/**
 * @flow strict
 * @file Metadata Queries API Helper
 * @author Box
 */
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import getProp from 'lodash/get';
import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import isNil from 'lodash/isNil';
import API from '../../api';

import {
    ITEM_TYPE_FILE,
    JSON_PATCH_OP_ADD,
    JSON_PATCH_OP_REMOVE,
    JSON_PATCH_OP_REPLACE,
    JSON_PATCH_OP_TEST,
    METADATA_FIELD_TYPE_ENUM,
    METADATA_FIELD_TYPE_MULTISELECT,
} from '../../common/constants';
import { FIELD_NAME, FIELD_METADATA, FIELD_EXTENSION, FIELD_CREATED_AT } from '../../constants';

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

type SuccessCallback = (metadataQueryCollection: Collection) => void;
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

    isV2: boolean;

    constructor(api: API, isV2: boolean = false) {
        this.api = api;
        this.isV2 = isV2;
    }

    createJSONPatchOperations = (
        field: string,
        oldValue: ?MetadataFieldValue,
        newValue: ?MetadataFieldValue,
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

    flattenResponseEntry = (metadataEntry: BoxItem): BoxItem => {
        const { metadata } = metadataEntry;
        return {
            ...metadataEntry,
            metadata: this.isV2 ? metadata : this.flattenMetadata(metadata),
        };
    };

    filterMetdataQueryResponse = (response: MetadataQueryResponseData): MetadataQueryResponseData => {
        const { entries = [], next_marker } = response;
        return {
            entries: this.isV2 ? entries : entries.filter(entry => getProp(entry, 'type') === ITEM_TYPE_FILE), // return only file items
            next_marker,
        };
    };

    getFlattenedDataWithTypes = (templateSchemaResponse?: MetadataTemplateSchemaResponse): Collection => {
        this.metadataTemplate = getProp(templateSchemaResponse, 'data');

        const { entries, next_marker }: MetadataQueryResponseData = this.metadataQueryResponseData;

        return {
            items: entries.map<BoxItem>(this.flattenResponseEntry),
            metadataTemplate: this.metadataTemplate,
            nextMarker: next_marker,
        };
    };

    getTemplateSchemaInfo = (data: MetadataQueryResponseData): Promise<MetadataTemplateSchemaResponse | void> => {
        const { entries } = data;
        this.metadataQueryResponseData = this.filterMetdataQueryResponse(data);
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
        successsCallback: SuccessCallback,
        errorCallback: ErrorCallback,
    ): Promise<void> => {
        this.metadataQuery = this.verifyQueryFields(metadataQuery);
        return this.queryMetadata()
            .then(this.getTemplateSchemaInfo)
            .then(this.getFlattenedDataWithTypes)
            .then(successsCallback)
            .catch(errorCallback);
    };

    updateMetadata = (
        file: BoxItem,
        field: string,
        oldValue: ?MetadataFieldValue,
        newValue: ?MetadataFieldValue,
        successsCallback: void => void,
        errorCallback: ErrorCallback,
    ): Promise<void> => {
        const operations = this.createJSONPatchOperations(field, oldValue, newValue);
        return this.api
            .getMetadataAPI(true)
            .updateMetadata(file, this.metadataTemplate, operations, successsCallback, errorCallback);
    };

    /**
     * Verify that the metadata query has required fields and update it if necessary
     * For a file item, default fields included in the response are "type", "id", "etag"
     *
     * @param {MetadataQueryType} metadataQuery metadata query object
     * @return {MetadataQueryType} updated metadata query object with required fields
     */
    verifyQueryFields = (metadataQuery: MetadataQueryType): MetadataQueryType => {
        const clonedQuery = cloneDeep(metadataQuery);
        const clonedFields = isArray(clonedQuery.fields) ? clonedQuery.fields : [];

        // Make sure the query fields array has "name" field which is necessary to display info.
        if (!clonedFields.includes(FIELD_NAME)) {
            clonedFields.push(FIELD_NAME);
        }
        if (this.isV2) {
            if (!clonedFields.includes(FIELD_EXTENSION)) {
                clonedFields.push(FIELD_EXTENSION);
            }

            if (!clonedFields.includes(FIELD_CREATED_AT)) {
                clonedFields.push(FIELD_CREATED_AT);
            }
        }

        clonedQuery.fields = clonedFields;

        return clonedQuery;
    };
}
