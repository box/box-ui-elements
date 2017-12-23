/**
 * @flow
 * @file Multiput upload
 * @author Box
 */

import noop from 'lodash/noop';
import BaseMultiput from './BaseMultiput';
import { getFileLastModifiedAsISONoMSIfPossible, getBoundedExpBackoffRetryDelay } from '../../util/uploads';
import { retryNumOfTimes } from '../../util/function';
import { digest } from '../../util/webcrypto';
import hexToBase64 from '../../util/base64';
import { DEFAULT_RETRY_DELAY_MS } from '../../constants';
import MultiputPart, { PART_STATE_UPLOADED, PART_STATE_DIGEST_READY, PART_STATE_NOT_STARTED } from './MultiputPart';
import type { StringAnyMap, MultiputConfig, Options } from '../../flowTypes';
import createWorker from '../../util/uploadsSHA1Worker';

// Constants used for specifying log event types.

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

class MultiputUpload extends BaseMultiput {
    clientId: ?string;
    commitRetryCount: number;
    createSessionNumRetriesPerformed: number;
    destinationFileId: ?string;
    folderId: ?string;
    file: File;
    fileSha1: ?string;
    firstUnuploadedPartIndex: number;
    initialFileLastModified: ?string;
    initialFileSize: number;
    successCallback: Function;
    errorCallback: Function;
    progressCallback: Function;
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
    sha1Worker: Worker;
    createSessionTimeout: ?number;
    commitSessionTimeout: ?number;
    fileName: string;
    fileId: ?string;
    overwrite: boolean;

    /**
     * [constructor]
     *
     * @param {Options} options
     * @param {MultiputConfig} [config]
     */
    constructor(options: Options, config?: MultiputConfig) {
        super(
            options,
            {
                createSession: null,
                uploadPart: null,
                listParts: null,
                commit: null,
                abort: null,
                logEvent: null
            },
            config
        );
        this.parts = [];
        this.options = options;
        this.fileSha1 = null;
        this.totalUploadedBytes = 0;
        this.numPartsNotStarted = 0; // # of parts yet to be processed
        this.numPartsDigestComputing = 0; // # of parts sent to the digest worker
        this.numPartsDigestReady = 0; // # of parts with digest finished that are waiting to be uploaded.
        this.numPartsUploading = 0; // # of parts with upload requests currently inflight
        this.numPartsUploaded = 0; // # of parts successfully uploaded
        this.firstUnuploadedPartIndex = 0; // Index of first part that hasn't been uploaded yet.
        this.createSessionNumRetriesPerformed = 0;
        this.partSize = 0;
        this.commitRetryCount = 0;
        this.clientId = null;
    }

    /**
     * Upload a given file
     *
     *
     * @param {Object} options
     * @param {File} options.file
     * @param {string} [options.id] - Untyped folder id (e.g. no "d_" prefix)
     * @param {Function} [options.errorCallback]
     * @param {Function} [options.progressCallback]
     * @param {Function} [options.successCallback]
     * @return {void}
     */
    upload = ({
        file,
        id,
        errorCallback,
        progressCallback,
        successCallback,
        overwrite = true,
        fileId
    }: {
        file: File,
        id?: ?string,
        errorCallback?: Function,
        progressCallback?: Function,
        successCallback?: Function,
        overwrite?: boolean,
        fileId?: string
    }): void => {
        this.file = file;
        this.fileName = this.file.name;
        // These values are used as part of our (best effort) attempt to abort uploads if we detect
        // a file change during the upload.
        this.initialFileSize = this.file.size;
        this.initialFileLastModified = getFileLastModifiedAsISONoMSIfPossible(this.file);
        this.folderId = id;
        this.errorCallback = errorCallback || noop;
        this.progressCallback = progressCallback || noop;
        this.successCallback = successCallback || noop;

        this.sha1Worker = createWorker();
        this.sha1Worker.addEventListener('message', this.onWorkerMessage);

        this.overwrite = overwrite;
        this.fileId = fileId;

        this.createSession();
    };

