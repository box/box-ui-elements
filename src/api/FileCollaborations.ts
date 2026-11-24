import ItemCollaborations from './ItemCollaborations';

/**
 * Helper for the Box File Collaborations API.
 *
 * This API is different from the File *Collaborators* API, which is referenced in ./FileCollaborators
 * and used in the ContentSidebar UI Element.
 *
 * While the two APIs have very similar names and purposes, they return collaborated user data in
 * significantly different formats. The data format for the File *Collaborations* API is documented here:
 * https://developer.box.com/reference/get-files-id-collaborations.
 */
class FileCollaborations extends ItemCollaborations {
    /** API URL for retrieving collaborations on the Box file `id`; throws when `id` is missing. */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing file ID!');
        }

        return `${this.getBaseApiUrl()}/files/${id}/collaborations`;
    }
}

export default FileCollaborations;
