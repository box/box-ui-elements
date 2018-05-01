/**
 * @flow
 * @file Helper for the box comments API
 * @author Box
 */

import OffsetBasedAPI from './OffsetBasedAPI';

class Comments extends OffsetBasedAPI {
    fields = 'created_by,created_at,tagged_message';

    /**
     * API URL for comments
     *
     * @param {string} [id] - a box file id
     * @return {string} base url for files
     */
    getUrl(id: string): string {
        if (!id) {
            throw new Error('Missing file id!');
        }
        return `${this.getBaseApiUrl()}/files/${id}/comments?fields=${this.fields}`;
    }
}

export default Comments;
