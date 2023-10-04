// @flow
import * as React from 'react';

import classNames from 'classnames';
import noop from 'lodash/noop';

import { BaseCommentMenuWrapper } from './components/BaseCommentMenuWrapper';
import { BaseCommentInfo } from './components/BaseCommentInfo';
import { COMMENT_STATUS_RESOLVED } from '../../../../constants';

import ActivityError from '../common/activity-error';
import ActivityMessage from '../common/activity-message';
import CommentForm from '../comment-form';
import CreateReply from './CreateReply';
import LoadingIndicator from '../../../../components/loading-indicator';
import RepliesToggle from './RepliesToggle';

import type {
    ActionItemError,
    BoxCommentPermission,
    FeedItemStatus,
    Comment as CommentType,
} from '../../../../common/types/feed';
import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { OnAnnotationEdit, OnCommentEdit } from './types';
import type { SelectorItems, User } from '../../../../common/types/core';
import type { Translations } from '../../flowTypes';

import './BaseComment.scss';
import './Replies.scss';
import './Comment.scss';
import ActivityStatus from '../common/activity-status';

export type BaseCommentProps = {
    annotationActivityLink?: React.Element<any>,
    created_at: string | number,
    created_by: User,
    currentUser?: User,
    error?: ActionItemError,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    hasReplies?: boolean,
    id: string,
    isDisabled?: boolean,
    isPending?: boolean,
    isRepliesLoading?: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    modified_at?: string | number,
    onAnnotationEdit?: OnAnnotationEdit,
    onCommentEdit: OnCommentEdit,
    onDelete: ({ id: string, permissions?: BoxCommentPermission }) => any,
    onHideReplies?: (shownReplies: CommentType[]) => void,
    onReplyCreate?: (reply: string) => void,
    onReplyDelete?: ({ id: string, permissions?: BoxCommentPermission }) => void,
    onSelect: (isSelected: boolean) => void,
    onShowReplies?: () => void,
    permissions: BoxCommentPermission,
    replies?: CommentType[],
    repliesTotalCount?: number,
    status?: FeedItemStatus,
    tagged_message: string,
    translatedTaggedMessage?: string,
    translations?: Translations,
};

