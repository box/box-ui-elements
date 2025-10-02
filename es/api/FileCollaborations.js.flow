/**
 * @flow
 * @file Helper for the Box File Collaborations API
 * @author Box
 *
 * This API is different from the File *Collaborators* API, which is referenced in ./FileCollaborators
 * and used in the ContentSidebar UI Element.
 *
 * While the two APIs have very similar names and purposes, they return collaborated user data in
 * significantly different formats. The data format for the File *Collaborations* API is documented here:
 * https://developer.box.com/reference/get-files-id-collaborations.
 */

import ItemCollaborations from './ItemCollaborations';

class FileCollaborations extends ItemCollaborations {
    /**
     * API URL for retrieving file collaborations
     *
     * @param {string} id - Box file ID
     * @return {string} Base URL for files
     */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing file ID!');
        }

        return `${this.getBaseApiUrl()}/files/${id}/collaborations`;
    }
}

export default FileCollaborations;
