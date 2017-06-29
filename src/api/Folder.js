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
import { FIELDS_TO_FETCH } from '../constants';
import getBadItemError from '../util/error';
import type {
    BoxItem,
    BoxItemCollection,
    FlattenedBoxItem,
    FlattenedBoxItemCollection,
    SortBy,
    SortDirection
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
        return `folder_${id}`;
    }

    /**
     * Base URL for folder api
     *
     * @param {string} [id] optional file id
     * @return {string} base url for files
     */
    getUrl(id: string): string {
        const suffix: string = id ? `/${id}` : '';
        return `${this.getBaseUrl()}/folders${suffix}`;
    }

    /**
     * Tells if a folder has its items all loaded
     *
     * @return {boolean} if items are loaded
     */
    isLoaded(): boolean {
        if (!this.getCache().has(this.key)) {
            return false;
        }
        const { item_collection = {} }: FlattenedBoxItem = this.getCache().get(this.key);
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

        const folder: FlattenedBoxItem = this.getCache().get(this.key);
        const sortedFolder: FlattenedBoxItem = sort(folder, this.sortBy, this.sortDirection, this.cache);

        const { id, name, permissions, path_collection, item_collection }: FlattenedBoxItem = sortedFolder;
        if (!item_collection || !path_collection) {
            throw getBadItemError();
        }

        const { entries, total_count }: FlattenedBoxItemCollection = item_collection;
        if (!Array.isArray(entries) || typeof total_count !== 'number') {
            throw getBadItemError();
        }

        const percentLoaded: number = total_count === 0 ? 100 : entries.length * 100 / total_count;
        this.successCallback({
            id,
            name,
            percentLoaded,
            permissions,
            breadcrumbs: path_collection.entries,
            sortBy: this.sortBy,
            sortDirection: this.sortDirection,
            items: entries.map((key: string) => this.getCache().get(key))
        });
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
     * Does the network request
     *
     * @return {void}
     */
    folderRequest(): void {
        if (this.isDestroyed()) {
            return;
        }

        this.xhr
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
     * API to delete a folder
     *
     * @param {String} id - item id
     * @param {String} parentId - item parent id
     * @param {Function} successCallback - success callback
     * @param {Function} errorCallback - error callback
     * @return {void}
     */
    delete(id: string, parentId: string, successCallback: Function, errorCallback: Function = noop): void {
        super.delete(id, parentId, successCallback, errorCallback, true);
    }
}

export default Folder;
