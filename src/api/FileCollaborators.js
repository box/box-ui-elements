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

    /**
     * Generic success handler
     *
     * @param {Object} data the response data
     */
    successHandler = (data: any): void => {
        if (this.isDestroyed() || typeof this.successCallback !== 'function') {
            return;
        }

        const { entries } = data;
        const collaborators = entries.map((collab) => {
            const { id, name, login } = collab;
            return {
                id,
                name,
                item: { id, name, email: login },
            };
        });

        this.successCallback({ ...data, entries: collaborators });
    };
}

export default FileCollaborators;
