function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Helper for the box folder api
 * @author Box
 */

import noop from 'lodash/noop';
import flatten from '../utils/flatten';
import { FOLDER_FIELDS_TO_FETCH } from '../utils/fields';
import { getBadItemError } from '../utils/error';
import Item from './Item';
import FileAPI from './File';
import WebLinkAPI from './WebLink';
import { CACHE_PREFIX_FOLDER, ERROR_CODE_FETCH_FOLDER, ERROR_CODE_CREATE_FOLDER, FIELD_REPRESENTATIONS, X_REP_HINT_HEADER_DIMENSIONS_DEFAULT } from '../constants';
class Folder extends Item {
  constructor(...args) {
    super(...args);
    /**
     * Handles the folder fetch response
     *
     * @param {Object} response
     * @return {void}
     */
    _defineProperty(this, "folderSuccessHandler", ({
      data
    }) => {
      if (this.isDestroyed()) {
        return;
      }
      const {
        item_collection
      } = data;
      if (!item_collection) {
        throw getBadItemError();
      }
      const {
        entries,
        total_count,
        limit,
        offset
      } = item_collection;
      if (!Array.isArray(entries) || typeof total_count !== 'number' || typeof limit !== 'number' || typeof offset !== 'number') {
        throw getBadItemError();
      }
      const flattened = flatten(entries, new Folder(this.options), new FileAPI(this.options), new WebLinkAPI(this.options));
      this.itemCache = (this.itemCache || []).concat(flattened);
      this.getCache().set(this.key, _objectSpread(_objectSpread({}, data), {}, {
        item_collection: _objectSpread(_objectSpread({}, item_collection), {}, {
          entries: this.itemCache
        })
      }));
      this.finish();
    });
    /**
     * Handles a request for folder details
     *
     * @param {Object} data - XHR response data
     * @returns {void}
     */
    _defineProperty(this, "folderDetailsSuccessHandler", ({
      data
    }) => {
      if (this.isDestroyed()) {
        return;
      }
      const cachedEntry = this.getCache().get(this.key);
      const updatedCacheEntry = _objectSpread(_objectSpread({}, cachedEntry), data);
      this.getCache().set(this.key, updatedCacheEntry);
      this.successCallback(updatedCacheEntry);
    });
    /**
     * API to rename an Item
     *
     * @param {string} id - parent folder id
     * @param {string} name - new folder name
     * @param {Function} successCallback - success callback
     * @param {Function} errorCallback - error callback
     * @return {void}
     */
    _defineProperty(this, "createSuccessHandler", ({
      data
    }) => {
      const {
        id: childId
      } = data;
      if (this.isDestroyed() || !childId) {
        return;
      }
      const childKey = this.getCacheKey(childId);
      const cache = this.getCache();
      const parent = cache.get(this.key);
      if (!parent) {
        this.successCallback(data);
        return;
      }
      const {
        item_collection
      } = parent;
      if (!item_collection) {
        throw getBadItemError();
      }
      const {
        total_count,
        entries
      } = item_collection;
      if (!Array.isArray(entries) || typeof total_count !== 'number') {
        throw getBadItemError();
      }
      cache.set(childKey, data);
      item_collection.entries = [childKey].concat(entries);
      item_collection.total_count = total_count + 1;
      this.successCallback(data);
    });
  }
  /**
   * @property {string}
   */

  /**
   * @property {string}
   */

  /**
   * @property {number}
   */

  /**
   * @property {number}
   */

  /**
   * @property {string}
   */

  /**
   * @property {string}
   */

  /**
   * @property {Array}
   */

  /**
   * @property {Function}
   */

  /**
   * @property {Function}
   */

  /**
   * Creates a key for the cache
   *
   * @param {string} id folder id
   * @return {string} key
   */
  getCacheKey(id) {
    return `${CACHE_PREFIX_FOLDER}${id}`;
  }

  /**
   * Base URL for folder api
   *
   * @param {string} [id] optional file id
   * @return {string} base url for files
   */
  getUrl(id) {
    const suffix = id ? `/${id}` : '';
    return `${this.getBaseApiUrl()}/folders${suffix}`;
  }

  /**
   * Tells if a folder has its items all loaded
   *
   * @return {boolean} if items are loaded
   */
  isLoaded() {
    const cache = this.getCache();
    return cache.has(this.key);
  }

  /**
   * Composes and returns the results
   *
   * @return {void}
   */
  finish() {
    if (this.isDestroyed()) {
      return;
    }
    const cache = this.getCache();
    const folder = cache.get(this.key);
    const {
      id,
      name,
      permissions,
      path_collection,
      item_collection
    } = folder;
    if (!item_collection || !path_collection) {
      throw getBadItemError();
    }
    const {
      entries,
      offset,
      total_count
    } = item_collection;
    if (!Array.isArray(entries) || typeof total_count !== 'number') {
      throw getBadItemError();
    }
    const collection = {
      id,
      name,
      offset,
      percentLoaded: 100,
      permissions,
      boxItem: folder,
      breadcrumbs: path_collection.entries,
      items: entries.map(key => cache.get(key)),
      sortBy: this.sortBy,
      sortDirection: this.sortDirection,
      totalCount: total_count
    };
    this.successCallback(collection);
  }
  /**
   * Does the network request for fetching a folder
   *
   * @param {Array<string>|void} fields - Optionally include specific fields
   * @return {Promise}
   */
  folderRequest({
    fields,
    noPagination
  } = {}, successHandler = this.folderSuccessHandler) {
    if (this.isDestroyed()) {
      return Promise.reject();
    }
    const requestFields = fields || FOLDER_FIELDS_TO_FETCH;
    this.errorCode = ERROR_CODE_FETCH_FOLDER;
    let params = {
      fields: requestFields.toString()
    };
    if (!noPagination) {
      params = _objectSpread(_objectSpread({}, params), {}, {
        direction: this.sortDirection.toLowerCase(),
        limit: this.limit,
        offset: this.offset,
        fields: requestFields.toString(),
        sort: this.sortBy.toLowerCase()
      });
    }
    return this.xhr.get({
      url: this.getUrl(this.id),
      params,
      headers: requestFields.includes(FIELD_REPRESENTATIONS) ? {
        'X-Rep-Hints': X_REP_HINT_HEADER_DIMENSIONS_DEFAULT
      } : {}
    }).then(successHandler).catch(this.errorHandler);
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
  getFolderFields(id, successCallback, errorCallback, options = {}) {
    if (this.isDestroyed()) {
      return;
    }

    // Save references
    this.id = id;
    this.key = this.getCacheKey(id);
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
    this.folderRequest(_objectSpread(_objectSpread({}, options), {}, {
      noPagination: true
    }), this.folderDetailsSuccessHandler);
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
  getFolder(id, limit, offset, sortBy, sortDirection, successCallback, errorCallback, options = {}) {
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
   * Does the network request for fetching a folder
   *
   * @return {void}
   */
  folderCreateRequest(name) {
    if (this.isDestroyed()) {
      return Promise.reject();
    }
    this.errorCode = ERROR_CODE_CREATE_FOLDER;
    const url = `${this.getUrl()}?fields=${FOLDER_FIELDS_TO_FETCH.toString()}`;
    return this.xhr.post({
      url,
      data: {
        name,
        parent: {
          id: this.id
        }
      }
    }).then(this.createSuccessHandler).catch(this.errorHandler);
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
  create(id, name, successCallback, errorCallback = noop) {
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
//# sourceMappingURL=Folder.js.map