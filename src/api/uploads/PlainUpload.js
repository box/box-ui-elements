/**
 * @flow
 * @file Helper for the plain Box Upload API
 * @author Box
 */

import noop from 'lodash/noop';
import { digest } from '../../utils/webcrypto';
import { getFileLastModifiedAsISONoMSIfPossible } from '../../utils/uploads';
import BaseUpload from './BaseUpload';
import type { BoxItem } from '../../common/types/core';

const CONTENT_MD5_HEADER = 'Content-MD5';

class PlainUpload extends BaseUpload {
    successCallback: Function;

    progressCallback: Function;

    /**
     * Handles an upload success response
     *
     * @param {Object} data - Upload success data
     * @return {void}
     */
    uploadSuccessHandler = ({ data }: Object): void => {
        const { entries }: { entries: BoxItem[] } = data;
        if (this.isDestroyed()) {
            return;
        }

        if (typeof this.successCallback === 'function') {
            // Response entries are the successfully created Box File objects
            this.successCallback(entries);
        }
    };

    /**
     * Handles an upload progress event
     *
     * @param {Object} event - Progress event
     * @return {void}
     */
    uploadProgressHandler = (event: ProgressEvent): void => {
        if (this.isDestroyed()) {
            return;
        }

        if (typeof this.progressCallback === 'function') {
            this.progressCallback(event);
        }
    };

    /**
     * Uploads a file. If a file ID is supplied, use the Upload File
     * Version API to replace the file.
     *
     * @param {Object} - Request options
     * @param {boolean} [options.url] - Upload URL to use
     * @return {Promise} Async function promise
     */
    preflightSuccessHandler = async ({ data }: { data: { upload_url?: string } }): Promise<any> => {
        if (this.isDestroyed()) {
            return;
        }

        // Use provided upload URL if passed in, otherwise construct
        let uploadUrl = data.upload_url;
        if (!uploadUrl) {
            uploadUrl = `${this.getBaseUploadUrl()}/files/content`;

            if (this.fileId) {
                uploadUrl = uploadUrl.replace('content', `${this.fileId}/content`);
            }
        }

        const attributes = JSON.stringify({
            name: this.fileName,
            parent: { id: this.folderId },
            description: this.fileDescription,
            content_modified_at: getFileLastModifiedAsISONoMSIfPossible(this.file),
        });

        const options = {
            url: uploadUrl,
            data: {
                attributes,
                file: this.file,
            },
            headers: {},
            successHandler: this.uploadSuccessHandler,
            errorHandler: this.preflightErrorHandler,
            progressHandler: this.uploadProgressHandler,
        };

        // Calculate SHA1 for file consistency check
        const sha1 = await this.computeSHA1(this.file);
        if (sha1) {
            options.headers = {
                [CONTENT_MD5_HEADER]: sha1,
            };
        }

        this.xhr.uploadFile(options);
    };

    /**
     * Uploads a file. If there is a conflict and overwrite is true, replace the file.
     * Otherwise, re-upload with a different name.
     *
     * @param {Object} options - Upload options
     * @param {string} options.folderId - untyped folder id
     * @param {string} [options.fileId] - Untyped file id (e.g. no "file_" prefix)
     * @param {File} options.file - File blob object
     * @param {Function} [options.successCallback] - Function to call with response
     * @param {Function} [options.errorCallback] - Function to call with errors
     * @param {Function} [options.progressCallback] - Function to call with progress
     * @param {Function} [options.conflictCallback] - Function to call on conflicting file names
     * @param {boolean|'error'} [overwrite] - Should upload overwrite file with same name, throw error, or call conflictCallback to rename
     * @return {void}
     */
    upload({
        folderId,
        fileId,
        file,
        fileDescription,
        successCallback = noop,
        errorCallback = noop,
        progressCallback = noop,
        conflictCallback,
        // $FlowFixMe
        overwrite = true,
    }: {
        conflictCallback?: Function,
        errorCallback: Function,
        file: File,
        fileDescription: ?string,
        fileId: ?string,
        folderId: string,
        overwrite: boolean | 'error',
        progressCallback: Function,
        successCallback: Function,
    }): void {
        if (this.isDestroyed()) {
            return;
        }

        // Save references
        this.folderId = folderId;
        this.fileId = fileId;
        this.file = file;
        this.fileDescription = fileDescription;
        this.fileName = this.file.name;
        this.successCallback = successCallback;
        this.errorCallback = errorCallback;
        this.progressCallback = progressCallback;
        this.overwrite = overwrite;
        this.conflictCallback = conflictCallback;

        this.makePreflightRequest();
    }

    /**
     * Cancels upload of a file.
     *
     * @return {void}
     */
    cancel() {
        if (this.isDestroyed()) {
            return;
        }

        clearTimeout(this.retryTimeout);
        this.destroy();
    }

    /**
     * Calculates SHA1 of a file
     *
     * @param {File} file
     * @return {Promise} Promise that resolves with SHA1 digest
     */
    async computeSHA1(file: File): Promise<any> {
        let sha1 = '';

        try {
            // Adapted from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
            const reader = new window.FileReader();
            const { buffer } = await this.readFile(reader, file);
            const hashBuffer: ArrayBuffer = await digest('SHA-1', buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            sha1 = hashArray.map(b => `00${b.toString(16)}`.slice(-2)).join('');
        } catch (e) {
            // Return empty sha1 if hashing fails
        }

        return sha1;
    }
}

export default PlainUpload;
