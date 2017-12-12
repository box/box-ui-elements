/**
 * @flow
 * @file Multiput upload
 * @author Box
 */

import noop from 'lodash.noop';
import BaseMultiput from './BaseMultiput';
import { getFileLastModifiedAsISONoMSIfPossible, getBoundedExpBackoffRetryDelay } from '../../util/uploads';
import { retryNumOfTimes } from '../../util/function';
import { digest } from '../../util/webcrypto';
import createWorker from '../../util/uploadsSHA1Worker';
import MultiputPart, { PART_STATE_UPLOADED, PART_STATE_DIGEST_READY, PART_STATE_NOT_STARTED } from './MultiputPart';
import type { StringAnyMap, MultiputConfig, Options } from '../../flowTypes';

// Constants used for specifying log event types.
/* eslint-disable no-unused-vars */
const LOG_EVENT_TYPE_COMMIT_CONFLICT = 'commit_conflict';
// This type is a catch-all for create session errors that aren't 5xx's (for which we'll do
// retries) and aren't specific 4xx's we know how to specifically handle (e.g. out of storage).
const LOG_EVENT_TYPE_CREATE_SESSION_MISC_ERROR = 'create_session_misc_error';
const LOG_EVENT_TYPE_CREATE_SESSION_RETRIES_EXCEEDED = 'create_session_retries_exceeded';
const LOG_EVENT_TYPE_FILE_CHANGED_DURING_UPLOAD = 'file_changed_during_upload';
const LOG_EVENT_TYPE_PART_UPLOAD_RETRIES_EXCEEDED = 'part_upload_retries_exceeded';
const LOG_EVENT_TYPE_COMMIT_RETRIES_EXCEEDED = 'commit_retries_exceeded';
const LOG_EVENT_TYPE_WEB_WORKER_ERROR = 'web_worker_error';
const LOG_EVENT_TYPE_FILE_READER_RECEIVED_NOT_FOUND_ERROR = 'file_reader_received_not_found_error';
const LOG_EVENT_TYPE_PART_DIGEST_RETRIES_EXCEEDED = 'part_digest_retries_exceeded';
const LOG_EVENT_TYPE_LOGGED_OUT = 'logged_out';
/* eslint-enable no-unused-vars */

class MultiputUpload extends BaseMultiput {
    clientId: ?string;
    commitRetryCount: number;
    createSessionNumRetriesPerformed: number;
    destinationFileId: ?string;
    destinationFolderId: ?string;
    file: File;
    fileSha1: ?string;
    firstUnuploadedPartIndex: number;
    initialFileLastModified: ?string;
    initialFileSize: number;
    onSuccess: Function;
    onError: Function;
    onProgress: Function;
    options: Options;
    partSize: number;
    parts: Array<MultiputPart>;
    numPartsDigestComputing: number;
    numPartsDigestReady: number;
    numPartsNotStarted: number;
    numPartsUploaded: number;
    numPartsUploading: number;
    sessionEndpoints: Object;
    sessionId: string;
    totalUploadedBytes: number;
    worker: Worker;
    createSessionTimeout: ?number;

