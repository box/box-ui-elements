/**
 * @flow
 * @file Helper for the plain Box Upload API
 * @author Box
 */

import noop from 'lodash.noop';
import Base from './Base';
import { DEFAULT_RETRY_DELAY_MS, MS_IN_S } from '../constants';
import type { BoxItem } from '../flowTypes';

class PlainUpload extends Base {
    file: File;
    id: string;
    overwrite: boolean;
    retryCount: number = 0;
    retryTimeout: number;
    successCallback: Function;
    errorCallback: Function;
    progressCallback: Function;

    /**
     * Handles a upload preflight success response
     *
     * @param {Object} data - Preflight success data
     * @return {void}
     */
    uploadPreflightSuccessHandler = ({ upload_url }: { upload_url: string }) => {
        if (this.isDestroyed()) {
            return;
        }

        // Make an actual POST request to the fast upload URL returned by pre-flight
        this.makeRequest({
            url: upload_url
        });
    };

    /**
     * Handles an upload success response
     *
     * @param {Object} data - Upload success data
     * @return {void}
     */
    uploadSuccessHandler = ({ entries }: { entries: BoxItem[] }): void => {
        if (this.isDestroyed()) {
            return;
        }

        if (typeof this.successCallback === 'function') {
            // Response entries are the successfully created Box File objects
            this.successCallback(entries);
        }
    };

    /**
     * Handles an upload progress event
     *
     * @param {Object} event - Progress event
     * @return {void}
     */
    uploadProgressHandler = (event: ProgressEvent): void => {
        if (this.isDestroyed()) {
            return;
        }

        if (typeof this.progressCallback === 'function') {
            this.progressCallback(event);
        }
    };

    /**
     * Handles an upload error
     *
     * @param {Object} error - Upload error
     * @return {void}
     */
    uploadErrorHandler = (error: any): void => {
        if (this.isDestroyed()) {
            return;
        }

        // Automatically handle name conflict errors
        if (error && error.status === 409) {
            if (this.overwrite) {
                // Error response contains file ID to upload a new file version for
                this.makePreflightRequest({
                    fileId: error.context_info.conflicts.id
                });
            } else {
                // Otherwise, reupload and append timestamp
                // 'test.jpg' becomes 'test-TIMESTAMP.jpg'
                const { name } = this.file;
                const extension = name.substr(name.lastIndexOf('.')) || '';
                this.makePreflightRequest({
                    fileName: `${name.substr(0, name.lastIndexOf('.'))}-${Date.now()}${extension}`
                });
            }
            // Retry after interval defined in header
        } else if (error && error.status === 429) {
            let retryAfterMs = DEFAULT_RETRY_DELAY_MS;

            if (error.headers) {
                const retryAfterSec = parseInt(error.headers.get('Retry-After'), 10);

                if (!isNaN(retryAfterSec)) {
                    retryAfterMs = retryAfterSec * MS_IN_S;
                }
            }

            this.retryTimeout = setTimeout(() => this.makePreflightRequest({}), retryAfterMs);

            // If another error status that isn't name conflict or rate limiting, fail upload
        } else if (error && error.status && typeof this.errorCallback === 'function') {
            this.errorCallback(error);
            // Retry with exponential backoff for other failures since these are likely to be network errors
        } else {
            this.retryTimeout = setTimeout(() => this.makePreflightRequest({}), 2 ** this.retryCount * MS_IN_S);
            this.retryCount += 1;
        }
    };

    /**
     * Sends an upload pre-flight request. If a file ID is supplied,
     * send a pre-flight request to that file version.
     *
     * @param {fileId} fileId - ID of file to replace
     * @param {fileName} fileName - New name for file
     * @return {void}
     */
    makePreflightRequest({ fileId, fileName }: { fileId?: string, fileName?: string }) {
        if (this.isDestroyed()) {
            return;
        }

        let url = `${this.getBaseUrl()}/files/content`;
        if (fileId) {
            url = url.replace('content', `${fileId}/content`);
        }

        const { size, name } = this.file;
        const attributes = {
            name: fileName || name,
            parent: { id: this.id },
            size
        };

        this.xhr.options({
            url,
            data: attributes,
            successHandler: this.uploadPreflightSuccessHandler,
            errorHandler: this.uploadErrorHandler
        });
    }

    /**
     * Uploads a file. If a file ID is supplied, use the Upload File
     * Version API to replace the file.
     *
     * @param {Object} - Request options
     * @param {boolean} [options.url] - Upload URL to use
     * @param {string} [options.fileId] - ID of file to replace
     * @param {string} [options.fileName] - New name for file
     * @return {void}
     */
    makeRequest({ url, fileId, fileName }: { url?: string, fileId?: string, fileName?: string }): void {
        if (this.isDestroyed()) {
            return;
        }

        // Use provided upload URL if passed in, otherwise construct
        let uploadUrl = url;
        if (!uploadUrl) {
            uploadUrl = `${this.uploadHost}/api/2.0/files/content`;

            if (fileId) {
                uploadUrl = uploadUrl.replace('content', `${fileId}/content`);
            }
        }

        const attributes = JSON.stringify({
            name: fileName || this.file.name,
            parent: { id: this.id }
        });

        this.xhr.uploadFile({
            url: uploadUrl,
            data: {
                attributes,
                file: this.file
            },
            successHandler: this.uploadSuccessHandler,
            errorHandler: this.uploadErrorHandler,
            progressHandler: this.uploadProgressHandler
        });
    }

    /**
     * Uploads a file. If there is a conflict and overwrite is true, replace the file.
     * Otherwise, re-upload with a different name.
     *
     * @param {Object} options - Upload options
     * @param {string} options.id - Folder id
     * @param {File} options.file - File blob object
     * @param {Function} [options.successCallback] - Function to call with response
     * @param {Function} [options.errorCallback] - Function to call with errors
     * @param {Function} [options.progressCallback] - Function to call with progress
     * @param {boolean} [overwrite] - Should upload overwrite file with same name
     * @return {void}
     */
    upload({
        id,
        file,
        successCallback = noop,
        errorCallback = noop,
        progressCallback = noop,
        overwrite = true
    }: {
        id: string,
        file: File,
        successCallback: Function,
        errorCallback: Function,
        progressCallback: Function,
        overwrite: boolean
    }): void {
        if (this.isDestroyed()) {
            return;
        }

        // Save references
        this.id = id;
        this.file = file;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
        this.progressCallback = progressCallback;
        this.overwrite = overwrite;

        this.makePreflightRequest({});
    }

    /**
     * Cancels upload of a file.
     *
     * @return {void}
     */
    cancel() {
        if (this.xhr && typeof this.xhr.abort === 'function') {
            this.xhr.abort();
        }

        clearTimeout(this.retryTimeout);
    }
}

export default PlainUpload;
