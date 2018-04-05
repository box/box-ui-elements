/**
 * @flow
 * @file Helper for the plain Box Upload API
 * @author Box
 */

import noop from 'lodash/noop';
import Base from './Base';
import { DEFAULT_RETRY_DELAY_MS, MS_IN_S } from '../constants';
import type { BoxItem } from '../flowTypes';

const MAX_RETRY = 5;
class PlainUpload extends Base {
    file: File;
    folderId: string;
    fileId: ?string;
    overwrite: boolean;
    successCallback: Function;
    errorCallback: Function;
    progressCallback: Function;
    retryCount: number = 0;
    retryTimeout: TimeoutID;

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

        const fileName = this.file ? this.file.name : '';

        // TODO(tonyjin): Normalize error object and clean up error handling
        let errorData = error;
        const { response } = error;
        if (response && response.data) {
            errorData = response.data;
        }

        if (this.retryCount >= MAX_RETRY) {
            this.errorCallback(errorData);
            // Automatically handle name conflict errors
        } else if (errorData && errorData.status === 409) {
            if (this.overwrite) {
                // Error response contains file ID to upload a new file version for
                this.makePreflightRequest({
                    fileId: errorData.context_info.conflicts.id,
                    fileName
                });
            } else {
                // Otherwise, reupload and append timestamp
                // 'test.jpg' becomes 'test-TIMESTAMP.jpg'
                const extension = fileName.substr(fileName.lastIndexOf('.')) || '';
                this.makePreflightRequest({
                    fileName: `${fileName.substr(0, fileName.lastIndexOf('.'))}-${Date.now()}${extension}`
                });
            }
            this.retryCount += 1;
            // When rate limited, retry after interval defined in header
        } else if (errorData && (errorData.status === 429 || errorData.code === 'too_many_requests')) {
            let retryAfterMs = DEFAULT_RETRY_DELAY_MS;

            if (errorData.headers) {
                const retryAfterSec = parseInt(
                    errorData.headers['retry-after'] || errorData.headers.get('Retry-After'),
                    10
                );

                if (!Number.isNaN(retryAfterSec)) {
                    retryAfterMs = retryAfterSec * MS_IN_S;
                }
            }

            this.retryTimeout = setTimeout(
                () =>
                    this.makePreflightRequest({
                        fileName
                    }),
                retryAfterMs
            );
            this.retryCount += 1;

            // If another error status that isn't name conflict or rate limiting, fail upload
        } else if (
            errorData &&
            (errorData.status || errorData.message === 'Failed to fetch') &&
            typeof this.errorCallback === 'function'
        ) {
            this.errorCallback(errorData);
            // Retry with exponential backoff for other failures since these are likely to be network errors
        } else {
            this.retryTimeout = setTimeout(
                () =>
                    this.makePreflightRequest({
                        fileName
                    }),
                2 ** this.retryCount * MS_IN_S
            );
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
    makePreflightRequest({ fileId, fileName }: { fileId?: string, fileName?: string }): void {
        if (this.isDestroyed()) {
            return;
        }

        if (!this.fileId && !!fileId) {
            this.fileId = fileId;
        }

        let url = `${this.getBaseApiUrl()}/files/content`;
        if (fileId) {
            url = url.replace('content', `${fileId}/content`);
        }

        const { size, name } = this.file;
        const attributes = {
            name: fileName || name,
            parent: { id: this.folderId },
            size
        };

        this.xhr.options({
            url,
            data: attributes,
            successHandler: this.makeRequest,
            errorHandler: this.uploadErrorHandler
        });
    }

    /**
     * Uploads a file. If a file ID is supplied, use the Upload File
     * Version API to replace the file.
     *
     * @param {Object} - Request options
     * @param {boolean} [options.url] - Upload URL to use
     * @return {void}
     */
    makeRequest = ({ data }: { data: { upload_url?: string } }): void => {
        if (this.isDestroyed()) {
            return;
        }

        // Use provided upload URL if passed in, otherwise construct
        let uploadUrl = data.upload_url;
        if (!uploadUrl) {
            uploadUrl = `${this.getBaseUploadUrl()}/files/content`;

            if (this.fileId) {
                uploadUrl = uploadUrl.replace('content', `${this.fileId}/content`);
            }
        }

        const attributes = JSON.stringify({
            name: this.file.name,
            parent: { id: this.folderId }
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
    };

    /**
     * Uploads a file. If there is a conflict and overwrite is true, replace the file.
     * Otherwise, re-upload with a different name.
     *
     * @param {Object} options - Upload options
     * @param {string} options.folderId - untyped folder id
     * @param {string} [options.fileId] - Untyped file id (e.g. no "file_" prefix)
     * @param {File} options.file - File blob object
     * @param {Function} [options.successCallback] - Function to call with response
     * @param {Function} [options.errorCallback] - Function to call with errors
     * @param {Function} [options.progressCallback] - Function to call with progress
     * @param {boolean} [overwrite] - Should upload overwrite file with same name
     * @return {void}
     */
    upload({
        folderId,
        fileId,
        file,
        successCallback = noop,
        errorCallback = noop,
        progressCallback = noop,
        overwrite = true
    }: {
        folderId: string,
        fileId: ?string,
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
        this.folderId = folderId;
        this.fileId = fileId;
        this.file = file;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
        this.progressCallback = progressCallback;
        this.overwrite = overwrite;

        this.makePreflightRequest(fileId ? { fileId } : {});
    }

    /**
     * Cancels upload of a file.
     *
     * @return {void}
     */
    cancel() {
        if (this.isDestroyed()) {
            return;
        }

        if (this.xhr && typeof this.xhr.abort === 'function') {
            this.xhr.abort();
        }

        clearTimeout(this.retryTimeout);
    }
}

export default PlainUpload;