    /**
     * [constructor]
     * 
     * @param {Options} options
     * @param {File} file
     * @param {string} createSessionUrl
     * @param {string} [destinationFolderId] - Untyped folder id (e.g. no "d_" prefix)
     * @param {string} [destinationFileId] - Untyped file id (e.g. no "f_" prefix)
     * @param {MultiputConfig} [config]
     * @param {Function} [onError]
     * @param {Function} [onProgress]
     * @param {Function} [onSuccess]
     */
    constructor(
        options: Options,
        file: File,
        createSessionUrl: string,
        destinationFolderId?: ?string,
        destinationFileId?: ?string,
        config?: MultiputConfig,
        onError?: Function,
        onProgress?: Function,
        onSuccess?: Function
    ) {
        super(
            options,
            {
                createSession: createSessionUrl,
                uploadPart: null,
                listParts: null,
                commit: null,
                abort: null,
                logEvent: null
            },
            config
        );

        if (destinationFolderId !== null && destinationFileId !== null) {
            throw new Error('Both destinationFolderId and destinationFileId set');
        }
        this.file = file;

        // These values are used as part of our (best effort) attempt to abort uploads if we detect
        // a file change during the upload.
        this.initialFileSize = this.file.size;
        this.initialFileLastModified = getFileLastModifiedAsISONoMSIfPossible(this.file);
        this.destinationFolderId = destinationFolderId;
        this.destinationFileId = destinationFileId;
        this.fileSha1 = null;
        this.totalUploadedBytes = 0;
        this.numPartsNotStarted = 0; // # of parts yet to be processed
        this.numPartsDigestComputing = 0; // # of parts sent to the digest worker
        this.numPartsDigestReady = 0; // # of parts with digest finished that are waiting to be uploaded.
        this.numPartsUploading = 0; // # of parts with upload requests currently inflight
        this.numPartsUploaded = 0; // # of parts successfully uploaded
        this.firstUnuploadedPartIndex = 0; // Index of first part that hasn't been uploaded yet.
        this.onProgress = onProgress || noop;
        this.onSuccess = onSuccess || noop;
        this.onError = onError || noop;
        this.createSessionNumRetriesPerformed = 0;
        this.partSize = 0;
        this.parts = [];
        this.commitRetryCount = 0;
        this.worker = createWorker();
        this.clientId = null;
        this.options = options;
    }

    /**
     * Creates upload session. If a file ID is supplied, use the Chunked Upload File Version
     * API to replace the file.
     *
     * @private
     * @param {Object} - Request options
     * @param {boolean} [options.url] - Upload URL to use
     * @param {string} [options.fileId] - ID of file to replace
     * @param {string} [options.fileName] - New name for file - required for new file upload
     * @return {void}
     */
    createUploadSession = async (): Promise<> => {
        if (this.isDestroyed()) {
            return;
        }

        // Set up post body
        const postData: StringAnyMap = {
            file_size: this.file.size,
            file_name: this.file.name
        };

        if (this.destinationFolderId) {
            postData.folder_id = this.destinationFolderId;
        }

        try {
            const data = await this.xhr.post({ url: this.sessionEndpoints.createSessionUrl, data: postData });
            this.createUploadSessionSuccessHandler(data);
        } catch (error) {
            const { response } = error;

            if (response.status >= 500 && response.status < 600) {
                this.createUploadSessionErrorHandler(response);
            }

            // Recover from 409 session_conflict.  The server will return the session information
            // in context_info, so treat it as a success.
            if (response && response.status === 409 && response.code === 'session_conflict') {
                this.createUploadSessionSuccessHandler(response.context_info.session);
                return;
            }

            if (
                (response && (response.status === 403 && response.code === 'storage_limit_exceeded')) ||
                (response.status === 403 && response.code === 'access_denied_insufficient_permissions') ||
                (response.status === 409 && response.code === 'item_name_in_use')
            ) {
                this.onError(response);
                return;
            }

            // All other cases get treated as an upload failure.
            this.sessionErrorHandler(response, LOG_EVENT_TYPE_CREATE_SESSION_MISC_ERROR, JSON.stringify(response));
        }
    };

    /**
     * Create session error handler.
     * Retries the create session request or fails the upload.
     * 
     * @private
     * @param {Object} response
     * @return {void}
     */
    createUploadSessionErrorHandler = (response: Object): void => {
        if (this.isDestroyed()) {
            return;
        }

        if (this.createSessionNumRetriesPerformed < this.config.retries) {
            this.createUploadSessionRetry();
            return;
        }

        this.consoleLog('Too many create session failures, failing upload');
        this.sessionErrorHandler(response, LOG_EVENT_TYPE_CREATE_SESSION_RETRIES_EXCEEDED, JSON.stringify(response));
    };

