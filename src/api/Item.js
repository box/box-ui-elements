/**
 * @flow
 * @file Helper for the box item API
 * @author Box
 */

import noop from 'lodash/noop';
import setProp from 'lodash/set';
import type { $AxiosError } from 'axios';

import { getBadItemError, getBadPermissionsError } from '../utils/error';
import Base from './Base';
import {
    ACCESS_NONE,
    CACHE_PREFIX_SEARCH,
    CACHE_PREFIX_FOLDER,
    TYPE_FOLDER,
    ERROR_CODE_DELETE_ITEM,
    ERROR_CODE_RENAME_ITEM,
    ERROR_CODE_SHARE_ITEM,
} from '../constants';
import type { ElementsErrorCallback } from '../common/types/api';

class Item extends Base {
    /**
     * @property {string}
     */
    id: string;

    /**
     * @property {string}
     */
    parentId: string;

    /**
     * @property {Function}
     */
    successCallback: Function;

    /**
     * @property {Function}
     */
    errorCallback: ElementsErrorCallback;

    /**
     * Creates a key for the item's parent
     * This is always a folder
     *
     * @param {string} Id - folder id
     * @return {string} Key
     */
    getParentCacheKey(id: string): string {
        return `${CACHE_PREFIX_FOLDER}${id}`;
    }

    /**
     * Creates a key for the cache
     *
     * @param {string} Id - Folder id
     * @return {string} Key
     */
    getCacheKey(id: string): string {
        return `getCacheKey(${id}) should be overriden`;
    }

    /**
     * API URL for items
     *
     * @param {string} id - Item id
     * @protected
     * @return {string} Base url for files
     */
    getUrl(id: string): string {
        return `getUrl(${id}) should be overriden`;
    }

    /**
     * Merges new data with old data and returns new data
     *
     * @param {String} cacheKey - The cache key of item to merge
     * @param {String} key - The attribute to merge
     * @param {Object} value - The value to merge
     * @return {BoxItem} The newly updated object from the cache
     */
    merge(cacheKey: string, key: string, value: any): BoxItem {
        const cache: APICache = this.getCache();
        cache.merge(cacheKey, setProp({}, key, value));
        return cache.get(cacheKey);
    }

    /**
     * Steps to do after deletion
     *
     * @return {void}
     */
    postDeleteCleanup(): void {
        if (this.isDestroyed()) {
            return;
        }

        // Get rid of all searches
        this.getCache().unsetAll(CACHE_PREFIX_SEARCH);
        this.successCallback();
    }

    /**
     * Handles response for deletion
     *
     * @return {void}
     */
    deleteSuccessHandler = (): void => {
        if (this.isDestroyed()) {
            return;
        }

        // When fetching the parent folder from the cache
        // we have no guarantees that it will be there since
        // search results happen across folders and we only
        // add those folders to cache that have been navigated to.
        const parentKey: string = this.getParentCacheKey(this.parentId);
        const folder: ?FlattenedBoxItem = this.getCache().get(parentKey);
        if (!folder) {
            this.postDeleteCleanup();
            return;
        }

        // Same logic as above but in this case we may have the parent
        // folders meta data in cache but not its contents.
        const { item_collection }: FlattenedBoxItem = folder;
        if (!item_collection) {
            this.postDeleteCleanup();
            return;
        }

        const { entries, total_count }: FlattenedBoxItemCollection = item_collection;
        if (!Array.isArray(entries) || typeof total_count !== 'number') {
            throw getBadItemError();
        }

        const childKey: string = this.getCacheKey(this.id);
        const oldCount: number = entries.length;
        const newEntries: string[] = entries.filter((entry: string) => entry !== childKey);
        const newCount: number = newEntries.length;

        const updatedObject: BoxItem = this.merge(
            parentKey,
            'item_collection',
            Object.assign(item_collection, {
                entries: newEntries,
                total_count: total_count - (oldCount - newCount),
            }),
        );

        this.successCallback(updatedObject);
        this.postDeleteCleanup();
    };