    /**
     * Creates upload session. If a file ID is supplied, use the Chunked Upload File Version
     * API to replace the file.
     *
     * @private
     * @return {void}
     */
    createSession = async (): Promise<any> => {
        if (this.isDestroyed()) {
            return;
        }

        await this.updateReachableUploadHost();
        let createSessionUrl = `${this.uploadHost}/api/2.0/files/upload_sessions`;

        // Set up post body
        const postData: StringAnyMap = {
            file_size: this.file.size,
            file_name: this.fileName
        };

        if (this.fileId) {
            createSessionUrl = createSessionUrl.replace(
                'upload_sessions',
                `${this.fileId}/upload_sessions`
            );
        } else {
            postData.folder_id = this.folderId;
        }

        try {
            const data = await this.xhr.post({ url: createSessionUrl, data: postData });
            this.createSessionSuccessHandler(data);
        } catch (error) {
            const response = await this.getErrorResponse(error);

            if (response && response.status >= 500 && response.status < 600) {
                this.createSessionErrorHandler(error);
            }

            // Recover from 409 session_conflict.  The server will return the session information
            // in context_info, so treat it as a success.
            if (response && response.status === 409 && response.code === 'session_conflict') {
                this.createSessionSuccessHandler(response.context_info.session);
                return;
            }

            if (
                (response && (response.status === 403 && response.code === 'storage_limit_exceeded')) ||
                (response.status === 403 && response.code === 'access_denied_insufficient_permissions')
            ) {
                this.errorCallback(error);
                return;
            }

            if (response && response.status === 409) {
                this.resolveConflict(response);
                this.createSessionRetry();
                return;
            }

            // All other cases get treated as an upload failure.
            this.sessionErrorHandler(error, LOG_EVENT_TYPE_CREATE_SESSION_MISC_ERROR, JSON.stringify(error));
        }
    };

    /**
     * Create session error handler.
     * Retries the create session request or fails the upload.
     *
     * @private
     * @param {Error} error
     * @return {void}
     */
    createSessionErrorHandler = (error: Error): void => {
        if (this.isDestroyed()) {
            return;
        }

        if (this.createSessionNumRetriesPerformed < this.config.retries) {
            this.createSessionRetry();
            return;
        }

        this.consoleLog('Too many create session failures, failing upload');
        this.sessionErrorHandler(error, LOG_EVENT_TYPE_CREATE_SESSION_RETRIES_EXCEEDED, JSON.stringify(error));
    };

    /**
     * Schedule a retry for create session request upon failure
     *
     * @private
     * @return {void}
     */
    createSessionRetry = (): void => {
        const retryDelayMs = getBoundedExpBackoffRetryDelay(
            this.config.initialRetryDelayMs,
            this.config.maxRetryDelayMs,
            this.createSessionNumRetriesPerformed
        );
        this.createSessionNumRetriesPerformed += 1;
        this.consoleLog(`Retrying create session in ${retryDelayMs} ms`);
        this.createSessionTimeout = setTimeout(this.createSession, retryDelayMs);
    };

