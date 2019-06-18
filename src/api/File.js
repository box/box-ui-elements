/**
 * @flow
 * @file Helper for the box file API
 * @author Box
 */

import queryString from 'query-string';
import { findMissingProperties, fillMissingProperties } from '../utils/fields';
import { getTypedFileId } from '../utils/file';
import { getBadItemError, getBadPermissionsError } from '../utils/error';
import {
    CACHE_PREFIX_FILE,
    ERROR_CODE_FETCH_FILE,
    ERROR_CODE_GET_DOWNLOAD_URL,
    FIELD_AUTHENTICATED_DOWNLOAD_URL,
    FIELD_EXTENSION,
    FIELD_IS_DOWNLOAD_AVAILABLE,
    FIELD_REPRESENTATIONS,
    X_REP_HINTS,
} from '../constants';
import Item from './Item';
import TokenService from '../utils/TokenService';

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
     * API for getting download URL for files and file versions
     *
     * @param {string} fileId - File id
     * @param {BoxItem|BoxItemVersion} fileOrFileVersion - File or file version to download
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    async getDownloadUrl(
        fileId: string,
        fileOrFileVersion: BoxItem | BoxItemVersion,
        successCallback: string => void,
        errorCallback: ElementsErrorCallback,
    ): Promise<void> {
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

        const { query, url: downloadBaseUrl } = queryString.parseUrl(downloadUrl);
        const downloadUrlParams = { ...query, access_token: token };
        const downloadUrlQuery = queryString.stringify(downloadUrlParams);

        this.successHandler(`${downloadBaseUrl}?${downloadUrlQuery}`);
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
        errorCallback: Function,
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
                data: { description },
            })
            .then(({ data }: { data: BoxItem }) => {
                if (!this.isDestroyed()) {
                    const updatedFile = this.merge(this.getCacheKey(id), 'description', data.description);
                    successCallback(updatedFile);
                }
            })
            .catch(() => {
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
    async getFile(
        id: string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
        options: FetchOptions = {},
    ): Promise<void> {
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

            this.successHandler(cache.get(key));
        } catch (e) {
            this.errorHandler(e);
        }
    }

    /**
     * Get the thumbnail url for a given BoxItem.  The function will attempt
     * to fetch a jpg thumbnail of the given dimensions.  If this fails, the function
     * will attempt to fectch a 1024x1024 png of the first page of the file as a fallback.
     *
     * @param {BoxItem} item - item whose thumbnail should be fetched
     * @param {string} dimensions - desired dimensions of thumbnail. Acceptable dimensions
     * for a jpg are: "32x32", "94x94", "160x160", "320x320", "1024x1024", "2048x2048".
     * @param {Function} successCallback - function to call with the thumbnail url. The thumbnail
     * url will be null if one could not be fetched.
     * @param {Function} errorCallback - Function to call with errors
     * @return {void}
     */
    getFileThumbnail(
        item: BoxItem,
        dimensions: string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
    ): void {
        if (this.isDestroyed()) {
            return;
        }

        this.successCallback = successCallback;
        this.errorCallback = errorCallback;

        // no need to make api call since folders do not have thumbnails
        if (item.type === 'folder') {
            this.successHandler(null);
        }

        // TODO: implement cache for recently fetched thumbnails

        const { id } = item;
        const newUrl = this.getUrl(id);

        const access_token = this.xhr.token;
        if (!access_token) {
            return;
        }

        const xhrOptions: Object = {
            url: newUrl,
            headers: {
                // API will return first representation it finds, so 1024x1024 png is fallback.
                'X-Rep-Hints': `[jpg?dimensions=${dimensions},png?dimensions=1024x1024]`,
            },
            params: {
                fields: FIELD_REPRESENTATIONS,
            },
        };
        try {
            this.xhr
                .get(xhrOptions)
                .then(response => {
                    const entries = response.data.representations.entries;

                    if (!entries.length || entries[0].status.state !== 'success') {
                        return null;
                    }

                    // if unable to fetch jpg thumbnail, grab png of first page of file.
                    // Asset path for thumbnail is simply empty string.
                    const asset_path = entries[0].representation === 'jpg' ? '' : '1.png';

                    const thumbnailLink = entries[0].content.url_template.replace('{+asset_path}', asset_path);

                    // use token in URL for authorization
                    return `${thumbnailLink}?access_token=${access_token}`;
                })
                .then(thumbnailUrl => {
                    // TODO: Calling this.successHandler(thumbnailUrl) leads to no thumbnails loading.
                    // Investigate this.
                    if (!this.isDestroyed() && typeof this.successCallback === 'function') {
                        successCallback(thumbnailUrl);
                    }
                });
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
    getFileExtension(id: string, successCallback: Function, errorCallback: ElementsErrorCallback): void {
        if (this.isDestroyed()) {
            return;
        }

        this.getFile(id, successCallback, errorCallback, {
            fields: [FIELD_EXTENSION],
        });
    }
}

export default File;
