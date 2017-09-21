/**
 * @flow
 * @file Helper for the box search api
 * @author Box
 */

import Base from './Base';
import FileAPI from './File';
import FolderAPI from './Folder';
import WebLinkAPI from '../api/WebLink';
import flatten from '../util/flatten';
import sort from '../util/sorter';
import Cache from '../util/Cache';
import getFields from '../util/fields';
import { CACHE_PREFIX_SEARCH, X_REP_HINTS } from '../constants';
import getBadItemError from '../util/error';
import type {
    BoxItemCollection,
    FlattenedBoxItem,
    FlattenedBoxItemCollection,
    SortBy,
    SortDirection,
    Collection
} from '../flowTypes';

const LIMIT_ITEM_FETCH = 200;

class Search extends Base {
    /**
     * @property {number}
     */
    offset: number;

    /**
     * @property {string}
     */
    id: string;

    /**
     * @property {string}
     */
    key: string;

    /**
     * @property {string}
     */
    query: string;

    /**
     * @property {string}
     */
    sortBy: SortBy;

    /**
     * @property {string}
     */
    sortDirection: SortDirection;

    /**
     * @property {Function}
     */
    successCallback: Function;

    /**
     * @property {Function}
     */
    errorCallback: Function;

    /**
     * @property {Array}
     */
    itemCache: string[];

    /**
     * @property {boolean}
     */
    includePreviewFields: boolean;

    /**
     * @property {boolean}
     */
    includePreviewSidebarFields: boolean;

    /**
     * Creates a key for the cache
     *
     * @param {string} id folder id
     * @param {string} query search string
     * @return {string} key
     */
    getEncodedQuery(query: string): string {
        return encodeURIComponent(query);
    }

    /**
     * Creates a key for the cache
     *
     * @param {string} id folder id
     * @param {string} query search string
     * @return {string} key
     */
    getCacheKey(id: string, query: string): string {
        return `${CACHE_PREFIX_SEARCH}${id}|${query}`;
    }

    /**
     * URL for search api
     *
     * @param {string} [id] optional file id
     * @return {string} base url for files
     */
    getUrl(): string {
        return `${this.getBaseUrl()}/search`;
    }

    /**
     * Tells if a search results has its items all loaded
     *
     * @return {boolean} if items are loaded
     */
    isLoaded(): boolean {
        const cache: Cache = this.getCache();
        if (!cache.has(this.key)) {
            return false;
        }
        const { item_collection = {} }: FlattenedBoxItem = cache.get(this.key);
        return !!item_collection.isLoaded;
    }

    /**
     * Sorts and returns the results
     *
     * @return {void}
     */
    finish(): void {
        if (this.isDestroyed()) {
            return;
        }

        const cache: Cache = this.getCache();
        const search: FlattenedBoxItem = cache.get(this.key);
        const sortedSearch: FlattenedBoxItem = sort(search, this.sortBy, this.sortDirection, cache);
        const { item_collection }: FlattenedBoxItem = sortedSearch;
        if (!item_collection) {
            throw getBadItemError();
        }

        const { entries, total_count }: FlattenedBoxItemCollection = item_collection;
        if (!Array.isArray(entries) || typeof total_count !== 'number') {
            throw getBadItemError();
        }

        // Total count may be more than the actual number of entries, so don't rely
        // on it on its own. Good for calculating percentatge, but not good for
        // figuring our when the collection is done loading.
        const percentLoaded: number =
            !!item_collection.isLoaded || total_count === 0 ? 100 : entries.length * 100 / total_count;

        const collection: Collection = {
            percentLoaded,
            id: this.id,
            sortBy: this.sortBy,
            sortDirection: this.sortDirection,
            items: entries.map((key: string) => cache.get(key))
        };
        this.successCallback(collection);
    }

    /**
     * Handles the folder search response
     *
     * @param {Object} response
     * @return {void}
     */
    searchSuccessHandler = (response: BoxItemCollection): void => {
        if (this.isDestroyed()) {
            return;
        }

        const { entries, total_count, limit, offset }: BoxItemCollection = response;
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
            new WebLinkAPI(this.options)
        );
        this.itemCache = (this.itemCache || []).concat(flattened);

        // Total count may be more than the actual number of entries, so don't rely
        // on it on its own. Good for calculating percentatge, but not good for
        // figuring our when the collection is done loading.
        const isLoaded: boolean = offset + limit >= total_count;

        this.getCache().set(this.key, {
            item_collection: Object.assign({}, response, {
                isLoaded,
                entries: this.itemCache
            })
        });

        if (!isLoaded) {
            this.offset += limit;
            this.searchRequest();
        }

        this.finish();
    };

    /**
     * Handles the search error
     *
     * @param {Error} error fetch error
     * @return {void}
     */
    searchErrorHandler = (error: Error): void => {
        if (this.isDestroyed()) {
            return;
        }
        this.errorCallback(error);
    };

    /**
     * Does the network request
     *
     * @return {void}
     */
    searchRequest(): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.reject();
        }

        return this.xhr
            .get({
                url: this.getUrl(),
                params: {
                    offset: this.offset,
                    query: this.query,
                    ancestor_folder_ids: this.id,
                    limit: LIMIT_ITEM_FETCH,
                    fields: getFields(this.includePreviewFields, this.includePreviewSidebarFields)
                },
                headers: { 'X-Rep-Hints': X_REP_HINTS }
            })
            .then(this.searchSuccessHandler)
            .catch(this.searchErrorHandler);
    }

    /**
     * Gets search results
     *
     * @param {string} id - folder id
     * @param {string} query - search string
     * @param {string} sortBy - sort by field
     * @param {string} sortDirection - sort direction
     * @param {Function} successCallback - Function to call with results
     * @param {Function} errorCallback - Function to call with errors
     * @param {boolean|void} [forceFetch] - Bypasses the cache
     * @param {boolean|void} [includePreview] - Optionally include preview fields
     * @param {boolean|void} [includePreviewSidebar] - Optionally include preview sidebar fields
     * @return {void}
     */
    search(
        id: string,
        query: string,
        sortBy: SortBy,
        sortDirection: SortDirection,
        successCallback: Function,
        errorCallback: Function,
        forceFetch: boolean = false,
        includePreviewFields: boolean = false,
        includePreviewSidebarFields: boolean = false
    ): void {
        if (this.isDestroyed()) {
            return;
        }

        // Save references
        this.offset = 0;
        this.query = query;
        this.id = id;
        this.key = this.getCacheKey(id, this.getEncodedQuery(this.query));
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
        this.sortBy = sortBy;
        this.sortDirection = sortDirection;
        this.includePreviewFields = includePreviewFields;
        this.includePreviewSidebarFields = includePreviewSidebarFields;

        // Clear the cache if needed
        if (forceFetch) {
            this.getCache().unset(this.key);
        }

        // Return the Cache value if it exists
        if (this.isLoaded()) {
            this.finish();
            return;
        }

        // Make the XHR request
        this.searchRequest();
    }
}

export default Search;
