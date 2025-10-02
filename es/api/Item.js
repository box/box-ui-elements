function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Helper for the box item API
 * @author Box
 */

import noop from 'lodash/noop';
import setProp from 'lodash/set';
import { getBadItemError, getBadPermissionsError } from '../utils/error';
import { fillMissingProperties } from '../utils/fields';
import Base from './Base';
import { ACCESS_NONE, CACHE_PREFIX_SEARCH, CACHE_PREFIX_FOLDER, TYPE_FOLDER, ERROR_CODE_DELETE_ITEM, ERROR_CODE_RENAME_ITEM, ERROR_CODE_SHARE_ITEM } from '../constants';
class Item extends Base {
  constructor(...args) {
    super(...args);
    /**
     * Handles response for deletion
     *
     * @return {void}
     */
    _defineProperty(this, "deleteSuccessHandler", () => {
      if (this.isDestroyed()) {
        return;
      }

      // When fetching the parent folder from the cache
      // we have no guarantees that it will be there since
      // search results happen across folders and we only
      // add those folders to cache that have been navigated to.
      const parentKey = this.getParentCacheKey(this.parentId);
      const folder = this.getCache().get(parentKey);
      if (!folder) {
        this.postDeleteCleanup();
        return;
      }

      // Same logic as above but in this case we may have the parent
      // folders meta data in cache but not its contents.
      const {
        item_collection
      } = folder;
      if (!item_collection) {
        this.postDeleteCleanup();
        return;
      }
      const {
        entries,
        total_count
      } = item_collection;
      if (!Array.isArray(entries) || typeof total_count !== 'number') {
        throw getBadItemError();
      }
      const childKey = this.getCacheKey(this.id);
      const oldCount = entries.length;
      const newEntries = entries.filter(entry => entry !== childKey);
      const newCount = newEntries.length;
      const updatedObject = this.merge(parentKey, 'item_collection', _extends(item_collection, {
        entries: newEntries,
        total_count: total_count - (oldCount - newCount)
      }));
      this.successCallback(updatedObject);
      this.postDeleteCleanup();
    });
    /**
     * Handles response for rename
     *
     * @param {BoxItem} data - The updated item
     * @return {void}
     */
    _defineProperty(this, "renameSuccessHandler", ({
      data
    }) => {
      if (!this.isDestroyed()) {
        // Get rid of all searches
        this.getCache().unsetAll(CACHE_PREFIX_SEARCH);
        const updatedObject = this.merge(this.getCacheKey(this.id), 'name', data.name);
        this.successCallback(updatedObject);
      }
    });
    /**
     * Handles response for shared link
     *
     * @param {BoxItem} data - The updated item
     * @param {Array<string>} [fields] - Optional fields from request
     * @return {void}
     */
    _defineProperty(this, "shareSuccessHandler", (data, fields) => {
      if (!this.isDestroyed()) {
        // Add fields that were requested but not returned
        const dataWithMissingFields = fields ? fillMissingProperties(data, fields) : data;
        const cache = this.getCache();
        const key = this.getCacheKey(this.id);
        if (cache.has(key)) {
          cache.merge(key, dataWithMissingFields);
        } else {
          cache.set(key, dataWithMissingFields);
        }
        this.successCallback(cache.get(key));
      }
    });
  }
  /**
   * @property {string}
   */

  /**
   * @property {string}
   */

  /**
   * @property {Function}
   */

  /**
   * @property {Function}
   */

  /**
   * Creates a key for the item's parent
   * This is always a folder
   *
   * @param {string} Id - folder id
   * @return {string} Key
   */
  getParentCacheKey(id) {
    return `${CACHE_PREFIX_FOLDER}${id}`;
  }

  /**
   * Creates a key for the cache
   *
   * @param {string} Id - Folder id
   * @return {string} Key
   */
  getCacheKey(id) {
    return `getCacheKey(${id}) should be overriden`;
  }

