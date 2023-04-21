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
    hasNewThreadedReplies?: boolean,
    hasReplies: boolean,
    isAlwaysExpanded?: boolean,
    isPending?: boolean,
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
    onReplySelect?: (isSelected: boolean) => void,
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
    hasNewThreadedReplies = false,
    hasReplies,
    isAlwaysExpanded = false,
    isPending,
    isRepliesLoading,
    mentionSelectorContacts,
    onHideReplies = noop,
    onReplyCreate,
    onReplyDelete = noop,
    onReplyEdit = noop,
    onReplySelect = noop,
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

    const handleFormFocusOrShow = () => {
        onReplySelect(true);
    };

    const handleFormHide = () => {
        onReplySelect(false);
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
            <div className="bcs-ActivityThread-selectWrapper">
                <div className="bcs-ActivityThread-content">
                    {children}

                    {renderButton()}

                    {repliesTotalCount > 0 && repliesLength > 0 && (
                        <ActivityThreadReplies
                            currentUser={currentUser}
                            getAvatarUrl={getAvatarUrl}
                            getMentionWithQuery={getMentionWithQuery}
                            getUserProfileUrl={getUserProfileUrl}
                            hasNewThreadedReplies={hasNewThreadedReplies}
                            isRepliesLoading={isRepliesLoading}
                            mentionSelectorContacts={mentionSelectorContacts}
                            onDelete={onReplyDelete}
                            onEdit={onReplyEdit}
                            onSelect={onReplySelect}
                            replies={replies}
                            translations={translations}
                        />
                    )}
                </div>

                {onReplyCreate && (
                    <ActivityThreadReplyForm
                        getMentionWithQuery={getMentionWithQuery}
                        isDisabled={isPending}
                        mentionSelectorContacts={mentionSelectorContacts}
                        onFocus={handleFormFocusOrShow}
                        onHide={handleFormHide}
                        onShow={handleFormFocusOrShow}
                        onReplyCreate={onReplyCreate}
                    />
                )}
            </div>
        </div>
    );
};

export default ActivityThread;
