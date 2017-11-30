/**
 * @flow
 * @file Multiput upload
 * @author Box
 */

import Base from '../Base';
import { getFileLastModifiedAsISONoMSIfPossible } from '../../util/uploads';
import createWorker from '../../util/uploadsSHA1Worker';
import MultiputPart, { PART_STATE_UPLOADED, PART_STATE_DIGEST_READY } from './MultiputPart';
import type { StringAnyMap, MultiputConfig } from '../../flowTypes';

const DEFAULT_MULTIPUT_CONFIG: MultiputConfig = {
    console: false, // Whether to display informational messages to console
    digestReadahead: 5, // How many parts past those currently uploading to precompute digest for
    initialRetryDelayMs: 5000, // Base for exponential backoff on retries
    maxRetryDelayMs: 60000, // Upper bound for time between retries
    parallelism: 5, // Maximum number of parts to upload at a time
    requestTimeout: 120000, // Idle timeout on part upload, overall request timeout on other requests
    // eslint-disable-next-line max-len
    retries: 5 // How many times to retry requests such as upload part or commit. Note that total number of attempts will be retries + 1 in worst case where all attempts fail.
};

class MultiputUpload extends Base {
    clientId: ?string;
    commitRetryCount: number;
    config: Object;
    createSessionNumRetriesPerformed: number;
    destinationFile: ?string;
    destinationFolder: ?string;
    file: File;
    fileSha1: ?string;
    firstUnuploadedPartIndex: number;
    initialFileLastModified: ?string;
    initialFileSize: number;
    onCompleted: ?Function;
    onFailure: ?Function;
    onProgress: ?Function;
    options: Object;
    partSize: number;
    parts: Array<MultiputPart>;
    partsDigestComputing: number;
    partsDigestReady: number;
    partsNotStarted: number;
    partsUploaded: number;
    partsUploading: number;
    sessionEndpoints: Object;
    sessionId: ?string;
    totalUploadedBytes: number;
    worker: Worker;

    /**
     * [constructor]
     * 
     * @param {object} options
     * @param {File} file
     * @param {string} createSessionUrl
     * @param {string} [destinationFolder] - Untyped folder id (e.g. no "d_" prefix)
     * @param {string} [destinationFile] - Untyped file id (e.g. no "f_" prefix)
     * @param {MultiputConfig} config
     */
    constructor(
        options: Object,
        file: File,
        createSessionUrl: string,
        destinationFolder?: string,
        destinationFile?: string,
        config: MultiputConfig
    ) {
        super(options);

        if (destinationFolder !== null && destinationFile !== null) {
            throw new Error('Both destinationFolder and destinationFile set');
        }
        this.file = file;

        // These values are used as part of our (best effort) attempt to abort uploads if we detect
        // a file change during the upload.
        this.initialFileSize = this.file.size;
        this.initialFileLastModified = getFileLastModifiedAsISONoMSIfPossible(this.file);

        this.sessionEndpoints = {
            createSession: createSessionUrl,
            uploadPart: null,
            listParts: null,
            commit: null,
            abort: null,
            logEvent: null
        };
        // Explicitly cast these two to string because sometimes they get passed as int, and
        // sending folder_id as a number instead of a string in the JSON body of createSession
        // results in an API error.
        this.destinationFolder = destinationFolder;
        this.destinationFile = destinationFile;
        this.config = config || DEFAULT_MULTIPUT_CONFIG;
        this.fileSha1 = null;
        this.totalUploadedBytes = 0;
        this.partsNotStarted = 0; // # of parts yet to be processed
        this.partsDigestComputing = 0; // # of parts sent to the digest worker
        this.partsDigestReady = 0; // # of parts with digest finished that are waiting to be uploaded.
        this.partsUploading = 0; // # of parts with upload requests currently inflight
        this.partsUploaded = 0; // # of parts successfully uploaded
        this.firstUnuploadedPartIndex = 0; // Index of first part that hasn't been uploaded yet.
        this.onProgress = null;
        this.onCompleted = null;
        this.onFailure = null;
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

        if (this.destinationFolder) {
            postData.folder_id = this.destinationFolder;
        }

        try {
            const data = await this.xhr.post({ url: this.sessionEndpoints.createSessionUrl, data: postData });
            this.uploadSessionSuccessHandler(data);
        } catch (error) {
            this.uploadSessionErrorHandler(error);
        }
    };

    /**
     * Upload session session error handler.
     * Retries the create session request or fails the upload.
     * TODO: implement this
     * 
     * @private
     * @return {void}
     */
    // eslint-disable-next-line
    uploadSessionErrorHandler = (error: Error): void => {};

    /**
     * Handles a upload session success response
     *
     * @private
     * @param {Object} data - Upload session creation success data
     * @return {void}
     */
    uploadSessionSuccessHandler = (data: any): void => {
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

        if (this.partsUploaded === this.parts.length && this.fileSha1) {
            this.commitSession();
        }

        this.updateFirstUnuploadedPartIndex();

        while (this.canStartMorePartUploads()) {
            this.uploadNextPart();
        }

        // TODO: compute digests for parts
    };

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
                this.partsDigestReady -= 1;
                this.partsUploading += 1;
                this.uploadPart(part);
                break;
            }
        }
    };

    /**
     * Upload given part
     * TODO: implement this
     * 
     * @private
     * @param {MultiputPart} part
     * @return {void}
     */
    // eslint-disable-next-line
    uploadPart = (part: MultiputPart): void => {};

    /**
     * Checks if upload pipeline is full
     * TODO: support progressive hashing
     * 
     * @private
     * @return {boolean}
     */
    canStartMorePartUploads = (): boolean => !this.ended && this.partsUploading < this.config.parallelism;

    /**
     * Functions that walk the parts array get called a lot, so we cache which part we should
     * start work at to avoid always iterating through entire parts list.
     * 
     * @private
     * @return {void}
     */
    updateFirstUnuploadedPartIndex = (): void => {
        for (let i = this.firstUnuploadedPartIndex; i < this.parts.length; i += 1) {
            const part = this.parts[i];

            if (i === this.firstUnuploadedPartIndex && part.state === PART_STATE_UPLOADED) {
                this.firstUnuploadedPartIndex = i + 1;
            } else {
                break;
            }
        }
    };

    /**
     * After session is created and we know the part size, populate the parts
     * array.
     * 
     * @private
     * @return {void}
     */
    populateParts = (): void => {
        this.partsNotStarted = Math.ceil(this.file.size / this.partSize);

        for (let i = 0; i < this.partsNotStarted; i += 1) {
            const offset = i * this.partSize;
            const part = new MultiputPart(
                this.options,
                i,
                offset,
                Math.min(offset + this.partSize, this.file.size) - offset
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
