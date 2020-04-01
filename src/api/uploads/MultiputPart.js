/**
 * @flow
 * @file Multiput upload part
 * @author Box
 */
import noop from 'lodash/noop';
import getProp from 'lodash/get';
import { updateQueryParameters } from '../../utils/url';
import { getBoundedExpBackoffRetryDelay } from '../../utils/uploads';
import { retryNumOfTimes } from '../../utils/function';

import BaseMultiput from './BaseMultiput';

import { HTTP_PUT } from '../../constants';

import type { MultiputConfig, MultiputData } from '../../common/types/upload';
import type { APIOptions } from '../../common/types/api';

const PART_STATE_NOT_STARTED: 0 = 0;
const PART_STATE_DIGEST_READY: 1 = 1;
const PART_STATE_UPLOADING: 2 = 2;
const PART_STATE_UPLOADED: 3 = 3;

class MultiputPart extends BaseMultiput {
    index: number;

    numDigestRetriesPerformed: number;

    numUploadRetriesPerformed: number;

    offset: number;

    sha256: string;

    partSize: number;

    state:
        | typeof PART_STATE_NOT_STARTED
        | typeof PART_STATE_DIGEST_READY
        | typeof PART_STATE_UPLOADING
        | typeof PART_STATE_UPLOADED;

    timing: Object;

    uploadedBytes: number;

    onProgress: Function;

    onSuccess: Function;

    onError: Function;

    data: MultiputData;

    config: MultiputConfig;

    id: string;

    retryTimeout: TimeoutID;

    blob: ?Blob;

    rangeEnd: number;

    startTimestamp: number;

    getNumPartsUploading: Function;

    fileSize: number;

    isPaused: boolean; // For resumable uploads.  When an error happens, all parts for an upload get paused.  This
    // is not a separate state because a paused upload transitions to the DIGEST_READY state immediately
    // so MultiputUpload can upload the part again.

    /**
     * [constructor]
     *
     * @param {Options} options
     * @param {number} index - 0-based index of this part in array of all parts
     * @param {number} offset - Starting byte offset of this part's range
     * @param {number} partSize - Size of this part in bytes
     * @param {number} sessionId
     * @param {Object} sessionEndpoints
     * @param {MultiputConfig} config
     * @param {Function} getNumPartsUploading
     * @param {Function} [onSuccess]
     * @param {Function} [onProgress]
     * @param {Function} [onError]
     * @return {void}
     */
    constructor(
        options: APIOptions,
        index: number,
        offset: number,
        partSize: number,
        fileSize: number,
        sessionId: string,
        sessionEndpoints: Object,
        config: MultiputConfig,
        getNumPartsUploading: Function,
        onSuccess?: Function,
        onProgress?: Function,
        onError?: Function,
    ): void {
        super(options, sessionEndpoints, config);

        this.index = index;
        this.numDigestRetriesPerformed = 0;
        this.numUploadRetriesPerformed = 0;
        this.offset = offset;
        this.partSize = partSize;
        this.fileSize = fileSize;
        this.state = PART_STATE_NOT_STARTED;
        this.timing = {};
        this.uploadedBytes = 0;
        this.data = {};
        this.config = config;
        this.rangeEnd = offset + partSize - 1;
        if (this.rangeEnd > fileSize - 1) {
            this.rangeEnd = fileSize - 1;
        }
        this.isPaused = false;

        this.onSuccess = onSuccess || noop;
        this.onError = onError || noop;
        this.onProgress = onProgress || noop;
        this.getNumPartsUploading = getNumPartsUploading;
    }

    toJSON = () =>
        JSON.stringify({
            index: this.index,
            offset: this.offset,
            partSize: this.partSize,
            state: this.state,
            uploadedBytes: this.uploadedBytes,
            numUploadRetriesPerformed: this.numUploadRetriesPerformed,
            numDigestRetriesPerformed: this.numDigestRetriesPerformed,
            sha256: this.sha256,
            timing: this.timing,
        });

    /**
     * Returns file part information from the server after part upload is successful
     *
     * @return {Object}
     */
    getPart = (): Object => this.data.part || {};

    /**
     * Uploads this Part via the API. Will retry on network failures.
     *
     * @return {void}
     */
    upload = (): void => {
        if (this.isDestroyedOrPaused()) {
            return;
        }

        if (!this.sha256) {
            throw new Error('Part SHA-256 unavailable');
        }

        if (!this.blob) {
            throw new Error('Part blob unavailable');
        }

        const clientEventInfo = {
            documentHidden: document.hidden,
            digest_retries: this.numDigestRetriesPerformed,
            timing: this.timing,
            parts_uploading: this.getNumPartsUploading(),
        };

        const headers = {
            'Content-Type': 'application/octet-stream',
            Digest: `sha-256=${this.sha256}`,
            'Content-Range': `bytes ${this.offset}-${this.rangeEnd}/${this.fileSize}`,
            'X-Box-Client-Event-Info': JSON.stringify(clientEventInfo),
        };

        this.state = PART_STATE_UPLOADING;

        this.startTimestamp = Date.now();
        this.xhr.uploadFile({
            url: this.sessionEndpoints.uploadPart,
            data: this.blob,
            headers,
            method: HTTP_PUT,
            successHandler: this.uploadSuccessHandler,
            errorHandler: this.uploadErrorHandler,
            progressHandler: this.uploadProgressHandler,
            withIdleTimeout: true,
            idleTimeoutDuration: this.config.requestTimeoutMs,
        });
    };

