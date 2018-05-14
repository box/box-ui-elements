/**
 * @flow
 * @file Helper for the box comments API
 * @author Box
 */

import OffsetBasedAPI from './OffsetBasedAPI';
import type { Comment, BoxComment } from '../flowTypes';

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

    /**
     * Formats the comments api response to usable data
     * @param {Object} response the api response data
     * @return {Object} the formatted api response data
     */
    formatResponse(response: Object): Object {
        const formattedEntries = response.entries.map((comment: BoxComment): Array<Comment> => ({
            type: comment.type,
            id: comment.id,
            isReplyComment: comment.is_reply_comment,
            taggedMessage: comment.tagged_message,
            createdAt: comment.created_at,
            createdBy: comment.created_by,
            modifiedAt: comment.modified_at
        }));

        return {
            ...response,
            entries: formattedEntries
        };
    }
}

export default Comments;
