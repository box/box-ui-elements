/**
 * @flow
 * @file Helper for the box comments API
 * @author Box
 */

import OffsetBasedAPI from './OffsetBasedAPI';
import type { Comment } from '../flowTypes';

class Comments extends OffsetBasedAPI {
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
        return `${this.getBaseApiUrl()}/files/${id}/comments`;
    }
}

export default Comments;
