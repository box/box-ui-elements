// @flow

import * as React from 'react';
import noop from 'lodash/noop';
import CreateReply from './CreateReply';
import LoadingIndicator from '../../../../components/loading-indicator';
import RepliesToggle from './RepliesToggle';
import type { BoxCommentPermission, Comment as CommentType } from '../../../../common/types/feed';

import './BaseComment.scss';
import './Replies.scss';
import './Comment.scss';

import { type BaseCommentAndRepliesSharedProps, type BaseCommentWrapperType } from './types';

// Much better to break these out into their own files.
// eslint-disable-next-line import/no-cycle

type RepliesProps = BaseCommentAndRepliesSharedProps & {
    BaseCommentWrapper: BaseCommentWrapperType,
    getMentionWithQuery?: (searchStr: string) => void,
    isParentPending?: boolean,
    onHideReplies?: (shownReplies: CommentType[]) => void,
    onReplyCreate?: (reply: string) => void,
    onReplySelect?: (isSelected: boolean) => void,
    onShowReplies?: () => void,
    replies: CommentType[],
    repliesTotalCount?: number,
};

const Replies = ({
    BaseCommentWrapper,
    currentUser,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    isParentPending = false,
    isRepliesLoading = false,
    mentionSelectorContacts,
    onReplyCreate,
    onReplySelect = noop,
    onShowReplies,
    onHideReplies,
    replies,
    repliesTotalCount = 0,
    translations,
}: RepliesProps) => {
    const [showReplyForm, setShowReplyForm] = React.useState(false);
    const getReplyPermissions = (reply: CommentType): BoxCommentPermission => {
        const { permissions: { can_delete = false, can_edit = false, can_resolve = false } = {} } = reply;
        return {
            can_delete,
            can_edit,
            can_resolve,
        };
    };

    const handleNewReplyButton = () => {
        setShowReplyForm(true);
        onReplySelect(true);
    };

    const handleCancelNewReply = () => {
        setShowReplyForm(false);
        onReplySelect(false);
    };

    const handleSubmitNewReply = (reply: string, replyCreate: (reply: string) => void) => {
        setShowReplyForm(false);
        replyCreate(reply);
    };

    return (
        <div className="bcs-Replies">
            {!!onShowReplies && !!onHideReplies && (
                <RepliesToggle
                    onHideReplies={index => onHideReplies([replies[index]])}
                    onShowReplies={onShowReplies}
                    repliesShownCount={replies.length}
                    repliesTotalCount={repliesTotalCount}
                />
            )}
            <div className="bcs-Replies-content">
                {isRepliesLoading && (
                    <div className="bcs-Replies-loading" data-testid="replies-loading">
                        <LoadingIndicator />
                    </div>
                )}
                <ol className="bcs-Replies-list">
                    {replies.map(reply => {
                        const { id, type } = reply;

                        return (
                            <li key={`${type}${id}`}>
                                <BaseCommentWrapper
                                    {...reply}
                                    currentUser={currentUser}
                                    getAvatarUrl={getAvatarUrl}
                                    getMentionWithQuery={getMentionWithQuery}
                                    getUserProfileUrl={getUserProfileUrl}
                                    isPending={isParentPending || reply.isPending}
                                    mentionSelectorContacts={mentionSelectorContacts}
                                    onSelect={onReplySelect}
                                    onDelete={noop}
                                    onEdit={noop}
                                    permissions={getReplyPermissions(reply)}
                                    translations={translations}
                                />
                                {/* <div>farm animal</div> */}
                            </li>
                        );
                    })}
                </ol>
            </div>
            {!!onReplyCreate && (
                <CreateReply
                    getMentionWithQuery={getMentionWithQuery}
                    isDisabled={isParentPending}
                    mentionSelectorContacts={mentionSelectorContacts}
                    onCancel={handleCancelNewReply}
                    onClick={handleNewReplyButton}
                    onFocus={() => onReplySelect(true)}
                    onSubmit={reply => handleSubmitNewReply(reply, onReplyCreate)}
                    showReplyForm={showReplyForm}
                />
            )}
        </div>
    );

    // return <div>meow</div>;
};

export default Replies;
