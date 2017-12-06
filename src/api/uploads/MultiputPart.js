/**
 * @flow
 * @file Multiput upload part
 * @author Box
 */
import noop from 'lodash.noop';
import BaseMultiput from './BaseMultiput';
import type { MultiputConfig, Options } from '../../flowTypes';
import { updateQueryParameters } from '../../util/url';
import { getBoundedExpBackoffRetryDelay } from '../../util/uploads';

const PART_STATE_NOT_STARTED: 0 = 0;
const PART_STATE_COMPUTING_DIGEST: 1 = 1;
const PART_STATE_DIGEST_READY: 2 = 2;
const PART_STATE_UPLOADING: 3 = 3;
const PART_STATE_UPLOADED: 4 = 4;

class MultiputPart extends BaseMultiput {
    index: number;
    numDigestRetriesPerformed: number;
    numUploadRetriesPerformed: number;
    offset: number;
    sha256: string;
    size: number;
    state:
        | typeof PART_STATE_NOT_STARTED
        | typeof PART_STATE_COMPUTING_DIGEST
        | typeof PART_STATE_DIGEST_READY
        | typeof PART_STATE_UPLOADING
        | typeof PART_STATE_UPLOADED;
    timing: Object;
    uploadedBytes: number;
    uploadUrl: string;
    onProgress: Function;
    onSuccess: Function;
    onError: Function;
    data: Object;
    config: MultiputConfig;
    id: number;
    retryTimeout: ?number;
    blob: ?Blob;
    rangeEnd: number;
    startTimestamp: number;
    getPartsState: Function;
    getNumPartsUploading: Function;

    /**
     * [constructor]
     *
     * @param {Options} options
     * @param {number} index - 0-based index of this part in array of all parts
     * @param {number} offset - Starting byte offset of this part's range
     * @param {number} size - Size of this part in bytes
     * @param {number} sessionId
     * @param {Object} sessionEndpoints
     * @param {MultiputConfig} config
     * @param {Function} getPartsState
     * @param {Function} getNumPartsUploading
     * @param {Function} [onSuccess]
     * @param {Function} [onProgress]
     * @param {Function} [onError]
     * @return {void}
     */
    constructor(
        options: Options,
        index: number,
        offset: number,
        size: number,
        sessionId: string,
        sessionEndpoints: Object,
        config: MultiputConfig,
        getPartsState: Function,
        getNumPartsUploading: Function,
        onSuccess?: Function,
        onProgress?: Function,
        onError?: Function
    ): void {
        super(options, sessionEndpoints, config);

        this.index = index;
        this.numDigestRetriesPerformed = 0;
        this.numUploadRetriesPerformed = 0;
        this.offset = offset;
        this.size = size;
        this.state = PART_STATE_NOT_STARTED;
        this.timing = {};
        this.uploadedBytes = 0;
        this.data = {};
        this.uploadUrl = `${this.uploadHost}/api/2.0/files/upload_sessions/${sessionId}`;
        this.config = config;
        this.rangeEnd = offset + size - 1;
        this.onSuccess = onSuccess || noop;
        this.onError = onError || noop;
        this.onProgress = onProgress || noop;
        this.getPartsState = getPartsState;
        this.getNumPartsUploading = getNumPartsUploading;
    }

    toJSON = () =>
        JSON.stringify({
            index: this.index,
            offset: this.offset,
            size: this.size,
            state: this.state,
            uploadedBytes: this.uploadedBytes,
            numUploadRetriesPerformed: this.numUploadRetriesPerformed,
            numDigestRetriesPerformed: this.numDigestRetriesPerformed,
            sha256: this.sha256,
            timing: this.timing
        });

    /**
     * Returns file part associated with this Part.
     *
     * @return {Object}
     */
    getPart = (): Object => this.data.part;

    /**
     * Uploads this Part via the API. Will retry on network failures.
     *
     * @return {void}
     */
    upload = (): void => {
        if (this.isDestroyed() || !this.sha256 || !this.blob) {
            return;
        }

        const clientEventInfo = {
            documentHidden: document.hidden,
            digest_retries: this.numDigestRetriesPerformed,
            timing: this.timing,
            parts_uploading: this.getNumPartsUploading()
        };

        const headers = {
            'Content-Type': 'application/octet-stream',
            Digest: `sha-256=${this.sha256}`,
            'Content-Range': `bytes ${this.offset}-${this.rangeEnd}/${this.size}`,
            'X-Box-Client-Event-Info': JSON.stringify(clientEventInfo)
        };

        this.startTimestamp = Date.now();

        this.xhr.uploadFile({
            url: this.uploadUrl,
            data: this.blob,
            headers,
            method: 'PUT',
            successHandler: this.uploadSuccessHandler,
            errorHandler: this.uploadErrorHandler,
            progressHandler: this.uploadProgressHandler,
            withIdleTimeout: true,
            idleTimeoutDuration: this.config.requestTimeoutMS
        });
    };

