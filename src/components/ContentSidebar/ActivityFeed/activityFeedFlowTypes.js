/**
 * @flow
 * @file Flow types for Activity Feed
 * @author Box
 */

export type CommentHandlers = {
    create?: Function,
    delete?: Function
};

export type TaskHandlers = {
    create?: Function,
    delete?: Function,
    edit?: Function,
    onTaskAssignmentUpdate?: Function
};

export type ContactHandlers = {
    getApproverWithQuery?: Function,
    getMentionWithQuery?: Function
};

export type VersionHandlers = {
    info?: Function
};

export type FeedItems = Array<Comment | Task | BoxItemVersion>;
