/**
 * @flow
 * @file Helper for the Box Folder Collaborations API
 * @author Box
 */

import ItemCollaborations from './ItemCollaborations';

class FolderCollaborations extends ItemCollaborations {
    /**
     * API URL for comments
     *
     * @param {string} [id] - a Box folder id
     * @return {string} base url for folders
     */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing folder id!');
        }

        return `${this.getBaseApiUrl()}/folders/${id}/collaborations`;
    }
}

export default FolderCollaborations;
