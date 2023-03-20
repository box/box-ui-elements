// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';

import BaseComment from './BaseComment';
import PlainButton from '../../../../components/plain-button';

import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { Translations } from '../../flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';
import type { BoxCommentPermission, Comment as CommentType, FeedItemStatus } from '../../../../common/types/feed';

import messages from './messages';

type Props = {
    currentUser?: User,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
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
    parentID: string,
    replies?: Array<CommentType>,
    repliesTotalCount?: number,
    translations?: Translations,
};

const Replies = ({
    currentUser,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    isAlwaysExpanded = false,
    isPending,
    isRepliesLoading,
    mentionSelectorContacts,
    onHideReplies = noop,
    onReplyDelete = noop,
    onReplyEdit = noop,
    onReplySelect = noop,
    onShowReplies = noop,
    parentID,
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

    const getReplyPermissions = (reply: CommentType): BoxCommentPermission => {
        const { permissions: { can_delete = false, can_edit = false, can_resolve = false } = {} } = reply;
        return {
            can_delete,
            can_edit,
            can_resolve,
        };
    };

    return (
        <div className="bcs-Replies">
            {renderButton()}
            <div className="bcs-Replies-list">
                {replies.map(reply => {
                    return (
                        <BaseComment
                            key={`${reply.type}${reply.id}`}
                            {...reply}
                            id={reply.id}
                            currentUser={currentUser}
                            getAvatarUrl={getAvatarUrl}
                            getMentionWithQuery={getMentionWithQuery}
                            getUserProfileUrl={getUserProfileUrl}
                            isPending={isPending}
                            mentionSelectorContacts={mentionSelectorContacts}
                            onDelete={onReplyDelete}
                            onEdit={onReplyEdit}
                            onSelect={onReplySelect}
                            parentID={parentID}
                            permissions={getReplyPermissions(reply)}
                            translations={translations}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Replies;
