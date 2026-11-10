import Base from '../Base';
import {
    DEFAULT_RETRY_DELAY_MS,
    MS_IN_S,
    DEFAULT_HOSTNAME_UPLOAD,
    DEFAULT_HOSTNAME_UPLOAD_APP,
    DEFAULT_HOSTNAME_UPLOAD_GOV,
} from '../../constants';

const MAX_RETRY = 5;
// Note: We may have to change this number if we add a lot more fast upload hosts.
const MAX_REACHABILITY_RETRY = 10;

class BaseUpload extends Base {
    /** Called with the error data when the upload fails. */
    errorCallback: (error: unknown) => void;

    /** File being uploaded. */
    file: File;

    /** Existing file to upload a new version of; set from the conflict response when overwriting. */
    fileId: string | null | undefined;

    /** Upload name; falls back to `file.name` and is rewritten to resolve name conflicts. */
    fileName: string;

    /** Description sent with the preflight request. */
    fileDescription: string | null | undefined;

    /** Parent folder the file is uploaded into. */
    folderId: string;

    /** File fields to request in the upload response. */
    fields: Array<string> | null | undefined;

    /** On name conflict: `true` uploads a new version, `'error'` fails, `false` renames the file. */
    overwrite: boolean | 'error';

    /** Returns a new file name on name conflict; when absent, a timestamp is appended instead. */
    conflictCallback: ((fileName: string) => string) | null | undefined;

    /** Subclass handler that starts the upload after a successful preflight. */
    preflightSuccessHandler: Function;

    /** Number of preflight retries made so far. */
    retryCount: number = 0;

    /** Number of preflight retries made because the upload host was unreachable. */
    reachabilityRetryCount: number = 0;

    /** Pending preflight retry timer. */
    retryTimeout: ReturnType<typeof setTimeout>;

    /** Whether to test upload host reachability and report unreachable hosts in preflight. */
    isUploadFallbackLogicEnabled: boolean = false;

    /**
     * Sends an upload pre-flight request. If a file ID is available,
     * send a pre-flight request to that file version.
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
     */
    preflightSuccessReachabilityHandler = async ({ data }: { data: { upload_url?: string } }): Promise<void> => {
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

    /** Handles a preflight error */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Receives Xhr errors, Error instances, or raw error response bodies.
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
            if (this.overwrite === 'error') {
                this.errorCallback(errorData);
                return;
            }
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
                // Otherwise, reupload and append timestamp
                // 'test.jpg' becomes 'test-TIMESTAMP.jpg'
                const extension = this.fileName.substr(this.fileName.lastIndexOf('.')) || '';
                this.fileName = `${this.fileName.substr(0, this.fileName.lastIndexOf('.'))}-${Date.now()}${extension}`;
            }
            this.makePreflightRequest();
            this.retryCount += 1;

            // When rate limited, retry with the same backoff as folder creation
        } else if (errorData && (errorData.status === 429 || errorData.code === 'too_many_requests')) {
            // Exponential delay plus jitter (0–999 ms) so parallel uploads don't retry together.
            // Retry-After from the server overrides that delay.
            let retryAfterMs = DEFAULT_RETRY_DELAY_MS * 2 ** this.retryCount + Math.floor(Math.random() * 1000);

            if (errorData.headers) {
                const retryAfterHeaderSec = parseInt(
                    errorData.headers['retry-after'] || errorData.headers.get('Retry-After'),
                    10,
                );

                if (!Number.isNaN(retryAfterHeaderSec)) {
                    retryAfterMs = retryAfterHeaderSec * MS_IN_S;
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

    /** Read a blob with FileReader */
    readFile(reader: FileReader, blob: Blob): Promise<{ buffer: FileReader['result']; readCompleteTimestamp: number }> {
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

    /** Parse uploadHost from uploadUrl */
    getUploadHostFromUrl(uploadUrl: string): string {
        const splitUrl = uploadUrl.split('/');
        const uploadHost = `${splitUrl[0]}//${splitUrl[2]}/`;
        return uploadHost;
    }
}

export default BaseUpload;
