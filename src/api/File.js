/**
 * @flow
 * @file Helper for the box file API
 * @author Box
 */

import Item from './Item';
import { getFieldsAsString } from '../util/fields';
import { getTypedFileId } from '../util/file';
import { FIELD_DOWNLOAD_URL, CACHE_PREFIX_FILE, X_REP_HINTS } from '../constants';
import { getBadItemError, getBadPermissionsError } from '../util/error';

class File extends Item {
    /**
     * Creates a key for the cache
     *
     * @param {string} id - Folder id
     * @return {string} key
     */
    getCacheKey(id: string): string {
        return `${CACHE_PREFIX_FILE}${id}`;
    }

    /**
     * API URL for files
     *
     * @param {string} [id] - Optional file id
     * @return {string} base url for files
     */
    getUrl(id: string): string {
        const suffix: string = id ? `/${id}` : '';
        return `${this.getBaseApiUrl()}/files${suffix}`;
    }

    /**
     * API for getting download URL for files
     *
     * @param {string} id - File id
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    getDownloadUrl(id: string, successCallback: Function, errorCallback: Function): Promise<void> {
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
        return this.xhr
            .get({
                url: this.getUrl(id),
                params: {
                    fields: FIELD_DOWNLOAD_URL
                }
            })
            .then(({ data }: { data: BoxItem }) => {
                this.successHandler(data[FIELD_DOWNLOAD_URL]);
            })
            .catch(this.errorHandler);
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
    setFileDescription(
        file: BoxItem,
        description: string,
        successCallback: Function,
        errorCallback: Function
    ): Promise<void> {
        const { id, permissions } = file;

        if (!id || !permissions) {
            errorCallback(getBadItemError());
            return Promise.reject();
        }

        if (!permissions.can_rename) {
            errorCallback(getBadPermissionsError());
            return Promise.reject();
        }

        return this.xhr
            .put({
                id: getTypedFileId(id),
                url: this.getUrl(id),
                data: { description }
            })
            .then(({ data }: { data: BoxItem }) => {
                if (!this.isDestroyed()) {
                    const updatedFile = this.merge(this.getCacheKey(id), 'description', data.description);
                    successCallback(updatedFile);
                }
            })
            .catch((e) => {
                if (!this.isDestroyed()) {
                    const originalFile = this.merge(this.getCacheKey(id), 'description', file.description);
                    errorCallback(e, originalFile);
                }
            });
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

        const cache: APICache = this.getCache();
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
                id: getTypedFileId(id),
                url: this.getUrl(id),
                params: {
                    fields: getFieldsAsString(true, includePreviewSidebarFields)
                },
                headers: { 'X-Rep-Hints': X_REP_HINTS }
            })
            .then(({ data }: { data: BoxItem }) => {
                if (!this.isDestroyed()) {
                    cache.set(key, data);
                    successCallback(data);
                }
            })
            .catch(errorCallback);
    }
}

export default File;
