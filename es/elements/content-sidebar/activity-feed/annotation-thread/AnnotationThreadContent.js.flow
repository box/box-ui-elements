// @flow
import * as React from 'react';
import ActivityError from '../common/activity-error';
import ActivityThread from '../activity-feed/ActivityThread';
import AnnotationActivity from '../annotations';
import LoadingIndicator from '../../../../components/loading-indicator/LoadingIndicator';

import type {
    Annotation,
    AnnotationPermission,
    BoxCommentPermission,
    Comment,
    FeedItemStatus,
} from '../../../../common/types/feed';
import type { SelectorItems, User } from '../../../../common/types/core';
import type { GetProfileUrlCallback } from '../../../common/flowTypes';
import type { AnnotationThreadError } from './types';

import './AnnotationThreadContent.scss';

import type { OnAnnotationEdit, OnAnnotationStatusChange } from '../comment/types';

type Props = {
    annotation?: Annotation,
    currentUser: User,
    error?: AnnotationThreadError,
    getAvatarUrl: string => Promise<?string>,
    getMentionWithQuery: (searchStr: string) => void,
    getUserProfileUrl?: GetProfileUrlCallback,
    isLoading: boolean,
    mentionSelectorContacts: SelectorItems<>,
    onAnnotationDelete?: ({ id: string, permissions: AnnotationPermission }) => any,
    onAnnotationEdit?: OnAnnotationEdit,
    onAnnotationStatusChange: OnAnnotationStatusChange,
    onReplyCreate?: (text: string) => void,
    onReplyDelete?: ({ id: string, permissions: BoxCommentPermission }) => void,
    onReplyEdit?: (
        id: string,
        text: string,
        status?: FeedItemStatus,
        hasMention?: boolean,
        permissions: BoxCommentPermission,
        onSuccess: ?Function,
        onError: ?Function,
    ) => void,
    replies?: Array<Comment>,
};

const AnnotationThreadContent = ({
    annotation,
    currentUser,
    error,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    isLoading,
    mentionSelectorContacts,
    onAnnotationDelete,
    onAnnotationEdit,
    onAnnotationStatusChange,
    onReplyCreate,
    onReplyDelete,
    onReplyEdit,
    replies = [],
}: Props) => {
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
                    getAvatarUrl={getAvatarUrl}
                    getMentionWithQuery={getMentionWithQuery}
                    getUserProfileUrl={getUserProfileUrl}
                    hasReplies
                    isAlwaysExpanded
                    isRepliesLoading={isLoading}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onReplyCreate={onReplyCreate}
                    onReplyDelete={onReplyDelete}
                    onReplyEdit={onReplyEdit}
                    replies={replies}
                    repliesTotalCount={replies.length}
                >
                    <AnnotationActivity
                        currentUser={currentUser}
                        getAvatarUrl={getAvatarUrl}
                        getMentionWithQuery={getMentionWithQuery}
                        getUserProfileUrl={getUserProfileUrl}
                        isCurrentVersion
                        item={annotation}
                        mentionSelectorContacts={mentionSelectorContacts}
                        onDelete={onAnnotationDelete}
                        onEdit={onAnnotationEdit}
                        onStatusChange={onAnnotationStatusChange}
                    />
                </ActivityThread>
            )}
        </>
    );
};

export default AnnotationThreadContent;
