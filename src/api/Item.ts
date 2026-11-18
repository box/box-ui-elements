import type { AxiosError } from 'axios';
import noop from 'lodash/noop';
import setProp from 'lodash/set';
import { getBadItemError, getBadPermissionsError } from '../utils/error';
import { fillMissingProperties } from '../utils/fields';
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
import type { ElementsErrorCallback, ElementsXhrError, RequestData, RequestOptions } from '../common/types/api';
import type {
    Access,
    BoxItem,
    BoxItemPermission,
    FlattenedBoxItem,
    FlattenedBoxItemCollection,
    SharedLink,
} from '../common/types/core';
import type APICache from '../utils/Cache';

class Item extends Base {
    /** Id of the item being deleted, renamed or shared. */
    id: string;

    /** Id of the parent folder of the item being deleted. */
    parentId: string;

    /** Invoked with the updated item (or parent folder) when the request succeeds. */
    successCallback: Base['successCallback'];

    /** Invoked when the request fails. */
    errorCallback: ElementsErrorCallback;

    /** Creates a cache key for the item's parent, which is always a folder. */
    getParentCacheKey(id: string): string {
        return `${CACHE_PREFIX_FOLDER}${id}`;
    }

    /** Creates a cache key for the item, meant to be overridden by subclasses. */
    getCacheKey(id: string): string {
        return `getCacheKey(${id}) should be overriden`;
    }

    /** API URL for the item, meant to be overridden by subclasses. */
    getUrl(id: string): string {
        return `getUrl(${id}) should be overriden`;
    }

    /** Merges `value` into the cached item at `key` and returns the updated item from the cache. */
    merge(cacheKey: string, key: string, value: unknown): BoxItem {
        const cache: APICache = this.getCache();
        cache.merge(cacheKey, setProp({}, key, value));
        return cache.get(cacheKey);
    }

    /** Clears cached searches and calls `successCallback` after deletion. */
    postDeleteCleanup(): void {
        if (this.isDestroyed()) {
            return;
        }

        // Get rid of all searches
        this.getCache().unsetAll(CACHE_PREFIX_SEARCH);
        this.successCallback();
    }

    /** Removes the deleted item from its cached parent folder. Throws when the cached folder is malformed. */
    deleteSuccessHandler = (): void => {
        if (this.isDestroyed()) {
            return;
        }

        // When fetching the parent folder from the cache
        // we have no guarantees that it will be there since
        // search results happen across folders and we only
        // add those folders to cache that have been navigated to.
        const parentKey: string = this.getParentCacheKey(this.parentId);
        const folder: FlattenedBoxItem | null | undefined = this.getCache().get(parentKey);
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

    /** Deletes the item; folders are deleted recursively. Rejects when destroyed or the item cannot be deleted. */
    deleteItem(item: BoxItem, successCallback: Function, errorCallback: ElementsErrorCallback = noop): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.reject();
        }

        this.errorCode = ERROR_CODE_DELETE_ITEM;
        const { id, permissions, parent, type }: BoxItem = item;
        if (!id || !permissions || !parent || !type) {
            errorCallback(getBadItemError() as ElementsXhrError, this.errorCode);
            return Promise.reject();
        }

        const { id: parentId } = parent;
        const { can_delete }: BoxItemPermission = permissions;
        if (!can_delete || !parentId) {
            errorCallback(getBadPermissionsError() as ElementsXhrError, this.errorCode);
            return Promise.reject();
        }

        this.id = id;
        this.parentId = parentId;
        this.successCallback = successCallback as Base['successCallback'];
        this.errorCallback = errorCallback;