    /**
     * Handles a upload session success response
     *
     * @private
     * @param {Object} data - Upload session creation success data
     * @return {void}
     */
    createSessionSuccessHandler = (data: any): void => {
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
     * @param {?Error} error
     * @param {string} logEventType
     * @param {string} [logMessage]
     * @return {Promise}
     */
    sessionErrorHandler = async (error: ?Error, logEventType: string, logMessage?: string): Promise<any> => {
        this.destroy();
        this.errorCallback(error);

        try {
            if (!this.sessionEndpoints.logEvent) {
                throw new Error('logEvent endpoint not found');
            }

            await retryNumOfTimes(
                (resolve: Function, reject: Function): void => {
                    this.logEvent(logEventType, logMessage)
                        .then(resolve)
                        .catch(reject);
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
        if (this.sha1Worker) {
            this.sha1Worker.terminate();
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
        this.updateProgress(part.uploadedBytes, this.partSize);
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
        this.sessionErrorHandler(error, LOG_EVENT_TYPE_PART_UPLOAD_RETRIES_EXCEEDED, eventInfo);
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
        this.progressCallback({
            loaded: this.totalUploadedBytes,
            total: this.file.size
        });
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
     * we send parts in order to the web sha1Worker (which is computing the digest for the entire file).
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
    readFile = (reader: FileReader, blob: Blob): Promise<any> =>
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
    computeDigestForPart = async (part: MultiputPart): Promise<any> => {
        const blob = this.file.slice(part.offset, part.offset + this.partSize);
        const reader = new window.FileReader();
        const startTimestamp = Date.now();

        try {
            const {
                buffer,
                readCompleteTimestamp
            }: { buffer: ArrayBuffer, readCompleteTimestamp: number } = await this.readFile(reader, blob);
            const sha256ArrayBuffer = await digest('SHA-256', buffer);
            const sha256 = btoa(
                new Uint8Array(sha256ArrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
            );
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
            this.onPartDigestError(error, part);
        }
    };

    /**
     * Deal with a message from the worker (either a part sha-1 ready, file sha-1 ready, or error).
     *
     * @private
     * @param {object} event
     * @return {void}
     */
    onWorkerMessage = (event: Object) => {
        if (this.isDestroyed()) {
            return;
        }

        const { data } = event;
        if (data.type === 'partDone') {
            this.numPartsDigestComputing -= 1;
            const { part } = data;
            this.parts[part.index].timing.fileDigestTime = data.duration;
            this.processNextParts();
        } else if (data.type === 'done') {
            this.fileSha1 = hexToBase64(data.sha1);
            this.sha1Worker.terminate();
            if (this.partsUploaded === this.parts.length) {
                this.commitSession();
            }
        } else if (data.type === 'error') {
            this.sessionErrorHandler(null, LOG_EVENT_TYPE_WEB_WORKER_ERROR, JSON.stringify(data));
        }
    };

    /**
     * Sends a part to the sha1Worker
     *
     * @private
     * @param {MultiputPart} part
     * @param {ArrayBuffer} buffer
     * @return {void}
     */
    sendPartToWorker = (part: MultiputPart, buffer: ArrayBuffer): void => {
        if (this.isDestroyed()) {
            return;
        }
        // Don't send entire part since XHR can't be cloned
        const partInformation = { index: part.index, offset: part.offset, size: part.partSize };
        this.sha1Worker.postMessage(
            { part: partInformation, fileSize: this.file.size, partContents: buffer },
            [buffer] // This transfers the ArrayBuffer to the worker context without copying contents.
        );
        this.consoleLog(`Part sent to worker: ${JSON.stringify(part)}.}`);
    };

    /**
     * Error handler for part digest computation
     *
     * @private
     * @param {Error} error
     * @param {MultiputPart} part
     * @return {void}
     */
    onPartDigestError = (error: Error, part: MultiputPart): void => {
        this.consoleLog(`Error computing digest for part ${JSON.stringify(part)}: ${JSON.stringify(error)}`);

        // When a FileReader is processing a file that changes on disk, Chrome reports a 'NotFoundError'
        // and Safari reports a 'NOT_FOUND_ERR'. (Other browsers seem to allow the reader to keep
        // going, either with the old version of the new file or the new one.) Since the error name
        // implies that retrying will not help, we fail the session.
        if (error.name === 'NotFoundError' || error.name === 'NOT_FOUND_ERR') {
            this.sessionErrorHandler(null, LOG_EVENT_TYPE_FILE_READER_RECEIVED_NOT_FOUND_ERROR, JSON.stringify(error));
            return;
        }

        if (this.failSessionIfFileChangeDetected()) {
            return;
        }

        if (part.numDigestRetriesPerformed >= this.config.retries) {
            this.sessionErrorHandler(null, LOG_EVENT_TYPE_PART_DIGEST_RETRIES_EXCEEDED, JSON.stringify(error));
            return;
        }

        const retryDelayMs = getBoundedExpBackoffRetryDelay(
            this.config.initialRetryDelayMs,
            this.config.maxRetryDelayMs,
            part.numDigestRetriesPerformed
        );
        part.numDigestRetriesPerformed += 1;
        this.consoleLog(`Retrying digest work for part ${JSON.stringify(part)} in ${retryDelayMs} ms`);

        setTimeout(() => {
            this.computeDigestForPart(part);
        }, retryDelayMs);
    };

    /**
     * Send a request to commit the upload.
     *
     * @private
     * @return {Promise}
     */
    commitSession = async (): Promise<any> => {
        if (this.isDestroyed()) {
            return;
        }

        const stats = {
            totalPartReadTime: 0,
            totalPartDigestTime: 0,
            totalFileDigestTime: 0,
            totalPartUploadTime: 0
        };

        const postData = {
            parts: this.parts
                .map((part) => {
                    stats.totalPartReadTime += part.timing.readTime;
                    stats.totalPartDigestTime += part.timing.subtleCryptoTime;
                    stats.totalFileDigestTime += part.timing.fileDigestTime;
                    stats.totalPartUploadTime += part.timing.uploadTime;
                    return part.getPart();
                })
                .sort((part1, part2) => part1.offset - part2.offset),
            attributes: {}
        };

        const fileLastModified = getFileLastModifiedAsISONoMSIfPossible(this.file);
        if (fileLastModified) {
            postData.attributes.content_modified_at = fileLastModified;
        }

        const clientEventInfo = {
            avg_part_read_time: Math.round(stats.totalPartReadTime / this.parts.length),
            avg_part_digest_time: Math.round(stats.totalPartDigestTime / this.parts.length),
            avg_file_digest_time: Math.round(stats.totalFileDigestTime / this.parts.length),
            avg_part_upload_time: Math.round(stats.totalPartUploadTime / this.parts.length)
        };

        // To make flow stop complaining about this.fileSha1 could potentially be undefined/null
        const fileSha1: string = (this.fileSha1: any);
        const headers = {
            Digest: `sha=${fileSha1}`,
            'X-Box-Client-Event-Info': JSON.stringify(clientEventInfo)
        };

        this.xhr
            .post({ url: this.sessionEndpoints.commit, data: postData, headers })
            .then(this.commitSessionSuccessHandler)
            .catch(this.commitSessionErrorHandler);
    };

    /**
     * Commit response handler.  Succeeds the upload, retries the commit on 202
     *
     * @private
     * @param {Object} response
     * @return {void}
     */
    commitSessionSuccessHandler = (response: Object): void => {
        if (this.isDestroyed()) {
            return;
        }

        const { status, entries } = response;

        if (status === 202) {
            this.commitSessionRetry(response);
            return;
        }

        this.destroy();

        if (this.successCallback && entries) {
            this.successCallback(entries);
        }
    };

    /**
     * Commit error handler.
     * Retries the commit or fails the multiput session.
     *
     * @private
     * @param {Object} error
     * @return {void}
     */
    commitSessionErrorHandler = (error: Object): void => {
        const { response } = error;

        if (this.isDestroyed()) {
            return;
        }

        if (this.commitRetryCount >= this.config.retries) {
            this.consoleLog('Too many commit failures, failing upload');
            this.sessionErrorHandler(error, LOG_EVENT_TYPE_COMMIT_RETRIES_EXCEEDED, JSON.stringify(error));
            return;
        }

        this.commitSessionRetry(response);
    };

    /**
     * Retry commit.
     * Retries the commit or fails the multiput session.
     *
     * @private
     * @param {Object} response
     * @return {void}
     */
    commitSessionRetry = (response: Object): void => {
        const { status, headers } = response;
        let retryAfterMs = DEFAULT_RETRY_DELAY_MS;

        if (headers) {
            const retryAfterSec = parseInt(headers.get('Retry-After'), 10);

            if (!Number.isNaN(retryAfterSec)) {
                retryAfterMs = retryAfterSec * 1000;
            }
        }

        const defaultRetryDelayMs = getBoundedExpBackoffRetryDelay(
            this.config.initialRetryDelayMs,
            this.config.maxRetryDelayMs,
            this.commitRetryCount
        );
        // If status is 202 then don't increment the retry count.
        // In this case, frontend will keep retrying until it gets another status code.
        // Retry interval = value specified for the Retry-After header in 202 response.
        if (status !== 202) {
            this.commitRetryCount += 1;
        }
        const retryDelayMs = retryAfterMs || defaultRetryDelayMs;
        this.consoleLog(`Retrying commit in ${retryDelayMs} ms`);
        this.commitSessionTimeout = setTimeout(this.commitSession, retryDelayMs);
    };

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
     *
     * @private
     * @return {boolean}
     */
    canStartMorePartUploads = (): boolean =>
        !this.isDestroyed() && this.numPartsUploading < this.config.parallelism && this.numPartsDigestReady > 0;

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
            const currentPartSize = Math.min(offset + this.partSize, this.file.size) - offset;
            const part = new MultiputPart(
                this.options,
                i,
                offset,
                currentPartSize,
                this.file.size,
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
     *
     * @private
     * @return {boolean} True if the session was failed, false if no action was taken
     */
    failSessionIfFileChangeDetected = (): boolean => {
        const currentFileSize = this.file.size;
        const currentFileLastModified = getFileLastModifiedAsISONoMSIfPossible(this.file);

        if (currentFileSize !== this.initialFileSize || currentFileLastModified !== this.initialFileLastModified) {
            this.sessionErrorHandler(
                null,
                LOG_EVENT_TYPE_FILE_CHANGED_DURING_UPLOAD,
                JSON.stringify({
                    oldSize: this.initialFileSize,
                    newSize: currentFileSize,
                    oldLastModified: this.initialFileLastModified,
                    newLastModified: currentFileLastModified
                })
            );
            return true;
        }

        return false;
    };

    /**
     * Cancels an upload in progress by cancelling all upload parts.
     * This cannot be undone or resumed.
     *
     * @private
     * @return {void}
     */
    cancel = (): void => {
        if (this.isDestroyed()) {
            return;
        }

        // Cancel individual upload parts
        this.parts.forEach((part) => {
            part.cancel();
        });

        this.parts = [];
        clearTimeout(this.createSessionTimeout);
        clearTimeout(this.commitSessionTimeout);
        this.abortSession();
        this.destroy();
    };

    /**
     * Resolves upload conflict by overwriting or renaming
     *
     * @param {Object} response
     * @return {Promise}
     */
    resolveConflict = async (response: Object): Promise<any> => {
        if (this.overwrite && response.context_info) {
            this.fileId = response.context_info.conflicts.id;
            return;
        }

        const extension = this.fileName.substr(this.fileName.lastIndexOf('.')) || '';
        // foo.txt => foo-1513385827917.txt
        this.fileName = `${this.fileName.substr(0, this.fileName.lastIndexOf('.'))}-${Date.now()}${extension}`;
    };

    /**
     * Returns detailed error response
     *
     * @param {Object} error
     * @return {Promise<Object>}
     */
    getErrorResponse = async (error: Object): Promise<Object> => {
        const { response } = error;
        if (!response) {
            return {};
        }

        if (response.status === 401 || response.status === 403) {
            return response;
        }

        return response.json();
    };
}

export default MultiputUpload;
