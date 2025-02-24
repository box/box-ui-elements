import * as React from 'react';
import ActivityError from '../common/activity-error';
import ActivityThread from '../activity-feed/ActivityThread';
import AnnotationActivity from '../annotations';
import LoadingIndicator from '../../../../components/loading-indicator/LoadingIndicator';

import {
    Annotation,
    AnnotationPermission,
    BoxCommentPermission,
    Comment,
    FeedItemStatus,
} from '../../../../common/types/feed';
import { SelectorItems, User } from '../../../../common/types/core';
import { GetProfileUrlCallback } from '../../../common/flowTypes';
import { AnnotationThreadError } from './types';

import './AnnotationThreadContent.scss';

import { OnAnnotationEdit, OnAnnotationStatusChange } from '../comment/types';

interface AnnotationThreadContentProps {
    annotation?: Annotation;
    currentUser: User;
    error?: AnnotationThreadError;
    getAvatarUrl: (userId: string) => Promise<string | null>;
    getMentionWithQuery: (searchStr: string) => void;
    getUserProfileUrl?: GetProfileUrlCallback;
    isLoading: boolean;
    mentionSelectorContacts: SelectorItems[];
    onAnnotationDelete?: (params: { id: string; permissions: AnnotationPermission }) => Promise<void> | void;
    onAnnotationEdit?: OnAnnotationEdit;
    onAnnotationStatusChange: OnAnnotationStatusChange;
    onReplyCreate?: (text: string) => void;
    onReplyDelete?: (params: { id: string; permissions: BoxCommentPermission }) => void;
    onReplyEdit?: (params: {
        id: string;
        text: string;
        permissions: BoxCommentPermission;
        status?: FeedItemStatus;
        hasMention?: boolean;
        onSuccess?: Function;
        onError?: Function;
    }) => void;
    replies?: Array<Comment>;
}

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
}: AnnotationThreadContentProps) => {
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
