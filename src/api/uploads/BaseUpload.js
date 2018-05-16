/**
 * @flow
 * @file Base helper for the Box Upload APIs
 * @author Box
 */

import Base from '../Base';

class BaseUpload extends Base {
    /**
     * Sends an upload pre-flight request. If a file ID is supplied,
     * send a pre-flight request to that file version.
     *
     * @private
     * @param {Object} options
     * @param {string} [options.fileId] - Untyped file id (e.g. no "file_" prefix)
     * @param {File} options.file
     * @param {string} options.folderId - Untyped folder id (e.g. no "folder_" prefix)
     * @param {Function} options.fileName
     * @param {Function} options.successHandler
     * @param {Function} options.errorHandler
     * @return {void}
     */
    makePreflightRequest({ fileId, file, folderId, fileName, successHandler, errorHandler }): void {
        if (this.isDestroyed()) {
            return;
        }

        let url = `${this.getBaseApiUrl()}/files/content`;
        if (fileId) {
            url = url.replace('content', `${fileId}/content`);
        }

        const { size, name } = file;
        const attributes = {
            name: fileName || name,
            parent: { id: folderId },
            size
        };

        this.xhr.options({
            url,
            data: attributes,
            successHandler,
            errorHandler
        });
    }
}

export default BaseUpload;
