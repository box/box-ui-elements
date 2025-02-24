import APIFactory from '../../../../api';
import { BoxItemPermission } from '../../../../common/types/core';
import { BoxCommentPermission, Comment } from '../../../../common/types/feed';
import { ElementsXhrError } from '../../../../common/types/api';

interface Props {
    annotationId?: string;
    api: APIFactory;
    errorCallback: (replyId: string, error: ElementsXhrError | Error, code: string) => void;
    fileId: string;
    filePermissions: BoxItemPermission;
}

const useRepliesAPI = ({ annotationId, api, errorCallback, fileId, filePermissions }: Props) => {
    const createReply = ({
        message,
        requestId,
        successCallback,
    }: {
        message: string;
        requestId: string;
        successCallback: (comment: Comment) => void;
    }) => {
        if (!annotationId) {
            return;
        }
        api.getAnnotationsAPI(false).createAnnotationReply(
            fileId,
            annotationId,
            filePermissions,
            message,
            successCallback,
            errorCallback.bind(null, requestId),
        );
    };

    const deleteReply = ({
        id,
        permissions,
        successCallback,
    }: {
        id: string;
        permissions: BoxCommentPermission;
        successCallback: () => void;
    }) => {
        api.getThreadedCommentsAPI(false).deleteComment({
            fileId,
            commentId: id,
            permissions,
            successCallback,
            errorCallback: errorCallback.bind(null, id),
        });
    };

    const editReply = ({
        id,
        message,
        permissions,
        successCallback,
    }: {
        id: string;
        message: string;
        permissions: BoxCommentPermission;
        successCallback: (comment: Comment) => void;
    }) => {
        api.getThreadedCommentsAPI(false).updateComment({
            fileId,
            commentId: id,
            message,
            permissions,
            successCallback,
            errorCallback: errorCallback.bind(null, id),
        });
    };

    return { createReply, deleteReply, editReply };
};

export default useRepliesAPI;
