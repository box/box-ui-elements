/**
 * @flow
 * @file Helper for the box recents api
 * @author Box
 */

import Base from './Base';
import FileAPI from './File';
import FolderAPI from './Folder';
import WebLinkAPI from '../api/WebLink';
import Cache from '../util/Cache';
import flatten from '../util/flatten';
import sort from '../util/sorter';
import { FIELDS_TO_FETCH, DEFAULT_ROOT, CACHE_PREFIX_RECENTS, SORT_DESC, FIELD_INTERACTED_AT } from '../constants';
import getBadItemError from '../util/error';
import type {
    Crumb,
    BoxItem,
    Recent,
    RecentCollection,
    Collection,
    SortBy,
    SortDirection,
    FlattenedBoxItem,
    FlattenedBoxItemCollection
} from '../flowTypes';

class Recents extends Base {
    /**
     * @property {string}
     */
    key: string;

    /**
     * @property {string}
     */
    id: string;

    /**
     * @property {Function}
     */
    successCallback: Function;

    /**
     * @property {Function}
     */
    errorCallback: Function;

    /**
     * @property {string}
     */
    sortBy: SortBy;

    /**
     * @property {string}
     */
    sortDirection: SortDirection;

    /**
     * Creates a key for the cache
     *
     * @param {string} id folder id
     * @return {string} key
     */
    getCacheKey(id: string): string {
        return `${CACHE_PREFIX_RECENTS}${id}`;
    }

    /**
     * URL for recents api
     *
     * @return {string} base url for files
     */
    getUrl(): string {
        return `${this.getBaseUrl()}/recent_items`;
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
        const recents: FlattenedBoxItem = cache.get(this.key);
        const sortedRecents: FlattenedBoxItem = sort(recents, this.sortBy, this.sortDirection, cache);
        const { item_collection }: FlattenedBoxItem = sortedRecents;
        if (!item_collection) {
            throw getBadItemError();
        }

        const { entries }: FlattenedBoxItemCollection = item_collection;
        if (!Array.isArray(entries)) {
            throw getBadItemError();
        }

        const collection: Collection = {
            percentLoaded: 100,
            id: this.id,
            sortBy: this.sortBy,
            sortDirection: this.sortDirection,
            items: entries.map((key: string) => cache.get(key))
        };
        this.successCallback(collection);
    }

    /**
     * Handles the folder Recents response
     *
     * @param {Object} response
     * @return {void}
     */
    recentsSuccessHandler = (response: RecentCollection): void => {
        if (this.isDestroyed()) {
            return;
        }

        const { entries, order: { by, direction } }: RecentCollection = response;
        const items: BoxItem[] = [];

        entries.forEach(({ item, interacted_at }: Recent) => {
            const { path_collection }: BoxItem = item;
            const shouldInclude =
                this.id === DEFAULT_ROOT ||
                (!!path_collection && path_collection.entries.findIndex((crumb: Crumb) => crumb.id === this.id) !== -1);
            if (shouldInclude) {
                items.push(Object.assign(item, { interacted_at }));
            }
        });

        const flattenedItems: string[] = flatten(
            items,
            new FolderAPI(this.options),
            new FileAPI(this.options),
            new WebLinkAPI(this.options)
        );

        this.getCache().set(this.key, {
            item_collection: {
                isLoaded: true,
                entries: flattenedItems,
                order: [
                    {
                        by,
                        direction
                    }
                ]
            }
        });
        this.finish();
    };

    /**
     * Handles the Recents error
     *
     * @param {Error} error fetch error
     * @return {void}
     */
    recentsErrorHandler = (error: Error): void => {
        if (this.isDestroyed()) {
            return;
        }
        this.errorCallback(error);
    };

    /**
     * Does the network request
     *
     * @return {Promise}
     */
    recentsRequest(): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.reject();
        }

        return this.xhr
            .get(this.getUrl(), {
                fields: FIELDS_TO_FETCH
            })
            .then(this.recentsSuccessHandler)
            .catch(this.recentsErrorHandler);
    }

    /**
     * Gets recent files
     *
     * @param {string} id - parent folder id
     * @param {string} sortBy sort by field
     * @param {string} sortDirection sort direction
     * @param {Function} successCallback - Function to call with results
     * @param {Function} errorCallback - Function to call with errors
     * @param {boolean} forceUpdate Bypasses the cache
     * @return {void}
     */
    recents(
        id: string,
        sortBy: SortBy,
        sortDirection: SortDirection,
        successCallback: Function,
        errorCallback: Function,
        forceFetch: boolean = false
    ): void {
        if (this.isDestroyed()) {
            return;
        }

        // Save references
        this.id = id;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
        this.sortBy = sortBy;
        this.sortDirection = sortDirection;

        const cache: Cache = this.getCache();
        this.key = this.getCacheKey(this.id);

        // Clear the cache if needed
        if (forceFetch) {
            cache.unset(this.key);
        }

        // Return the Cache value if it exists
        if (cache.has(this.key)) {
            this.finish();
            return;
        }

        // Recents should always be sorted with date desc
        // on non cached loads, aka newest to oldest
        this.sortBy = FIELD_INTERACTED_AT;
        this.sortDirection = SORT_DESC;

        // Make the XHR request
        this.recentsRequest();
    }
}

export default Recents;
