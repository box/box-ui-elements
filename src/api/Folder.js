/**
 * @flow
 * @file Helper for the box folder api
 * @author Box
 */

import noop from 'lodash/noop';
import flatten from '../utils/flatten';
import { fillMissingProperties, findMissingProperties, FOLDER_FIELDS_TO_FETCH } from '../utils/fields';
import { getBadItemError } from '../utils/error';
import Item from './Item';
import FileAPI from './File';
import WebLinkAPI from './WebLink';
import {
    CACHE_PREFIX_FOLDER,
    ERROR_CODE_FETCH_FOLDER,
    ERROR_CODE_CREATE_FOLDER,
    FIELD_REPRESENTATIONS,
    X_REP_HINT_HEADER_DIMENSIONS_DEFAULT,
    X_REP_HINTS,
    ERROR_CODE_FETCH_FILE,
} from '../constants';
import type { RequestOptions, ElementsErrorCallback } from '../common/types/api';
import type {
    SortBy,
    SortDirection,
    FlattenedBoxItem,
    FlattenedBoxItemCollection,
    Collection,
    BoxItem,
    BoxItemCollection,
} from '../common/types/core';
import type APICache from '../utils/Cache';
import { getTypedFileId } from 'utils/file';

class Folder extends Item {
    /**
     * @property {string}
     */
    id: string;