    /**
     * Handler for upload part success
     * 
     * @param {Object} data
     * @return {void}
     */
    uploadSuccessHandler = (data: Object) => {
        if (this.isDestroyed()) {
            return;
        }

        this.state = PART_STATE_UPLOADED;
        this.consoleLogFunc(() => `Upload completed: ${this.toJSON()}. Parts state: ${this.getPartsState()}`);
        this.data = data;
        this.blob = null;
        this.timing.uploadTime = Date.now() - this.startTimestamp;

        this.onSuccess(this);

        this.uploadedBytes = this.size;
    };

    /**
     * Handler for upload part progress event
     * 
     * @param {ProgressEvent} data
     * @return {void}
     */
    uploadProgressHandler = (event: ProgressEvent) => {
        if (this.isDestroyed()) {
            return;
        }

        const newUploadedBytes = parseInt(event.loaded, 10);
        this.onProgress(this.uploadedBytes, newUploadedBytes);
        this.uploadedBytes = newUploadedBytes;
    };

    /**
     * Handler for upload part error
     * 
     * @param {Error} error
     * @return {void}
     */
    uploadErrorHandler = (error: Error) => {
        if (this.isDestroyed()) {
            return;
        }

        this.consoleLog(
            () =>
                `Upload failure ${error.message} for part ${this.toJSON()}. XHR state: ${this.xhr.xhr
                    .readyState}. Parts state ${this.getPartsState()}`
        );
        const eventInfo = {
            message: error.message,
            part: {
                uploadedBytes: this.uploadedBytes,
                id: this.id,
                index: this.index,
                offset: this.offset
            },
            xhr_ready_state: this.xhr.xhr.readyState,
            xhr_status_text: this.xhr.xhr.statusText
        };
        const eventInfoString = JSON.stringify(eventInfo);
        this.logEvent('part_failure', eventInfoString);

        if (this.numUploadRetriesPerformed >= this.config.retries) {
            this.onError(error, eventInfoString);
            return;
        }

        const retryDelayMs = getBoundedExpBackoffRetryDelay(
            this.config.initialRetryDelayMs,
            this.config.maxRetryDelayMs,
            this.numUploadRetriesPerformed
        );

        this.numUploadRetriesPerformed += 1;
        this.consoleLog(`Retrying uploading part ${this.toJSON()} in ${retryDelayMs} ms`);
        this.retryTimeout = setTimeout(this.retryUpload, retryDelayMs);
    };

    /**
     * Retry uploading part
     * 
     * @return {Promise}
     */
    retryUpload = async (): Promise<> => {
        if (this.isDestroyed()) {
            return;
        }

        try {
            if (this.uploadedBytes < this.size) {
                // Not all bytes were uploaded to the server. So upload part again.
                throw new Error('Incomplete part.');
            }

            const parts = await this.listParts(this.index, 1);

            if (parts && parts.length === 1 && parts[0].offset === this.offset && parts[0].part_id) {
                this.consoleLog(`Part ${this.toJSON()} is available on server. Not re-uploading.`);
                this.id = parts[0].part_id;
                this.uploadSuccessHandler({
                    part: parts[0]
                });
                return;
            }
            this.consoleLog(`Part ${this.toJSON()} is not available on server. Re-uploading.`);
            throw new Error('Part not found on the server');
        } catch (error) {
            const { response } = error;
            if (response && response.status) {
                this.consoleLog(`Error ${response.status} while listing part ${this.toJSON()}. Re-uploading.`);
            }
            this.numUploadRetriesPerformed += 1;
            this.upload();
        }
    };

    /**
     * Cancels upload for this Part.
     *
     * @return {void}
     */
    cancel(): void {
        if (this.xhr && typeof this.xhr.abort === 'function') {
            this.xhr.abort();
        }

        clearTimeout(this.retryTimeout);
        this.blob = null;
        this.data = {};
        this.destroy();
    }

    /**
     * List specified parts
     * 
     * @param {number} partIndex - Index of starting part. Optional.
     * @param {number} limit - Number of parts to be listed. Optional.
     * @return {Promise<Array<Object>>} Array of parts
     */
    listParts = async (partIndex: number, limit: number): Promise<Array<Object>> => {
        const params = {
            offset: partIndex,
            limit
        };

        const endpoint = updateQueryParameters(this.sessionEndpoints.listParts, params);
        const response = await this.xhr.get({
            url: endpoint
        });

        return response.entries;
    };
}

export default MultiputPart;
export {
    PART_STATE_NOT_STARTED,
    PART_STATE_COMPUTING_DIGEST,
    PART_STATE_DIGEST_READY,
    PART_STATE_UPLOADING,
    PART_STATE_UPLOADED
};
