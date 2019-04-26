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
     * @param {string} [versionId] - Optional file version id
     * @return {string} base url for files
     */
    getUrl(id: string, versionId: ?string): string {
        const fileSuffix: string = id ? `/${id}` : '';
        const fileVersionSuffix: string = versionId ? `/versions/${versionId}` : '';
        return `${this.getBaseApiUrl()}/files${fileSuffix}${fileVersionSuffix}`;
    }

    /**
     * API for getting download URL for files
     *
     * @param {string} id - File id
     * @param {string|null} versionId - File version id
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     * @return {void}
     */
    getDownloadUrl(
        id: string,
        versionId: ?string,
        successCallback: Function,
        errorCallback: ElementsErrorCallback,
    ): Promise<void> {
        this.errorCode = ERROR_CODE_GET_DOWNLOAD_URL;
        this.errorCallback = errorCallback;
        this.successCallback = successCallback;

        return this.xhr
            .get({
                url: this.getUrl(id, versionId),
                params: {
                    fields: FIELD_AUTHENTICATED_DOWNLOAD_URL,
                },
            })
            .then(async ({ data }: { data: BoxItem }) => {
                const dataUrl = data[FIELD_AUTHENTICATED_DOWNLOAD_URL];
                const typedId = getTypedFileId(id);
                const token: TokenLiteral = await TokenService.getReadToken(typedId, this.options.token);
                const tokenString: ?string = token && (typeof token === 'string' ? token : token.read);

                if (!dataUrl || !tokenString) {
                    this.errorHandler({ code: this.errorCode });
                }

                const { query, url: downloadUrl } = queryString.parseUrl(dataUrl);
                const downloadUrlParams = { ...query, access_token: tokenString };
                const downloadUrlQuery = queryString.stringify(downloadUrlParams);

                this.successHandler(`${downloadUrl}?${downloadUrlQuery}`);
            })
            .catch((e: $AxiosError<any>) => {
                this.errorHandler(e);
            });
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
