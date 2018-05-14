/**
 * @flow
 * @file Helper for the box comments API
 * @author Box
 */

import OffsetBasedAPI from './OffsetBasedAPI';
import type { BoxComment } from '../flowTypes';

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
     * @param {Object} data the api response data
     */
    successHandler = (data: any): void => {
        const comments = data.entries.map((comment: BoxComment) => ({
            id: comment.id,
            type: comment.type,
            isReplyComment: comment.is_reply_comment,
            taggedMessage: comment.tagged_message,
            createdAt: comment.created_at,
            createdBy: comment.created_by,
            modifiedAt: comment.modified_at
        }));

        this.successCallback({
            ...data,
            entries: comments
        });
    };
}

export default Comments;
