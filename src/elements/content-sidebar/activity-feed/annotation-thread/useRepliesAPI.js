// @flow
import uniqueId from 'lodash/uniqueId';
import APIFactory from '../../../../api';
import commonMessages from '../../../common/messages';
import { commentsErrors } from './errors';

import type { BoxItemPermission, User } from '../../../../common/types/core';
import type { BoxCommentPermission, Comment, FeedItemStatus } from '../../../../common/types/feed';
import type { ElementsXhrError } from '../../../../common/types/api';

type setRepliesCallback = (prevReplies: { [string]: Comment }) => { [string]: Comment };

type Props = {
    annotationId: string,
    api: APIFactory,
    currentUser: User,
    fileId: string,
    filePermissions: BoxItemPermission,
    setReplies: (setRepliesCallback: setRepliesCallback | { [string]: Comment }) => void,
};

const useRepliesAPI = ({ annotationId, api, currentUser, fileId, filePermissions, setReplies }: Props) => {
    const updateReplyItem = (updatedReplyValues: Object, replyId: string) => {
        setReplies(prevReplies => ({
            ...prevReplies,
            [replyId]: {
                ...prevReplies[replyId],
                ...updatedReplyValues,
            },
        }));
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

        setReplies(prevReplies => ({
            ...prevReplies,
            [pendingReply.id]: pendingReply,
        }));
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
        setReplies(prevReplies => {
            const newReplies = { ...prevReplies };
            delete newReplies[replyId];
            return newReplies;
        });
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

    return { handleDeleteReply, handleEditReply, handleCreateReply };
};

export default useRepliesAPI;
