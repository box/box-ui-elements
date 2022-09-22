/**
 * @flow
 * @file Utils for the box APIs
 * @author Box
 */

import type { Comment } from '../common/types/feed';

/**
 * Formats comment data (including replies) for use in components.
 *
 * @param {Comment} comment - An individual comment entry from the API
 * @return {Comment} Updated comment
 */
export const formatComment = (comment: Comment): Comment => {
    const formattedComment = {
        ...comment,
        tagged_message: comment.message,
    };

    if (comment.replies && comment.replies.length) {
        formattedComment.replies = comment.replies.map(formatComment);
    }

    return formattedComment;
};

export default {
    formatComment,
};
