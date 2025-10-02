function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Helper for the box file API
 * @author Box
 */

import queryString from 'query-string';
import getProp from 'lodash/get';
import { findMissingProperties, fillMissingProperties } from '../utils/fields';
import { getTypedFileId } from '../utils/file';
import { getBadItemError, getBadPermissionsError } from '../utils/error';
import { CACHE_PREFIX_FILE, ERROR_CODE_FETCH_FILE, ERROR_CODE_GET_DOWNLOAD_URL, FIELD_AUTHENTICATED_DOWNLOAD_URL, FIELD_EXTENSION, FIELD_IS_DOWNLOAD_AVAILABLE, REPRESENTATIONS_RESPONSE_ERROR, REPRESENTATIONS_RESPONSE_SUCCESS, REPRESENTATIONS_RESPONSE_VIEWABLE, X_REP_HINTS } from '../constants';
import Item from './Item';
import { retryNumOfTimes } from '../utils/function';
import TokenService from '../utils/TokenService';
class File extends Item {
  /**
   * Creates a key for the cache
   *
   * @param {string} id - Folder id
   * @return {string} key
   */
  getCacheKey(id) {
    return `${CACHE_PREFIX_FILE}${id}`;
  }

  /**
   * API URL for files
   *
   * @param {string} [id] - Optional file id
   * @return {string} base url for files
   */
  getUrl(id) {
    const suffix = id ? `/${id}` : '';
    return `${this.getBaseApiUrl()}/files${suffix}`;
  }

  /**
   * API for getting download URL for files and file versions
   *
   * @param {string} fileId - File id
   * @param {BoxItem|BoxItemVersion} fileOrFileVersion - File or file version to download
   * @param {Function} successCallback - Success callback
   * @param {Function} errorCallback - Error callback
   * @return {void}
   */
  async getDownloadUrl(fileId, fileOrFileVersion, successCallback, errorCallback) {
    this.errorCode = ERROR_CODE_GET_DOWNLOAD_URL;
    this.errorCallback = errorCallback;
    this.successCallback = successCallback;
    const downloadAvailable = fileOrFileVersion[FIELD_IS_DOWNLOAD_AVAILABLE];
    const downloadUrl = fileOrFileVersion[FIELD_AUTHENTICATED_DOWNLOAD_URL];
    const token = await TokenService.getReadToken(getTypedFileId(fileId), this.options.token);
    if (!downloadAvailable || !downloadUrl || !token) {
      this.errorHandler(new Error('Download is missing required fields or token.'));
      return;
    }
    const {
      query,
      url: downloadBaseUrl
    } = queryString.parseUrl(downloadUrl);
    const downloadUrlParams = _objectSpread(_objectSpread({}, query), {}, {
      access_token: token
    });
    const downloadUrlQuery = queryString.stringify(downloadUrlParams);
    this.successHandler(`${downloadBaseUrl}?${downloadUrlQuery}`);
  }

  /**
   * Determines whether the call to the file representations API has completed
   *
   * @param {data: { FileRepresentation }} response
   * @return {boolean}
   */
  isRepresentationsCallComplete(response) {
    const status = getProp(response, 'data.status.state');
    return !status || status === REPRESENTATIONS_RESPONSE_ERROR || status === REPRESENTATIONS_RESPONSE_SUCCESS || status === REPRESENTATIONS_RESPONSE_VIEWABLE;
  }

  /**
   * Polls a representation's infoUrl, attempting to generate a representation
   *
   * @param {FileRepresentation} representation - representation that should have its info.url polled
   * @return {Promise<FileRepresentation>} - representation updated with most current status
   */
  async generateRepresentation(representation) {
    const infoUrl = getProp(representation, 'info.url');
    if (!infoUrl) {
      return representation;
    }
    return retryNumOfTimes((successCallback, errorCallback) => this.xhr.get({
      successCallback,
      errorCallback,
      url: infoUrl
    }).then(response => this.isRepresentationsCallComplete(response) ? successCallback(response.data) : errorCallback(response.data)).catch(e => {
      errorCallback(e);
    }), 4, 2000, 2);
  }

