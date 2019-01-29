/**
 * @flow
 * @file Base helper for the Box Upload APIs
 * @author Box
 */

import Base from '../Base';
import { DEFAULT_RETRY_DELAY_MS, MS_IN_S } from '../../constants';

const MAX_RETRY = 5;

class BaseUpload extends Base {
    errorCallback: Function;

    file: File;

    fileId: ?string;

    fileName: string;

    folderId: string;

    overwrite: boolean;

    preflightSuccessHandler: Function;

    retryCount: number = 0;

    retryTimeout: TimeoutID;

    /**
     * Sends an upload pre-flight request. If a file ID is available,
     * send a pre-flight request to that file version.
     *
     * @private
     * @return {void}
     */
    makePreflightRequest = (): void => {
        if (this.isDestroyed()) {
            return;
        }

        let url = `${this.getBaseApiUrl()}/files/content`;
        if (this.fileId) {
            url = url.replace('content', `${this.fileId}/content`);
        }

        const { size, name } = this.file;
        const attributes = {
            name: this.fileName || name,
            parent: { id: this.folderId },
            size,
        };

        this.xhr.options({
            url,
            data: attributes,
            successHandler: this.preflightSuccessHandler,
            errorHandler: this.preflightErrorHandler,
        });
    };

    /**
     * Handles a preflight error
     *
     * @param {Object} error - preflight error
     * @return {void}
     */
    preflightErrorHandler = (error: any): void => {
        if (this.isDestroyed()) {
            return;
        }

        this.fileName = this.file ? this.file.name : '';

        // TODO: Normalize error object and clean up error handling
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
                const conflictFileId = errorData.context_info.conflicts.id;
                if (!this.fileId && !!conflictFileId) {
                    this.fileId = conflictFileId;
                }

                // Error response contains file ID to upload a new file version for
                this.makePreflightRequest();
            } else {
                // Otherwise, reupload and append timestamp
                // 'test.jpg' becomes 'test-TIMESTAMP.jpg'
                const extension = this.fileName.substr(this.fileName.lastIndexOf('.')) || '';
                this.fileName = `${this.fileName.substr(0, this.fileName.lastIndexOf('.'))}-${Date.now()}${extension}`;
                this.makePreflightRequest();
            }

            this.retryCount += 1;
            // When rate limited, retry after interval defined in header
        } else if (errorData && (errorData.status === 429 || errorData.code === 'too_many_requests')) {
            let retryAfterMs = DEFAULT_RETRY_DELAY_MS;

            if (errorData.headers) {
                const retryAfterSec = parseInt(
                    errorData.headers['retry-after'] || errorData.headers.get('Retry-After'),
                    10,
                );

                if (!Number.isNaN(retryAfterSec)) {
                    retryAfterMs = retryAfterSec * MS_IN_S;
                }
            }

            this.retryTimeout = setTimeout(this.makePreflightRequest, retryAfterMs);
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
            this.retryTimeout = setTimeout(this.makePreflightRequest, 2 ** this.retryCount * MS_IN_S);
            this.retryCount += 1;
        }
    };

    /**
     * Read a blob with FileReader
     *
     * @param {FileReader} reader
     * @param {Blob} blob
     * @return {Promise}
     */
    readFile(reader: FileReader, blob: Blob): Promise<any> {
        return new Promise((resolve, reject) => {
            reader.readAsArrayBuffer(blob);
            reader.onload = () => {
                resolve({
                    buffer: reader.result,
                    readCompleteTimestamp: Date.now(),
                });
            };

            reader.onerror = reject;
        });
    }
}

export default BaseUpload;