        const url = `${this.getUrl(id)}${type === TYPE_FOLDER ? '?recursive=true' : ''}`;
        return this.xhr
            .delete({ url })
            .then(this.deleteSuccessHandler)
            .catch((e: AxiosError) => {
                this.errorHandler(e);
            });
    }

    /** Updates the cached item's name and calls `successCallback` with the updated item. */
    renameSuccessHandler = ({ data }: { data: BoxItem }): void => {
        if (!this.isDestroyed()) {
            // Get rid of all searches
            this.getCache().unsetAll(CACHE_PREFIX_SEARCH);
            const updatedObject: BoxItem = this.merge(this.getCacheKey(this.id), 'name', data.name);
            this.successCallback(updatedObject);
        }
    };

    /** Renames the item. Rejects when destroyed or the item cannot be renamed. */
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
            errorCallback(getBadItemError() as ElementsXhrError, this.errorCode);
            return Promise.reject();
        }

        const { can_rename }: BoxItemPermission = permissions;
        if (!can_rename) {
            errorCallback(getBadPermissionsError() as ElementsXhrError, this.errorCode);
            return Promise.reject();
        }

        this.id = id;
        this.successCallback = successCallback as Base['successCallback'];
        this.errorCallback = errorCallback;

        return this.xhr
            .put({ url: `${this.getUrl(id)}`, data: { name } })
            .then(this.renameSuccessHandler)
            .catch((e: AxiosError) => {
                this.errorHandler(e);
            });
    }

    /**
     * Caches the shared link response, adding requested `fields` that were not returned,
     * and calls `successCallback` with the cached item.
     */
    shareSuccessHandler = (data: BoxItem, fields?: Array<string>): void => {
        if (!this.isDestroyed()) {
            // Add fields that were requested but not returned
            const dataWithMissingFields = fields ? fillMissingProperties(data, fields) : data;
            const cache: APICache = this.getCache();
            const key = this.getCacheKey(this.id);

            if (cache.has(key)) {
                cache.set(key, { ...cache.get(key), ...dataWithMissingFields });
            } else {
                cache.set(key, dataWithMissingFields);
            }
            this.successCallback(cache.get(key));
        }
    };

    /**
     * Validates a request to update an item shared link. Throws when the item id or permissions are missing,
     * or the user cannot share. Set `canSkipSetShareAccessPermission` to skip the `can_set_share_access` check.
     */
    validateSharedLinkRequest(
        itemID: string | null | undefined,
        itemPermissions: BoxItemPermission | null | undefined,
        canSkipSetShareAccessPermission: boolean = false,
    ): void {
        if (!itemID || !itemPermissions) {
            this.errorCode = ERROR_CODE_SHARE_ITEM;
            throw getBadItemError();
        }

        // It is sometimes necessary to skip `can_set_share_access` permission check
        // e.g. Viewer permission can create shared links but cannot update access level
        const { can_share, can_set_share_access }: BoxItemPermission = itemPermissions;
        if (!can_share || (!canSkipSetShareAccessPermission && !can_set_share_access)) {
            this.errorCode = ERROR_CODE_SHARE_ITEM;
            throw getBadPermissionsError();
        }
    }

    /**
     * Creates, modifies (changes access of), or removes the item's shared link.
     * `options.fields` optionally requests specific fields.
     */
    async share(
        item: BoxItem,
        access: Access | undefined, // if "access" is undefined, the backend will set the default access level for the shared link
        successCallback: Function,
        errorCallback: ElementsErrorCallback = noop,
        options: RequestOptions = {},
    ): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.reject();
        }

        try {
            const { id, permissions, shared_link: sharedLink }: BoxItem = item;
            this.id = id;
            this.successCallback = successCallback as Base['successCallback'];
            this.errorCallback = errorCallback;

            // skip permission check when creating links with default access level
            const canSkipSetShareAccessPermission = !sharedLink && access === undefined;
            this.validateSharedLinkRequest(id, permissions, canSkipSetShareAccessPermission);

            const { fields } = options;
            const requestData: RequestData = {
                url: this.getUrl(this.id),
                data: {
                    shared_link: access === ACCESS_NONE ? null : { access },
                },
            };
            if (fields) {
                requestData.params = { fields: fields.toString() };
            }

            const { data } = await this.xhr.put(requestData);
            return this.shareSuccessHandler(data, fields);
        } catch (e) {
            return this.errorHandler(e);
        }
    }

    /** Updates the item's shared link with `sharedLinkParams`. `options.fields` optionally requests specific fields. */
    async updateSharedLink(
        item: BoxItem,
        sharedLinkParams: Partial<SharedLink>,
        successCallback: Function,
        errorCallback: ElementsErrorCallback = noop,
        options: RequestOptions = {},
    ): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.reject();
        }

        try {
            const { id, permissions }: BoxItem = item;
            this.id = id;
            this.successCallback = successCallback as Base['successCallback'];
            this.errorCallback = errorCallback;

            this.validateSharedLinkRequest(id, permissions);

            const { fields } = options;
            const requestData: RequestData = {
                url: this.getUrl(this.id),
                data: {
                    shared_link: sharedLinkParams,
                },
            };
            if (fields) {
                requestData.params = { fields: fields.toString() };
            }

            const { data } = await this.xhr.put(requestData);
            return this.shareSuccessHandler(data, fields);
        } catch (e) {
            return this.errorHandler(e);
        }
    }
}

export default Item;
