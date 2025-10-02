function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Helper for the box recents api
 * @author Box
 */

import flatten from '../utils/flatten';
import { getBadItemError } from '../utils/error';
import { FOLDER_FIELDS_TO_FETCH } from '../utils/fields';
import Base from './Base';
import FileAPI from './File';
import FolderAPI from './Folder';
import WebLinkAPI from './WebLink';
import { DEFAULT_ROOT, CACHE_PREFIX_RECENTS, ERROR_CODE_FETCH_RECENTS, FIELD_DATE, FIELD_REPRESENTATIONS, X_REP_HINT_HEADER_DIMENSIONS_DEFAULT, SORT_DESC } from '../constants';
class Recents extends Base {
  constructor(...args) {
    super(...args);
    /**
     * Handles the folder Recents response
     *
     * @param {Object} response
     * @return {void}
     */
    _defineProperty(this, "recentsSuccessHandler", ({
      data
    }) => {
      if (this.isDestroyed()) {
        return;
      }
      const {
        entries,
        order: {
          by,
          direction
        }
      } = data;
      const items = [];
      entries.forEach(({
        item,
        interacted_at
      }) => {
        const {
          path_collection
        } = item;
        const shouldInclude = this.id === DEFAULT_ROOT || !!path_collection && path_collection.entries.findIndex(crumb => crumb.id === this.id) !== -1;
        if (shouldInclude) {
          items.push(_extends(item, {
            interacted_at
          }));
        }
      });
      const flattenedItems = flatten(items, new FolderAPI(this.options), new FileAPI(this.options), new WebLinkAPI(this.options));
      this.getCache().set(this.key, {
        item_collection: {
          entries: flattenedItems,
          order: [{
            by,
            direction
          }]
        }
      });
      this.finish();
    });
    /**
     * Handles the Recents error
     *
     * @param {Error} error fetch error
     * @return {void}
     */
    _defineProperty(this, "recentsErrorHandler", error => {
      if (this.isDestroyed()) {
        return;
      }
      this.errorCallback(error, this.errorCode);
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
   * Creates a key for the cache
   *
   * @param {string} id folder id
   * @return {string} key
   */
  getCacheKey(id) {
    return `${CACHE_PREFIX_RECENTS}${id}`;
  }

  /**
   * URL for recents api
   *
   * @return {string} base url for files
   */
  getUrl() {
    return `${this.getBaseApiUrl()}/recent_items`;
  }

  /**
   * Returns the results
   *
   * @return {void}
   */
  finish() {
    if (this.isDestroyed()) {
      return;
    }
    const cache = this.getCache();
    const recents = cache.get(this.key);
    const {
      item_collection
    } = recents;
    if (!item_collection) {
      throw getBadItemError();
    }
    const {
      entries
    } = item_collection;
    if (!Array.isArray(entries)) {
      throw getBadItemError();
    }
    const collection = {
      id: this.id,
      items: entries.map(key => cache.get(key)),
      percentLoaded: 100,
      sortBy: FIELD_DATE,
      // Results are always sorted by date
      sortDirection: SORT_DESC // Results are always sorted descending
    };
    this.successCallback(collection);
  }
  /**
   * Does the network request
   *
   * @param {RequestOptions} options - options for request
   * @return {Promise}
   */
  recentsRequest(options = {}) {
    if (this.isDestroyed()) {
      return Promise.reject();
    }
    const {
      fields
    } = options;
    const requestFields = fields || FOLDER_FIELDS_TO_FETCH;
    this.errorCode = ERROR_CODE_FETCH_RECENTS;
    return this.xhr.get({
      url: this.getUrl(),
      params: {
        fields: requestFields.toString()
      },
      headers: requestFields.includes(FIELD_REPRESENTATIONS) ? {
        'X-Rep-Hints': X_REP_HINT_HEADER_DIMENSIONS_DEFAULT
      } : {}
    }).then(this.recentsSuccessHandler).catch(this.recentsErrorHandler);
  }

  /**
   * Gets recent files
   *
   * @param {string} id - parent folder id
   * @param {Function} successCallback - Function to call with results
   * @param {Function} errorCallback - Function to call with errors
   * @param {boolean|void} [options.forceFetch] - Bypasses the cache
   * @return {void}
   */
  recents(id, successCallback, errorCallback, options = {}) {
    if (this.isDestroyed()) {
      return;
    }

    // Save references
    this.id = id;
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;
    const cache = this.getCache();
    this.key = this.getCacheKey(this.id);

    // Clear the cache if needed
    if (options.forceFetch) {
      cache.unset(this.key);
    }

    // Return the Cache value if it exists
    if (cache.has(this.key)) {
      this.finish();
      return;
    }

    // Make the XHR request
    this.recentsRequest(options);
  }
}
export default Recents;
//# sourceMappingURL=Recents.js.map