    /**
     * @property {string}
     */
    key: string;

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
    errorCallback: ElementsErrorCallback;

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
        return `${this.getBaseApiUrl()}/folders${suffix}`;
    }

    /**
     * Tells if a folder has its items all loaded
     *
     * @return {boolean} if items are loaded
     */
    isLoaded(): boolean {
        const cache: APICache = this.getCache();
        return cache.has(this.key);
    }

    /**
     * Composes and returns the results
     *
     * @return {void}
     */
    finish(): void {
        if (this.isDestroyed()) {
            return;
        }

        const cache: APICache = this.getCache();
        const folder: FlattenedBoxItem = cache.get(this.key);
        const { id, name, permissions, path_collection, item_collection }: FlattenedBoxItem = folder;
        if (!item_collection || !path_collection) {
            throw getBadItemError();
        }

        const { entries, offset, total_count }: FlattenedBoxItemCollection = item_collection;
        if (!Array.isArray(entries) || typeof total_count !== 'number') {
            throw getBadItemError();
        }

        const collection: Collection = {
            id,
            name,
            offset,
            percentLoaded: 100,
            permissions,
            boxItem: folder,
            breadcrumbs: path_collection.entries,
            items: entries.map((key: string) => cache.get(key)),
            sortBy: this.sortBy,
            sortDirection: this.sortDirection,
            totalCount: total_count,
        };
        this.successCallback(collection);
    }

    /**
     * Handles the folder fetch response
     *
     * @param {Object} response
     * @return {void}
     */
    folderSuccessHandler = ({ data }: { data: BoxItem }): void => {
        if (this.isDestroyed()) {
            return;
        }

        const { item_collection }: BoxItem = data;
        if (!item_collection) {
            throw getBadItemError();
        }

        const { entries, total_count, limit, offset }: BoxItemCollection = item_collection;
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
            new Folder(this.options),
            new FileAPI(this.options),
            new WebLinkAPI(this.options),
        );
        this.itemCache = (this.itemCache || []).concat(flattened);

        this.getCache().set(this.key, {
            ...data,
            item_collection: { ...item_collection, entries: this.itemCache },
        });

        this.finish();
    };

    /**
     * Handles a request for folder details
     *
     * @param {Object} data - XHR response data
     * @returns {void}
     */
    folderDetailsSuccessHandler = ({ data }: { data: BoxItem }): void => {
        if (this.isDestroyed()) {
            return;
        }

        const cachedEntry = this.getCache().get(this.key);
        const updatedCacheEntry = { ...cachedEntry, ...data };

        this.getCache().set(this.key, updatedCacheEntry);
        this.successCallback(updatedCacheEntry);
    };

    /**
     * Does the network request for fetching a folder
     *
     * @param {Array<string>|void} fields - Optionally include specific fields
     * @return {Promise}
     */
    folderRequest(
        { fields, noPagination }: RequestOptions = {},
        successHandler?: Function = this.folderSuccessHandler,
    ): Promise<any> {
        if (this.isDestroyed()) {
            return Promise.reject();
        }

        const requestFields = fields || FOLDER_FIELDS_TO_FETCH;

        this.errorCode = ERROR_CODE_FETCH_FOLDER;
        let params = { fields: requestFields.toString() };
        if (!noPagination) {
            params = {
                ...params,
                direction: this.sortDirection.toLowerCase(),
                limit: this.limit,
                offset: this.offset,
                fields: requestFields.toString(),
                sort: this.sortBy.toLowerCase(),
            };
        }

        return this.xhr
            .get({
                url: this.getUrl(this.id),
                params,
                headers: requestFields.includes(FIELD_REPRESENTATIONS)
                    ? {
                          'X-Rep-Hints': X_REP_HINT_HEADER_DIMENSIONS_DEFAULT,
                      }
                    : {},
            })
            .then(successHandler)
            .catch(this.errorHandler);
    }

    /**
     * Gets a box folder properties. If you want to get the items, you should use `getFolder`
     *
     * @param {string} id - Folder id
     * @param {Function} successCallback - Function to call with results
     * @param {Function} errorCallback - Function to call with errors
     * @param {Object} options - Options
     * @returns {void}
     */
    getFolderFields(
        id: string,
        successCallback: Function,
        errorCallback: Function,
        options: RequestOptions = {},
    ): void {
        if (this.isDestroyed()) {
            return;
        }

        // Save references
        this.id = id;
        this.key = this.getCacheKey(id);
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        this.folderRequest({ ...options, noPagination: true }, this.folderDetailsSuccessHandler);
    }

    /**
     * Gets a box folder and its items
     *
     * @param {string} id - Folder id
     * @param {number} limit - maximum number of items to retrieve
     * @param {number} offset - starting index from which to retrieve items
     * @param {string} sortBy - sort by field
     * @param {string} sortDirection - sort direction
     * @param {Function} successCallback - Function to call with results
     * @param {Function} errorCallback - Function to call with errors
     * @param {boolean|void} [options.fields] - Optionally include specific fields
     * @param {boolean|void} [options.forceFetch] - Optionally Bypasses the cache
     * @param {boolean|void} [options.refreshCache] - Optionally Updates the cache
     * @return {void}
     */
    getFolder(
        id: string,
        limit: number,
        offset: number,
        sortBy: SortBy,
        sortDirection: SortDirection,
        successCallback: Function,
        errorCallback: Function,
        options: RequestOptions = {},
    ): void {
        if (this.isDestroyed()) {
            return;
        }

        // Save references
        this.id = id;
        this.key = this.getCacheKey(id);
        this.limit = limit;
        this.offset = offset;
        this.sortBy = sortBy;
        this.sortDirection = sortDirection;
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
        this.folderRequest(options);
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
    createSuccessHandler = ({ data }: { data: BoxItem }): void => {
        const { id: childId } = data;
        if (this.isDestroyed() || !childId) {
            return;
        }

        const childKey: string = this.getCacheKey(childId);
        const cache: APICache = this.getCache();
        const parent: FlattenedBoxItem = cache.get(this.key);

        if (!parent) {
            this.successCallback(data);
            return;
        }

        const { item_collection }: FlattenedBoxItem = parent;
        if (!item_collection) {
            throw getBadItemError();
        }

        const { total_count, entries }: FlattenedBoxItemCollection = item_collection;
        if (!Array.isArray(entries) || typeof total_count !== 'number') {
            throw getBadItemError();
        }

        cache.set(childKey, data);
        item_collection.entries = [childKey].concat(entries);
        item_collection.total_count = total_count + 1;
        this.successCallback(data);
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

        this.errorCode = ERROR_CODE_CREATE_FOLDER;
        const url = `${this.getUrl()}?fields=${FOLDER_FIELDS_TO_FETCH.toString()}`;
        return this.xhr
            .post({
                url,
                data: {
                    name,
                    parent: {
                        id: this.id,
                    },
                },
            })
            .then(this.createSuccessHandler)
            .catch(this.errorHandler);
    }

    /**
     * API to create a folder
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

    /**
     * Gets a box folder
     *
     * @param {string} id - Folder id
     * @param {boolean|void} [options.fields] - Optionally include specific fields
     * @param {boolean|void} [options.forceFetch] - Optionally Bypasses the cache
     * @param {boolean|void} [options.refreshCache] - Optionally Updates the cache
     * @return {Promise}
     */
    async getFolderInformation(id: string, options: RequestOptions = {}): Promise<void> {
        if (this.isDestroyed()) {
            return;
        }

        const cache: APICache = this.getCache();
        const key: string = this.getCacheKey(id);
        const isCached: boolean = !options.forceFetch && cache.has(key);
        const file: BoxItem = isCached ? cache.get(key) : { id };
        let missingFields: Array<string> = findMissingProperties(file, options.fields);
        const xhrOptions: Object = {
            id: getTypedFileId(id),
            url: this.getUrl(id),
            headers: { 'X-Rep-Hints': X_REP_HINTS },
        };
        this.errorCode = ERROR_CODE_FETCH_FILE;

        // If the file was cached and there are no missing fields
        // then just return the cached file and optionally refresh
        // the cache with new data if required
        if (isCached && missingFields.length === 0) {
            missingFields = options.fields || [];

            return file;
        }

        // If there are missing fields to fetch, add it to the params
        if (missingFields.length > 0) {
            xhrOptions.params = {
                fields: missingFields.toString(),
            };
        }

        try {
            const { data } = await this.xhr.get(xhrOptions);

            if (this.isDestroyed()) {
                return;
            }

            // Merge fields that were requested but were actually not returned.
            // This part is mostly useful for metadata.foo.bar fields since the API
            // returns { metadata: null } instead of { metadata: { foo: { bar: null } } }
            const dataWithMissingFields = fillMissingProperties(data, missingFields);

            // Cache check is again done since this code is executed async
            if (cache.has(key)) {
                cache.merge(key, dataWithMissingFields);
            } else {
                // If there was nothing in the cache
                cache.set(key, dataWithMissingFields);
            }

            return cache.get(key);
        } catch (e) {
            return undefined;
        }
    }

    /**
     * Add a folder to a given collection
     *
     * @param {BoxItem} file - Folder object for which we are changing the description
     * @param {string} collectionID - The collection to add the folder to
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     *
     * @return {Promise}
     */
    addToCollection(
        file: BoxItem,
        collectionID: string,
        successCallback: Function,
        errorCallback: Function,
    ): Promise<void> {
        const { id, permissions } = file;

        if (!id || !permissions) {
            errorCallback(getBadItemError());
            return Promise.reject();
        }

        this.getFolderInformation(id, { fields: ['collections'] })
            .then((data: any) => {
                let collections = data.collections || [];

                // Convert to correct format
                collections = collections.map((c: any /* FIXME */) => ({ id: c.id }));

                if (!collections.find((c: any /* FIXME */) => c.id === collectionID)) {
                    collections.push({ id: collectionID });
                }

                return this.xhr
                    .put({
                        id: getTypedFileId(id),
                        url: this.getUrl(id),
                        data: { collections },
                        params: {
                            fields: 'collections',
                        },
                    })
                    .then(({ data }: { data: BoxItem }) => {
                        if (!this.isDestroyed()) {
                            const updatedFile = this.merge(this.getCacheKey(id), 'collections', data.collections);
                            successCallback(updatedFile);
                        }
                    })
                    .catch(e => {
                        console.log(e);

                        if (!this.isDestroyed()) {
                            const originalFile = this.merge(this.getCacheKey(id), 'collections', file.collections);
                            errorCallback(originalFile);
                        }
                    });
            })
            .catch(e => {
                console.log(e);

                const originalFile = this.merge(this.getCacheKey(id), 'collections', file.collections);
                errorCallback(originalFile);
            });
    }

    /**
     * Remove a folder from a given collection
     *
     * @param {BoxItem} file - File object for which we are changing the description
     * @param {string} collectionID - The collection to add the folder to
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     *
     * @return {Promise}
     */
    removeFromToCollection(
        file: BoxItem,
        collectionID: string,
        successCallback: Function,
        errorCallback: Function,
    ): Promise<void> {
        const { id, permissions } = file;

        if (!id || !permissions) {
            errorCallback(getBadItemError());
            return Promise.reject();
        }

        this.getFolderInformation(id, { fields: ['collections'] })
            .then((data: any) => {
                let collections = data.collections || [];

                // Convert to correct object format and remove the specified collection
                collections = collections
                    .map((c: any /* FIXME */) => ({ id: c.id }))
                    .filter((c: any /* FIXME */) => c.id !== collectionID);

                return this.xhr
                    .put({
                        id: getTypedFileId(id),
                        url: this.getUrl(id),
                        data: { collections },
                        params: {
                            fields: 'collections',
                        },
                    })
                    .then(({ data }: { data: BoxItem }) => {
                        if (!this.isDestroyed()) {
                            this.cache.set(this.getCacheKey(id), {
                                ...this.cache.get(this.getCacheKey(id)),
                                collections: data.collections,
                            });
                            successCallback(this.cache.get(this.getCacheKey(id)));
                        }
                    })
                    .catch(e => {
                        console.log(e);

                        if (!this.isDestroyed()) {
                            const originalFile = this.merge(this.getCacheKey(id), 'collections', file.collections);
                            errorCallback(originalFile);
                        }
                    });
            })
            .catch(e => {
                console.log(e);

                const originalFile = this.merge(this.getCacheKey(id), 'collections', file.collections);
                errorCallback(originalFile);
            });
    }
}

export default Folder;
