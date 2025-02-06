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
import type APICache from 'utils/Cache';

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

    async getCollaborationsRole(file) {
        const cache: APICache = this.getCache();
        const key: string = `getFileCollaborationsRole_${file.id}`;
        const isCached: boolean = cache.has(key);
        const cachedData = cache.get(key);

        const { getCollaborationsRole: handler } = window.__shared_methods || {};

        if (handler) {
            const role = isCached ? cachedData : await handler(file);

            cache.set(key, role);
            return {
                file_id: file.id,
                role: role,
            };
        }

        return {
            file_id: file.id,
            role: null,
        };
    }
}

export default FileCollaborations;
