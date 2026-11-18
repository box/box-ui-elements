import flatten from '../utils/flatten';
import { FOLDER_FIELDS_TO_FETCH } from '../utils/fields';
import { getBadItemError } from '../utils/error';
import Base from './Base';
import FileAPI from './File';
import FolderAPI from './Folder';
import WebLinkAPI from './WebLink';
import {
    CACHE_PREFIX_SEARCH,
    FIELD_RELEVANCE,
    FIELD_REPRESENTATIONS,
    X_REP_HINT_HEADER_DIMENSIONS_DEFAULT,
    SORT_DESC,
    ERROR_CODE_SEARCH,
} from '../constants';
import type { RequestOptions, ElementsErrorCallback, ElementsXhrError } from '../common/types/api';
import type { FlattenedBoxItem, FlattenedBoxItemCollection, Collection, BoxItemCollection } from '../common/types/core';
import type APICache from '../utils/Cache';

type SearchSuccessCallback = (collection: Collection) => void;

class Search extends Base {
    /** Maximum number of items to retrieve. */
    limit: number;

    /** Starting index from which to retrieve items. */
    offset: number;

    /** Id of the folder to search in. */
    id: string;

    /** Cache key for the current search. */
    key: string;

    /** Search string. */
    query: string;

    /** Invoked with the search results collection. */
    successCallback: SearchSuccessCallback;

    /** Invoked when the search request fails. */
    errorCallback: ElementsErrorCallback;

    /** Cache keys of the flattened search result items. */
    itemCache: string[];

    /** URL-encodes the search string. */
    getEncodedQuery(query: string): string {
        return encodeURIComponent(query);
    }

    /** Creates a cache key for searching `query` in folder `id`. */
    getCacheKey(id: string, query: string): string {
        return `${CACHE_PREFIX_SEARCH}${id}|${query}`;
    }

    /** URL for the search API. */
    getUrl(): string {
        return `${this.getBaseApiUrl()}/search`;
    }

    /** Whether the results for the current search are in the cache. */
    isLoaded(): boolean {
        const cache: APICache = this.getCache();
        return cache.has(this.key);
    }

    /** Calls `successCallback` with the cached search results. Throws when the cached results are malformed. */
    finish(): void {
        if (this.isDestroyed()) {
            return;
        }

        const cache: APICache = this.getCache();
        const search: FlattenedBoxItem = cache.get(this.key);
        const { item_collection }: FlattenedBoxItem = search;
        if (!item_collection) {
            throw getBadItemError();
        }

        const { entries, total_count }: FlattenedBoxItemCollection = item_collection;
        if (!Array.isArray(entries) || typeof total_count !== 'number') {
            throw getBadItemError();
        }

        const collection: Collection = {
            id: this.id,
            items: entries.map((key: string) => cache.get(key)),
            offset: this.offset,
            percentLoaded: 100,
            sortBy: FIELD_RELEVANCE, // Results are always sorted by relevance
            sortDirection: SORT_DESC, // Results are always sorted descending
            totalCount: total_count,
        };
        this.successCallback(collection);
    }

    /** Flattens and caches the search response, then calls `finish`. Throws when the response is malformed. */
    searchSuccessHandler = ({ data }: { data: BoxItemCollection }): void => {
        if (this.isDestroyed()) {
            return;
        }

        const { entries, total_count, limit, offset }: BoxItemCollection = data;
        if (
            !Array.isArray(entries) ||
            typeof total_count !== 'number' ||
            typeof limit !== 'number' ||
            typeof offset !== 'number'
        ) {
            throw getBadItemError();
        }

        const flattened: string[] = flatten(
            entries,
            new FolderAPI(this.options),
            new FileAPI(this.options),
            new WebLinkAPI(this.options),
        );
        this.itemCache = (this.itemCache || []).concat(flattened);

        this.getCache().set(this.key, {
            item_collection: { ...data, entries: this.itemCache },
        });

        this.finish();
    };

    /** Calls `errorCallback` with the search error. */
    searchErrorHandler = (error: Error): void => {
        if (this.isDestroyed()) {
            return;
        }

        this.errorCallback(error as ElementsXhrError, this.errorCode);
    };

    /** Requests the search results, using `options.fields` or the default folder fields. Rejects when destroyed. */
    searchRequest(options: RequestOptions = {}): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.reject();
        }

        const { fields } = options;
        const requestFields = fields || FOLDER_FIELDS_TO_FETCH;

        this.errorCode = ERROR_CODE_SEARCH;
        return this.xhr
            .get({
                url: this.getUrl(),
                params: {
                    offset: this.offset,
                    query: this.query,
                    ancestor_folder_ids: this.id,
                    limit: this.limit,
                    fields: requestFields.toString(),
                },
                headers: requestFields.includes(FIELD_REPRESENTATIONS)
                    ? {
                          'X-Rep-Hints': X_REP_HINT_HEADER_DIMENSIONS_DEFAULT,
                      }
                    : {},
            })
            .then(this.searchSuccessHandler)
            .catch(this.searchErrorHandler);
    }

    /**
     * Searches folder `id` for `query`, returning up to `limit` items starting at `offset`.
     * Uses cached results unless `options.forceFetch` is set.
     */
    search(
        id: string,
        query: string,
        limit: number,
        offset: number,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        options: RequestOptions = {},
    ): void {
        if (this.isDestroyed()) {
            return;
        }

        // Save references
        this.limit = limit;
        this.offset = offset;
        this.query = query;
        this.id = id;
        this.key = this.getCacheKey(id, this.getEncodedQuery(this.query));
        this.successCallback = successCallback as SearchSuccessCallback;
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
        this.searchRequest(options);
    }
}

export default Search;
