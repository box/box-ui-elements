/**
 * @flow
 * @file Helper for the box folder api
 * @author Box
 */

import noop from 'lodash.noop';
import Item from './Item';
import flatten from '../util/flatten';
import sort from '../util/sorter';
import FileAPI from '../api/File';
import WebLinkAPI from '../api/WebLink';
import Cache from '../util/Cache';
import { FIELDS_TO_FETCH, CACHE_PREFIX_FOLDER } from '../constants';
import getBadItemError from '../util/error';
import type {
    BoxItem,
    BoxItemCollection,
    FlattenedBoxItem,
    FlattenedBoxItemCollection,
    SortBy,
    SortDirection,
    Collection
} from '../flowTypes';

const LIMIT_ITEM_FETCH = 1000;

class Folder extends Item {
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
    sortBy: SortBy;

    /**
     * @property {string}
     */
    sortDirection: SortDirection;

    /**
     * @property {Array}
     */
    itemCache: string[];

    /**
     * @property {Function}
     */
    successCallback: Function;

    /**
     * @property {Function}
     */
    errorCallback: Function;

    /**
     * Creates a key for the cache
     *
     * @param {string} id folder id
     * @return {string} key
     */
    getCacheKey(id: string): string {
        return `${CACHE_PREFIX_FOLDER}${id}`;
    }

    /**
     * Base URL for folder api
     *
     * @param {string} [id] optional file id
     * @return {string} base url for files
     */
    getUrl(id?: string): string {
        const suffix: string = id ? `/${id}` : '';
        return `${this.getBaseUrl()}/folders${suffix}`;
    }

    /**
     * Tells if a folder has its items all loaded
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
        const folder: FlattenedBoxItem = cache.get(this.key);
        const sortedFolder: FlattenedBoxItem = sort(folder, this.sortBy, this.sortDirection, cache);

        const { id, name, permissions, path_collection, item_collection }: FlattenedBoxItem = sortedFolder;
        if (!item_collection || !path_collection) {
            throw getBadItemError();
        }

        const { entries, total_count }: FlattenedBoxItemCollection = item_collection;
        if (!Array.isArray(entries) || typeof total_count !== 'number') {
            throw getBadItemError();
        }

        const percentLoaded: number = total_count === 0 ? 100 : entries.length * 100 / total_count;
        const collection: Collection = {
            id,
            name,
            percentLoaded,
            permissions,
            boxItem: sortedFolder,
            breadcrumbs: path_collection.entries,
            sortBy: this.sortBy,
            sortDirection: this.sortDirection,
            items: entries.map((key: string) => cache.get(key))
        };
        this.successCallback(collection);
    }

    /**
     * Handles the folder fetch response
     *
     * @param {Object} response
     * @return {void}
     */
    folderSuccessHandler = (response: BoxItem): void => {
        if (this.isDestroyed()) {
            return;
        }

        const { item_collection }: BoxItem = response;
        if (!item_collection) {
            throw getBadItemError();
        }

        const { entries, total_count }: BoxItemCollection = item_collection;
        if (!Array.isArray(entries) || typeof total_count !== 'number') {
            throw getBadItemError();
        }

        const flattened: string[] = flatten(
            entries,
            new Folder(this.options),
            new FileAPI(this.options),
            new WebLinkAPI(this.options)
        );
        this.itemCache = (this.itemCache || []).concat(flattened);
        const isLoaded: boolean = this.itemCache.length === total_count;

        this.getCache().set(
            this.key,
            Object.assign({}, response, {
                item_collection: Object.assign({}, item_collection, {
                    isLoaded,
                    entries: this.itemCache
                })
            })
        );

        if (!isLoaded) {
            this.offset += LIMIT_ITEM_FETCH;
            this.folderRequest();
        }

        this.finish();
    };

    /**
     * Handles the folder fetch error
     *
     * @param {Error} error fetch error
     * @return {void}
     */
    folderErrorHandler = (error: any): void => {
        if (this.isDestroyed()) {
            return;
        }
        this.errorCallback(error);
    };

    /**
     * Does the network request for fetching a folder
     *
     * @return {void}
     */
    folderRequest(): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.reject();
        }

        return this.xhr
            .get(this.getUrl(this.id), {
                offset: this.offset,
                limit: LIMIT_ITEM_FETCH,
                fields: FIELDS_TO_FETCH
            })
            .then(this.folderSuccessHandler)
            .catch(this.folderErrorHandler);
    }

    /**
     * Gets a box folder and its items
     *
     * @param {string} id Folder id
     * @param {string} sortBy sort by field
     * @param {string} sortDirection sort direction
     * @param {Function} successCallback Function to call with results
     * @param {Function} errorCallback Function to call with errors
     * @param {boolean} forceFetch Bypasses the cache
     * @return {void}
     */
    folder(
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
        this.offset = 0;
        this.id = id;
        this.key = this.getCacheKey(id);
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
        this.sortBy = sortBy;
        this.sortDirection = sortDirection;

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
        this.folderRequest();
    }

    /**
     * API to rename an Item
     *
     * @param {string} id - parent folder id
     * @param {string} name - new folder name
     * @param {Function} successCallback - success callback
     * @param {Function} errorCallback - error callback
     * @return {void}
     */
    createSuccessHandler = (item: BoxItem): void => {
        const { id: childId } = item;
        if (this.isDestroyed() || !childId) {
            return;
        }
        const childKey: string = this.getCacheKey(childId);
        const cache: Cache = this.getCache();
        const parent: FlattenedBoxItem = cache.get(this.key);

        const { item_collection }: FlattenedBoxItem = parent;
        if (!item_collection) {
            throw getBadItemError();
        }

        const { total_count, entries }: FlattenedBoxItemCollection = item_collection;
        if (!Array.isArray(entries) || typeof total_count !== 'number') {
            throw getBadItemError();
        }

        cache.set(childKey, item);
        item_collection.entries = [childKey].concat(entries);
        item_collection.total_count = total_count + 1;
        this.successCallback(item);
    };

    /**
     * Does the network request for fetching a folder
     *
     * @return {void}
     */
    folderCreateRequest(name: string): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.reject();
        }

        const url = `${this.getUrl()}?fields=${FIELDS_TO_FETCH}`;
        return this.xhr
            .post(url, {
                name,
                parent: {
                    id: this.id
                }
            })
            .then(this.createSuccessHandler)
            .catch(this.folderErrorHandler);
    }

    /**
     * API to rename an Item
     *
     * @param {string} id - parent folder id
     * @param {string} name - new folder name
     * @param {Function} successCallback - success callback
     * @param {Function} errorCallback - error callback
     * @return {void}
     */
    create(id: string, name: string, successCallback: Function, errorCallback: Function = noop): void {
        if (this.isDestroyed()) {
            return;
        }

        this.id = id;
        this.key = this.getCacheKey(id);
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
        this.folderCreateRequest(name);
    }
}

export default Folder;
