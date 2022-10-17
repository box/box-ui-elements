// @flow
import React from 'react';
import type EventEmitter from 'events';
import ActivityError from '../common/activity-error';
import ActivityThread from '../activity-feed/ActivityThread';
import AnnotationActivity from '../annotations';
import API from '../../../../api/APIFactory';
import LoadingIndicator from '../../../../components/loading-indicator/LoadingIndicator';
import useAnnotationAPI from './useAnnotationAPI';

import type { BoxItem, SelectorItems, User } from '../../../../common/types/core';
import type { ErrorContextProps } from '../../../../common/types/api';
import type { BoxCommentPermission, FeedItemStatus } from '../../../../common/types/feed';

import './AnnotationThreadContent.scss';

type Props = {
    annotationId: string,
    api: API,
    currentUser: User,
    eventEmitter: EventEmitter,
    file: BoxItem,
    getAvatarUrl: string => Promise<?string>,
    getMentionWithQuery: (searchStr: string) => void,
    mentionSelectorContacts: SelectorItems<>,
} & ErrorContextProps;

const AnnotationThreadContent = ({
    annotationId,
    api,
    currentUser,
    eventEmitter,
    file,
    getAvatarUrl,
    getMentionWithQuery,
    mentionSelectorContacts,
    onError,
}: Props) => {
    const { id: fileId, permissions = {} } = file;

    const {
        annotation,
        replies,
        isLoading,
        error,
        handleEdit,
        handleStatusChange,
        handleDelete,
        handleCreateReply,
        handleDeleteReply,
        handleEditReply,
    } = useAnnotationAPI({
        api,
        annotationId,
        currentUser,
        eventEmitter,
        fileId,
        filePermissions: permissions,
        errorCallback: onError,
    });

    const onReplyEditHandler = (
        id: string,
        text: string,
        status?: FeedItemStatus,
        hasMention?: boolean,
        replyPermissions: BoxCommentPermission,
    ) => {
        handleEditReply(id, text, status, replyPermissions);
    };

    return (
        <ActivityThread
            hasReplies
            getAvatarUrl={getAvatarUrl}
            getMentionWithQuery={getMentionWithQuery}
            isAlwaysExpanded
            isRepliesLoading={isLoading}
            mentionSelectorContacts={mentionSelectorContacts}
            onReplyCreate={handleCreateReply}
            onReplyDelete={handleDeleteReply}
            onReplyEdit={onReplyEditHandler}
            replies={replies}
            repliesTotalCount={replies.length}
        >
            {error && <ActivityError {...error} />}
            {isLoading && (
                <div className="AnnotationThreadContent-loading" data-testid="annotation-loading">
                    <LoadingIndicator />
                </div>
            )}
            {annotation && (
                <AnnotationActivity
                    getAvatarUrl={getAvatarUrl}
                    currentUser={currentUser}
                    isCurrentVersion
                    item={annotation}
                    getMentionWithQuery={getMentionWithQuery}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange}
                />
            )}
        </ActivityThread>
    );
};

export default AnnotationThreadContent;
