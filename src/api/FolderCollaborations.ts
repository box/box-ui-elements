import ItemCollaborations from './ItemCollaborations';

/** Helper for the Box Folder Collaborations API. */
class FolderCollaborations extends ItemCollaborations {
    /** API URL for retrieving collaborations on the Box folder `id`; throws when `id` is missing. */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing folder ID!');
        }

        return `${this.getBaseApiUrl()}/folders/${id}/collaborations`;
    }
}

export default FolderCollaborations;
