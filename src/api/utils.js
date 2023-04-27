/**
 * @flow
 * @file Utils for the box APIs
 * @author Box
 */

import type { Comment, UAAActivityTypes, UAAFileActivity } from '../common/types/feed';
import { UAA_ACTIVITY_TYPE_TASK } from '../constants';

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

export const getUAAQueryParams = (fileID: string, activityTypes?: UAAActivityTypes[], enableReplies?: boolean) => {
    const baseEndpoint = `/file_activities?file_id=${fileID}`;
    const hasFilteredActivityTypes = !!activityTypes && !!activityTypes.length;

    return `${baseEndpoint}${hasFilteredActivityTypes ? `&activity_types=${activityTypes.join()}` : ''}${
        enableReplies ? '&enable_replies=true&reply_limit=1' : ''
    }`;
};

export const parseFileActivitiesResponseForFeed = (data?: UAAFileActivity[]) => {
    if (!data || !data.length) {
        return [];
    }

    const parsedData = [];

    data.forEach(item => {
        if (item.source) {
            // UAA follows a lowercased enum naming convention, convert to uppercase to align with task api
            const taskItem = item.source[UAA_ACTIVITY_TYPE_TASK];
            if (taskItem) {
                if (!!taskItem.assigned_to && !!taskItem.assigned_to.entries) {
                    taskItem.assigned_to.entries.forEach(entry => {
                        entry.role = entry.role.toUpperCase();
                        entry.status = entry.status.toUpperCase();
                    });
                }
                if (taskItem.completion_rule) {
                    taskItem.completion_rule = taskItem.completion_rule.toUpperCase();
                }
                if (taskItem.status) {
                    taskItem.status = taskItem.status.toUpperCase();
                }
                if (taskItem.task_type) {
                    taskItem.task_type = taskItem.task_type.toUpperCase();
                }
            }

            parsedData.push(...Object.values(item.source));
        }
    });

    return { entries: parsedData };
};

export default {
    formatComment,
};
