/**
 * @flow
 * @file Base helper for the Box Upload APIs
 * @author Box
 */

import Base from '../Base';
import {
    DEFAULT_RETRY_DELAY_MS,
    MS_IN_S,
    DEFAULT_HOSTNAME_UPLOAD,
    DEFAULT_HOSTNAME_UPLOAD_APP,
    DEFAULT_HOSTNAME_UPLOAD_GOV,
} from '../../constants';

const MAX_RETRY = 50;
// Note: We may have to change this number if we add a lot more fast upload hosts.
const MAX_REACHABILITY_RETRY = 10;

class BaseUpload extends Base {
    errorCallback: Function;

    file: File;

    fileId: ?string;

    fileName: string;

    fileDescription: ?string;

    folderId: string;

    overwrite: boolean;

    conflictCallback: ?(fileName: string) => string;

    preflightSuccessHandler: Function;

    retryCount: number = 0;

    reachabilityRetryCount: number = 0;

    retryTimeout: TimeoutID;

    isUploadFallbackLogicEnabled: boolean = false;

    newFilename: string;
    hasConflict: boolean;

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

        if (this.isUploadFallbackLogicEnabled) {
            // Add unreachable hosts to url
            const unreachableHostUrls = this.uploadsReachability.getUnreachableHostsUrls();
            if (unreachableHostUrls.length !== 0) {
                url += `?unreachable_hosts=${unreachableHostUrls.join(',')}`;
            }
        }

        const { size, name } = this.file;
        const attributes = {
            name: this.fileName || name,
            parent: { id: this.folderId },
            description: this.fileDescription,
            size,
        };

        this.xhr.options({
            url,
            data: attributes,
            successHandler: response => {
                if (this.isUploadFallbackLogicEnabled) {
                    this.preflightSuccessReachabilityHandler(response);
                } else {
                    this.preflightSuccessHandler(response);
                }
            },
            errorHandler: this.preflightErrorHandler,
        });
    };

    /**
     * Handles successful preflight response.
     * Performs a upload reachability test before calling preflightSuccessHandler.
     *
     * @param {Object} - Request options
     * @return {Promise} Async function promise
     */
    preflightSuccessReachabilityHandler = async ({ data }: { data: { upload_url?: string } }): Promise<any> => {
        if (this.isDestroyed()) {
            return;
        }

        const { upload_url } = data;
        // If upload_url is not available, don't make reachability test
        if (!upload_url) {
            this.preflightSuccessHandler({ data });
            return;
        }

        const uploadHost = this.getUploadHostFromUrl(upload_url);
        // The default upload host should always be reachable
        // DEFAULT_HOSTNAME_UPLOAD is the original default upload host, while DEFAULT_HOSTNAME_UPLOAD_APP is recent.
        // Both of these hosts will resolve to the same IP so they are interchangeable.
        if (
            uploadHost === `${DEFAULT_HOSTNAME_UPLOAD}/` ||
            uploadHost === `${DEFAULT_HOSTNAME_UPLOAD_APP}/` ||
            uploadHost === `${DEFAULT_HOSTNAME_UPLOAD_GOV}/`
        ) {
            this.preflightSuccessHandler({ data });
            return;
        }

        // If upload host reachable upload file, else make a new preflight request
        const isHostReachable = await this.uploadsReachability.isReachable(uploadHost);
        if (isHostReachable) {
            this.preflightSuccessHandler({ data });
        } else if (this.reachabilityRetryCount >= MAX_REACHABILITY_RETRY) {
            this.preflightSuccessHandler({ data: {} });
        } else {
            this.reachabilityRetryCount += 1;
            this.makePreflightRequest();
        }
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
        } else if (errorData && errorData.status === 403) {
            this.hasConflict = true;
            this.fileName = this.incrementFilename(this.fileName);
            this.newFilename = this.fileName;
            this.fileId = null;
            this.overwrite = false;
            this.makePreflightRequest();
            this.retryCount += 1;

            // Automatically handle name conflict errors
        } else if (errorData && errorData.status === 409) {
            if (this.overwrite) {
                // Error response contains file ID to upload a new file version for
                const conflictFileId = errorData.context_info.conflicts.id;
                if (!this.fileId && !!conflictFileId) {
                    this.fileId = conflictFileId;
                }
            } else if (this.conflictCallback) {
                // conflictCallback handler for setting new file name
                this.fileName = this.conflictCallback(this.fileName);
            } else {
                // Otherwise, reupload and append number
                // 'test.jpg' becomes 'test (1).jpg'
                this.fileName = this.incrementFilename(this.newFilename ?? this.fileName);
                this.newFilename = this.fileName;
                this.hasConflict = true;
            }
            this.makePreflightRequest();
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

    /**
     * Parse uploadHost from uploadUrl
     *
     * @param uploadUrl - uploadUrl from preflight response
     * @return {string}
     */
    getUploadHostFromUrl(uploadUrl: string): string {
        const splitUrl = uploadUrl.split('/');
        const uploadHost = `${splitUrl[0]}//${splitUrl[2]}/`;
        return uploadHost;
    }

    /**
     * Detect " (n)" suffixed string. Return "n"
     * @param {String} name
     * @return {String|null} The integer string or null
     */
    isFilenameIncremented = name => {
        const m = /\s\((\d+)\)$/.exec(name);
        return m && m[1];
    };

    /**
     * Increment unsuffixed or " (n)" suffixed string
     * @dependency {Function} isFilenameIncremented
     * @param {String} name
     * @return {String} The " ((n|0)+1)" suffixed filename
     */
    incrementFilename = name => {
        const [filename, ext] = this.extractFilenameAndExtension(name);
        const isInc = this.isFilenameIncremented(filename);
        const newFilename = isInc ? filename.replace(/\d+(?=\)$)/, m => +m + 1) : `${filename} (1)`;

        return `${newFilename}.${ext}`;
    };

    extractFilenameAndExtension = name => {
        const filenameExtension = name.replace(/^.*[\\\/]/, '');
        const filename = filenameExtension.substring(0, filenameExtension.lastIndexOf('.'));
        const ext = filenameExtension.split('.').pop();

        return [filename, ext];
    };
}

export default BaseUpload;
