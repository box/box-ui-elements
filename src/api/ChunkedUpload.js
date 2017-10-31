/**
 * @flow
 * @file Helper for the Box Chunked Upload API
 * @author Box
 */

import noop from 'lodash.noop';
import Chunk from './Chunk';
import BaseUpload from './BaseUpload';
import hexToBase64 from '../util/base64';
import { DEFAULT_RETRY_DELAY_MS } from '../constants';
import type { BoxItem, StringAnyMap } from '../flowTypes';

const UPLOAD_PARALLELISM = 4; // Maximum concurrent chunks to upload per file

class ChunkedUpload extends BaseUpload {
    digest: string;
    file: File;
    finished: boolean = false;
    chunks: Chunk[] = [];
    chunkSize: number;
    hashPosition: number = 0;
    id: string;
    numChunksUploaded: number = 0;
    overwrite: boolean;
    position: number = 0;
    sessionId: string;
    sha1Worker: any;
    totalNumChunks: number;
    successCallback: Function;
    errorCallback: Function;
    progressCallback: Function;

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

        const { id, part_size, total_parts } = data;
        this.sessionId = id;
        this.chunkSize = part_size;
        this.totalNumChunks = total_parts;

        this.startChunkedUpload();
    };

    /**
     * Handles a upload session error
     *
     * @private
     * @param {Object} error - Upload error
     * @return {void}
     */
    uploadSessionErrorHandler = (error: any): void => {
        if (this.isDestroyed()) {
            return;
        }

        const { response } = error;
        if (response) {
            // When blocked by CORS due to authentication errors, response.json() fails
            if (response.status === 401 || response.status === 403) {
                this.baseUploadErrorHandler(response, this.createUploadSession.bind(this));
            } else {
                response.json().then((body) => {
                    this.baseUploadErrorHandler(body, this.createUploadSession.bind(this));
                });
            }
        }
    };

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
    createUploadSession({ url, fileId, fileName }: { url?: string, fileId?: string, fileName?: string }): void {
        if (this.isDestroyed()) {
            return;
        }

        // Use provided upload URL if passed in, otherwise construct
        let uploadSessionUrl = url;
        if (!uploadSessionUrl) {
            uploadSessionUrl = this.getUploadSessionUrl();

            if (fileId) {
                uploadSessionUrl = uploadSessionUrl.replace('upload_sessions', `${fileId}/upload_sessions`);
            }
        }

        // Set up post body
        const postData: StringAnyMap = {
            file_size: this.file.size
        };

        if (!fileId) {
            postData.folder_id = this.id;
        }

        if (fileName) {
            postData.file_name = fileName;
        }

        this.xhr
            .post({ url: uploadSessionUrl, data: postData })
            .then(this.uploadSessionSuccessHandler)
            .catch(this.uploadSessionErrorHandler);
    }

    /**
     * Starts upload of file using chunked upload API.
     *
     * @private
     * @return {void}
     */
    startChunkedUpload(): void {
        if (this.isDestroyed()) {
            return;
        }

        for (let i = 0; i < UPLOAD_PARALLELISM; i += 1) {
            this.getNextChunk().then((chunk) => (chunk ? this.uploadChunk(chunk) : this.commitFile())).catch(() => {
                this.errorCallback(new Error('Error fetching next chunk'));
            });
        }
    }

    /**
     * Retrieves next chunk and prepares it for uploading. Resolves with a chunk if there are chunks to process and
     * null if there are no more chunks. Rejects when there is an error reading a chunk as an ArrayBuffer.
     *
     * @private
     * @return {Promise}
     */
    getNextChunk(): Promise<?Chunk> {
        return new Promise((resolve, reject) => {
            if (this.isDestroyed()) {
                reject();
                return;
            }

            if (!this.file || this.position >= this.file.size || !this.sha1Worker) {
                resolve(null);
                return;
            }

            // Save current byte position and then increment for concurrency
            const bytePosition = this.position;
            this.position += this.chunkSize;

            // Generate unique part ID based on session ID & byte position
            const partId = `${this.sessionId}${bytePosition}`;

            // Slice the file as a blob for upload and hashing
            const blobPart: Blob = this.file.slice(bytePosition, bytePosition + this.chunkSize);

            // Send blob to Rusha worker for hashing
            this.sha1Worker.postMessage({ id: partId, data: blobPart });

            // When hashing is complete, generate a chunk for upload
            this.sha1Worker.addEventListener('message', ({ data }) => {
                if (data && data.id === partId) {
                    const chunk = new Chunk(this.options);
                    chunk.setup({
                        sessionId: this.sessionId,
                        part: blobPart,
                        offset: bytePosition,
                        sha1: hexToBase64(data.hash),
                        totalSize: this.file.size,
                        successCallback: this.handleChunkSuccess,
                        errorCallback: this.handleUploadError,
                        progressCallback: (progressEvent) => this.handleChunkProgress(chunk, progressEvent)
                    });

                    resolve(chunk);
                }
            });
        });
    }

    /**
     * Handles upload progress success event for a chunk.
     *
     * @private
     * @return {void}
     */
    handleChunkSuccess = (): void => {
        this.numChunksUploaded += 1;

        this.getNextChunk()
            .then((anotherChunk) => (anotherChunk ? this.uploadChunk(anotherChunk) : this.commitFile()))
            .catch(() => {
                /* eslint-disable no-console */
                console.log('Error fetching next chunk');
                /* eslint-enable no-console */
            });
    };

    /**
     * Handles upload progress event for a chunk.
     *
     * @private
     * @param {Chunk} chunk - Chunk
     * @param {ProgressEvent} event - Progress event
     * @return {void}
     */
    handleChunkProgress = (chunk: Chunk, event: ProgressEvent): void => {
        if (!event.total) {
            return;
        }

        // Update chunk progress
        chunk.setProgress(event.loaded / event.total);

        // Calculate progress across all chunks
        const loaded = this.chunks.reduce((progress, chk) => progress + chk.getProgress(), 0) * 100;

        // Generate an overall progress event and bubble progress up. We don't use ProgressEvent because it is not
        // supported in IE11
        this.progressCallback({
            loaded,
            total: this.totalNumChunks * 100
        });
    };

    /**
     * Start upload for a specified chunk.
     *
     * @private
     * @param {Chunk} chunk - Chunk to upload
     * @return {void}
     */
    uploadChunk(chunk: Chunk): void {
        chunk.upload();
        this.chunks.push(chunk);
    }

    /**
     * Finish chunked upload by commiting.
     *
     * @private
     * @return {void}
     */
    commitFile(): void {
        if (this.finished || this.numChunksUploaded !== this.totalNumChunks) {
            return;
        }

        this.finished = true;

        const postData = {
            parts: this.chunks.map((chunk) => chunk.getPart()).sort((part1, part2) => part1.offset - part2.offset)
        };

        this.getDigest().then((digest) => {
            const headers = {
                Digest: `sha=${digest}`
            };

            this.xhr
                .post({ url: this.getUploadSessionUrl(this.sessionId, 'commit'), data: postData, headers })
                .then(this.handleCommitSuccess)
                .catch(this.handleUploadError);
        });
    }

    /**
     * Handles a successful commit file response.
     *
     * @param {Response} response - Fetch response object
     * @return {void}
     */
    handleCommitSuccess = ({
        entries,
        headers,
        status
    }: {
        entries: BoxItem[],
        headers: Headers,
        status: number
    }): void => {
        // Retry after a delay since server is still processing chunks
        if (status === 202) {
            this.finished = false;
            let retryAfterMs = DEFAULT_RETRY_DELAY_MS;

            if (headers) {
                const retryAfterSec = parseInt(headers.get('Retry-After'), 10);

                if (!isNaN(retryAfterSec)) {
                    retryAfterMs = retryAfterSec * 1000;
                }
            }

            setTimeout(() => this.commitFile(), retryAfterMs);
        } else if (entries) {
            this.successCallback(entries);
        }
    };

    /**
     * Handles an upload error. Cancels the pending upload and executes error callback.
     *
     * @param {Error} error - Error
     * @return {void}
     */
    handleUploadError = (error: Error): void => {
        this.cancel();
        this.errorCallback(error);
    };

    /**
     * Get SHA1 digest of file. This happens asynchronously since it's possible that the digest hasn't been updated
     * with all of the parts yet.
     *
     * @return {Promise<string>} Promise that resolves with digest
     */
    getDigest(): Promise<string> {
        return new Promise((resolve) => {
            if (this.digest) {
                resolve(this.digest);
                return;
            }

            this.sha1Worker.postMessage({ id: this.sessionId, file: this.file });
            this.sha1Worker.addEventListener('message', ({ data }) => {
                if (data && data.id === this.sessionId) {
                    resolve(hexToBase64(data.hash));
                }
            });
        });
    }

    /**
     * Constructs an upload session URL
     *
     * @private
     * @param {string[]} [parts] - String parts to add to the upload URL
     */
    getUploadSessionUrl(...parts: string[]): string {
        let sessionUrl = `${this.uploadHost}/api/2.0/files/upload_sessions`;

        parts.forEach((part) => {
            sessionUrl = `${sessionUrl}/${part}`;
        });

        return sessionUrl;
    }

    /**
     * Uploads a file using chunked upload API. If there is a conflict and overwrite is true,
     * replace the file. Otherwise, re-upload with a different name.
     *
     * @param {Object} options - Upload options
     * @param {string} options.id - Folder id
     * @param {File} options.file - File blob object
     * @param {Function} [options.successCallback] - Function to call with response
     * @param {Function} [options.errorCallback] - Function to call with errors
     * @param {Function} [options.progressCallback] - Function to call with progress
     * @param {boolean} [overwrite] - Should upload overwrite file with same name
     * @return {void}
     */
    upload({
        id,
        file,
        sha1Worker,
        successCallback = noop,
        errorCallback = noop,
        progressCallback = noop,
        overwrite = true
    }: {
        id: string,
        file: File,
        sha1Worker: any,
        successCallback: Function,
        errorCallback: Function,
        progressCallback: Function,
        overwrite: boolean
    }): void {
        if (this.isDestroyed()) {
            return;
        }

        // Save references
        this.id = id;
        this.file = file;
        this.sha1Worker = sha1Worker;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
        this.progressCallback = progressCallback;
        this.overwrite = overwrite;

        this.createUploadSession({
            fileName: this.file.name
        });
    }

    /**
     * Cancels an upload in progress by cancelling all upload chunks.
     * This cannot be undone or resumed.
     *
     * @returns {void}
     */
    cancel(): void {
        if (this.isDestroyed()) {
            return;
        }

        // Cancel individual upload chunks
        this.chunks.forEach((chunk) => {
            chunk.cancel();
        });

        this.chunks = [];

        // Abort upload session
        this.xhr.delete({ url: this.getUploadSessionUrl(this.sessionId) });
        this.destroy();
    }
}

export default ChunkedUpload;
