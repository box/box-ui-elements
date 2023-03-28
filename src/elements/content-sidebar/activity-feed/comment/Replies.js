// @flow
import * as React from 'react';
import noop from 'lodash/noop';

import BaseComment from './BaseComment';
import RepliesToggle from './RepliesToggle';
import LoadingIndicator from '../../../../components/loading-indicator';

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
    isRepliesLoading = false,
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
    const getReplyPermissions = (reply: CommentType): BoxCommentPermission => {
        const { permissions: { can_delete = false, can_edit = false, can_resolve = false } = {} } = reply;
        return {
            can_delete,
            can_edit,
            can_resolve,
        };
    };

    if (!hasReplies || !parentID) {
        return null;
    }

    return (
        <div className="bcs-Replies">
            <RepliesToggle
                isAlwaysExpanded={isAlwaysExpanded}
                isRepliesLoading={isRepliesLoading}
                onShowReplies={onShowReplies}
                onHideReplies={index => onHideReplies(replies[index])}
                repliesShownCount={replies.length}
                repliesTotalCount={repliesTotalCount}
            />
            <div className="bcs-Replies-content">
                {isRepliesLoading && (
                    <div className="bcs-Replies-loading" data-testid="replies-loading">
                        <LoadingIndicator />
                    </div>
                )}
                <ol className="bcs-Replies-list">
                    {replies.map(reply => {
                        const { id, type, isPending } = reply;

                        return (
                            <li key={`${type}${id}`}>
                                <BaseComment
                                    {...reply}
                                    currentUser={currentUser}
                                    getAvatarUrl={getAvatarUrl}
                                    getMentionWithQuery={getMentionWithQuery}
                                    getUserProfileUrl={getUserProfileUrl}
                                    id={id}
                                    isPending={isPending}
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
                </ol>
            </div>
        </div>
    );
};

export default Replies;
