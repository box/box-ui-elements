import Base from './Base';
import { CACHE_PREFIX_METADATA_QUERY, ERROR_CODE_METADATA_QUERY } from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';
import type { MetadataQuery as MetadataQueryType, MetadataQueryResponseData } from '../common/types/metadataQueries';
import type APICache from '../utils/Cache';

class MetadataQuery extends Base {
    key: string;

    errorCallback: ElementsErrorCallback;

    /** Creates the cache key for query results identified by `id`. */
    getCacheKey(id: string): string {
        return `${CACHE_PREFIX_METADATA_QUERY}${id}`;
    }

    /** URL of the metadata query execute endpoint. */
    getUrl(): string {
        return `${this.getBaseApiUrl()}/metadata_queries/execute_read`;
    }

    /** Whether results for the current key are cached. */
    isLoaded(): boolean {
        const cache: APICache = this.getCache();
        return cache.has(this.key);
    }

    /** Delivers the loaded query results to the caller. */
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

    /** Posts the query to the metadata query API unless destroyed. */
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
     * Queries enterprise metadata, serving cached results when available
     * @param query - metadata query object
     * @param successCallback - called with the results
     * @param errorCallback - called with errors
     * @param options - `forceFetch` bypasses the cache; `context.id` keys the cached results
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

        if (options.forceFetch) {
            this.getCache().unset(this.key);
        }

        if (this.isLoaded()) {
            this.finish();
            return;
        }

        this.queryMetadataRequest(query);
    }
}

export default MetadataQuery;