    /**
     * API to delete an Item
     *
     * @param {Object} item - Item to delete
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    deleteItem(item: BoxItem, successCallback: Function, errorCallback: ElementsErrorCallback = noop): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.reject();
        }

        this.errorCode = ERROR_CODE_DELETE_ITEM;
        const { id, permissions, parent, type }: BoxItem = item;
        if (!id || !permissions || !parent || !type) {
            errorCallback(getBadItemError(), this.errorCode);
            return Promise.reject();
        }

        const { id: parentId } = parent;
        const { can_delete }: BoxItemPermission = permissions;
        if (!can_delete || !parentId) {
            errorCallback(getBadPermissionsError(), this.errorCode);
            return Promise.reject();
        }

        this.id = id;
        this.parentId = parentId;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        const url = `${this.getUrl(id)}${type === TYPE_FOLDER ? '?recursive=true' : ''}`;
        return this.xhr
            .delete({ url })
            .then(this.deleteSuccessHandler)
            .catch((e: $AxiosError<any>) => {
                this.errorHandler(e);
            });
    }

    /**
     * Handles response for rename
     *
     * @param {BoxItem} data - The updated item
     * @return {void}
     */
    renameSuccessHandler = ({ data }: { data: BoxItem }): void => {
        if (!this.isDestroyed()) {
            // Get rid of all searches
            this.getCache().unsetAll(CACHE_PREFIX_SEARCH);
            const updatedObject: BoxItem = this.merge(this.getCacheKey(this.id), 'name', data.name);
            this.successCallback(updatedObject);
        }
    };

    /**
     * API to rename an Item
     *
     * @param {Object} item - Item to rename
     * @param {string} name - Item new name
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    rename(
        item: BoxItem,
        name: string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback = noop,
    ): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.reject();
        }

        this.errorCode = ERROR_CODE_RENAME_ITEM;
        const { id, permissions }: BoxItem = item;
        if (!id || !permissions) {
            errorCallback(getBadItemError(), this.errorCode);
            return Promise.reject();
        }

        const { can_rename }: BoxItemPermission = permissions;
        if (!can_rename) {
            errorCallback(getBadPermissionsError(), this.errorCode);
            return Promise.reject();
        }

        this.id = id;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        return this.xhr
            .put({ url: `${this.getUrl(id)}`, data: { name } })
            .then(this.renameSuccessHandler)
            .catch((e: $AxiosError<any>) => {
                this.errorHandler(e);
            });
    }

    /**
     * Handles response for shared link
     *
     * @param {BoxItem} data - The updated item
     * @return {void}
     */
    shareSuccessHandler = ({ data }: { data: BoxItem }): void => {
        if (!this.isDestroyed()) {
            const updatedObject: BoxItem = this.merge(this.getCacheKey(this.id), 'shared_link', data.shared_link);
            this.successCallback(updatedObject);
        }
    };

    /**
     * API to create or remove a shared link
     *
     * @param {Object} item - Item to share
     * @param {string} access - Shared access level
     * @param {Function} successCallback - Success callback
     * @param {Function|void} errorCallback - Error callback
     * @return {void}
     */
    share(
        item: BoxItem,
        access: string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback = noop,
    ): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.reject();
        }

        this.errorCode = ERROR_CODE_SHARE_ITEM;
        const { id, permissions }: BoxItem = item;
        if (!id || !permissions) {
            errorCallback(getBadItemError(), this.errorCode);
            return Promise.reject();
        }

        const { can_share, can_set_share_access }: BoxItemPermission = permissions;
        if (!can_share || !can_set_share_access) {
            errorCallback(getBadPermissionsError(), this.errorCode);
            return Promise.reject();
        }

        this.id = id;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        // We use the parent folder's auth token since use case involves
        // only content explorer or picker which works onf folder tokens
        return this.xhr
            .put({
                url: this.getUrl(this.id),
                data: {
                    shared_link: access === ACCESS_NONE ? null : { access },
                },
            })
            .then(this.shareSuccessHandler)
            .catch((e: $AxiosError<any>) => {
                this.errorHandler(e);
            });
    }
}

export default Item;
