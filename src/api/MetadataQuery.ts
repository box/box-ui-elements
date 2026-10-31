/**
 * @file Helper for the box metadata query API
 * @author Box
 */

import Base from './Base';
import { CACHE_PREFIX_METADATA_QUERY, ERROR_CODE_METADATA_QUERY } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';
import type { MetadataQuery as MetadataQueryType, MetadataQueryResponseData } from '../common/types/metadataQueries';
import type APICache from '../utils/Cache';

class MetadataQuery extends Base {
    key: string;

    errorCallback: ElementsErrorCallback;

    /**
     * Creates a key for the metadata cache
     *
     * @param id - metadata template
     * @return key
     */
    getCacheKey(id: string): string {
        return `${CACHE_PREFIX_METADATA_QUERY}${id}`;
    }

    /**
     * API URL for metadata query
     * @return base url for files
     */
    getUrl(): string {
        return `${this.getBaseApiUrl()}/metadata_queries/execute_read`;
    }

    /**
     * Returns true for cache hit for metadata query results
     *
     * @return if query results are loaded
     */
    isLoaded(): boolean {
        const cache: APICache = this.getCache();
        return cache.has(this.key);
    }

    /**
     * Returns the results using successCallback
     */
    finish(): void {
        if (this.isDestroyed()) {
            return;
        }

        const cache: APICache = this.getCache();
        const metadataQueryData = cache.get(this.key);
        this.successCallback(metadataQueryData);
    }

    queryMetadataSuccessHandler = ({ data }: { data: MetadataQueryResponseData }): void => {
        const cache: APICache = this.getCache();
        cache.set(this.key, data);
        this.finish();
    };

    /**
     * Does the network request to metadata query API
     * @param query query object with SQL Clauses like properties
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
     * @param query - metadata query object
     * @param successCallback - Function to call with results
     * @param errorCallback - Function to call with errors
     * @param [options.forceFetch] - Bypasses the cache
     */
    queryMetadata(
        query: MetadataQueryType,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        options: { context?: { id?: string }; forceFetch?: boolean } = {},
    ): void {
        if (this.isDestroyed()) {
            return;
        }

        const { context = {} } = options;
        this.key = this.getCacheKey(context.id);
        this.successCallback = successCallback as Base['successCallback'];
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