    /**
     * Schedule a retry for create session request upon failure
     * 
     * @private
     * @return {void}
     */
    createUploadSessionRetry = (): void => {
        const retryDelayMs = getBoundedExpBackoffRetryDelay(
            this.config.initialRetryDelayMs,
            this.config.maxRetryDelayMs,
            this.createSessionNumRetriesPerformed
        );
        this.createSessionNumRetriesPerformed += 1;
        this.consoleLog(`Retrying create session in ${retryDelayMs} ms`);
        this.createSessionTimeout = setTimeout(this.createUploadSession, retryDelayMs);
    };

    /**
     * Handles a upload session success response
     *
     * @private
     * @param {Object} data - Upload session creation success data
     * @return {void}
     */
    createUploadSessionSuccessHandler = (data: any): void => {
        if (this.isDestroyed()) {
            return;
        }

        const { id, part_size, session_endpoints } = data;

        this.sessionId = id;
        this.partSize = part_size;
        this.sessionEndpoints = {
            ...this.sessionEndpoints,
            uploadPart: session_endpoints.upload_part,
            listParts: session_endpoints.list_parts,
            commit: session_endpoints.commit,
            abort: session_endpoints.abort,
            logEvent: session_endpoints.log_event
        };

        this.populateParts();
        this.processNextParts();
    };

    /**
     * Session error handler.
     * Retries the create session request or fails the upload.
     * 
     * @private
     * @param {?Object} response
     * @param {string} logEventType
     * @param {string} [logMessage]
     * @return {void}
     */
    sessionErrorHandler = async (response: ?Object, logEventType: string, logMessage?: string): Promise<> => {
        this.destroy();
        this.onError(response);

        try {
            await retryNumOfTimes(
                (resolve: Function, reject: Function): void => {
                    this.logEvent(logEventType, logMessage).then(resolve).catch(reject);
                },
                this.config.retries,
                this.config.initialRetryDelayMs
            );

            this.abortSession();
        } catch (err) {
            this.abortSession();
        }
    };

    /**
     * Aborts the upload session
     * 
     * @private
     * @return {void}
     */
    abortSession = (): void => {
        if (this.worker) {
            this.worker.terminate();
        }

        if (this.sessionEndpoints.abort) {
            this.xhr.delete(this.sessionEndpoints.abort);
        }
    };

    /**
     * Part upload success handler
     * 
     * @private
     * @param {MultiputPart} part
     * @return {void}
     */
    partUploadSuccessHandler = (part: MultiputPart): void => {
        this.numPartsUploading -= 1;
        this.numPartsUploaded += 1;
        this.updateProgress(part.uploadedBytes, part.size);
        this.processNextParts();
    };

    /**
     * Part upload error handler
     * 
     * @private
     * @param {Error} error
     * @param {string} eventInfo
     * @return {void}
     */
    partUploadErrorHandler = (error: Error, eventInfo: string): void => {
        this.sessionErrorHandler(null, LOG_EVENT_TYPE_PART_UPLOAD_RETRIES_EXCEEDED, eventInfo);
    };

    /**
     * Update upload progress
     * 
     * @private
     * @param {number} prevUploadedBytes
     * @param {number} newUploadedBytes
     * @return {void}
     */
    updateProgress = (prevUploadedBytes: number, newUploadedBytes: number): void => {
        if (this.isDestroyed()) {
            return;
        }

        this.totalUploadedBytes += newUploadedBytes - prevUploadedBytes;
        this.onProgress(this.totalUploadedBytes);
    };

    /**
     * Attempts to process more parts, except in the case where everything is done or we detect
     * a file change (in which case we want to abort and not process more parts).
     * 
     * @private
     * @return {void}
     */
    processNextParts = (): void => {
        if (this.failSessionIfFileChangeDetected()) {
            return;
        }

        if (this.numPartsUploaded === this.parts.length && this.fileSha1) {
            this.commitSession();
            return;
        }

        this.updateFirstUnuploadedPartIndex();

        while (this.canStartMorePartUploads()) {
            this.uploadNextPart();
        }

        if (this.shouldComputeDigestForNextPart()) {
            this.computeDigestForNextPart();
        }
    };

