/**
 * @flow
 * @file Helper for the box file API
 * @author Box
 */

import queryString from 'query-string';
import getProp from 'lodash/get';
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
    REPRESENTATIONS_RESPONSE_ERROR,
    REPRESENTATIONS_RESPONSE_SUCCESS,
    REPRESENTATIONS_RESPONSE_VIEWABLE,
    X_REP_HINTS,
} from '../constants';
import Item from './Item';
import { retryNumOfTimes } from '../utils/function';
import TokenService from '../utils/TokenService';
import type { RequestOptions, ElementsErrorCallback } from '../common/types/api';
import type { BoxItem, BoxItemVersion, FileRepresentation } from '../common/types/core';
import type APICache from '../utils/Cache';

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
     * Determines whether the call to the file representations API has completed
     *
     * @param {data: { FileRepresentation }} response
     * @return {boolean}
     */
    isRepresentationsCallComplete(response: { data: FileRepresentation }): boolean {
        const status = getProp(response, 'data.status.state');
        return (
            !status ||
            status === REPRESENTATIONS_RESPONSE_ERROR ||
            status === REPRESENTATIONS_RESPONSE_SUCCESS ||
            status === REPRESENTATIONS_RESPONSE_VIEWABLE
        );
    }

    /**
     * Polls a representation's infoUrl, attempting to generate a representation
     *
     * @param {FileRepresentation} representation - representation that should have its info.url polled
     * @return {Promise<FileRepresentation>} - representation updated with most current status
     */
    async generateRepresentation(representation: FileRepresentation): Promise<FileRepresentation> {
        const infoUrl = getProp(representation, 'info.url');

        if (!infoUrl) {
            return representation;
        }

        return retryNumOfTimes(
            (successCallback, errorCallback) =>
                this.xhr
                    .get({ successCallback, errorCallback, url: infoUrl })
                    .then(response =>
                        this.isRepresentationsCallComplete(response)
                            ? successCallback(response.data)
                            : errorCallback(response.data),
                    )
                    .catch(e => {
                        errorCallback(e);
                    }),
            4,
            2000,
            2,
        );
    }

    /**
     * API for getting a thumbnail URL for a BoxItem
     *
     * @param {BoxItem} item - BoxItem to get the thumbnail URL for
     * @return {Promise<?string>} - the url for the item's thumbnail, or null
     */
    async getThumbnailUrl(item: BoxItem): Promise<?string> {
        const entry = getProp(item, 'representations.entries[0]');
        const extension = getProp(entry, 'representation');
        const template = getProp(entry, 'content.url_template');
        const token = await TokenService.getReadToken(getTypedFileId(item.id), this.options.token);

        if (!extension || !template || !token) {
            return null;
        }

        const thumbnailUrl = template.replace('{+asset_path}', extension === 'jpg' ? '' : '1.png');
        const { query, url: thumbnailBaseUrl } = queryString.parseUrl(thumbnailUrl);
        const thumbnailUrlParams = { ...query, access_token: token };
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
     * Add a file to a given collection
     *
     * @param {BoxItem} file - File object for which we are changing the description
     * @param {string} collectionID - The collection to add the folder to
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     *
     * @return {Promise}
     */
    addToCollection(
        file: BoxItem,
        collectionID: string,
        successCallback: Function,
        errorCallback: Function,
    ): Promise<void> {
        const { id, permissions } = file;

        if (!id || !permissions) {
            errorCallback(getBadItemError());
            return Promise.reject();
        }

        this.getFileInformation(id, { fields: ['collections'] })
            .then((data: any) => {
                let collections = data.collections || [];

                // Convert to correct format
                collections = collections.map((c: any /* FIXME */) => ({ id: c.id }));

                if (!collections.find((c: any /* FIXME */) => c.id === collectionID)) {
                    collections.push({ id: collectionID });
                }

                return this.xhr
                    .put({
                        id: getTypedFileId(id),
                        url: this.getUrl(id),
                        data: { collections },
                        params: {
                            fields: 'collections',
                        },
                    })
                    .then(({ data }: { data: BoxItem }) => {
                        if (!this.isDestroyed()) {
                            const updatedFile = this.merge(this.getCacheKey(id), 'collections', data.collections);
                            console.log(updatedFile);
                            successCallback(updatedFile);
                        }
                    })
                    .catch(e => {
                        console.log(e);

                        if (!this.isDestroyed()) {
                            const originalFile = this.merge(this.getCacheKey(id), 'collections', file.collections);
                            errorCallback(originalFile);
                        }
                    });
            })
            .catch(e => {
                console.log(e);

                const originalFile = this.merge(this.getCacheKey(id), 'collections', file.collections);
                errorCallback(originalFile);
            });
    }

    /**
     * Remove a file from a given collection
     *
     * @param {BoxItem} file - File object for which we are changing the description
     * @param {string} collectionID - The collection to add the folder to
     * @param {Function} successCallback - Success callback
     * @param {Function} errorCallback - Error callback
     *
     * @return {Promise}
     */
    removeFromToCollection(
        file: BoxItem,
        collectionID: string,
        successCallback: Function,
        errorCallback: Function,
    ): Promise<void> {
        const { id, permissions } = file;

        if (!id || !permissions) {
            errorCallback(getBadItemError());
            return Promise.reject();
        }

        this.getFileInformation(id, { fields: ['collections'] })
            .then((data: any) => {
                let collections = data.collections || [];

                // Convert to correct object format and remove the specified collection
                collections = collections
                    .map((c: any /* FIXME */) => ({ id: c.id }))
                    .filter((c: any /* FIXME */) => c.id !== collectionID);

                return this.xhr
                    .put({
                        id: getTypedFileId(id),
                        url: this.getUrl(id),
                        data: { collections },
                        params: {
                            fields: 'collections',
                        },
                    })
                    .then(({ data }: { data: BoxItem }) => {
                        if (!this.isDestroyed()) {
                            this.cache.set(this.getCacheKey(id), {
                                ...this.cache.get(this.getCacheKey(id)),
                                collections: data.collections,
                            });
                            successCallback(this.cache.get(this.getCacheKey(id)));
                        }
                    })
                    .catch(e => {
                        console.log(e);
                        if (!this.isDestroyed()) {
                            const originalFile = this.merge(this.getCacheKey(id), 'collections', file.collections);
                            errorCallback(originalFile);
                        }
                    });
            })
            .catch(e => {
                console.log(e);

                const originalFile = this.merge(this.getCacheKey(id), 'collections', file.collections);
                errorCallback(originalFile);
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
        options: RequestOptions = {},
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
     * Gets a box file
     *
     * @param {string} id - File id
     * @param {boolean|void} [options.fields] - Optionally include specific fields
     * @param {boolean|void} [options.forceFetch] - Optionally Bypasses the cache
     * @param {boolean|void} [options.refreshCache] - Optionally Updates the cache
     * @return {Promise}
     */
    async getFileInformation(id: string, options: RequestOptions = {}): Promise<void> {
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

        // If the file was cached and there are no missing fields
        // then just return the cached file and optionally refresh
        // the cache with new data if required
        if (isCached && missingFields.length === 0) {
            missingFields = options.fields || [];
            return file;
        }

        // If there are missing fields to fetch, add it to the params
        if (missingFields.length > 0) {
            const hasPermissionsField = options.fields.includes('permissions')
            if (hasPermissionsField) {
              missingFields.push('permissions')
            }
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

            return cache.get(key);
        } catch (e) {
            return undefined;
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
