// @flow
import React from 'react';
import type EventEmitter from 'events';
import useAnnotationThread from './useAnnotationThread';
import ActivityError from '../common/activity-error';
import ActivityThread from '../activity-feed/ActivityThread';
import ActivityThreadReplyForm from '../activity-feed/ActivityThreadReplyForm';
import AnnotationActivity from '../annotations';
import API from '../../../../api/APIFactory';
import LoadingIndicator from '../../../../components/loading-indicator/LoadingIndicator';

import type { BoxItem, SelectorItems, User } from '../../../../common/types/core';
import type { ErrorContextProps } from '../../../../common/types/api';
import type { GetProfileUrlCallback } from '../../../common/flowTypes';

import './AnnotationThreadContent.scss';

type Props = {
    annotationId: string,
    api: API,
    currentUser: User,
    eventEmitter: EventEmitter,
    file: BoxItem,
    getAvatarUrl: string => Promise<?string>,
    getMentionWithQuery: (searchStr: string) => void,
    getUserProfileUrl?: GetProfileUrlCallback,
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
    getUserProfileUrl,
    mentionSelectorContacts,
    onError,
}: Props) => {
    const { id: fileId, permissions = {} } = file;

    const {
        annotation,
        replies,
        isLoading,
        error,
        annotationActions: { handleAnnotationStatusChange, handleAnnotationDelete, handleAnnotationEdit },
        repliesActions: { handleReplyEdit, handleReplyCreate, handleReplyDelete },
    } = useAnnotationThread({
        api,
        annotationId,
        currentUser,
        eventEmitter,
        fileId,
        filePermissions: permissions,
        errorCallback: onError,
    });

    return (
        <>
            {error && <ActivityError {...error} />}
            {isLoading && (
                <div className="AnnotationThreadContent-loading" data-testid="annotation-loading">
                    <LoadingIndicator />
                </div>
            )}
            {annotation && (
                <ActivityThread
                    hasReplies
                    getAvatarUrl={getAvatarUrl}
                    getMentionWithQuery={getMentionWithQuery}
                    getUserProfileUrl={getUserProfileUrl}
                    isAlwaysExpanded
                    isRepliesLoading={isLoading}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onReplyCreate={handleReplyCreate}
                    onReplyDelete={handleReplyDelete}
                    onReplyEdit={handleReplyEdit}
                    replies={replies}
                    repliesTotalCount={replies.length}
                >
                    <AnnotationActivity
                        getAvatarUrl={getAvatarUrl}
                        currentUser={currentUser}
                        isCurrentVersion
                        item={annotation}
                        getMentionWithQuery={getMentionWithQuery}
                        getUserProfileUrl={getUserProfileUrl}
                        mentionSelectorContacts={mentionSelectorContacts}
                        onEdit={handleAnnotationEdit}
                        onDelete={handleAnnotationDelete}
                        onStatusChange={handleAnnotationStatusChange}
                    />
                </ActivityThread>
            )}
        </>
    );
};

export default AnnotationThreadContent;