    /**
     * We compute digest for parts one at a time.  This is done for simplicity and also to guarantee that
     * we send parts in order to the web worker (which is computing the digest for the entire file).
     * 
     * @private
     * @return {boolean} true if there is work to do, false otherwise.
     */
    shouldComputeDigestForNextPart = (): boolean =>
        !this.isDestroyed() &&
        this.numPartsDigestComputing === 0 &&
        this.numPartsNotStarted > 0 &&
        this.numPartsDigestReady < this.config.digestReadahead;

    /**
     * Find first part in parts array that doesn't have a digest, and compute its digest.

     * @private
     * @return {void}
     */
    computeDigestForNextPart = (): void => {
        for (let i = this.firstUnuploadedPartIndex; i < this.parts.length; i += 1) {
            const part = this.parts[i];
            if (part.state === PART_STATE_NOT_STARTED) {
                // Update the counters here instead of computeDigestForPart because computeDigestForPart
                // can get called on retries
                this.numPartsNotStarted -= 1;
                this.numPartsDigestComputing += 1;
                this.computeDigestForPart(part);
                return;
            }
        }
    };

    /**
     * Read a blob with FileReader
     * 
     * @param {FileReader} reader
     * @param {Blob} blob
     * @return {Promise}
     */
    readFile = (reader: FileReader, blob: Blob): Promise<> =>
        new Promise((resolve, reject) => {
            reader.readAsArrayBuffer(blob);
            reader.onload = () => {
                resolve({
                    buffer: reader.result,
                    readCompleteTimestamp: Date.now()
                });
            };
            reader.onerror = reject;
        });

    /**
     * Compute digest for this part
     * 
     * @private
     * @param {MultiputPart} part
     * @return {Promise}
     */
    computeDigestForPart = async (part: MultiputPart): Promise<> => {
        const blob = this.file.slice(part.offset, part.offset + part.size);
        const reader = new window.FileReader();
        const startTimestamp = Date.now();

        try {
            const {
                buffer,
                readCompleteTimestamp
            }: { buffer: ArrayBuffer, readCompleteTimestamp: number } = await this.readFile(reader, blob);
            const sha256 = await digest('SHA-256', buffer);

            this.sendPartToWorker(part, buffer);

            part.sha256 = sha256;
            part.state = PART_STATE_DIGEST_READY;
            part.blob = blob;

            this.numPartsDigestReady += 1;
            const digestCompleteTimestamp = Date.now();

            part.timing = {
                partDigestTime: digestCompleteTimestamp - startTimestamp,
                readTime: readCompleteTimestamp - startTimestamp,
                subtleCryptoTime: digestCompleteTimestamp - readCompleteTimestamp
            };

            this.processNextParts();
        } catch (error) {
            this.onPartDigestError(error);
        }
    };

    /**
     * Sends a part to the worker
     * 
     * @private
     * @param {MultiputPart} part
     * @param {ArrayBuffer} buffer
     * @return {void}
     * TODO: implement this
     */
    // eslint-disable-next-line
    sendPartToWorker = (part: MultiputPart, buffer: ArrayBuffer): void => {};

    /**
     * Error handler for part digest computation
     * 
     * @private
     * @param {MultiputPart} part
     * @param {ArrayBuffer} buffer
     * @return {void}
     * TODO: implement this
     */
    // eslint-disable-next-line
    onPartDigestError = (error: Error): void => {};

    /**
     * Send a request to commit the upload.
     * TODO: implement this
     * 
     * @private
     * @return {void}
     */
    commitSession = (): void => {};

    /**
     * Commit response handler.  Succeeds the upload, retries the commit on 202/429/failure, or fails
     * the upload.
     * TODO: implement this
     * 
     * @private
     * @return {void}
     */
    commitSessionSuccessHandler = (): void => {};

    /**
     * Commit error handler.
     * Retries the commit or fails the multiput session.
     * TODO: implement this
     * 
     * @private
     * @return {void}
     */
    commitSessionErrorHandler = (): void => {};

