/**
 * @flow
 * @file Active state component for Activity Feed
 */
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
import {
    FEED_ITEM_TYPE_ANNOTATION,
    FEED_ITEM_TYPE_APP_ACTIVITY,
    FEED_ITEM_TYPE_COMMENT,
    FEED_ITEM_TYPE_TASK,
    FEED_ITEM_TYPE_VERSION,
} from '../../../../constants';
import type {
    Annotation,
    AnnotationPermission,
    BoxCommentPermission,
    Comment as CommentType,
    CommentFeedItemType,
    FeedItem,
    FeedItems,
    FeedItemStatus,
} from '../../../../common/types/feed';
import type { SelectorItems, User } from '../../../../common/types/core';
import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { Translations } from '../../flowTypes';

type Props = {
    activeFeedItem: FeedItem,
    activeFeedItemRef: { current: null | HTMLElement },
    approverSelectorContacts?: SelectorItems<>,
    currentFileVersionId: string,
    currentUser?: User,
    getApproverWithQuery?: Function,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    hasReplies?: boolean,
    hasVersions?: boolean,
    items: FeedItems,
    mentionSelectorContacts?: SelectorItems<>,
    onAnnotationDelete?: ({ id: string, permissions: AnnotationPermission }) => void,
    onAnnotationEdit?: (id: string, text: string, permissions: AnnotationPermission) => void,
    onAnnotationSelect?: (annotation: Annotation) => void,
    onAnnotationStatusChange?: (id: string, status: FeedItemStatus, permissions: AnnotationPermission) => void,
    onAppActivityDelete?: Function,
    onCommentDelete?: Function,
    onCommentEdit?: (
        id: string,
        text?: string,
        status?: FeedItemStatus,
        hasMention: boolean,
        permissions: BoxCommentPermission,
        onSuccess: ?Function,
        onError: ?Function,
    ) => void,
    onHideReplies?: (id: string, replies: Array<CommentType>) => void,
    onReplyCreate?: (parentId: string, parentType: CommentFeedItemType, text: string) => void,
    onReplyDelete?: ({ id: string, parentId: string, permissions: BoxCommentPermission }) => void,
    onReplyUpdate?: (
        id: string,
        parentId: string,
        text: string,
        permissions: BoxCommentPermission,
        onSuccess: ?Function,
        onError: ?Function,
    ) => void,
    onShowReplies?: (id: string, type: CommentFeedItemType) => void,
    onTaskAssignmentUpdate?: Function,
    onTaskDelete?: Function,
    onTaskEdit?: Function,
    onTaskModalClose?: Function,
    onTaskView?: Function,
    onVersionInfo?: Function,
    translations?: Translations,
};

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
    translations,
}: Props): React.Node => {
    const [selectedThreadParentId, setSelectedThreadParentId] = React.useState(null);

    const onThreadSelected = (parentId: string) => (isSelected: boolean) => {
        setSelectedThreadParentId(isSelected ? parentId : null);
    };
    const onHideRepliesHandler = (parentId: string) => (lastReply: CommentType) => {
        onHideReplies(parentId, [lastReply]);
    };
    const onReplyCreateHandler = (parentId: string, parentType: CommentFeedItemType) => (text: string) => {
        onReplyCreate(parentId, parentType, text);
    };
    const onReplyDeleteHandler = (parentId: string) => (options: { id: string, permissions: BoxCommentPermission }) => {
        onReplyDelete({ ...options, parentId });
    };
    const onReplyUpdateHandler = (parentId: string) => (
        id: string,
        text: string,
        status?: FeedItemStatus,
        hasMention?: boolean,
        permissions: BoxCommentPermission,
        onSuccess: ?Function,
        onError: ?Function,
    ) => {
        onReplyUpdate(id, parentId, text, permissions, onSuccess, onError);
    };
    const onShowRepliesHandler = (id: string, type: CommentFeedItemType) => () => {
        onShowReplies(id, type);
    };

    return (
        <ul className="bcs-activity-feed-active-state">
            {items.map((item: FeedItem) => {
                const isFocused =
                    selectedThreadParentId === item.id ||
                    (selectedThreadParentId === null && activeFeedItem !== null && item === activeFeedItem);
                const refValue = isFocused ? activeFeedItemRef : undefined;
                const itemFileVersionId = getProp(item, 'file_version.id');

                switch (item.type) {
                    case FEED_ITEM_TYPE_COMMENT:
                        return (
                            <ActivityItem
                                key={item.type + item.id}
                                data-testid="comment"
                                isFocused={isFocused}
                                ref={refValue}
                            >
                                <ActivityThread
                                    currentUser={currentUser}
                                    data-testid="activity-thread"
                                    getAvatarUrl={getAvatarUrl}
                                    getMentionWithQuery={getMentionWithQuery}
                                    getUserProfileUrl={getUserProfileUrl}
                                    hasReplies={hasReplies}
                                    isRepliesLoading={item.isRepliesLoading}
                                    mentionSelectorContacts={mentionSelectorContacts}
                                    onHideReplies={onHideRepliesHandler(item.id)}
                                    onReplyCreate={onReplyCreateHandler(item.id, item.type)}
                                    onReplyDelete={onReplyDeleteHandler(item.id)}
                                    onReplyEdit={onReplyUpdateHandler(item.id)}
                                    onReplySelect={onThreadSelected(item.id)}
                                    onShowReplies={onShowRepliesHandler(item.id, item.type)}
                                    replies={item.replies}
                                    repliesTotalCount={item.total_reply_count}
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
                                        onSelect={onThreadSelected(item.id)}
                                        permissions={{
                                            can_delete: getProp(item.permissions, 'can_delete', false),
                                            can_edit: getProp(item.permissions, 'can_edit', false),
                                            can_reply: getProp(item.permissions, 'can_reply', false),
                                            can_resolve: getProp(item.permissions, 'can_resolve', false),
                                        }}
                                        translations={translations}
                                    />
                                </ActivityThread>
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
                                    onModalClose={onTaskModalClose}
                                    onView={onTaskView}
                                    translations={translations}
                                />
                            </ActivityItem>
                        );
                    case FEED_ITEM_TYPE_VERSION:
                        return (
                            <ActivityItem key={item.type + item.id} className="bcs-version-item" data-testid="version">
                                {item.versions ? (
                                    // $FlowFixMe
                                    <CollapsedVersion {...item} onInfo={onVersionInfo} />
                                ) : (
                                    // $FlowFixMe
                                    <Version {...item} onInfo={onVersionInfo} />
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
                                isFocused={isFocused}
                                ref={refValue}
                            >
                                <ActivityThread
                                    currentUser={currentUser}
                                    data-testid="activity-thread"
                                    getAvatarUrl={getAvatarUrl}
                                    getMentionWithQuery={getMentionWithQuery}
                                    getUserProfileUrl={getUserProfileUrl}
                                    hasReplies={hasReplies}
                                    isRepliesLoading={item.isRepliesLoading}
                                    mentionSelectorContacts={mentionSelectorContacts}
                                    onHideReplies={onHideRepliesHandler(item.id)}
                                    onReplyCreate={onReplyCreateHandler(item.id, item.type)}
                                    onReplyDelete={onReplyDeleteHandler(item.id)}
                                    onReplyEdit={onReplyUpdateHandler(item.id)}
                                    onShowReplies={onShowRepliesHandler(item.id, item.type)}
                                    replies={item.replies}
                                    repliesTotalCount={item.total_reply_count}
                                    translations={translations}
                                >
                                    <AnnotationActivity
                                        currentUser={currentUser}
                                        getAvatarUrl={getAvatarUrl}
                                        getMentionWithQuery={getMentionWithQuery}
                                        getUserProfileUrl={getUserProfileUrl}
                                        hasVersions={hasVersions}
                                        isCurrentVersion={currentFileVersionId === itemFileVersionId}
                                        item={item}
                                        mentionSelectorContacts={mentionSelectorContacts}
                                        onDelete={onAnnotationDelete}
                                        onEdit={onAnnotationEdit}
                                        onSelect={onAnnotationSelect}
                                        onStatusChange={onAnnotationStatusChange}
                                    />
                                </ActivityThread>
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
