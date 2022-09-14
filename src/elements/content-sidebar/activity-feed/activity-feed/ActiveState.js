/**
 * @flow
 * @file Active state component for Activity Feed
 */
import * as React from 'react';
import getProp from 'lodash/get';
import ActivityThread from './ActivityThread';
import ActivityItem from './ActivityItem';
import AppActivity from '../app-activity';
import AnnotationActivity from '../annotations';
import Comment from '../comment';
import TaskNew from '../task-new';
import Version, { CollapsedVersion } from '../version';
import withErrorHandling from '../../withErrorHandling';
import type {
    Annotation,
    AnnotationPermission,
    BoxCommentPermission,
    FeedItem,
    FeedItems,
    FeedItemStatus,
    FocusableFeedItemType,
} from '../../../../common/types/feed';
import type { SelectorItems, User } from '../../../../common/types/core';
import type { GetAvatarUrlCallback, GetProfileUrlCallback } from '../../../common/flowTypes';
import type { Translations } from '../../flowTypes';

type Props = {
    activeFeedEntryId?: string,
    activeFeedEntryType?: FocusableFeedItemType,
    activeFeedItemRef: { current: null | HTMLElement },
    approverSelectorContacts?: SelectorItems<>,
    currentFileVersionId: string,
    currentUser?: User,
    getApproverWithQuery?: Function,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    hasReplies?: boolean,
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
    onTaskAssignmentUpdate?: Function,
    onTaskDelete?: Function,
    onTaskEdit?: Function,
    onTaskModalClose?: Function,
    onTaskView?: Function,
    onVersionInfo?: Function,
    translations?: Translations,
};

const ActiveState = ({
    activeFeedEntryId,
    activeFeedEntryType,
    activeFeedItemRef,
    approverSelectorContacts,
    currentFileVersionId,
    currentUser,
    hasReplies = false,
    items,
    mentionSelectorContacts,
    getMentionWithQuery,
    onAnnotationDelete,
    onAnnotationEdit,
    onAnnotationSelect,
    onAnnotationStatusChange,
    onAppActivityDelete,
    onCommentDelete,
    onCommentEdit,
    onTaskDelete,
    onTaskEdit,
    onTaskView,
    onTaskAssignmentUpdate,
    onTaskModalClose,
    onVersionInfo,
    translations,
    getApproverWithQuery,
    getAvatarUrl,
    getUserProfileUrl,
}: Props): React.Node => {
    const activeEntry = items.find(({ id, type }) => id === activeFeedEntryId && type === activeFeedEntryType);

    return (
        <ul className="bcs-activity-feed-active-state">
            {items.map((item: FeedItem) => {
                const isFocused = item === activeEntry;
                const refValue = isFocused ? activeFeedItemRef : undefined;
                const itemFileVersionId = getProp(item, 'file_version.id');

                switch (item.type) {
                    case 'comment':
                        return (
                            <ActivityItem
                                key={item.type + item.id}
                                data-testid="comment"
                                isFocused={isFocused}
                                ref={refValue}
                            >
                                <ActivityThread
                                    data-testid="activity-thread"
                                    onReplyDelete={onCommentDelete}
                                    onReplyEdit={onCommentEdit}
                                    currentUser={currentUser}
                                    getAvatarUrl={getAvatarUrl}
                                    hasReplies={hasReplies}
                                    getMentionWithQuery={getMentionWithQuery}
                                    getUserProfileUrl={getUserProfileUrl}
                                    mentionSelectorContacts={mentionSelectorContacts}
                                    totalReplyCount={item.total_reply_count}
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
                    case 'task':
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
                                    translations={translations}
                                />
                            </ActivityItem>
                        );
                    case 'file_version':
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
                    case 'app_activity':
                        return (
                            <ActivityItem
                                key={item.type + item.id}
                                className="bcs-activity-feed-app-activity"
                                data-testid="app-activity"
                            >
                                <AppActivity currentUser={currentUser} onDelete={onAppActivityDelete} {...item} />
                            </ActivityItem>
                        );
                    case 'annotation':
                        return (
                            <ActivityItem
                                key={item.type + item.id}
                                className="bcs-activity-feed-annotation-activity"
                                data-testid="annotation-activity"
                                isFocused={isFocused}
                                ref={refValue}
                            >
                                <ActivityThread
                                    data-testid="activity-thread"
                                    onReplyDelete={onCommentDelete}
                                    onReplyEdit={onCommentEdit}
                                    currentUser={currentUser}
                                    getAvatarUrl={getAvatarUrl}
                                    getMentionWithQuery={getMentionWithQuery}
                                    getUserProfileUrl={getUserProfileUrl}
                                    hasReplies={hasReplies}
                                    mentionSelectorContacts={mentionSelectorContacts}
                                    totalReplyCount={item.total_reply_count}
                                    replies={item.replies}
                                    translations={translations}
                                >
                                    <AnnotationActivity
                                        currentUser={currentUser}
                                        getAvatarUrl={getAvatarUrl}
                                        getUserProfileUrl={getUserProfileUrl}
                                        getMentionWithQuery={getMentionWithQuery}
                                        isCurrentVersion={currentFileVersionId === itemFileVersionId}
                                        item={item}
                                        mentionSelectorContacts={mentionSelectorContacts}
                                        onEdit={onAnnotationEdit}
                                        onDelete={onAnnotationDelete}
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
