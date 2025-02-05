import * as React from 'react';
import noop from 'lodash/noop';
import Comment from './Comment';
import LoadingIndicator from '../../../../components/loading-indicator';
import RepliesToggle from './RepliesToggle';
import type { Comment as CommentType } from '../../../../common/types/feed';
import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';
import type { Translations } from '../../flowTypes';
import type { OnCommentEdit } from './types';

interface RepliesProps {
    currentUser?: User;
    getAvatarUrl: GetAvatarUrlCallback;
    getMentionWithQuery?: (searchStr: string) => void;
    getUserProfileUrl?: GetProfileUrlCallback;
    isParentPending?: boolean;
    isRepliesLoading?: boolean;
    mentionSelectorContacts?: SelectorItems<User>;
    onCommentEdit: OnCommentEdit;
    onHideReplies?: (shownReplies: CommentType[]) => void;
    onReplyDelete?: (args: { id: string }) => void;
    onReplySelect?: (isSelected: boolean) => void;
    onShowReplies?: () => void;
    replies: CommentType[];
    repliesTotalCount: number;
    translations?: Translations;
}

const Replies = ({
    currentUser,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    isParentPending = false,
    isRepliesLoading = false,
    mentionSelectorContacts,
    onCommentEdit,
    onReplyDelete,
    onReplySelect = noop,
    onShowReplies,
    replies = [],
    repliesTotalCount = 0,
    translations,
}: RepliesProps): JSX.Element => {
    const hasMoreReplies = repliesTotalCount > replies.length;

    return (
        <div className="bcs-Comment-replies">
            {isRepliesLoading ? (
                <div className="bcs-Comment-repliesLoading">
                    <LoadingIndicator />
                </div>
            ) : (
                <>
                    {replies.map(reply => (
                        <Comment
                            key={reply.id}
                            {...reply}
                            currentUser={currentUser}
                            getAvatarUrl={getAvatarUrl}
                            getMentionWithQuery={getMentionWithQuery}
                            getUserProfileUrl={getUserProfileUrl}
                            isPending={isParentPending}
                            mentionSelectorContacts={mentionSelectorContacts}
                            onDelete={onReplyDelete}
                            onEdit={onCommentEdit}
                            onSelect={onReplySelect}
                            translations={translations}
                        />
                    ))}
                    {hasMoreReplies && onShowReplies && (
                        <RepliesToggle
                            onToggle={onShowReplies}
                            repliesTotalCount={repliesTotalCount}
                            showReplies={false}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Replies;
