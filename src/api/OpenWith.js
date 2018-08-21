/**
 * @flow
 * @file Helper for the open_with_integrations API endpoint
 * @author Box
 */

import Base from './Base';

class OpenWith extends Base {
    /**
     * API URL for Open With
     *
     * @param {string} [id] - a box file id
     * @return {string} base url for files
     */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }

        return `${this.getBaseApiUrl()}/files/${id}/open_with_integrations`;
    }
}

export default OpenWith;