  /**
   * API URL for items
   *
   * @param {string} id - Item id
   * @protected
   * @return {string} Base url for files
   */
  getUrl(id) {
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
  merge(cacheKey, key, value) {
    const cache = this.getCache();
    cache.merge(cacheKey, setProp({}, key, value));
    return cache.get(cacheKey);
  }

  /**
   * Steps to do after deletion
   *
   * @return {void}
   */
  postDeleteCleanup() {
    if (this.isDestroyed()) {
      return;
    }

    // Get rid of all searches
    this.getCache().unsetAll(CACHE_PREFIX_SEARCH);
    this.successCallback();
  }
  /**
   * API to delete an Item
   *
   * @param {BoxItem} item - Item to delete
   * @param {Function} successCallback - Success callback
   * @param {Function} errorCallback - Error callback
   * @return {void}
   */
  deleteItem(item, successCallback, errorCallback = noop) {
    if (this.isDestroyed()) {
      return Promise.reject();
    }
    this.errorCode = ERROR_CODE_DELETE_ITEM;
    const {
      id,
      permissions,
      parent,
      type
    } = item;
    if (!id || !permissions || !parent || !type) {
      errorCallback(getBadItemError(), this.errorCode);
      return Promise.reject();
    }
    const {
      id: parentId
    } = parent;
    const {
      can_delete
    } = permissions;
    if (!can_delete || !parentId) {
      errorCallback(getBadPermissionsError(), this.errorCode);
      return Promise.reject();
    }
    this.id = id;
    this.parentId = parentId;
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
    const url = `${this.getUrl(id)}${type === TYPE_FOLDER ? '?recursive=true' : ''}`;
    return this.xhr.delete({
      url
    }).then(this.deleteSuccessHandler).catch(e => {
      this.errorHandler(e);
    });
  }
  /**
   * API to rename an Item
   *
   * @param {BoxItem} item - Item to rename
   * @param {string} name - Item new name
   * @param {Function} successCallback - Success callback
   * @param {Function} errorCallback - Error callback
   * @return {void}
   */
  rename(item, name, successCallback, errorCallback = noop) {
    if (this.isDestroyed()) {
      return Promise.reject();
    }
    this.errorCode = ERROR_CODE_RENAME_ITEM;
    const {
      id,
      permissions
    } = item;
    if (!id || !permissions) {
      errorCallback(getBadItemError(), this.errorCode);
      return Promise.reject();
    }
    const {
      can_rename
    } = permissions;
    if (!can_rename) {
      errorCallback(getBadPermissionsError(), this.errorCode);
      return Promise.reject();
    }
    this.id = id;
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
    return this.xhr.put({
      url: `${this.getUrl(id)}`,
      data: {
        name
      }
    }).then(this.renameSuccessHandler).catch(e => {
      this.errorHandler(e);
    });
  }
  /**
   * Validate request to update an item shared link
   *
   * @param {string|void} itemID - ID of item to share
   * @param {BoxItemPermission|void} itemPermissions - Permissions for item
   * @param {boolean|void} canSkipSetShareAccessPermission - skip `can_set_share_access` permission check
   * @throws {Error}
   * @return {void}
   */
  validateSharedLinkRequest(itemID, itemPermissions, canSkipSetShareAccessPermission = false) {
    if (!itemID || !itemPermissions) {
      this.errorCode = ERROR_CODE_SHARE_ITEM;
      throw getBadItemError();
    }

    // It is sometimes necessary to skip `can_set_share_access` permission check
    // e.g. Viewer permission can create shared links but cannot update access level
    const {
      can_share,
      can_set_share_access
    } = itemPermissions;
    if (!can_share || !canSkipSetShareAccessPermission && !can_set_share_access) {
      this.errorCode = ERROR_CODE_SHARE_ITEM;
      throw getBadPermissionsError();
    }
  }

  /**
   * API to create, modify (change access), or remove a shared link
   *
   * @param {BoxItem} item - Item to share
   * @param {Access} access - Shared access level
   * @param {Function} successCallback - Success callback
   * @param {Function|void} errorCallback - Error callback
   * @param {Array<string>|void} [options.fields] - Optionally include specific fields
   * @return {Promise<void>}
   */
  async share(item, access,
  // if "access" is undefined, the backend will set the default access level for the shared link
  successCallback, errorCallback = noop, options = {}) {
    if (this.isDestroyed()) {
      return Promise.reject();
    }
    try {
      const {
        id,
        permissions,
        shared_link: sharedLink
      } = item;
      this.id = id;
      this.successCallback = successCallback;
      this.errorCallback = errorCallback;

      // skip permission check when creating links with default access level
      const canSkipSetShareAccessPermission = !sharedLink && access === undefined;
      this.validateSharedLinkRequest(id, permissions, canSkipSetShareAccessPermission);
      const {
        fields
      } = options;
      const requestData = {
        url: this.getUrl(this.id),
        data: {
          shared_link: access === ACCESS_NONE ? null : {
            access
          }
        }
      };
      if (fields) {
        requestData.params = {
          fields: fields.toString()
        };
      }
      const {
        data
      } = await this.xhr.put(requestData);
      return this.shareSuccessHandler(data, fields);
    } catch (e) {
      return this.errorHandler(e);
    }
  }

  /**
   * API to update a shared link
   *
   * @param {BoxItem} item - Item to update
   * @param {$Shape<SharedLink>} sharedLinkParams - New shared link parameters
   * @param {Function} successCallback - Success callback
   * @param {Function|void} errorCallback - Error callback
   * @param {Array<string>|void} [options.fields] - Optionally include specific fields
   * @return {Promise<void>}
   */
  async updateSharedLink(item, sharedLinkParams, successCallback, errorCallback = noop, options = {}) {
    if (this.isDestroyed()) {
      return Promise.reject();
    }
    try {
      const {
        id,
        permissions
      } = item;
      this.id = id;
      this.successCallback = successCallback;
      this.errorCallback = errorCallback;
      this.validateSharedLinkRequest(id, permissions);
      const {
        fields
      } = options;
      const requestData = {
        url: this.getUrl(this.id),
        data: {
          shared_link: sharedLinkParams
        }
      };
      if (fields) {
        requestData.params = {
          fields: fields.toString()
        };
      }
      const {
        data
      } = await this.xhr.put(requestData);
      return this.shareSuccessHandler(data, fields);
    } catch (e) {
      return this.errorHandler(e);
    }
  }
}
export default Item;
//# sourceMappingURL=Item.js.map