import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import { EventEmitter } from 'events';
import commonMessages from '../../../common/messages';
import { annotationErrors, commentsErrors } from './errors';
import API from '../../../../api/APIFactory';
import useRepliesAPI from './useRepliesAPI';
import { useAnnotatorEvents } from '../../../common/annotator-context';
import useAnnotationAPI from './useAnnotationAPI';
import { Annotation, AnnotationPermission, NewAnnotation, Target } from '../../../../common/types/annotations';
import { BoxItem, User } from '../../../../common/types/core';
import { BoxCommentPermission, Comment, FeedItemStatus } from '../../../../common/types/feed';
import { ElementOrigin, ElementsXhrError } from '../../../../common/types/api';
import { AnnotationThreadError } from './types';
import { OnAnnotationEdit, OnAnnotationStatusChange } from '../comment/types';

const normalizeReplies = (repliesArray?: Array<Comment>): { [key: string]: Comment } => {
    if (!repliesArray) {
        return {};
    }
    return repliesArray.reduce((prevValues, reply) => {
        return {
            ...prevValues,
            [reply.id]: reply,
        };
    }, {});
};

const denormalizeReplies = (repliesMap: { [key: string]: Comment }): Array<Comment> => {
    return Object.keys(repliesMap).map(key => repliesMap[key]);
};

interface Props {
    annotationId?: string;
    api: API;
    currentUser: User;
    errorCallback: (
        error: ElementsXhrError | Error,
        code: string,
        contextInfo?: Record<string, unknown>,
        origin?: ElementOrigin,
    ) => void;
    eventEmitter: EventEmitter;
    file: BoxItem;
    onAnnotationCreate: (annotation: Annotation) => void;
    target: Target;
}

interface UseAnnotationThread {
    annotation?: Annotation;
    annotationActions: {
        handleAnnotationCreate: (text: string) => void;
        handleAnnotationDelete: (params: { id: string; permissions: AnnotationPermission }) => void;
        handleAnnotationEdit: OnAnnotationEdit;
        handleAnnotationStatusChange: OnAnnotationStatusChange;
    };
    error?: AnnotationThreadError;
    isLoading: boolean;
    replies: Array<Comment>;
    repliesActions: {
        handleReplyCreate: (message: string) => void;
        handleReplyDelete: (params: { id: string; permissions: BoxCommentPermission }) => void;
        handleReplyEdit: (params: {
            id: string;
            text: string;
            permissions: BoxCommentPermission;
            status?: FeedItemStatus;
            hasMention?: boolean;
            onSuccess?: Function;
            onError?: Function;
        }) => void;
    };
}