    /**
     * Handler for upload part success
     *
     * @param {Object} data
     * @return {void}
     */
    uploadSuccessHandler = ({ data }: { data: Object }) => {
        if (this.isDestroyedOrPaused()) {
            return;
        }

        this.state = PART_STATE_UPLOADED;
        this.consoleLog(`Upload completed: ${this.toJSON()}.`);
        this.data = data;
        this.blob = null;
        this.timing.uploadTime = Date.now() - this.startTimestamp;

        this.onSuccess(this);

        this.uploadedBytes = this.partSize;
    };

    /**
     * Handler for upload part progress event
     *
     * @param {ProgressEvent} data
     * @return {void}
     */
    uploadProgressHandler = (event: ProgressEvent) => {
        if (this.isDestroyedOrPaused()) {
            return;
        }

        const newUploadedBytes = parseInt(event.loaded, 10);
        const prevUploadedBytes = this.uploadedBytes;
        this.uploadedBytes = newUploadedBytes;

        this.onProgress(prevUploadedBytes, newUploadedBytes);
    };

    /**
     * Handler for upload part error
     *
     * @param {Error} error
     * @return {void}
     */
    uploadErrorHandler = async (error: Error) => {
        if (this.isDestroyedOrPaused()) {
            // Ignore abort() error by checking this.isPaused
            return;
        }

        const xhr_ready_state = getProp(this.xhr, 'xhr.readyState', null);
        const xhr_status_text = getProp(this.xhr, 'xhr.statusText', '');

        this.consoleLog(`Upload failure ${error.message} for part ${this.toJSON()}. XHR state: ${xhr_ready_state}.`);

        const eventInfo = {
            message: error.message,
            part: {
                uploadedBytes: this.uploadedBytes,
                id: this.id,
                index: this.index,
                offset: this.offset,
            },
            xhr_ready_state,
            xhr_status_text,
        };

        const eventInfoString = JSON.stringify(eventInfo);

        if (this.sessionEndpoints.logEvent) {
            retryNumOfTimes(
                (resolve: Function, reject: Function): void => {
                    this.logEvent('part_failure', eventInfoString)
                        .then(resolve)
                        .catch(reject);
                },
                this.config.retries,
                this.config.initialRetryDelayMs,
            ).catch(e => this.consoleLog(`Failure in logEvent: ${e.message}`));
        } else {
            this.consoleLog('logEvent endpoint not found');
        }

        if (this.numUploadRetriesPerformed >= this.config.retries) {
            this.onError(error, eventInfoString);
            return;
        }

        const retryDelayMs = getBoundedExpBackoffRetryDelay(
            this.config.initialRetryDelayMs,
            this.config.maxRetryDelayMs,
            this.numUploadRetriesPerformed,
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
    retryUpload = async (): Promise<any> => {
        if (this.isDestroyedOrPaused()) {
            return;
        }

        try {
            const parts = await this.listParts(this.index, 1);

            if (parts && parts.length === 1 && parts[0].offset === this.offset && parts[0].part_id) {
                this.consoleLog(`Part ${this.toJSON()} is available on server. Not re-uploading.`);
                this.id = parts[0].part_id;
                this.uploadSuccessHandler({
                    data: {
                        part: parts[0],
                    },
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
        clearTimeout(this.retryTimeout);
        this.blob = null;
        this.data = {};
        this.destroy();
    }

    /**
     * Pauses upload for this Part.
     *
     * @return {void}
     */
    pause(): void {
        clearTimeout(this.retryTimeout); // Cancel timeout so that we don't keep retrying while paused
        this.isPaused = true;
        this.state = PART_STATE_DIGEST_READY;
        this.xhr.abort(); //  This calls the error handler.
    }

    /**
     * Unpauses upload for this Part.
     *
     * @return {void}
     */
    unpause(): void {
        this.isPaused = false;
        this.state = PART_STATE_UPLOADING;
        this.retryUpload();
    }

    /**
     * Resets upload for this Part.
     *
     * @return {void}
     */
    reset(): void {
        this.numUploadRetriesPerformed = 0;
        this.timing = {};
        this.uploadedBytes = 0;
    }

    /**
     * Checks if this Part is destroyed or paused
     *
     * @return {boolean}
     */
    isDestroyedOrPaused(): boolean {
        return this.isDestroyed() || this.isPaused;
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
            limit,
        };

        const endpoint = updateQueryParameters(this.sessionEndpoints.listParts, params);
        const response = await this.xhr.get({
            url: endpoint,
        });

        return response.data.entries;
    };
}

export default MultiputPart;
export { PART_STATE_NOT_STARTED, PART_STATE_DIGEST_READY, PART_STATE_UPLOADING, PART_STATE_UPLOADED };
