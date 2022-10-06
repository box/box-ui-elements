// @flow
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
    handleAddReplyItem: Comment => void,
    handleRemoveReplyItem: (id: string) => void,
    handleUpdateReplyItem: (updatedValues: Object, id: string) => void,
};

const useRepliesAPI = ({
    annotationId,
    api,
    currentUser,
    fileId,
    filePermissions,
    handleAddReplyItem,
    handleRemoveReplyItem,
    handleUpdateReplyItem,
}: Props) => {
    const setReplyPendingStatus = (replyId: string, pendingStatus: boolean) => {
        handleUpdateReplyItem({ isPending: pendingStatus }, replyId);
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

        handleAddReplyItem(pendingReply);
    };

    const createReplySuccessCallback = (replyId: string, reply: Comment) => {
        handleUpdateReplyItem(
            {
                ...reply,
                isPending: false,
            },
            replyId,
        );
    };

    const createReplyErrorCallback = (error: ElementsXhrError, code: string, replyId: string) => {
        handleUpdateReplyItem(
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
            successCallback: () => handleRemoveReplyItem(id),
            errorCallback: errorCallbackFn,
        });
    };

    const handleEditReply = (
        replyId: string,
        message: string,
        status?: FeedItemStatus,
        permissions: BoxCommentPermission,
    ) => {
        setReplyPendingStatus(replyId, true);

        const errorCallbackFn = (error, code) => createReplyErrorCallback(error, code, replyId);
        api.getThreadedCommentsAPI(false).updateComment({
            fileId,
            commentId: replyId,
            message,
            permissions,
            successCallback: updatedReply => handleUpdateReplyItem({ ...updatedReply, isPending: false }, replyId),
            errorCallback: errorCallbackFn,
        });
    };

    return { handleDeleteReply, handleEditReply, handleCreateReply };
};

export default useRepliesAPI;
