import Base from 'api/Base';
import { getTypedFileId } from 'utils/file';

class FolderListItems extends Base {
    /**
     * API URL for files
     *
     * @param {string} [id] - Optional file id
     * @return {string} base url for files
     */
    getUrl(id: string): string {
        return `${this.getBaseApiUrl()}/folders/${id}/items`;
    }

    /**
     * Requests all of a user's collection objects.
     *
     * @returns {Promise<Object>} A promise resolving to the collection of collections
     */
    async getAll(id: string) {
        const { data } = await this.xhr.get({
            url: this.getUrl(id),
            id: getTypedFileId(0),
            params: {
              fields: `lock,collections,accessible_by,version_number,permissions`,
          }
        });

        return data;
    }

    async getAllEntries(id: string) {
        const { entries } = await this.getAll(id);

        if (!entries) {
            return null;
        }

        return entries;
    }
}

export default FolderListItems;
