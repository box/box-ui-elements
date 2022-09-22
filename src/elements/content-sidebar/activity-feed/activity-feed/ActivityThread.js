// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';

import LoadingIndicator from '../../../../components/loading-indicator';
import PlainButton from '../../../../components/plain-button';
import ActivityThreadReplies from './ActivityThreadReplies';

import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { Translations } from '../../flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';
import type {
    BoxCommentPermission,
    Comment as CommentType,
    CommentFeedItemType,
    FeedItemStatus,
} from '../../../../common/types/feed';

import messages from './messages';
import './ActivityThread.scss';

type Props = {
    children: React.Node,
    currentUser?: User,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    hasReplies: boolean,
    isRepliesLoading?: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    onGetReplies?: (id: string, type: CommentFeedItemType) => void,
    onReplyCreate?: (parentId: string, parentType: CommentFeedItemType, text: string, hasMention: boolean) => void,
    onReplyDelete?: ({ id: string, parentId: string, permissions: BoxCommentPermission }) => void,
    onReplyEdit?: (
        id: string,
        parentId: string,
        text: string,
        hasMention: boolean,
        permissions: BoxCommentPermission,
        onSuccess: ?Function,
        onError: ?Function,
    ) => void,
    parentId: string,
    parentType: CommentFeedItemType,
    replies?: Array<CommentType>,
    repliesTotalCount?: number,
    translations?: Translations,
};

const ActivityThread = ({
    children,
    currentUser,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    hasReplies,
    isRepliesLoading,
    mentionSelectorContacts,
    onGetReplies = noop,
    onReplyDelete = noop,
    onReplyEdit = noop,
    parentId,
    parentType,
    replies = [],
    repliesTotalCount = 0,
    translations,
}: Props) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const toggleButtonLabel = isExpanded ? messages.hideReplies : messages.showReplies;
    const repliesToLoadCount = Math.max(repliesTotalCount - 1, 0);

    const toggleReplies = () => {
        if (!isExpanded) {
            onGetReplies(parentId, parentType);
        }
        setIsExpanded(previousState => !previousState);
    };

    const onDelete = (options: { id: string, permissions: BoxCommentPermission }) => {
        onReplyDelete({ ...options, parentId });
    };

    const onEdit = (
        id: string,
        text: string,
        status?: FeedItemStatus,
        hasMention: boolean,
        permissions: BoxCommentPermission,
        onSuccess: ?Function,
        onError: ?Function,
    ) => {
        onReplyEdit(id, parentId, text, hasMention, permissions, onSuccess, onError);
    };

    if (!hasReplies) {
        return children;
    }
    return (
        <div className="bcs-ActivityThread" data-testid="activity-thread">
            {children}

            {isRepliesLoading && (
                <div className="bcs-ActivityThread-loading" data-testid="activity-thread-loading">
                    <LoadingIndicator />
                </div>
            )}
            {!isRepliesLoading && repliesTotalCount > 1 && (
                <PlainButton
                    className="bcs-ActivityThread-toggle"
                    onClick={toggleReplies}
                    type="button"
                    data-testid="activity-thread-button"
                >
                    <FormattedMessage values={{ repliesToLoadCount }} {...toggleButtonLabel} />
                </PlainButton>
            )}

            {!isRepliesLoading && repliesTotalCount > 0 && replies.length && (
                <ActivityThreadReplies
                    currentUser={currentUser}
                    getAvatarUrl={getAvatarUrl}
                    getMentionWithQuery={getMentionWithQuery}
                    getUserProfileUrl={getUserProfileUrl}
                    isExpanded={isExpanded}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    replies={replies}
                    translations={translations}
                />
            )}
        </div>
    );
};

export default ActivityThread;
