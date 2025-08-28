import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
import getProp from 'lodash/get';
import includes from 'lodash/includes';
import isArray from 'lodash/isArray';
import type { MetadataTemplateField } from '@box/metadata-editor';
import type { MetadataFieldType } from '@box/metadata-view';
import API from '../../api';
import { areFieldValuesEqual, isEmptyValue, isMultiValuesField } from './utils';

import {
    JSON_PATCH_OP_ADD,
    JSON_PATCH_OP_REMOVE,
    JSON_PATCH_OP_REPLACE,
    JSON_PATCH_OP_TEST,
    METADATA_FIELD_TYPE_ENUM,
    METADATA_FIELD_TYPE_MULTISELECT,
} from '../../common/constants';
import { FIELD_NAME, FIELD_METADATA, FIELD_EXTENSION, FIELD_PERMISSIONS } from '../../constants';

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
        // check if two values are the same, return empty operations if so
        if (areFieldValuesEqual(oldValue, newValue)) {
            return [];
        }

        let operation = JSON_PATCH_OP_REPLACE;

        if (isEmptyValue(oldValue) && !isEmptyValue(newValue)) {
            operation = JSON_PATCH_OP_ADD;
        }

        if (!isEmptyValue(oldValue) && isEmptyValue(newValue)) {
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

    /**
     * Generate operations for all fields update in the metadata sidepanel
     *
     * @private
     * @return {JSONPatchOperations}
     */
    generateOperations = (
        item: BoxItem,
        templateOldFields: MetadataTemplateField[],
        templateNewFields: MetadataTemplateField[],
    ): JSONPatchOperations => {
        const { scope, templateKey } = this.metadataTemplate;
        const itemFields = item.metadata[scope][templateKey];
        const operations = templateNewFields.flatMap(newField => {
            let newFieldValue = newField.value;
            const { key, type } = newField;
            // when retrieve value from float type field, it gives a string instead
            if (type === 'float' && newFieldValue !== '') {
                newFieldValue = Number(newFieldValue);
            }
            const oldField = templateOldFields.find(f => f.key === key);
            const oldFieldValue = oldField.value;

            /*
                Generate operations array based on all the fields' orignal value and the incoming updated value.

                Edge Case:
                    If there are multiple items shared different value for enum or multi-select field, the form will
                    return 'Multiple values' as the value. In this case, it needs to generate operation based on the
                    actual item's field value.
            */
            const shouldUseItemFieldValue =
                isMultiValuesField(type as MetadataFieldType, oldFieldValue) &&
                !isMultiValuesField(type as MetadataFieldType, newFieldValue);

            return this.createJSONPatchOperations(
                key,
                shouldUseItemFieldValue ? itemFields[key] : oldFieldValue,
                newFieldValue,
            );
        });

        return operations;
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
    ): Promise<void> => {
        this.metadataQuery = this.verifyQueryFields(metadataQuery);
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

    updateMetadataWithOperations = (
        item: BoxItem,
        operations: JSONPatchOperations,
        successCallback: () => void,
        errorCallback: ErrorCallback,
    ): Promise<void> => {
        return this.api
            .getMetadataAPI(true)
            .updateMetadata(item, this.metadataTemplate, operations, successCallback, errorCallback);
    };

    bulkUpdateMetadata = (
        items: BoxItem[],
        templateOldFields: MetadataTemplateField[],
        templateNewFields: MetadataTemplateField[],
        successCallback: () => void,
        errorCallback: ErrorCallback,
    ): Promise<void> => {
        const operations: JSONPatchOperations = [];
        items.forEach(item => {
            const operation = this.generateOperations(item, templateOldFields, templateNewFields);
            operations.push(operation);
        });
        return this.api
            .getMetadataAPI(true)
            .bulkUpdateMetadata(items, this.metadataTemplate, operations, successCallback, errorCallback);
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

        if (!clonedFields.includes(FIELD_EXTENSION)) {
            clonedFields.push(FIELD_EXTENSION);
        }

        // This field is necessary to check if the user has permission to update metadata
        if (!clonedFields.includes(FIELD_PERMISSIONS)) {
            clonedFields.push(FIELD_PERMISSIONS);
        }

        clonedQuery.fields = clonedFields;

        return clonedQuery;
    };
}
