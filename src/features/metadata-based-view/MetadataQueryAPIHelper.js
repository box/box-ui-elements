/**
 * @flow strict
 * @file Metadata Queries API Helper
 * @author Box
 */
import find from 'lodash/find';
import getProp from 'lodash/get';
import includes from 'lodash/includes';
import API from '../../api';

import { METADATA_FIELD_TYPE_ENUM, METADATA_FIELD_TYPE_MULTISELECT, ITEM_TYPE_FILE } from '../../common/constants';

import type {
    MetadataQuery as MetadataQueryType,
    MetadataQueryResponseData,
    MetadataQueryResponseEntry,
    MetadataQueryResponseEntryMetadata,
} from '../../common/types/metadataQueries';
import type { MetadataTemplateSchemaResponse } from '../../common/types/metadata';

type SuccessCallback = (metadataQueryCollection: Collection) => void;
type ErrorCallback = (e: ElementsXhrError) => void;

const SELECT_TYPES: Array<typeof METADATA_FIELD_TYPE_ENUM | typeof METADATA_FIELD_TYPE_MULTISELECT> = [
    METADATA_FIELD_TYPE_ENUM,
    METADATA_FIELD_TYPE_MULTISELECT,
];

export default class MetadataQueryAPIHelper {
    api: API;

    metadataQueryResponseData: MetadataQueryResponseData;

    metadataTemplate: ?MetadataTemplate;

    templateKey: string;

    templateScope: string;

    constructor(api: API) {
        this.api = api;
    }

    flattenMetadata = (metadata: MetadataQueryResponseEntryMetadata): MetadataType => {
        const templateFields = getProp(this.metadataTemplate, 'fields', []);
        const instance = getProp(metadata, `${this.templateScope}.${this.templateKey}`);

        if (!instance) {
            return {};
        }

        const fields = Object.keys(instance)
            .filter(key => !key.startsWith('$'))
            .map(key => {
                const templateField = find(templateFields, ['key', key]);
                const type = getProp(templateField, 'type'); // get data type
                const field: MetadataQueryInstanceTypeField = {
                    name: key,
                    value: instance[key],
                    type,
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

    flattenResponseEntry = ({ item, metadata }: MetadataQueryResponseEntry): BoxItem => {
        const { id, name, size } = item;

        return {
            id,
            metadata: this.flattenMetadata(metadata),
            name,
            size,
        };
    };

    filterMetdataQueryResponse = (response: MetadataQueryResponseData): MetadataQueryResponseData => {
        const { entries = [], next_marker } = response;
        return {
            entries: entries.filter(entry => getProp(entry, 'item.type') === ITEM_TYPE_FILE), // return only file items
            next_marker,
        };
    };

    getFlattenedDataWithTypes = (templateSchemaResponse?: MetadataTemplateSchemaResponse): Collection => {
        this.metadataTemplate = getProp(templateSchemaResponse, 'data');
        const { entries, next_marker }: MetadataQueryResponseData = this.metadataQueryResponseData;
        return {
            items: entries.map<BoxItem>(this.flattenResponseEntry),
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

    queryMetadata = (metadataQuery: MetadataQueryType): Promise<MetadataQueryResponseData> => {
        return new Promise((resolve, reject) => {
            this.api.getMetadataQueryAPI().queryMetadata(metadataQuery, resolve, reject, { forceFetch: true });
        });
    };

    fetchMetadataQueryResults = (
        metadataQuery: MetadataQueryType,
        successsCallback: SuccessCallback,
        errorCallback: ErrorCallback,
    ): Promise<void> => {
        return this.queryMetadata(metadataQuery)
            .then(this.getTemplateSchemaInfo)
            .then(this.getFlattenedDataWithTypes)
            .then(successsCallback)
            .catch(errorCallback);
    };
}
