import Base from 'api/Base';
import { getTypedFileId } from 'utils/file';

class Collections extends Base {
    /**
     * API URL for files
     *
     * @param {string} [id] - Optional file id
     * @return {string} base url for files
     */
    getUrl(id: string): string {
        return `${this.getBaseApiUrl()}/collections`;
    }

    /**
     * Requests all of a user's collection objects.
     *
     * @returns {Promise<Object>} A promise resolving to the collection of collections
     */
    async getAll() {
        const { data } = await this.xhr.get({
            url: this.getUrl(),
            id: getTypedFileId(0),
        });

        return data;
    }

    async getFavoriteCollection() {
        const { entries } = await this.getAll();

        if (!entries) {
            return null;
        }

        return entries.find(collection => collection.collection_type === 'favorites');
    }

    async getFavoriteCollectionItems(collectionId) {
        const { data } = await this.xhr.get({
            url: `${this.getBaseApiUrl()}/collections/${collectionId}/items`,
        });

        return data;
    }
}

export default Collections;
