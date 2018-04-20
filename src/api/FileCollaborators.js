/**
 * @flow
 * @file Helper for the box collaborators API
 * @author Box
 */

import MarkerBasedAPI from './MarkerBasedAPI';

class FileCollaborators extends MarkerBasedAPI {
    /**
     * API URL for comments
     *
     * @param {string} [id] - a box file id
     * @return {string} base url for files
     */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }
        return `${this.getBaseApiUrl()}/files/${id}/collaborators`;
    }
}

export default FileCollaborators;
