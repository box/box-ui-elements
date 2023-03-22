// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';

import BaseComment from './BaseComment';
import LoadingIndicator from '../../../../components/loading-indicator';
import messages from './messages';
import PlainButton from '../../../../components/plain-button';

import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { Translations } from '../../flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';
import type { BoxCommentPermission, Comment as CommentType, FeedItemStatus } from '../../../../common/types/feed';

import './Replies.scss';

type ReplyProps = {
    hasReplies?: boolean,
    isAlwaysExpanded?: boolean,
    isRepliesLoading?: boolean,
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
    replies?: CommentType[],
    repliesTotalCount?: number,
};

type Props = ReplyProps & {
    currentUser?: User,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    mentionSelectorContacts?: SelectorItems<>,
    translations?: Translations,
};

const Replies = ({
    currentUser,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    hasReplies = false,
    isAlwaysExpanded = false,
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
                    className="bcs-Replies-toggle"
                    onClick={onShowReplies}
                    type="button"
                    data-testid="show-replies-button"
                >
                    <FormattedMessage values={{ repliesToLoadCount }} {...messages.showReplies} />
                </PlainButton>
            );
        }
        if (repliesTotalCount > 1 && repliesTotalCount === repliesLength) {
            return (
                <PlainButton
                    className="bcs-Replies-toggle"
                    onClick={onHideRepliesHandler}
                    type="button"
                    data-testid="hide-replies-button"
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

    if (!hasReplies) {
        return null;
    }

    return (
        <div className="bcs-Replies">
            {renderButton()}
            <ul className="bcs-Replies-list">
                {isRepliesLoading && (
                    <div className="bcs-Replies-loading" data-testid="replies-loading">
                        <LoadingIndicator />
                    </div>
                )}
                {replies.map(reply => {
                    return (
                        <li key={`${reply.type}${reply.id}`}>
                            <BaseComment
                                {...reply}
                                currentUser={currentUser}
                                getAvatarUrl={getAvatarUrl}
                                getMentionWithQuery={getMentionWithQuery}
                                getUserProfileUrl={getUserProfileUrl}
                                id={reply.id}
                                isPending={reply.isPending}
                                mentionSelectorContacts={mentionSelectorContacts}
                                onDelete={onReplyDelete}
                                onEdit={onReplyEdit}
                                onSelect={onReplySelect}
                                parentID={parentID}
                                permissions={getReplyPermissions(reply)}
                                translations={translations}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Replies;
