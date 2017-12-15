/**
 * @flow
 * @file Base helper for the Box Upload APIs
 * @author Box
 */

import Base from '../Base';

class BaseUpload extends Base {
    fileName: string;
    fileId: ?string;
    overwrite: boolean;

    /**
     * Resolves upload conflict by overwriting or renaming
     * 
     * @param {Object} response
     * @return {Promise}
     */
    resolveConflict = async (response: Object): Promise<> => {
        if (this.overwrite && response.context_info) {
            this.fileId = response.context_info.conflicts.id;
            return;
        }

        const extension = this.fileName.substr(this.fileName.lastIndexOf('.')) || '';
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

export default BaseUpload;
