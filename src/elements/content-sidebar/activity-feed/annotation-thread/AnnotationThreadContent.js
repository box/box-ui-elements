// @flow
import React from 'react';
import type EventEmitter from 'events';
import useAnnotationThread from './useAnnotationThread';
import ActivityError from '../common/activity-error';
import ActivityThread from '../activity-feed/ActivityThread';
import AnnotationActivity from '../annotations';
import API from '../../../../api/APIFactory';
import LoadingIndicator from '../../../../components/loading-indicator/LoadingIndicator';
import useAnnotatorEvents from '../../../common/annotator-context/useAnnotatorEvents';

import type { BoxItem, SelectorItems, User } from '../../../../common/types/core';
import type { ErrorContextProps } from '../../../../common/types/api';

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

    const events = useAnnotatorEvents({ eventEmitter });

    React.useEffect(() => {
        events.emitAnnotationActiveChangeEvent(annotationId, file.id);
    }, [annotationId, events, file.id]);

    return (
        <ActivityThread
            hasReplies
            getAvatarUrl={getAvatarUrl}
            getMentionWithQuery={getMentionWithQuery}
            isAlwaysExpanded
            isRepliesLoading={isLoading}
            mentionSelectorContacts={mentionSelectorContacts}
            onReplyCreate={handleReplyCreate}
            onReplyDelete={handleReplyDelete}
            onReplyEdit={handleReplyEdit}
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
                    onEdit={handleAnnotationEdit}
                    onDelete={handleAnnotationDelete}
                    onStatusChange={handleAnnotationStatusChange}
                />
            )}
        </ActivityThread>
    );
};

export default AnnotationThreadContent;