    /**
     * Retry commit.
     * Retries the commit or fails the multiput session.
     * TODO: implement this
     * 
     * @private
     * @return {void}
     */
    commitSessionRetry = (): void => {};

    /**
     * Find first part in parts array that we can upload, and upload it.
     * 
     * @private
     * @return {void}
     */
    uploadNextPart = (): void => {
        for (let i = this.firstUnuploadedPartIndex; i < this.parts.length; i += 1) {
            const part = this.parts[i];

            if (part.state === PART_STATE_DIGEST_READY) {
                // Update the counters here instead of uploadPart because uploadPart
                // can get called on retries
                this.numPartsDigestReady -= 1;
                this.numPartsUploading += 1;
                part.upload();
                break;
            }
        }
    };

    /**
     * Checks if upload pipeline is full
     * TODO: support progressive hashing
     * 
     * @private
     * @return {boolean}
     */
    canStartMorePartUploads = (): boolean => !this.isDestroyed() && this.numPartsUploading < this.config.parallelism;

    /**
     * Functions that walk the parts array get called a lot, so we cache which part we should
     * start work at to avoid always iterating through entire parts list.
     * 
     * @private
     * @return {void}
     */
    updateFirstUnuploadedPartIndex = (): void => {
        let part = this.parts[this.firstUnuploadedPartIndex];
        while (part && part.state === PART_STATE_UPLOADED) {
            this.firstUnuploadedPartIndex += 1;
            part = this.parts[this.firstUnuploadedPartIndex];
        }
    };

    /**
     * Get number of parts being uploaded
     * 
     * @return {number}
     */
    getNumPartsUploading = (): number => this.numPartsUploading;

    /**
     * After session is created and we know the part size, populate the parts
     * array.
     * 
     * @private
     * @return {void}
     */
    populateParts = (): void => {
        this.numPartsNotStarted = Math.ceil(this.file.size / this.partSize);

        for (let i = 0; i < this.numPartsNotStarted; i += 1) {
            const offset = i * this.partSize;
            const part = new MultiputPart(
                this.options,
                i,
                offset,
                Math.min(offset + this.partSize, this.file.size) - offset,
                this.sessionId,
                this.sessionEndpoints,
                this.config,
                this.getNumPartsUploading,
                this.partUploadSuccessHandler,
                this.updateProgress,
                this.partUploadErrorHandler
            );
            this.parts.push(part);
        }
    };

    /**
     * Fails the session if the file's size or last modified has changed since the upload process
     * began.
     *
     * This ensures that we don't upload a file that has parts from one file version and parts from
     * another file version.
     *
     * This logic + the "not found" error logic in onWorkerError() is best effort and will not
     * detect all possible file changes. This is because of browser differences. For example,
     * -- In Safari, size and last modified will update when a file changes, and workers will
     * get "not found" errors.
     * -- In Chrome, size and last modified will update, but not in legacy drag and drop (that
     * code path constructs a different file object). Workers will still get "not found" errors,
     * though, so we can still detect changes even in legacy drag and drop.
     * -- In IE 11/Edge, size will update but last modified will not. Workers will not get
     * "not found" errors, but they may get a generic error saying that some bytes failed to be
     * read.
     * -- In Firefox, neither last modified nor size will update. Workers don't seem to get errors.
     * (Not a whole lot we can do here...)
     *
     * Unfortunately, alternative solutions to catch more cases don't have a clear ROI (for
     * example, doing a SHA-1 of the file before and after the upload is very expensive), so
     * this is the best solution we have. We can revisit this if data shows that we need a better
     * solution.
     * TODO: implement this
     *
     * @private
     * @return {boolean} True if the session was failed, false if no action was taken
     */
    failSessionIfFileChangeDetected = (): void => {};

    /**
     * Cancels an upload in progress by cancelling all upload chunks.
     * This cannot be undone or resumed.
     * TODO: implement this
     *
     * @private
     * @return {void}
     */
    cancel(): void {}
}

export default MultiputUpload;
