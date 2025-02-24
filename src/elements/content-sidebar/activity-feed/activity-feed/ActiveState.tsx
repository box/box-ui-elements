import * as React from 'react';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import ActivityThread from './ActivityThread';
import ActivityItem from './ActivityItem';
import AppActivity from '../app-activity';
import AnnotationActivity from '../annotations';
import Comment from '../comment';
import TaskNew from '../task-new';
import Version, { CollapsedVersion } from '../version';
import withErrorHandling from '../../withErrorHandling';
import { BaseComment } from '../comment/BaseComment';
import {
    FEED_ITEM_TYPE_ANNOTATION,
    FEED_ITEM_TYPE_APP_ACTIVITY,
    FEED_ITEM_TYPE_COMMENT,
    FEED_ITEM_TYPE_TASK,
    FEED_ITEM_TYPE_VERSION,
} from '../../../../constants';
import {
    Annotation,
    AnnotationPermission,
    BoxCommentPermission,
    Comment as CommentType,
    CommentFeedItemType,
    FeedItem,
    FeedItems,
    FeedItemStatus,
} from '../../../../common/types/feed';
import { SelectorItems, User, GroupMini } from '../../../../common/types/core';
import { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import { Translations } from '../../flowTypes';
import { OnAnnotationEdit, OnAnnotationStatusChange, OnCommentEdit, OnCommentStatusChange } from '../comment/types';
import AnnotationActivityLinkProvider from './AnnotationActivityLinkProvider';

interface ActiveStateProps {
    activeFeedItem: FeedItem;
    activeFeedItemRef: React.RefObject<HTMLLIElement>;
    approverSelectorContacts?: SelectorItems<User | GroupMini>;
    currentFileVersionId: string;
    currentUser?: User;
    getApproverWithQuery?: (searchStr: string) => void;
    getAvatarUrl: GetAvatarUrlCallback;
    getMentionWithQuery?: (searchStr: string) => void;
    getUserProfileUrl?: GetProfileUrlCallback;
    hasNewThreadedReplies?: boolean;
    hasReplies?: boolean;
    hasVersions?: boolean;
    items: FeedItems;
    mentionSelectorContacts?: SelectorItems<User>;
    onAnnotationDelete?: (params: { id: string; permissions: AnnotationPermission }) => void;
    onAnnotationEdit?: OnAnnotationEdit;
    onAnnotationSelect?: (annotation: Annotation) => void;
    onAnnotationStatusChange: OnAnnotationStatusChange;
    onAppActivityDelete?: (id: string) => void;
    onCommentDelete?: (id: string, permissions: BoxCommentPermission) => void;
    onCommentEdit?: OnCommentEdit;
    onCommentSelect?: (id: string | null) => void;
    onHideReplies?: (id: string, replies: Array<CommentType>) => void;
    onReplyCreate?: (parentId: string, parentType: CommentFeedItemType, text: string) => void;
    onReplyDelete?: (params: { id: string; parentId: string; permissions: BoxCommentPermission }) => void;
    onReplyUpdate?: (
        id: string,
        parentId: string,
        text: string,
        permissions: BoxCommentPermission,
        onSuccess?: Function,
        onError?: Function,
    ) => void;
    onShowReplies?: (id: string, type: CommentFeedItemType) => void;
    onTaskAssignmentUpdate?: (taskId: string, taskAssignmentId: string, status: string) => void;
    onTaskDelete?: (id: string) => void;
    onTaskEdit?: (id: string, text: string, dueAt: string | null) => void;
    onTaskModalClose?: () => void;
    onTaskView?: (id: string) => void;
    onVersionInfo?: (version: string) => void;
    shouldUseUAA?: boolean;
    translations?: Translations;
}

const ActiveState = ({
    activeFeedItem,
    activeFeedItemRef,
    approverSelectorContacts,
    currentFileVersionId,
    currentUser,
    getApproverWithQuery,
    getAvatarUrl,
    getMentionWithQuery,
    getUserProfileUrl,
    hasNewThreadedReplies = false,
    hasReplies = false,
    hasVersions,
    items,
    mentionSelectorContacts,
    onAnnotationDelete,
    onAnnotationEdit,
    onAnnotationSelect,
    onAnnotationStatusChange,
    onAppActivityDelete,
    onCommentDelete,
    onCommentEdit,
    onCommentSelect = noop,
    onHideReplies = noop,
    onReplyCreate = noop,
    onReplyDelete = noop,
    onReplyUpdate = noop,
    onShowReplies = noop,
    onTaskAssignmentUpdate,
    onTaskDelete,
    onTaskEdit,
    onTaskModalClose,
    onTaskView,
    onVersionInfo,
    shouldUseUAA,
    translations,
}: ActiveStateProps): React.ReactNode => {
    const onCommentSelectHandler = (itemId: string) => (isSelected: boolean) => {
        onCommentSelect(isSelected ? itemId : null);
    };
    const onHideRepliesHandler = (parentId: string) => (lastReply: CommentType) => {
        onHideReplies(parentId, [lastReply]);
    };
    const onReplyCreateHandler = (parentId: string, parentType: CommentFeedItemType) => (text: string) => {
        onReplyCreate(parentId, parentType, text);
    };
    const onReplyDeleteHandler = (parentId: string) => (options: { id: string; permissions: BoxCommentPermission }) => {
        onReplyDelete({ ...options, parentId });
    };
    const onReplyUpdateHandler =
        (parentId: string) =>
        (
            id: string,
            text: string,
            permissions: BoxCommentPermission,
            status?: FeedItemStatus,
            hasMention?: boolean,
            onSuccess?: () => void,
            onError?: (error: Error) => void,
        ) => {
            onReplyUpdate(id, parentId, text, permissions, onSuccess, onError);
        };
    const onShowRepliesHandler = (id: string, type: CommentFeedItemType) => () => {
        onShowReplies(id, type);
    };
    const onCommentStatusChangeHandler: OnCommentStatusChange = (props: {
        id: string;
        permissions: AnnotationPermission | BoxCommentPermission;
        status: FeedItemStatus;
    }) => {
        if (onCommentEdit) {
            onCommentEdit({ hasMention: false, ...props });
        }
    };

    const hasMultipleVersions = item => item.versions || (shouldUseUAA && item.version_start !== item.version_end);

    return (
        <ul className="bcs-activity-feed-active-state">
            {items.map((item: FeedItem) => {
                const isFocused = item === activeFeedItem;
                const refValue = isFocused ? activeFeedItemRef : undefined;
                const itemFileVersionId = getProp(item, 'file_version.id');
                const replyProps = {
                    hasReplies,
                    onReplySelect: onCommentSelectHandler(item.id),
                };

                const commentAndAnnotationCommonProps = {
                    ...item,
                    ...replyProps,
                    currentUser,
                    getAvatarUrl,
                    getMentionWithQuery,
                    getUserProfileUrl,
                    mentionSelectorContacts,
                    onHideReplies: shownReplies => onHideReplies(item.id, shownReplies),
                    onSelect: onCommentSelectHandler(item.id),
                    permissions: {
                        can_delete: getProp(item.permissions, 'can_delete', false),
                        can_edit: getProp(item.permissions, 'can_edit', false),
                        can_reply: getProp(item.permissions, 'can_reply', false),
                        can_resolve: getProp(item.permissions, 'can_resolve', false),
                    },
                    // TODO: legitimate, pre-existing typing issue that was previously undetected
                    // $FlowFixMe
                    repliesTotalCount: item.total_reply_count,
                    translations,
                };

                switch (item.type) {
                    case FEED_ITEM_TYPE_COMMENT:
                        return (
                            <ActivityItem
                                key={item.type + item.id}
                                data-testid="comment"
                                isFocused={isFocused}
                                isHoverable
                                hasNewThreadedReplies={hasNewThreadedReplies}
                                ref={refValue}
                            >
                                {hasNewThreadedReplies ? (
                                    // TODO: legitimate, pre-existing typing issue that was previously undetected
                                    // Conflict between BoxCommentPermissions and BoxTaskPermissions
                                    // $FlowFixMe
                                    <BaseComment
                                        {...commentAndAnnotationCommonProps}
                                        onDelete={onCommentDelete}
                                        onCommentEdit={onCommentEdit}
                                        onReplyCreate={reply => onReplyCreate(item.id, FEED_ITEM_TYPE_COMMENT, reply)}
                                        onReplyDelete={onReplyDeleteHandler(item.id)}
                                        onShowReplies={() => onShowReplies(item.id, FEED_ITEM_TYPE_COMMENT)}
                                        onStatusChange={onCommentStatusChangeHandler}
                                    />
                                ) : (
                                    <ActivityThread
                                        data-testid="activity-thread"
                                        currentUser={currentUser}
                                        getAvatarUrl={getAvatarUrl}
                                        getMentionWithQuery={getMentionWithQuery}
                                        getUserProfileUrl={getUserProfileUrl}
                                        hasNewThreadedReplies={hasNewThreadedReplies}
                                        hasReplies={hasReplies}
                                        isPending={item.isPending}
                                        isRepliesLoading={item.isRepliesLoading}
                                        mentionSelectorContacts={mentionSelectorContacts}
                                        onHideReplies={onHideRepliesHandler(item.id)}
                                        onReplyCreate={onReplyCreateHandler(item.id, item.type)}
                                        onReplyDelete={onReplyDeleteHandler(item.id)}
                                        onReplyEdit={onReplyUpdateHandler(item.id)}
                                        onReplySelect={onCommentSelectHandler(item.id)}
                                        onShowReplies={onShowRepliesHandler(item.id, item.type)}
                                        repliesTotalCount={item.total_reply_count}
                                        replies={item.replies}
                                        translations={translations}
                                    >
                                        <Comment
                                            {...item}
                                            currentUser={currentUser}
                                            getAvatarUrl={getAvatarUrl}
                                            getMentionWithQuery={getMentionWithQuery}
                                            getUserProfileUrl={getUserProfileUrl}
                                            mentionSelectorContacts={mentionSelectorContacts}
                                            onDelete={onCommentDelete}
                                            onEdit={onCommentEdit}
                                            onSelect={onCommentSelectHandler(item.id)}
                                            permissions={{
                                                can_delete: getProp(item.permissions, 'can_delete', false),
                                                can_edit: getProp(item.permissions, 'can_edit', false),
                                                can_reply: getProp(item.permissions, 'can_reply', false),
                                                can_resolve: getProp(item.permissions, 'can_resolve', false),
                                            }}
                                            translations={translations}
                                        />
                                    </ActivityThread>
                                )}
                            </ActivityItem>
                        );
                    case FEED_ITEM_TYPE_TASK:
                        return (
                            <ActivityItem
                                key={item.type + item.id}
                                className="bcs-activity-feed-task-new"
                                data-testid="task"
                                isFocused={isFocused}
                                ref={refValue}
                            >
                                <TaskNew
                                    {...item}
                                    approverSelectorContacts={approverSelectorContacts}
                                    currentUser={currentUser}
                                    getApproverWithQuery={getApproverWithQuery}
                                    getAvatarUrl={getAvatarUrl}
                                    getUserProfileUrl={getUserProfileUrl}
                                    onAssignmentUpdate={onTaskAssignmentUpdate}
                                    onDelete={onTaskDelete}
                                    onEdit={onTaskEdit}
                                    onView={onTaskView}
                                    onModalClose={onTaskModalClose}
                                    shouldUseUAA={shouldUseUAA}
                                    translations={translations}
                                />
                            </ActivityItem>
                        );
                    case FEED_ITEM_TYPE_VERSION:
                        return (
                            <ActivityItem key={item.type + item.id} className="bcs-version-item" data-testid="version">
                                {hasMultipleVersions(item) ? (
                                    // $FlowFixMe
                                    <CollapsedVersion {...item} onInfo={onVersionInfo} shouldUseUAA={shouldUseUAA} />
                                ) : (
                                    // $FlowFixMe
                                    <Version {...item} onInfo={onVersionInfo} shouldUseUAA={shouldUseUAA} />
                                )}
                            </ActivityItem>
                        );
                    case FEED_ITEM_TYPE_APP_ACTIVITY:
                        return (
                            <ActivityItem
                                key={item.type + item.id}
                                className="bcs-activity-feed-app-activity"
                                data-testid="app-activity"
                            >
                                <AppActivity currentUser={currentUser} onDelete={onAppActivityDelete} {...item} />
                            </ActivityItem>
                        );
                    case FEED_ITEM_TYPE_ANNOTATION:
                        return (
                            <ActivityItem
                                key={item.type + item.id}
                                className="bcs-activity-feed-annotation-activity"
                                data-testid="annotation-activity"
                                isHoverable
                                hasNewThreadedReplies={hasNewThreadedReplies}
                                isFocused={isFocused}
                                ref={refValue}
                            >
                                {hasNewThreadedReplies && onAnnotationSelect ? (
                                    // TODO: legitimate, pre-existing typing issue that was previously undetected
                                    // Conflict between BoxCommentPermissions and BoxTaskPermissions
                                    // $FlowFixMe
                                    <BaseComment
                                        {...commentAndAnnotationCommonProps}
                                        annotationActivityLink={
                                            <AnnotationActivityLinkProvider
                                                item={item}
                                                onSelect={onAnnotationSelect}
                                                isCurrentVersion={currentFileVersionId === itemFileVersionId}
                                            />
                                        }
                                        onAnnotationEdit={onAnnotationEdit}
                                        onCommentEdit={onCommentEdit}
                                        onDelete={onAnnotationDelete}
                                        onStatusChange={onAnnotationStatusChange}
                                        onReplyCreate={reply =>
                                            onReplyCreate(item.id, FEED_ITEM_TYPE_ANNOTATION, reply)
                                        }
                                        onShowReplies={() => onShowReplies(item.id, FEED_ITEM_TYPE_ANNOTATION)}
                                        tagged_message={item.description?.message ?? ''}
                                    />
                                ) : (
                                    <ActivityThread
                                        data-testid="activity-thread"
                                        currentUser={currentUser}
                                        getAvatarUrl={getAvatarUrl}
                                        getMentionWithQuery={getMentionWithQuery}
                                        getUserProfileUrl={getUserProfileUrl}
                                        hasNewThreadedReplies={hasNewThreadedReplies}
                                        hasReplies={hasReplies}
                                        isPending={item.isPending}
                                        isRepliesLoading={item.isRepliesLoading}
                                        mentionSelectorContacts={mentionSelectorContacts}
                                        onHideReplies={onHideRepliesHandler(item.id)}
                                        onReplyCreate={onReplyCreateHandler(item.id, item.type)}
                                        onReplyDelete={onReplyDeleteHandler(item.id)}
                                        onReplyEdit={onReplyUpdateHandler(item.id)}
                                        onReplySelect={onCommentSelectHandler(item.id)}
                                        onShowReplies={onShowRepliesHandler(item.id, item.type)}
                                        repliesTotalCount={item.total_reply_count}
                                        replies={item.replies}
                                        translations={translations}
                                    >
                                        <AnnotationActivity
                                            currentUser={currentUser}
                                            getAvatarUrl={getAvatarUrl}
                                            getUserProfileUrl={getUserProfileUrl}
                                            getMentionWithQuery={getMentionWithQuery}
                                            hasVersions={hasVersions}
                                            isCurrentVersion={currentFileVersionId === itemFileVersionId}
                                            item={item}
                                            mentionSelectorContacts={mentionSelectorContacts}
                                            onEdit={onAnnotationEdit}
                                            onDelete={onAnnotationDelete}
                                            onSelect={onAnnotationSelect}
                                            onStatusChange={onAnnotationStatusChange}
                                        />
                                    </ActivityThread>
                                )}
                            </ActivityItem>
                        );
                    default:
                        return null;
                }
            })}
        </ul>
    );
};

export { ActiveState as ActiveStateComponent };
export default withErrorHandling(ActiveState);
