// @flow
import React from 'react';
import uniqueId from 'lodash/uniqueId';
import APIFactory from '../../../../api';
import commonMessages from '../../../common/messages';
import { commentsErrors } from './errors';

import type { BoxItemPermission, User } from '../../../../common/types/core';
import type { BoxCommentPermission, Comment, FeedItemStatus } from '../../../../common/types/feed';
import type { ElementsXhrError } from '../../../../common/types/api';

type Props = {
    annotationId: string,
    api: APIFactory,
    currentUser: User,
    fileId: string,
    filePermissions: BoxItemPermission,
    initialReplies?: Array<Comment>,
};
const useRepliesAPI = ({ annotationId, api, initialReplies, currentUser, fileId, filePermissions }: Props) => {
    const transformArrayToMap = (replies: Array<Comment>): Map<string, Comment> => {
        return new Map(replies.map(reply => [reply.id, reply]));
    };

    const transformMapToArray = (repliesMap: Map<string, Comment>): Array<Comment> => {
        return Array.from<Comment>(repliesMap.values());
    };

    const [replies, setReplies] = React.useState<Map<string, Comment>>(transformArrayToMap(initialReplies || []));

    React.useEffect(() => {
        if (initialReplies) {
            setReplies(transformArrayToMap(initialReplies));
        }
    }, [initialReplies]);

    const updateReplyItem = (updatedReplyValues: Object, replyId: string) => {
        if (!replies) {
            return;
        }

        setReplies(
            new Map(
                replies.set(replyId, {
                    ...replies.get(replyId),
                    ...updatedReplyValues,
                }),
            ),
        );
    };

    const setReplyPendingStatus = (replyId: string, pendingStatus: boolean) => {
        updateReplyItem({ isPending: pendingStatus }, replyId);
    };

    const addNewPendingReply = (baseReply: Object) => {
        const date = new Date().toISOString();
        const pendingReply: Comment = {
            created_at: date,
            created_by: currentUser,
            modified_at: date,
            isPending: true,
            ...baseReply,
        };

        setReplies(new Map([...replies, [pendingReply.id, pendingReply]]));
    };

    const createReplySuccessCallback = (replyId: string, reply: Comment) => {
        updateReplyItem(
            {
                ...reply,
                isPending: false,
            },
            replyId,
        );
    };

    const removeReplyItem = (replyId: string) => {
        replies.delete(replyId);
        setReplies(new Map(replies));
    };

    const createReplyErrorCallback = (error: ElementsXhrError, code: string, replyId: string) => {
        updateReplyItem(
            {
                error: {
                    title: commonMessages.errorOccured,
                    message: commentsErrors[code] || commentsErrors.default,
                },
            },
            replyId,
        );
    };

    const handleCreateReply = (message: string) => {
        const uuid = uniqueId('reply_');
        const replyData = {
            id: uuid,
            tagged_message: message,
            type: 'comment',
        };
        addNewPendingReply(replyData);

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

    return { replies: transformMapToArray(replies), handleDeleteReply, handleEditReply, handleCreateReply };
};

export default useRepliesAPI;
