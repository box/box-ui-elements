// @flow
import React from 'react';
import uniqueId from 'lodash/uniqueId';
import APIFactory from '../../../../api';
import commonMessages from '../../../common/messages';
import { repliesErrors } from './errors';

import type { BoxItemPermission, User } from '../../../../common/types/core';
import type { BoxCommentPermission, Comment, FeedItemStatus } from '../../../../common/types/feed';
import type { ElementsXhrError } from '../../../../common/types/api';

type Props = {
    annotationId: string,
    api: APIFactory,
    currentUser: User,
    fileId: string,
    filePermissions: BoxItemPermission,
    initialReplies: Array<Comment>,
};
const useReplies = ({ annotationId, api, initialReplies = [], currentUser, fileId, filePermissions }: Props) => {
    const [replies: Array<Comment>, setReplies] = React.useState(initialReplies);

    React.useEffect(() => {
        setReplies(initialReplies);
    }, [initialReplies]);

    const updateReplyItem = (updatedReplyValues: Object, replyId: string) => {
        if (!replies) {
            return;
        }
        const updatedReplies: Array<Comment> = replies.map(reply => {
            if (reply.id === replyId) {
                return {
                    ...reply,
                    ...updatedReplyValues,
                };
            }
            return reply;
        });

        setReplies(updatedReplies);
    };

    const setReplyPendingStatus = (replyId: string, pendingStatus: boolean) => {
        updateReplyItem({ isPending: pendingStatus }, replyId);
    };

    const addNewPendingReply = (baseComment: Object) => {
        const date = new Date().toISOString();
        const pendingReply: Comment = {
            created_at: date,
            created_by: currentUser,
            modified_at: date,
            isPending: true,
            ...baseComment,
        };

        setReplies([...replies, pendingReply]);
    };

    const createReplySuccessCallback = (replyId: string, comment: Comment) => {
        updateReplyItem(
            {
                ...comment,
                isPending: false,
            },
            replyId,
        );
    };

    const removeReplyItem = (replyId: string) => {
        const updatedReplies: Array<Comment> = replies.filter((reply: Comment) => reply.id !== replyId);

        setReplies(updatedReplies);
    };

    const createReplyErrorCallback = (error: ElementsXhrError, code: string, replyId: string) => {
        updateReplyItem(
            {
                error: {
                    title: commonMessages.errorOccured,
                    message: repliesErrors[code] || repliesErrors.default,
                },
            },
            replyId,
        );
    };

    const handleCreateReply = (message: string) => {
        const uuid = uniqueId('comment_');
        const commentData = {
            id: uuid,
            tagged_message: message,
            type: 'comment',
        };
        addNewPendingReply(commentData);

        const successCallback = (reply: Comment) => createReplySuccessCallback(uuid, reply);
        const errorCallbackFn = (error, code) => createReplyErrorCallback(error, code, uuid);

        api.getAnnotationsAPI(false).createAnnotationReply(
            fileId,
            annotationId,
            filePermissions,
            message,
            successCallback,
            errorCallbackFn,
        );
    };

    const handleDeleteReply = ({ id, permissions }: { id: string, permissions: BoxCommentPermission }) => {
        setReplyPendingStatus(id, true);
        const errorCallbackFn = (error, code) => createReplyErrorCallback(error, code, id);

        api.getThreadedCommentsAPI(false).deleteComment({
            fileId,
            commentId: id,
            permissions,
            successCallback: () => removeReplyItem(id),
            errorCallback: errorCallbackFn,
        });
    };

    const handleEditReply = (
        replyId: string,
        message: string,
        status?: FeedItemStatus,
        hasMention: boolean,
        permissions: BoxCommentPermission,
    ) => {
        setReplyPendingStatus(replyId, true);

        const errorCallbackFn = (error, code) => createReplyErrorCallback(error, code, replyId);
        api.getThreadedCommentsAPI(false).updateComment({
            fileId,
            commentId: replyId,
            message,
            permissions,
            successCallback: updatedReply => updateReplyItem({ ...updatedReply, isPending: false }, replyId),
            errorCallback: errorCallbackFn,
        });
    };

    return { replies, handleDeleteReply, handleEditReply, handleCreateReply };
};

export default useReplies;
