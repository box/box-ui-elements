/**
 * @flow
 * @file Helper for the box metadata query API
 * @author Box
 */

import getProp from 'lodash/get';
import omit from 'lodash/omit';
import Base from './Base';
import { CACHE_PREFIX_METADATA_QUERY, ERROR_CODE_METADATA_QUERY } from '../constants';
import { ITEM_TYPE_FILE } from '../common/constants';
import type {
    MetadataQuery as MetadataQueryType,
    FlattenedMetadataQueryResponse,
    FlattenedMetadataQueryResponseEntry,
    FlattenedMetadataQueryResponseEntryMetadata,
    MetadataQueryResponse,
    MetadataQueryResponseEntry,
    MetadataQueryResponseEntryMetadata,
} from '../common/types/metadataQueries';

class MetadataQuery extends Base {
    /**
     * @property {string}
     */
    key: string;

    /**
     * @property {Function}
     */
    successCallback: Function;

    /**
     * @property {Function}
     */
    errorCallback: ElementsErrorCallback;

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
        let flattenedMetadata = {};

        Object.keys(metadata).forEach(scope => {
            Object.keys(metadata[scope]).forEach(templateKey => {
                const nonconformingInstance = metadata[scope][templateKey];
                const data = omit(nonconformingInstance, [
                    '$id',
                    '$parent',
                    '$type',
                    '$typeScope',
                    '$typeVersion',
                    '$version',
                ]);

                flattenedMetadata = {
                    data,
                    id: nonconformingInstance.$id,
                    metadataTemplate: {
                        type: 'metadata-template',
                        templateKey,
                    },
                };
            });
        });

        return flattenedMetadata;
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
    flattenMetdataQueryResponse = ({ entries, next_marker }: MetadataQueryResponse): FlattenedMetadataQueryResponse => {
        return {
            items: entries.map<FlattenedMetadataQueryResponseEntry>(this.flattenResponseEntry),
            nextMarker: next_marker,
        };
    };

    /**
     * @param {Object} response
     */
    queryMetadataSuccessHandler = ({ data }: { data: MetadataQueryResponse }): void => {
        const cache: APICache = this.getCache();
        const filteredResponse = this.filterMetdataQueryResponse(data);
        // Flatten the filtered metadata query response and set it in cache
        cache.set(this.key, this.flattenMetdataQueryResponse(filteredResponse));
        this.finish();
    };

    /**
     * Does the network request to metadata query API
     * @param {Object} query query object with SQL Clauses like properties
     * @return {void}
     */
    queryMetadataRequest(query: MetadataQueryType): void {
        if (this.isDestroyed()) {
            return;
        }

        this.errorCode = ERROR_CODE_METADATA_QUERY;
        this.xhr
            .post({
                url: this.getUrl(),
                data: query,
            })
            .then(this.queryMetadataSuccessHandler)
            .catch(this.errorHandler);
    }

    /**
     * API for querying enterprise metadata
     * @param {Object} query - metadata query object
     * @param {Function} successCallback - Function to call with results
     * @param {Function} errorCallback - Function to call with errors
     * @param {boolean|void} [options.forceFetch] - Bypasses the cache
     * @return {void}
     */
    queryMetadata(
        query: MetadataQueryType,
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
