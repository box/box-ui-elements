// @flow

export type ThreadedCommentStatus = 'open' | 'resolved';

export type ThreadedCommentPermission = {
    can_delete?: boolean,
    can_edit?: boolean,
    can_resolve?: boolean,
};
