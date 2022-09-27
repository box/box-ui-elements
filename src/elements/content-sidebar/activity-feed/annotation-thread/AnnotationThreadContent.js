// @flow
import React from 'react';
import ActivityError from '../common/activity-error';
import ActivityThread from '../activity-feed/ActivityThread';
import AnnotationActivity from '../annotations';
import API from '../../../../api/APIFactory';
import LoadingIndicator from '../../../../components/loading-indicator/LoadingIndicator';
import useAnnotationAPI from './useAnnotationAPI';
import useReplies from './useReplies';

import type { BoxItem, SelectorItems, User } from '../../../../common/types/core';
import type { ErrorContextProps } from '../../../../common/types/api';

import './AnnotationThreadContent.scss';

type Props = {
    annotationId: string,
    api: API,
    currentUser: User,
    file: BoxItem,
    getAvatarUrl: string => Promise<?string>,
    getMentionWithQuery: (searchStr: string) => void,
    mentionSelectorContacts: SelectorItems<>,
} & ErrorContextProps;

const AnnotationThreadContent = ({
    annotationId,
    api,
    currentUser,
    file,
    getAvatarUrl,
    getMentionWithQuery,
    mentionSelectorContacts,
    onError,
}: Props) => {
    const { id: fileId, permissions = {} } = file;

    const {
        annotation,
        initialReplies,
        isLoading,
        error,
        handleEdit,
        handleStatusChange,
        handleDelete,
    } = useAnnotationAPI({
        api,
        annotationId,
        fileId,
        filePermissions: permissions,
        errorCallback: onError,
    });

    const { replies, handleCreateReply, handleEditReply, handleDeleteReply } = useReplies({
        annotationId,
        api,
        initialReplies,
        currentUser,
        fileId,
        filePermissions: permissions,
    });

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
            onReplyEdit={handleEditReply}
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
