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
     * Formats the collaborators api response to usable data
     * @param {Object} response the api response data
     * @return {Object} the formatted api response data
     */
    formatResponse(response: Object): Object {
        const { entries } = response;
        const formattedEntries = entries.map((collab) => {
            const { id, name, login } = collab;
            return {
                id,
                name,
                item: { ...collab, email: login }
            };
        });

        return {
            ...response,
            entries: formattedEntries
        };
    }
}

export default FileCollaborators;
