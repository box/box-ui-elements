/**
 * @flow
 * @file Helper for the box item api
 * @author Box
 */

import noop from 'lodash.noop';
import Base from './Base';
import FolderAPI from './Folder';
import { ACCESS_NONE, CACHE_PREFIX_SEARCH } from '../constants';
import getBadItemError from '../util/error';
import type { BoxItem, FlattenedBoxItem, FlattenedBoxItemCollection } from '../flowTypes';

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
    errorCallback: Function;

    /**
     * Handles error responses
     *
     * @param {Response} error.response - error response
     * @return {Function} Function that handles response
     */
    errorHandler = ({ response }: { response: Response }): void => {
        if (this.isDestroyed()) {
            return;
        }
        if (response) {
            response.json().then(this.errorCallback);
        }
    };

    /**
     * Creates a key for the cache
     *
     * @param {string} id folder id
     * @return {string} key
     */
    getCacheKey(id: string): string {
        return `getCacheKey(${id}) should be overriden`;
    }

    /**
     * API URL for items
     *
     * @param {string} id - item id
     * @protected
     * @return {string} base url for files
     */
    getUrl(id: string): string {
        return `getUrl(${id}) should be overriden`;
    }

    /**
     * Merges new data with old data and returns new data
     *
     * @param {String} cacheKey - the cache key of item to merge
     * @param {String} key - the attribute to merge
     * @param {Object} value - the value to merge
     * @return {void}
     */
    merge(cacheKey: string, key: string, value: any): void {
        if (this.isDestroyed()) {
            return;
        }
        this.getCache().merge(cacheKey, {
            [key]: value
        });
        this.successCallback(this.getCache().get(cacheKey));
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

        const parentAPI = new FolderAPI(this.options);
        const parentKey: string = parentAPI.getCacheKey(this.parentId);

        // When fetching the parent folder from the cache
        // we have no guarantees that it will be there since
        // search results happen across folders and we only
        // add those folders to cache that have been navigated to.
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

        const { entries }: FlattenedBoxItemCollection = item_collection;
        if (!Array.isArray(entries)) {
            throw getBadItemError();
        }

        const newEntries: string[] = entries.filter((entry: string) => entry !== this.getCacheKey(this.id));
        this.merge(
            parentKey,
            'item_collection',
            Object.assign(item_collection, {
                entries: newEntries,
                total_count: newEntries.length
            })
        );
        this.postDeleteCleanup();
    };

    /**
     * API to delete an Item
     *
     * @param {String} id - item id
     * @param {Function} successCallback - success callback
     * @param {Function} errorCallback - error callback
     * @param {Boolean} recursive - true for folders
     * @return {void}
     */
    delete(
        id: string,
        parentId: string,
        successCallback: Function,
        errorCallback: Function = noop,
        recursive: boolean = false
    ): void {
        this.id = id;
        this.parentId = parentId;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        const url = `${this.getUrl(id)}${recursive ? '?recursive=true' : ''}`;
        this.xhr.delete(url).then(this.deleteSuccessHandler).catch(this.errorHandler);
    }

    /**
     * Handles response for rename
     *
     * @param {BoxItem} item - the updated item
     * @return {void}
     */
    renameSuccessHandler = (item: BoxItem): void => {
        // Get rid of all searches
        this.getCache().unsetAll(CACHE_PREFIX_SEARCH);
        this.merge(this.getCacheKey(this.id), 'name', item.name);
    };

    /**
     * API to rename an Item
     *
     * @param {string} id - item id
     * @param {string} name - item new name
     * @param {Function} successCallback - success callback
     * @param {Function} errorCallback - error callback
     * @return {void}
     */
    rename(id: string, name: string, successCallback: Function, errorCallback: Function = noop): void {
        this.id = id;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        this.xhr.put(`${this.getUrl(id)}`, { name }).then(this.renameSuccessHandler).catch(this.errorHandler);
    }

    /**
     * Handles response for shared link
     *
     * @param {BoxItem} item - the updated item
     * @return {void}
     */
    shareSuccessHandler = (item: BoxItem): void => {
        this.merge(this.getCacheKey(this.id), 'shared_link', item.shared_link);
    };

    /**
     * Api to create or remove a shared link
     *
     * @param {string} id - item id
     * @param {string} access - shared access level
     * @param {Function} successCallback - success callback
     * @param {Function|void} errorCallback - error callback
     * @return {void}
     */
    share(id: string, access: string, successCallback: Function, errorCallback: Function = noop): void {
        this.id = id;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        this.xhr
            .put(this.getUrl(this.id), {
                shared_link: access === ACCESS_NONE ? null : { access }
            })
            .then(this.shareSuccessHandler)
            .catch(this.errorHandler);
    }
}

export default Item;
