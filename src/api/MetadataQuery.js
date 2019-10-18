/**
 * @flow
 * @file Helper for the box metadata query API
 * @author Box
 */

import getProp from 'lodash/get';
import find from 'lodash/find';
import includes from 'lodash/includes';
import Base from './Base';
import MetadataAPI from './Metadata';
import { CACHE_PREFIX_METADATA_QUERY, ERROR_CODE_METADATA_QUERY } from '../constants';
import { METADATA_FIELD_TYPE_ENUM, METADATA_FIELD_TYPE_MULTISELECT, ITEM_TYPE_FILE } from '../common/constants';

import type {
    MetadataQuery as MetadataQueryType,
    FlattenedMetadataQueryResponse,
    FlattenedMetadataQueryResponseEntry,
    FlattenedMetadataQueryResponseEntryMetadata,
    FlattenedMetadataQueryResponseEntryMetadataField,
    MetadataTemplateSchemaResponse,
    MetadataQueryResponse,
    MetadataQueryResponseEntry,
    MetadataQueryResponseEntryMetadata,
} from '../common/types/metadataQueries';

const SELECT_TYPES: Array<'enum' | 'multiSelect'> = [METADATA_FIELD_TYPE_ENUM, METADATA_FIELD_TYPE_MULTISELECT];

class MetadataQuery extends Base {
    key: string;

    templateKey: string;

    templateScope: string;

    metadataTemplate: ?MetadataTemplate;

    metadataQueryResponse: MetadataQueryResponse;

    successCallback: Function;

    errorCallback: ElementsErrorCallback;

    metadataAPI: MetadataAPI;

    /**
     * Creates a key for the metadata cache
     *
     * @param {string} id - metadata template
     * @return {string} key
     */
    getCacheKey(id: string): string {
        return `${CACHE_PREFIX_METADATA_QUERY}${id}`;
    }

    /**
     * API URL for metadata query
     * @return {string} base url for files
     */
    getUrl(): string {
        return `${this.getBaseApiUrl()}/metadata_queries/execute`;
    }

    /**
     * Returns true for cache hit for metadata query results
     *
     * @return {boolean} if query results are loaded
     */
    isLoaded(): boolean {
        const cache: APICache = this.getCache();
        return cache.has(this.key);
    }

    /**
     * Returns the results using successCallback
     *
     * @return {void}
     */
    finish(): void {
        if (this.isDestroyed()) {
            return;
        }

        const cache: APICache = this.getCache();
        const metadataQueryData = cache.get(this.key);
        this.successCallback(metadataQueryData);
    }

    /**
     * Returns the response object with entries of type 'file' only.
     *
     * @param {Object} response
     * @return {Object}
     */
    filterMetdataQueryResponse = (response: MetadataQueryResponse): MetadataQueryResponse => {
        const { entries = [], next_marker } = response;
        return {
            entries: entries.filter(entry => getProp(entry, 'item.type') === ITEM_TYPE_FILE), // return only file items
            next_marker,
        };
    };

    /**
     * Extracts flattened metadata from the metadata response object
     * @param {Object} - metadata from the query response entry
     * @return {Object} - flattened metadata entry without the $ fields
     */
    flattenMetadata = (metadata: MetadataQueryResponseEntryMetadata): FlattenedMetadataQueryResponseEntryMetadata => {
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
                const field: FlattenedMetadataQueryResponseEntryMetadataField = {
                    name: key,
                    value: instance[key],
                    type,
                };

                if (includes(SELECT_TYPES, type)) {
                    field.options = getProp(templateField, 'options'); // get "options"
                }

                return field;
            });

        return {
            fields,
            id: instance.$id,
        };
    };

    /**
     * Converts metadata query response entry to a flattened one
     * @param {Object} - metadata query response entry
     * @return {Object} - flattened metadata query response entry
     */
    flattenResponseEntry = ({ item, metadata }: MetadataQueryResponseEntry): FlattenedMetadataQueryResponseEntry => {
        const { id, name, size } = item;

        return {
            id,
            metadata: this.flattenMetadata(metadata),
            name,
            size,
        };
    };

    /**
     * Flattens metadata query response
     * @param {Object} - metadata query response object
     * @return {Object} - flattened metadata query response object
     */
    flattenMetdataQueryResponse = (): FlattenedMetadataQueryResponse => {
        const { entries, next_marker }: MetadataQueryResponse = this.metadataQueryResponse;
        return {
            items: entries.map<FlattenedMetadataQueryResponseEntry>(this.flattenResponseEntry),
            nextMarker: next_marker,
        };
    };

    /**
     * Success handler function storing flattened response in Cache
     * @param {Object} templateSchemaResponse - metadata template schema response
     */
    successHandler = (templateSchemaResponse: ?MetadataTemplateSchemaResponse): void => {
        this.metadataTemplate = getProp(templateSchemaResponse, 'data');
        const cache: APICache = this.getCache();
        // Flatten the filtered metadata query response and set it in cache
        cache.set(this.key, this.flattenMetdataQueryResponse());
        this.finish();
    };

    /**
     * Gets template schema
     * @param {Object} response
     */
    getTemplateSchemaInfo = ({
        data,
    }: {
        data: MetadataQueryResponse,
    }): Promise<MetadataTemplateSchemaResponse | void> => {
        this.metadataQueryResponse = this.filterMetdataQueryResponse(data);
        const { entries } = data;

        if (!entries || entries.length === 0) {
            // if no items found for provided query, don't make API call to get template info
            return Promise.resolve();
        }

        const metadata = getProp(entries, '[0].metadata');
        this.templateScope = Object.keys(metadata)[0];
        const instance = metadata[this.templateScope];
        this.templateKey = Object.keys(instance)[0];

        return this.metadataAPI.getSchemaByTemplateKey(this.templateKey);
    };

    /**
     * Does the network request to metadata query API
     * @param {Object} query query object with SQL Clauses like properties
     * @return {void}
     */
    queryMetadataRequest(query: MetadataQueryType): Promise<void> {
        if (this.isDestroyed()) {
            Promise.resolve();
        }

        this.errorCode = ERROR_CODE_METADATA_QUERY;
        return this.xhr
            .post({
                url: this.getUrl(),
                data: query,
            })
            .then(this.getTemplateSchemaInfo)
            .then(this.successHandler)
            .catch(this.errorHandler);
    }

    /**
     * API for querying enterprise metadata
     * @param {Object} query - metadata query object
     * @param {Object} metadataAPI - metadata API
     * @param {Function} successCallback - Function to call with results
     * @param {Function} errorCallback - Function to call with errors
     * @param {boolean|void} [options.forceFetch] - Bypasses the cache
     * @return {void}
     */
    queryMetadata(
        query: MetadataQueryType,
        metadataAPI: MetadataAPI,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        options: Object = {},
    ): void {
        if (this.isDestroyed()) {
            return;
        }

        const { context = {} } = options;
        this.key = this.getCacheKey(context.id);
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
        this.metadataAPI = metadataAPI;

        // Clear the cache if needed
        if (options.forceFetch) {
            this.getCache().unset(this.key);
        }

        // Return the Cache value if it exists
        if (this.isLoaded()) {
            this.finish();
            return;
        }

        // Make the XHR request
        this.queryMetadataRequest(query);
    }
}

export default MetadataQuery;