const useAnnotationThread = ({
    annotationId,
    api,
    currentUser,
    errorCallback,
    eventEmitter,
    file,
    onAnnotationCreate,
    target,
}: Props): UseAnnotationThread => {
    const [annotation, setAnnotation] = React.useState<Annotation | undefined>();
    const [replies, setReplies] = React.useState<{ [key: string]: Comment }>({});
    const [error, setError] = React.useState<AnnotationThreadError | undefined>();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { file_version = {}, id: fileId, permissions: filePermissions = {} } = file;
    const fileVersionId = file_version.id;

    const updateOrCreateReplyItem = (replyId: string, updatedReplyValues: Partial<Comment>) => {
        setReplies(prevReplies => ({
            ...prevReplies,
            [replyId]: {
                ...prevReplies[replyId],
                ...updatedReplyValues,
            },
        }));
    };

    const removeReplyItem = (replyId: string) => {
        setReplies(prevReplies => {
            const newReplies = { ...prevReplies };
            delete newReplies[replyId];
            return newReplies;
        });
    };

    const addPendingReply = (baseReply: Partial<Comment>, requestId: string) => {
        const date = new Date().toISOString();
        const pendingReply: Comment = {
            created_at: date,
            created_by: currentUser,
            id: requestId,
            isPending: true,
            modified_at: date,
            ...baseReply,
        };
        updateOrCreateReplyItem(requestId, pendingReply);
    };

    const isCurrentAnnotation = (id: string) => annotationId === id;

    const handleAnnotationUpdateStartEvent = (updatedAnnotation: Annotation) => {
        if (!isCurrentAnnotation(updatedAnnotation.id) || !annotation) {
            return;
        }
        setAnnotation(prevAnnotation => ({ ...prevAnnotation, ...updatedAnnotation, isPending: true }));
    };

    const handleAnnotationUpdateEndEvent = (updatedAnnotation: Annotation) => {
        if (!isCurrentAnnotation(updatedAnnotation.id) || !annotation) {
            return;
        }
        setAnnotation(prevAnnotation => ({ ...prevAnnotation, ...updatedAnnotation, isPending: false }));
    };

    const handleAnnotationDeleteStartEvent = (originAnnotationId: string) => {
        if (!isCurrentAnnotation(originAnnotationId) || !annotation) {
            return;
        }
        setAnnotation(prevAnnotation => ({ ...prevAnnotation, isPending: true }));
    };

    const handleAnnotationReplyAddStartEvent = ({
        annotationId: originAnnotationId,
        reply,
        requestId,
    }: {
        annotationId: string;
        reply: Partial<Comment>;
        requestId: string;
    }) => {
        if (!isCurrentAnnotation(originAnnotationId)) {
            return;
        }
        addPendingReply(reply, requestId);
    };

    const handleAnnotationReplyAddEndEvent = ({
        annotationId: originAnnotationId,
        reply,
        requestId,
    }: {
        annotationId: string;
        reply: Comment;
        requestId: string;
    }) => {
        if (!isCurrentAnnotation(originAnnotationId)) {
            return;
        }
        updateOrCreateReplyItem(requestId, { ...reply, isPending: false });
    };

    const handleAnnotationReplyUpdateStart = ({
        annotationId: originAnnotationId,
        reply,
    }: {
        annotationId: string;
        reply: Comment;
    }) => {
        if (!isCurrentAnnotation(originAnnotationId)) {
            return;
        }
        updateOrCreateReplyItem(reply.id, { ...reply, isPending: true });
    };

    const handleAnnotationReplyUpdateEnd = ({
        annotationId: originAnnotationId,
        reply,
    }: {
        annotationId: string;
        reply: Comment;
    }) => {
        if (!isCurrentAnnotation(originAnnotationId)) {
            return;
        }
        updateOrCreateReplyItem(reply.id, { ...reply, isPending: false });
    };

    const handleAnnotationReplyDeleteStart = ({ annotationId: originAnnotationId, id: replyId }) => {
        if (!isCurrentAnnotation(originAnnotationId)) {
            return;
        }
        updateOrCreateReplyItem(replyId, { isPending: true });
    };

    const handleAnnotationReplyDeleteEnd = ({ annotationId: originAnnotationId, id: replyId }) => {
        if (!isCurrentAnnotation(originAnnotationId)) {
            return;
        }
        removeReplyItem(replyId);
    };

    const {
        emitAddAnnotationEndEvent,
        emitAddAnnotationReplyEndEvent,
        emitAddAnnotationReplyStartEvent,
        emitAddAnnotationStartEvent,
        emitAnnotationActiveChangeEvent,
        emitDeleteAnnotationEndEvent,
        emitDeleteAnnotationReplyEndEvent,
        emitDeleteAnnotationReplyStartEvent,
        emitDeleteAnnotationStartEvent,
        emitUpdateAnnotationEndEvent,
        emitUpdateAnnotationReplyEndEvent,
        emitUpdateAnnotationReplyStartEvent,
        emitUpdateAnnotationStartEvent,
    } = useAnnotatorEvents({
        eventEmitter,
        onAnnotationDeleteStart: handleAnnotationDeleteStartEvent,
        onAnnotationReplyAddEnd: handleAnnotationReplyAddEndEvent,
        onAnnotationReplyAddStart: handleAnnotationReplyAddStartEvent,
        onAnnotationReplyUpdateEnd: handleAnnotationReplyUpdateEnd,
        onAnnotationReplyUpdateStart: handleAnnotationReplyUpdateStart,
        onAnnotationUpdateEnd: handleAnnotationUpdateEndEvent,
        onAnnotationUpdateStart: handleAnnotationUpdateStartEvent,
        onAnnotationReplyDeleteEnd: handleAnnotationReplyDeleteEnd,
        onAnnotationReplyDeleteStart: handleAnnotationReplyDeleteStart,
    });

    const handleUpdateAnnotation = (updatedValues: Partial<Annotation>) => {
        setAnnotation(prevAnnotation => ({ ...prevAnnotation, ...updatedValues }));
    };

    const annotationErrorCallback = React.useCallback(
        (e: ElementsXhrError, code: string): void => {
            setIsLoading(false);
            setError({
                title: commonMessages.errorOccured,
                message: annotationErrors[code] || annotationErrors.default,
            });

            errorCallback(e, code, {
                error: e,
            });
        },
        [errorCallback],
    );

    const { handleCreate, handleDelete, handleEdit, handleFetch, handleStatusChange } = useAnnotationAPI({
        api,
        file,
        errorCallback: annotationErrorCallback,
    });

    const replyErrorCallback = React.useCallback(
        (replyId: string, e: ElementsXhrError, code: string): void => {
            updateOrCreateReplyItem(replyId, {
                error: {
                    title: commonMessages.errorOccured,
                    message: commentsErrors[code] || commentsErrors.default,
                },
            });

            errorCallback(e, code, {
                error: e,
            });
        },
        [errorCallback],
    );

    const { createReply, deleteReply, editReply } = useRepliesAPI({
        annotationId,
        api,
        errorCallback: replyErrorCallback,
        fileId,
        filePermissions,
    });

    const handleAnnotationCreate = (text: string) => {
        setIsLoading(true);

        const requestId = uniqueId('annotation_');

        const successCallback = (newAnnotation: Annotation) => {
            setIsLoading(false);
            emitAddAnnotationEndEvent(newAnnotation, requestId);
            onAnnotationCreate(newAnnotation);
        };

        const payload: NewAnnotation = {
            description: { message: text },
            target,
        };

        emitAddAnnotationStartEvent(payload, requestId);

        handleCreate({ payload, successCallback });
    };

    const handleAnnotationDelete = ({ id, permissions }: { id: string; permissions: AnnotationPermission }): void => {
        const annotationDeleteSuccessCallback = () => {
            emitDeleteAnnotationEndEvent(id);
        };

        setAnnotation(prevAnnotation => ({ ...prevAnnotation, isPending: true }));

        emitDeleteAnnotationStartEvent(id);

        handleDelete({
            id,
            permissions,
            successCallback: annotationDeleteSuccessCallback,
        });
    };

    const onAnnotationEditSuccessCallback = (updatedAnnotation: Annotation): void => {
        handleUpdateAnnotation({
            ...updatedAnnotation,
            isPending: false,
        });

        emitUpdateAnnotationEndEvent(updatedAnnotation);
    };

    const handleAnnotationEdit = ({
        id,
        text,
        permissions,
    }: {
        id: string;
        text?: string;
        permissions: AnnotationPermission;
    }): void => {
        setAnnotation(prevAnnotation => ({ ...prevAnnotation, isPending: true }));

        emitUpdateAnnotationStartEvent({
            id,
            description: { message: text },
        });

        handleEdit({
            id,
            text: text ?? '',
            permissions,
            successCallback: onAnnotationEditSuccessCallback,
        });
    };

    const handleAnnotationStatusChange: OnAnnotationStatusChange = ({ id, permissions, status }): void => {
        setAnnotation(prevAnnotation => ({ ...prevAnnotation, isPending: true }));

        handleStatusChange({
            id,
            status,
            permissions,
            successCallback: onAnnotationEditSuccessCallback,
        });
    };

    const handleReplyCreate = (message: string) => {
        const requestId = uniqueId('reply_');
        const replyData = {
            tagged_message: message,
            type: 'comment',
        };

        const successCallback = (comment: Comment) => {
            updateOrCreateReplyItem(requestId, { ...comment, isPending: false });
            emitAddAnnotationReplyEndEvent(comment, annotationId, requestId);
        };

        addPendingReply(replyData, requestId);
        emitAddAnnotationReplyStartEvent(replyData, annotationId, requestId);

        createReply({ message, requestId, successCallback });
    };

    const handleReplyEdit = (params: {
        id: string;
        text: string;
        permissions: BoxCommentPermission;
        status?: FeedItemStatus;
        hasMention?: boolean;
        onSuccess?: Function;
        onError?: Function;
    }) => {
        const { id, text, permissions, onSuccess } = params;
        const updates = {
            id,
            tagged_message: text,
        };

        const successCallback = (comment: Comment) => {
            updateOrCreateReplyItem(comment.id, { ...comment, isPending: false });
            emitUpdateAnnotationReplyEndEvent(comment, annotationId);
            if (onSuccess) onSuccess();
        };

        updateOrCreateReplyItem(id, { message: text, isPending: true });
        emitUpdateAnnotationReplyStartEvent(updates, annotationId);

        editReply({ id, message: text, permissions, successCallback });
    };

    const handleReplyDelete = ({ id, permissions }: { id: string; permissions: BoxCommentPermission }) => {
        updateOrCreateReplyItem(id, { isPending: true });
        emitDeleteAnnotationReplyStartEvent(id, annotationId);

        const successCallback = () => {
            removeReplyItem(id);
            emitDeleteAnnotationReplyEndEvent(id, annotationId);
        };

        deleteReply({ id, permissions, successCallback });
    };

    React.useEffect(() => {
        if (!annotationId || isLoading || (annotation && annotation.id === annotationId)) {
            return;
        }
        setIsLoading(true);
        handleFetch({
            id: annotationId,
            successCallback: ({ replies: fetchedReplies, ...normalizedAnnotation }: Annotation) => {
                setAnnotation({ ...normalizedAnnotation });
                setReplies(normalizeReplies(fetchedReplies));
                setError(undefined);
                setIsLoading(false);
                emitAnnotationActiveChangeEvent(normalizedAnnotation.id, fileVersionId);
            },
        });
    }, [annotation, annotationId, emitAnnotationActiveChangeEvent, fileVersionId, handleFetch, isLoading]);

    return {
        annotation,
        error,
        isLoading,
        replies: denormalizeReplies(replies),
        annotationActions: {
            handleAnnotationCreate,
            handleAnnotationDelete,
            handleAnnotationEdit,
            handleAnnotationStatusChange,
        },
        repliesActions: {
            handleReplyCreate,
            handleReplyEdit,
            handleReplyDelete,
        },
    };
};

export default useAnnotationThread;