export const BaseComment = ({
    annotationActivityLink,
    created_at,
    created_by,
    currentUser,
    error,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    hasReplies = false,
    id,
    isDisabled,
    isPending = false,
    isRepliesLoading = false,
    mentionSelectorContacts,
    modified_at,
    onAnnotationEdit,
    onCommentEdit,
    onDelete,
    onHideReplies,
    onReplyCreate,
    onReplyDelete,
    onSelect,
    onShowReplies,
    permissions = {},
    replies = [],
    repliesTotalCount = 0,
    status,
    tagged_message = '',
    translatedTaggedMessage,
    translations,
}: BaseCommentProps) => {
    const [isEditing, setIsEditing] = React.useState<boolean>(false);
    const [isInputOpen, setIsInputOpen] = React.useState<boolean>(false);

    const commentFormFocusHandler = (): void => {
        setIsInputOpen(true);
        onSelect(true);
    };

    const commentFormCancelHandler = (): void => {
        setIsInputOpen(false);
        setIsEditing(false);
        onSelect(false);
    };

    const commentFormSubmitHandler = (): void => {
        setIsInputOpen(false);
        setIsEditing(false);
        onSelect(false);
    };

    const handleMessageUpdate = ({ id: messageID, text, hasMention }) => {
        // Since we have to pass onCommentEdit through annotations (to Replies), onAnnotationEdit essentially overrides onCommentEdit
        if (onAnnotationEdit) {
            onAnnotationEdit({ id: messageID, text, permissions });
        } else if (onCommentEdit) {
            onCommentEdit({
                id: messageID,
                text,
                hasMention,
                permissions,
            });
        }
        commentFormSubmitHandler();
    };

    // Since we have to pass onCommentEdit through annotations (to Replies), onAnnotationEdit essentially overrides onCommentEdit
    const onEdit = onAnnotationEdit ?? onCommentEdit;

    const canDelete = !!permissions.can_delete;
    const canEdit = onEdit !== noop && !!permissions.can_edit;
    const canResolve = onEdit !== noop && !!permissions.can_resolve;

    const isEdited = modified_at !== undefined && modified_at !== created_at;
    const isMenuVisible = (canDelete || canEdit || canResolve) && !isPending;
    const isResolved = status === COMMENT_STATUS_RESOLVED;
    const commentProps = {
        currentUser,
        getUserProfileUrl,
        getAvatarUrl,
        getMentionWithQuery,
        mentionSelectorContacts,
        translations,
    };

    return (
        // TODO: Change className to bcs-Comment once FF is removed
        <div className="bcs-BaseComment">
            <div
                className={classNames('bcs-Comment-media', {
                    'bcs-is-pending': isPending || error,
                })}
            >
                <div className="bcs-BaseComment-header">
                    <BaseCommentInfo
                        annotationActivityLink={annotationActivityLink}
                        created_at={created_at}
                        created_by={created_by}
                        getAvatarUrl={getAvatarUrl}
                        getUserProfileUrl={getUserProfileUrl}
                        status={status}
                    />
                    {isMenuVisible && (
                        <BaseCommentMenuWrapper
                            canDelete={canDelete}
                            canEdit={canEdit}
                            canResolve={canResolve}
                            id={id}
                            isEditing={isEditing}
                            isInputOpen={isInputOpen}
                            isResolved={isResolved}
                            onAnnotationEdit={onAnnotationEdit}
                            onCommentEdit={onCommentEdit}
                            onDelete={onDelete}
                            onSelect={onSelect}
                            permissions={permissions}
                            setIsEditing={setIsEditing}
                            setIsInputOpen={setIsInputOpen}
                        />
                    )}
                </div>
                <ActivityStatus status={status} />
                <div className="bcs-BaseComment-content">
                    {isEditing ? (
                        <CommentForm
                            className={classNames('bcs-Comment-editor', {
                                'bcs-is-disabled': isDisabled,
                            })}
                            entityId={id}
                            getAvatarUrl={getAvatarUrl}
                            getMentionWithQuery={getMentionWithQuery}
                            isDisabled={isDisabled}
                            isEditing={isEditing}
                            isOpen={isInputOpen}
                            mentionSelectorContacts={mentionSelectorContacts}
                            onCancel={commentFormCancelHandler}
                            onFocus={commentFormFocusHandler}
                            shouldFocusOnOpen
                            tagged_message={tagged_message}
                            updateComment={handleMessageUpdate}
                            // $FlowFixMe
                            user={currentUser}
                        />
                    ) : (
                        <ActivityMessage
                            id={id}
                            isEdited={isEdited && !isResolved}
                            tagged_message={tagged_message}
                            translatedTaggedMessage={translatedTaggedMessage}
                            {...translations}
                            translationFailed={error ? true : null}
                            getUserProfileUrl={getUserProfileUrl}
                        />
                    )}
                </div>
            </div>
            {/* $FlowFixMe */}
            {error ? <ActivityError {...error} /> : null}
            {hasReplies && (
                <Replies
                    {...commentProps}
                    isParentPending={isPending}
                    isRepliesLoading={isRepliesLoading}
                    onCommentEdit={onCommentEdit}
                    onHideReplies={onHideReplies}
                    onReplyCreate={onReplyCreate}
                    onReplyDelete={onReplyDelete}
                    onReplySelect={onSelect}
                    onShowReplies={onShowReplies}
                    replies={replies}
                    repliesTotalCount={repliesTotalCount}
                />
            )}
        </div>
    );
};

// Added Replies to Comment file to avoid circular dependency warning
type RepliesProps = {
    currentUser?: User,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: (searchStr: string) => void,
    getUserProfileUrl?: GetProfileUrlCallback,
    isParentPending?: boolean,
    isRepliesLoading?: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    onCommentEdit: OnCommentEdit,
    onHideReplies?: (shownReplies: CommentType[]) => void,
    onReplyCreate?: (reply: string) => void,
    onReplyDelete?: ({ id: string, permissions?: BoxCommentPermission }) => void,
    onReplySelect?: (isSelected: boolean) => void,
    onShowReplies?: () => void,
    replies: CommentType[],
    repliesTotalCount?: number,
    translations?: Translations,
};

export const Replies = ({
    currentUser,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    isParentPending = false,
    isRepliesLoading = false,
    mentionSelectorContacts,
    onCommentEdit,
    onReplyCreate,
    onReplyDelete,
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
                                <BaseComment
                                    {...reply}
                                    currentUser={currentUser}
                                    getAvatarUrl={getAvatarUrl}
                                    getMentionWithQuery={getMentionWithQuery}
                                    getUserProfileUrl={getUserProfileUrl}
                                    isPending={isParentPending || reply.isPending}
                                    mentionSelectorContacts={mentionSelectorContacts}
                                    onCommentEdit={onCommentEdit}
                                    onSelect={onReplySelect}
                                    onDelete={onReplyDelete}
                                    permissions={getReplyPermissions(reply)}
                                    translations={translations}
                                />
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
};
