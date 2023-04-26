/**
 * @flow
 * @file Utils for the box APIs
 * @author Box
 */

import type { Comment, UAAActivityTypes, UAAFileActivity } from '../common/types/feed';

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

export const getUAAQueryParams = (fileID: string, activityTypes?: UAAActivityTypes[]) => {
    const baseEndpoint = `/file_activities?file_id=${fileID}`;

    if (!activityTypes || !activityTypes.length) {
        return baseEndpoint;
    }

    return `${baseEndpoint}?activity_types=${activityTypes.join()}`;
};

export const parseUAAResponseForFeed = (data?: UAAFileActivity[]) => {
    if (!data || !data.length) {
        return [];
    }

    const parsedData = [];

    data.forEach(item => {
        if (item.source) {
            parsedData.push(...Object.values(item.source));
        }
    });

    return { entries: parsedData };
};

export default {
    formatComment,
};
