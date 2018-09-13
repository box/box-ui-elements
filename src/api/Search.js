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
import { FOLDER_FIELDS_TO_FETCH } from '../util/fields';
import { CACHE_PREFIX_SEARCH, FIELD_RELEVANCE, SORT_DESC } from '../constants';
import { getBadItemError } from '../util/error';

class Search extends Base {
    /**
     * @property {number}
     */
    limit: number;

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
        return `${this.getBaseApiUrl()}/search`;
    }

    /**
     * Tells if a search results has its items all loaded
     *
     * @return {boolean} if items are loaded
     */
    isLoaded(): boolean {
        const cache: APICache = this.getCache();
        return cache.has(this.key);
    }

    /**
     * Returns the results
     *
     * @return {void}
     */
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

        const {
            entries,
            total_count,
        }: FlattenedBoxItemCollection = item_collection;
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

    /**
     * Handles the folder search response
     *
     * @param {Object} response
     * @return {void}
     */
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
            item_collection: Object.assign({}, data, {
                entries: this.itemCache,
            }),
        });

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
                    limit: this.limit,
                    fields: FOLDER_FIELDS_TO_FETCH.toString(),
                },
            })
            .then(this.searchSuccessHandler)
            .catch(this.searchErrorHandler);
    }

    /**
     * Gets search results
     *
     * @param {string} id - folder id
     * @param {string} query - search string
     * @param {number} limit - maximum number of items to retrieve
     * @param {number} offset - starting index from which to retrieve items
     * @param {Function} successCallback - Function to call with results
     * @param {Function} errorCallback - Function to call with errors
     * @param {boolean|void} [options.forceFetch] - Bypasses the cache
     * @return {void}
     */
    search(
        id: string,
        query: string,
        limit: number,
        offset: number,
        successCallback: Function,
        errorCallback: Function,
        options: Object = {},
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
        this.searchRequest();
    }
}

export default Search;
