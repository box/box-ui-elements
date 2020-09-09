/**
 * @flow
 * @file Helper for the Box Folder Collaborations API
 * @author Box
 */

import ItemCollaborations from './ItemCollaborations';

class FolderCollaborations extends ItemCollaborations {
    /**
     * API URL for retrieving folder collaborations
     *
     * @param {string} id - Box folder ID
     * @return {string} Base URL for folders
     */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing folder ID!');
        }

        return `${this.getBaseApiUrl()}/folders/${id}/collaborations`;
    }
}

export default FolderCollaborations;
