/**
 * @flow
 * @file Base helper for the Box Upload APIs
 * @author Box
 */

import Base from './Base';
import { DEFAULT_RETRY_DELAY_MS, MS_IN_S } from '../constants';

const MAX_RETRY = 5;

class BaseUpload extends Base {
    file: File;
    overwrite: boolean;
    retryCount: number = 0;
    retryTimeout: TimeoutID;
    errorCallback: Function;

    /**
     * Shared upload error handler for initial upload (preflight for plain upload, session creation for chunked)
     *
     * @private
     * @param {Object} error - Upload error
     * @param {Function} retryUploadFunc - Function to retry the initial upload
     * @return {void}
     */
    baseUploadErrorHandler = (error: any, retryUploadFunc: Function): void => {
        const fileName = this.file ? this.file.name : '';

        // TODO(tonyjin): Normalize error object and clean up error handling

        // Automatically handle name conflict errors
        if (this.retryCount >= MAX_RETRY) {
            this.errorCallback(error);
        } else if (error && error.status === 409) {
            if (this.overwrite) {
                // Error response contains file ID to upload a new file version for
                retryUploadFunc({
                    fileId: error.context_info.conflicts.id,
                    fileName
                });
            } else {
                // Otherwise, reupload and append timestamp
                // 'test.jpg' becomes 'test-TIMESTAMP.jpg'
                const extension = fileName.substr(fileName.lastIndexOf('.')) || '';
                retryUploadFunc({
                    fileName: `${fileName.substr(0, fileName.lastIndexOf('.'))}-${Date.now()}${extension}`
                });
            }
            this.retryCount += 1;
            // When rate limited, retry after interval defined in header
        } else if (error && (error.status === 429 || error.code === 'too_many_requests')) {
            let retryAfterMs = DEFAULT_RETRY_DELAY_MS;

            if (error.headers) {
                const retryAfterSec = parseInt(error.headers.get('Retry-After'), 10);

                if (!Number.isNaN(retryAfterSec)) {
                    retryAfterMs = retryAfterSec * MS_IN_S;
                }
            }

            this.retryTimeout = setTimeout(
                () =>
                    retryUploadFunc({
                        fileName
                    }),
                retryAfterMs
            );
            this.retryCount += 1;

            // If another error status that isn't name conflict or rate limiting, fail upload
        } else if (
            error &&
            (error.status || error.message === 'Failed to fetch') &&
            typeof this.errorCallback === 'function'
        ) {
            this.errorCallback(error);
            // Retry with exponential backoff for other failures since these are likely to be network errors
        } else {
            this.retryTimeout = setTimeout(
                () =>
                    retryUploadFunc({
                        fileName
                    }),
                2 ** this.retryCount * MS_IN_S
            );
            this.retryCount += 1;
        }
    };
}

export default BaseUpload;
