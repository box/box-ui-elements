/**
 * @flow
 * @file Helper for the Box Folder Collaborations API
 * @author Box
 */

import ItemCollaborations from './ItemCollaborations';
import type APICache from 'utils/Cache';

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

    async getCollaborationsRole(item) {
        const cache: APICache = this.getCache();
        const key: string = `getFolderCollaborationsRole_${item.id}`;
        const isCached: boolean = cache.has(key);
        const cachedData = cache.get(key);

        const { getFolderCollaborationRole: handler } = window.__shared_methods || {};

        if (handler) {
            const role = isCached ? cachedData : await handler(item);

            cache.set(key, role);

            return role;
        }

        return null;
    }
}

export default FolderCollaborations;
