// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';

import PlainButton from '../../../../components/plain-button';
import ActivityThreadReplies from './ActivityThreadReplies';
import ActivityThreadReplyForm from './ActivityThreadReplyForm';

import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { Translations } from '../../flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';
import type { BoxCommentPermission, Comment as CommentType, FeedItemStatus } from '../../../../common/types/feed';

import messages from './messages';

import './ActivityThread.scss';

type Props = {
    children: React.Node,
    currentUser?: User,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    hasReplies: boolean,
    isAlwaysExpanded?: boolean,
    isRepliesLoading?: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    onHideReplies?: (lastReply: CommentType) => void,
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
    onShowReplies?: () => void,
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
    isAlwaysExpanded = false,
    isRepliesLoading,
    mentionSelectorContacts,
    onHideReplies = noop,
    onReplyCreate,
    onReplyDelete = noop,
    onReplyEdit = noop,
    onShowReplies = noop,
    replies = [],
    repliesTotalCount = 0,
    translations,
}: Props) => {
    const { length: repliesLength } = replies;
    const repliesToLoadCount = Math.max(repliesTotalCount - repliesLength, 0);

    const onHideRepliesHandler = () => {
        if (repliesLength) {
            onHideReplies(replies[repliesLength - 1]);
        }
    };

    const renderButton = () => {
        if (isAlwaysExpanded || isRepliesLoading) {
            return null;
        }

        if (repliesTotalCount > repliesLength) {
            return (
                <PlainButton
                    className="bcs-ActivityThread-toggle"
                    onClick={onShowReplies}
                    type="button"
                    data-testid="activity-thread-button"
                >
                    <FormattedMessage values={{ repliesToLoadCount }} {...messages.showReplies} />
                </PlainButton>
            );
        }
        if (repliesTotalCount > 1 && repliesTotalCount === repliesLength) {
            return (
                <PlainButton
                    className="bcs-ActivityThread-toggle"
                    onClick={onHideRepliesHandler}
                    type="button"
                    data-testid="activity-thread-button"
                >
                    <FormattedMessage {...messages.hideReplies} />
                </PlainButton>
            );
        }

        return null;
    };

    if (!hasReplies) {
        return children;
    }
    return (
        <div className="bcs-ActivityThread" data-testid="activity-thread">
            {children}

            {renderButton()}

            {repliesTotalCount > 0 && repliesLength > 0 && (
                <ActivityThreadReplies
                    currentUser={currentUser}
                    getAvatarUrl={getAvatarUrl}
                    getMentionWithQuery={getMentionWithQuery}
                    getUserProfileUrl={getUserProfileUrl}
                    isRepliesLoading={isRepliesLoading}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onDelete={onReplyDelete}
                    onEdit={onReplyEdit}
                    replies={replies}
                    translations={translations}
                />
            )}

            {onReplyCreate ? (
                <ActivityThreadReplyForm
                    getMentionWithQuery={getMentionWithQuery}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onReplyCreate={onReplyCreate}
                />
            ) : null}
        </div>
    );
};

export default ActivityThread;