  /**
   * API for getting a thumbnail URL for a BoxItem
   *
   * @param {BoxItem} item - BoxItem to get the thumbnail URL for
   * @return {Promise<?string>} - the url for the item's thumbnail, or null
   */
  async getThumbnailUrl(item) {
    const entry = getProp(item, 'representations.entries[0]');
    const extension = getProp(entry, 'representation');
    const template = getProp(entry, 'content.url_template');
    const token = await TokenService.getReadToken(getTypedFileId(item.id), this.options.token);
    if (!extension || !template || !token) {
      return null;
    }
    const thumbnailUrl = template.replace('{+asset_path}', extension === 'jpg' ? '' : '1.png');
    const {
      query,
      url: thumbnailBaseUrl
    } = queryString.parseUrl(thumbnailUrl);
    const thumbnailUrlParams = _objectSpread(_objectSpread({}, query), {}, {
      access_token: token
    });
    const thumbnailUrlQuery = queryString.stringify(thumbnailUrlParams);
    return `${thumbnailBaseUrl}?${thumbnailUrlQuery}`;
  }

  /**
   * API for setting the description of a file
   *
   * @param {BoxItem} file - File object for which we are changing the description
   * @param {string} description - New file description
   * @param {Function} successCallback - Success callback
   * @param {Function} errorCallback - Error callback
   * @return {Promise}
   */
  setFileDescription(file, description, successCallback, errorCallback) {
    const {
      id,
      permissions
    } = file;
    if (!id || !permissions) {
      errorCallback(getBadItemError());
      return Promise.reject();
    }
    if (!permissions.can_rename) {
      errorCallback(getBadPermissionsError());
      return Promise.reject();
    }
    return this.xhr.put({
      id: getTypedFileId(id),
      url: this.getUrl(id),
      data: {
        description
      }
    }).then(({
      data
    }) => {
      if (!this.isDestroyed()) {
        const updatedFile = this.merge(this.getCacheKey(id), 'description', data.description);
        successCallback(updatedFile);
      }
    }).catch(() => {
      if (!this.isDestroyed()) {
        const originalFile = this.merge(this.getCacheKey(id), 'description', file.description);
        errorCallback(originalFile);
      }
    });
  }

  /**
   * Gets a box file
   *
   * @param {string} id - File id
   * @param {Function} successCallback - Function to call with results
   * @param {Function} errorCallback - Function to call with errors
   * @param {boolean|void} [options.fields] - Optionally include specific fields
   * @param {boolean|void} [options.forceFetch] - Optionally Bypasses the cache
   * @param {boolean|void} [options.refreshCache] - Optionally Updates the cache
   * @return {Promise}
   */
  async getFile(id, successCallback, errorCallback, options = {}) {
    if (this.isDestroyed()) {
      return;
    }
    const cache = this.getCache();
    const key = this.getCacheKey(id);
    const isCached = !options.forceFetch && cache.has(key);
    const file = isCached ? cache.get(key) : {
      id
    };
    let missingFields = findMissingProperties(file, options.fields);
    const xhrOptions = {
      id: getTypedFileId(id),
      url: this.getUrl(id),
      headers: {
        'X-Rep-Hints': X_REP_HINTS
      }
    };
    this.errorCode = ERROR_CODE_FETCH_FILE;
    this.successCallback = successCallback;
    this.errorCallback = errorCallback;

    // If the file was cached and there are no missing fields
    // then just return the cached file and optionally refresh
    // the cache with new data if required
    if (isCached && missingFields.length === 0) {
      successCallback(file);
      missingFields = options.fields || [];
      if (!options.refreshCache) {
        return;
      }
    }

    // If there are missing fields to fetch, add it to the params
    if (missingFields.length > 0) {
      xhrOptions.params = {
        fields: missingFields.toString()
      };
    }
    try {
      const {
        data
      } = await this.xhr.get(xhrOptions);
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
      this.successHandler(cache.get(key));
    } catch (e) {
      this.errorHandler(e);
    }
  }

  /**
   * Gets the extension of a box file.
   *
   * @param {string} id - File id
   * @param {Function} successCallback - Function to call with results
   * @param {Function} errorCallback - Function to call with errors
   * @return {Promise}
   */
  getFileExtension(id, successCallback, errorCallback) {
    if (this.isDestroyed()) {
      return;
    }
    this.getFile(id, successCallback, errorCallback, {
      fields: [FIELD_EXTENSION]
    });
  }
}
export default File;
//# sourceMappingURL=File.js.map