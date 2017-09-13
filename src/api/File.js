/**
 * @flow
 * @file Helper for the box file api
 * @author Box
 */

import Item from './Item';
import Cache from '../util/Cache';
import getFields from '../util/fields';
import { FIELD_DOWNLOAD_URL, CACHE_PREFIX_FILE, X_REP_HINTS, TYPED_ID_FILE_PREFIX } from '../constants';
import type { BoxItem } from '../flowTypes';

class File extends Item {
    /**
     * Creates a key for the cache
     *
     * @param {string} id folder id
     * @return {string} key
     */
    getCacheKey(id: string): string {
        return `${CACHE_PREFIX_FILE}${id}`;
    }

    /**
     * Returns typed id for file. Useful for when
     * making file based XHRs where auth token
     * can be per file as used by Preview.
     *
     * @return {string} typed id for file
     */
    getTypedFileId(id: string): string {
        return `${TYPED_ID_FILE_PREFIX}${id}`;
    }

    /**
     * API URL for files
     *
     * @param {string} [id] optional file id
     * @return {string} base url for files
     */
    getUrl(id: string): string {
        const suffix: string = id ? `/${id}` : '';
        return `${this.getBaseUrl()}/files${suffix}`;
    }

    /**
     * API for getting download URL for files
     *
     * @param {string} id - file id
     * @return {void}
     */
    getDownloadUrl(id: string, successCallback: Function, errorCallback: Function): Promise<void> {
        return this.xhr
            .get({
                url: this.getUrl(id),
                params: {
                    fields: FIELD_DOWNLOAD_URL
                }
            })
            .then((data: BoxItem) => {
                successCallback(data[FIELD_DOWNLOAD_URL]);
            })
            .catch(errorCallback);
    }

    /**
     * Gets a box file
     *
     * @param {string} id - File id
     * @param {Function} successCallback - Function to call with results
     * @param {Function} errorCallback - Function to call with errors
     * @param {boolean|void} [forceFetch] - Bypasses the cache
     * @param {boolean|void} [includePreviewSidebar] - Optionally include preview sidebar fields
     * @return {Promise}
     */
    file(
        id: string,
        successCallback: Function,
        errorCallback: Function,
        forceFetch: boolean = false,
        includePreviewSidebarFields: boolean = false
    ): Promise<void> {
        if (this.isDestroyed()) {
            return Promise.reject();
        }

        const cache: Cache = this.getCache();
        const key = this.getCacheKey(id);

        // Clear the cache if needed
        if (forceFetch) {
            cache.unset(key);
        }

        // Return the Cache value if it exists
        if (cache.has(key)) {
            successCallback(cache.get(key));
            return Promise.resolve();
        }

        // Make the XHR request
        // We use per file auth tokens for file
        // as thats what needed by preview.
        return this.xhr
            .get({
                id: this.getTypedFileId(id),
                url: this.getUrl(id),
                params: {
                    fields: getFields(true, includePreviewSidebarFields)
                },
                headers: { 'X-Rep-Hints': X_REP_HINTS }
            })
            .then((file: BoxItem) => {
                cache.set(key, file);
                successCallback(file);
            })
            .catch(errorCallback);
    }
}

export default File;
