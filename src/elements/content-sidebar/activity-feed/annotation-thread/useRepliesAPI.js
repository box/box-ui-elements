// @flow
import uniqueId from 'lodash/uniqueId';
import APIFactory from '../../../../api';
import commonMessages from '../../../common/messages';
import { commentsErrors } from './errors';

import type { BoxItemPermission, User } from '../../../../common/types/core';
import type { BoxCommentPermission, Comment, FeedItemStatus } from '../../../../common/types/feed';
import type { ElementsXhrError } from '../../../../common/types/api';

type Props = {
    annotationId?: string,
    api: APIFactory,
    currentUser: User,
    fileId: string,
    filePermissions: BoxItemPermission,
    handleRemoveReplyItem: (id: string) => void,
    handleUpdateOrCreateReplyItem: (id: string, updatedValues: Object) => void,
};

const useRepliesAPI = ({
    annotationId,
    api,
    currentUser,
    fileId,
    filePermissions,
    handleRemoveReplyItem,
    handleUpdateOrCreateReplyItem,
}: Props) => {
    const setReplyPendingStatus = (replyId: string, pendingStatus: boolean) => {
        handleUpdateOrCreateReplyItem(replyId, { isPending: pendingStatus });
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

        handleUpdateOrCreateReplyItem(pendingReply.id, pendingReply);
    };

    const createReplySuccessCallback = (replyId: string, reply: Comment) => {
        handleUpdateOrCreateReplyItem(replyId, {
            ...reply,
            isPending: false,
        });
    };

    const createReplyErrorCallback = (error: ElementsXhrError, code: string, replyId: string) => {
        handleUpdateOrCreateReplyItem(replyId, {
            error: {
                title: commonMessages.errorOccured,
                message: commentsErrors[code] || commentsErrors.default,
            },
        });
    };

    const handleReplyCreate = (message: string) => {
        if (!annotationId) {
            return;
        }

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

    const handleReplyDelete = ({ id, permissions }: { id: string, permissions: BoxCommentPermission }) => {
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

    const handleReplyEdit = (
        replyId: string,
        message: string,
        status?: FeedItemStatus,
        hasMention?: boolean,
        permissions: BoxCommentPermission,
    ) => {
        setReplyPendingStatus(replyId, true);

        const errorCallbackFn = (error, code) => createReplyErrorCallback(error, code, replyId);
        api.getThreadedCommentsAPI(false).updateComment({
            fileId,
            commentId: replyId,
            message,
            permissions,
            successCallback: updatedReply =>
                handleUpdateOrCreateReplyItem(replyId, { ...updatedReply, isPending: false }),
            errorCallback: errorCallbackFn,
        });
    };

    return { handleReplyDelete, handleReplyEdit, handleReplyCreate };
};

export default useRepliesAPI;
