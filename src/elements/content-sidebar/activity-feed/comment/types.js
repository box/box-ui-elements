// @flow
import * as React from 'react';
import type {
    ActionItemError,
    AnnotationPermission,
    BoxCommentPermission,
    FeedItemStatus,
    Comment as CommentType,
} from '../../../../common/types/feed';

import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { SelectorItems, User } from '../../../../common/types/core';
import type { Translations } from '../../flowTypes';
import './BaseComment.scss';
import './Replies.scss';
import './Comment.scss';

export type HandleMessageUpdate = ({
    hasMention: boolean,
    id: string,
    text: string,
}) => void;
export type HandleStatusUpdate = (selectedStatus: FeedItemStatus) => void;
export type OnSelect = (isSelected: boolean) => void;

export type BaseCommentAndRepliesSharedProps = {
    currentUser?: User,
    getAvatarUrl: GetAvatarUrlCallback,
    getUserProfileUrl?: GetProfileUrlCallback,
    isRepliesLoading?: boolean,
    mentionSelectorContacts?: SelectorItems<>,
    translations?: Translations,
};

export type BaseCommentSharedProps = BaseCommentAndRepliesSharedProps & {
    annotationActivityLink?: React.Element<any>,
    children?: React.Element<any>,
    error?: ActionItemError,
    getMentionWithQuery?: Function,
    hasReplies?: boolean,
    id: string,
    isAnnotation?: boolean,
    isDisabled?: boolean,
    isPending?: boolean,
    onSelect: OnSelect,
    status?: FeedItemStatus,
    tagged_message?: string,
    translatedTaggedMessage?: string,
};

export type BaseCommentProps = BaseCommentSharedProps & {
    // TODO: update with AnnotationActivityLink props
    created_at: string | number,
    created_by: User,
    modified_at?: string | number,
    onDelete: ({ id: string, permissions: BoxCommentPermission }) => any,
    onHideReplies?: (shownReplies: CommentType[]) => void,
    onReplyCreate?: (reply: string) => void,
    onSelect: OnSelect,
    onShowReplies?: () => void,
    permissions: BoxCommentPermission,
    replies?: CommentType[],
    repliesTotalCount?: number,
};

export type OnAnnotationEdit = (args: { id: string, permissions: AnnotationPermission, text?: string }) => void;
export type OnCommentEdit = (args: {
    hasMention: boolean,
    id: string,
    onError?: Function,
    onSuccess?: Function,
    permissions: BoxCommentPermission,
    status?: FeedItemStatus,
    text?: string,
}) => void;

export type BaseCommentContainerProps = BaseCommentSharedProps & {
    // TODO: update with AnnotationActivityLink props
    annotationActivityLink?: React.Element<any>,
    created_at: string | number,
    created_by: User,
    modified_at?: string | number,
    onAnnotationEdit?: OnAnnotationEdit,
    onCommentEdit?: OnCommentEdit,
    onDelete: ({ id: string, permissions: BoxCommentPermission }) => any,
    onHideReplies?: (shownReplies: CommentType[]) => void,
    onReplyCreate?: (reply: string) => void,
    onSelect: OnSelect,
    onShowReplies?: () => void,
    permissions: BoxCommentPermission,
    replies?: CommentType[],
    repliesTotalCount?: number,
};

export type BaseCommentWrapperType = (
    props: BaseCommentContainerProps,
) => React$Element<(props: BaseCommentProps) => React$Element<'div'>>;
