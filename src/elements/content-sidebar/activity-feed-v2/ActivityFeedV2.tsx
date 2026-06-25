/**
 * @file Activity Feed V2 adapter - wraps @box/activity-feed compound components.
 *
 * Read data comes from the file activities endpoint (already parsed into BUIE FeedItem types by Feed.js).
 * Write/mutate operations still use the traditional v2 API via ActivitySidebar callbacks.
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedMessage, useIntl } from 'react-intl';

import { ActivityFeed, useActivityFeedScroll } from '@box/activity-feed';

import TaskModal from '../TaskModal';

import FeedItemRow from './FeedItemRow';
import { serializeEditorContent } from './helpers';
import { transformFeedItem } from './transformers';
import { useAvatarUrls } from './useAvatarUrls';
import { useTimeFormat } from './useTimeFormat';
import { useVideoTimestamp } from './useVideoTimestamp';

import type { ActivityFeedV2Props, TransformedFeedItem, UserContact } from './types';
import type { TaskAssigneeCollection, TaskNew } from '../../../common/types/tasks';

import { FILE_EXTENSIONS } from '../../common/item/constants';
import { TASK_COMPLETION_RULE_ALL, TASK_EDIT_MODE_EDIT, TASK_TYPE_APPROVAL } from '../../../constants';

import commonMessages from '../../common/messages';
import draftJsMentionSelectorMessages from '../../../components/form-elements/draft-js-mention-selector/messages';
import messages from '../messages';

import './ActivityFeedV2.scss';

const ActivityFeedV2 = ({
    activeFeedEntryId,
    approverSelectorContacts = [],
    createTask,
    currentUser,
    feedItems,
    file,
    getApproverWithQuery,
    getAvatarUrl,
    getMentionAsync,
    getTaskCollaborators,
    getViewer,
    hasTasks = true,
    isDisabled = false,
    isTimestampedCommentsEnabled = false,
    onAnnotationCopyLink,
    onAnnotationDelete,
    onAnnotationEdit,
    onAnnotationSelect,
    onAnnotationStatusChange,
    onCommentCopyLink,
    onCommentCreate,
    onCommentDelete,
    onCommentUpdate,
    onReplyCreate,
    onReplyDelete,
    onReplyUpdate,
    onShowOnlyMentionsMeChange,
    onShowResolvedChange,
    onTaskAssignmentUpdate,
    onTaskDelete,
    onTaskUpdate,
    onTaskView,
    onVersionHistoryClick,
    showOnlyMentionsMe: showOnlyMentionsMeProp,
    showResolved: showResolvedProp,
}: ActivityFeedV2Props) => {
    const intl = useIntl();
    const scrollHandle = useActivityFeedScroll();
    const currentUserId = currentUser?.id;
    const headerTitle = intl.formatMessage(commonMessages.sidebarActivityTitle);

    const scrolledEntryIdRef = React.useRef<string | null>(null);
    const hasScrolledToEndRef = React.useRef(false);
    const knownIdsBeforePostRef = React.useRef<Set<string> | null>(null);

    const fetchUsers = React.useCallback(
        async (inputValue: string): Promise<UserContact[]> => {
            const trimmed = inputValue.trim();
            if (!trimmed || !getMentionAsync) {
                return [];
            }
            try {
                const entries = await getMentionAsync(trimmed);
                return entries.map((c: Record<string, unknown>) => ({
                    email: (c.email as string) ?? (c.login as string) ?? '',
                    id: Number(c.id) || 0,
                    name: (c.name as string) ?? '',
                    value: String(c.id),
                }));
            } catch {
                return [];
            }
        },
        [getMentionAsync],
    );

    const fetchAvatarUrls = React.useCallback(
        async (userContacts: UserContact[]) => {
            const urls: Record<string, string> = {};
            if (getAvatarUrl) {
                await Promise.all(
                    userContacts.map(async contact => {
                        // Key by contact.value; contact.id may collide when ids don't parse as numbers.
                        try {
                            const url = await getAvatarUrl(contact.value);
                            if (url) {
                                urls[contact.value] = url;
                            }
                        } catch {
                            // Individual avatar failure should not block other avatars
                        }
                    }),
                );
            }
            return urls;
        },
        [getAvatarUrl],
    );

    const userSelectorProps = React.useMemo(
        () => ({
            allowEmptyQuery: true,
            ariaRoleDescription: intl.formatMessage(messages.mentionUserSelectorRoleDescription),
            fetchAvatarUrls,
            fetchUsers,
            loadingAriaLabel: intl.formatMessage(messages.mentionUserSelectorLoading),
            renderEmpty: (value: string) => (
                <div className="bcs-NewActivityFeed-mentionEmpty">
                    <FormattedMessage
                        {...(value.trim()
                            ? draftJsMentionSelectorMessages.noUsersFound
                            : draftJsMentionSelectorMessages.startMention)}
                    />
                </div>
            ),
        }),
        [fetchAvatarUrls, fetchUsers, intl],
    );

    // collaborationPopoverProps must be defined so MentionComponent can
    // destructure onSubmit/onClose from it without crashing. getAvatarUrl is
    // intentionally omitted: the mentionContext contract is synchronous
    // ((id: string) => string) but BUIE's getAvatarUrl is async, so there is
    // no correct sync adapter without a caching layer. Leave it undefined
    // until the vendor contract supports async resolution.
    const mentionContext = React.useMemo(
        () => ({
            collaborationPopoverProps: {
                onClose: noop,
                onSubmit: noop,
            },
        }),
        [],
    );

    const [localShowOnlyMentionsMe, setLocalShowOnlyMentionsMe] = React.useState(false);
    const [localShowResolved, setLocalShowResolved] = React.useState(false);
    const showOnlyMentionsMe = showOnlyMentionsMeProp ?? localShowOnlyMentionsMe;
    const showResolved = showResolvedProp ?? localShowResolved;

    const handleShowOnlyMentionsMeChange = (checked: boolean) => {
        if (showOnlyMentionsMeProp === undefined) setLocalShowOnlyMentionsMe(checked);
        onShowOnlyMentionsMeChange?.(checked);
    };
    const handleShowResolvedChange = (checked: boolean) => {
        if (showResolvedProp === undefined) setLocalShowResolved(checked);
        onShowResolvedChange?.(checked);
    };

    const [isTaskFormOpen, setIsTaskFormOpen] = React.useState(false);
    const [taskType, setTaskType] = React.useState<string>(TASK_TYPE_APPROVAL);
    const [taskError, setTaskError] = React.useState<Error | null>(null);
    const [editingTask, setEditingTask] = React.useState<TaskNew | null>(null);
    const [editingAssignees, setEditingAssignees] = React.useState<TaskAssigneeCollection | null>(null);

    const handleTaskModalClose = React.useCallback(() => {
        setIsTaskFormOpen(false);
        setTaskError(null);
        setEditingTask(null);
        setEditingAssignees(null);
    }, []);

    const handleTaskEdit = React.useCallback(
        async (task: TaskNew) => {
            let fullAssignees = task.assigned_to;
            if (task.assigned_to?.next_marker && getTaskCollaborators) {
                try {
                    fullAssignees = await getTaskCollaborators(task);
                } catch (error) {
                    // eslint-disable-next-line no-console
                    console.error(`ActivityFeedV2: failed to load assignees for task "${task.id}"`, error);
                }
            }
            setEditingTask(task);
            setEditingAssignees(fullAssignees);
            setTaskType(task.task_type);
            setIsTaskFormOpen(true);
        },
        [getTaskCollaborators],
    );

    const avatarUrls = useAvatarUrls(feedItems, getAvatarUrl);

    const transformedItems: TransformedFeedItem[] = React.useMemo(() => {
        if (!feedItems) return [];
        return feedItems.reduce<TransformedFeedItem[]>((acc, item) => {
            const transformed = transformFeedItem(item, currentUserId, avatarUrls);
            if (transformed) {
                acc.push(transformed);
            }
            return acc;
        }, []);
    }, [avatarUrls, currentUserId, feedItems]);

    const filteredItems = React.useMemo(() => {
        const filtered = transformedItems.filter(item => {
            if ((item.type === 'comment' || item.type === 'annotation') && item.isResolved && !showResolved) {
                return false;
            }
            if (showOnlyMentionsMe && currentUserId) {
                if (item.type === 'comment' || item.type === 'annotation') {
                    const hasMention = item.messages.some(msg =>
                        msg.message?.content?.some(
                            (paragraph: { content?: Array<{ type: string; attrs?: { mentionedUserId?: string } }> }) =>
                                paragraph.content?.some(
                                    node => node.type === 'mention' && node.attrs?.mentionedUserId === currentUserId,
                                ),
                        ),
                    );
                    if (!hasMention) return false;
                }
                if (item.type === 'task') {
                    const isAssigned = item.props.assignees.some(a => a.id === currentUserId);
                    if (!isAssigned) return false;
                }
                if (item.type === 'version' || item.type === 'app_activity') {
                    return false;
                }
            }
            return true;
        });
        const filtersDroppedItems = filtered.length < transformedItems.length;
        if (!filtersDroppedItems && filtered.every(item => item.type === 'version')) {
            return [];
        }
        return filtered;
    }, [currentUserId, showOnlyMentionsMe, showResolved, transformedItems]);

    React.useEffect(() => {
        const alreadyScrolledToThisEntry = scrolledEntryIdRef.current === activeFeedEntryId;
        if (!activeFeedEntryId || !scrollHandle || alreadyScrolledToThisEntry) {
            return;
        }
        const didScroll = scrollHandle.scrollTo(activeFeedEntryId);
        if (didScroll) {
            scrolledEntryIdRef.current = activeFeedEntryId;
        }
    }, [activeFeedEntryId, filteredItems, scrollHandle]);

    React.useEffect(() => {
        const hasDeepLink = Boolean(activeFeedEntryId);
        if (hasScrolledToEndRef.current || hasDeepLink || !scrollHandle || filteredItems.length === 0) {
            return;
        }
        const lastItemId = filteredItems[filteredItems.length - 1].id;
        const didScroll = scrollHandle.scrollTo(lastItemId);
        if (didScroll) {
            hasScrolledToEndRef.current = true;
        }
    }, [activeFeedEntryId, filteredItems, scrollHandle]);

    // Scroll only to comments/annotations the current user authored after the post
    // snapshot, so a concurrent push from another user doesn't hijack the viewport.
    React.useEffect(() => {
        const knownIds = knownIdsBeforePostRef.current;
        if (!knownIds || !scrollHandle || !currentUserId) return;
        const newItem = filteredItems.find(item => {
            if (knownIds.has(item.id)) return false;
            if (item.type !== 'comment' && item.type !== 'annotation') return false;
            const author = item.messages[0]?.author;
            return author ? String(author.id) === currentUserId : false;
        });
        if (!newItem) return;
        if (scrollHandle.scrollTo(newItem.id)) {
            knownIdsBeforePostRef.current = null;
        }
    }, [currentUserId, filteredItems, scrollHandle]);

    const isVideo = file?.extension ? FILE_EXTENSIONS.video.includes(file.extension) : false;
    const fileVersionId = file?.file_version?.id;
    const allowVideoTimestamps = isVideo && isTimestampedCommentsEnabled && Boolean(fileVersionId);
    const { timeFormat, fps } = useTimeFormat(isVideo);

    const {
        formattedTimestamp,
        isPressed: isTimestampPressed,
        onPressedChange,
        timestampMs,
    } = useVideoTimestamp(allowVideoTimestamps, timeFormat, fps);

    const editorVideoTimestamp = allowVideoTimestamps
        ? { formattedTimestamp, isPressed: isTimestampPressed, onPressedChange }
        : undefined;

    React.useEffect(() => {
        if (!getViewer || !isVideo) return undefined;
        const viewer = getViewer();
        if (!viewer) return undefined;

        const markers: Array<{
            avatarUrl?: string;
            colorIndex?: number;
            id: string;
            initial?: string;
            time: number;
            type: 'annotation' | 'comment';
        }> = [];
        for (const item of filteredItems) {
            if (item.type === 'comment' && item.annotationTimestampMs != null) {
                const author = item.messages[0]?.author;
                markers.push({
                    avatarUrl: author?.avatarUrl ?? undefined,
                    colorIndex: author?.id ?? 0,
                    id: item.id,
                    initial: author?.name?.[0] ?? undefined,
                    time: item.annotationTimestampMs / 1000,
                    type: 'comment',
                });
            } else if (item.type === 'annotation') {
                const loc = item.annotation?.target?.location;
                if (loc?.type === 'frame' && loc.value != null) {
                    const author = item.messages[0]?.author;
                    markers.push({
                        avatarUrl: author?.avatarUrl ?? undefined,
                        colorIndex: author?.id ?? 0,
                        id: item.id,
                        initial: author?.name?.[0] ?? undefined,
                        time: loc.value / 1000,
                        type: 'annotation',
                    });
                }
            }
        }
        viewer.emit('commentmarkers', markers);

        const handleMarkerSelect = ({ id }: { id: string }) => {
            requestAnimationFrame(() => {
                const el = document.querySelector(`[data-activity-id="${CSS.escape(id)}"]`);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        };
        viewer.addListener('commentmarkerselect', handleMarkerSelect);
        return () => {
            viewer.removeListener('commentmarkerselect', handleMarkerSelect);
        };
    }, [filteredItems, getViewer, isVideo]);

    const handleCommentPost = React.useCallback(
        async (content: unknown) => {
            if (!onCommentCreate) return;
            const serialized = serializeEditorContent(content);
            if (!serialized || !serialized.text) return;
            const text =
                allowVideoTimestamps && isTimestampPressed && fileVersionId
                    ? `#[timestamp:${timestampMs},versionId:${fileVersionId}] ${serialized.text}`
                    : serialized.text;
            try {
                const snapshot = new Set(filteredItems.map(item => item.id));
                await onCommentCreate(text, serialized.hasMention);
                knownIdsBeforePostRef.current = snapshot;
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error('ActivityFeedV2: failed to post comment', error);
            }
        },
        [allowVideoTimestamps, filteredItems, fileVersionId, isTimestampPressed, onCommentCreate, timestampMs],
    );

    return (
        <div className="bcs-NewActivityFeed" data-resin-feature="activityfeedv2">
            <ActivityFeed.Root mentionContext={mentionContext} scrollTo={scrollHandle}>
                <ActivityFeed.Header title={headerTitle}>
                    <ActivityFeed.Header.Actions>
                        <ActivityFeed.Header.FilterMenu hasActiveFilters={showOnlyMentionsMe || showResolved}>
                            <ActivityFeed.Header.ShowResolvedOption
                                checked={showResolved}
                                onCheckedChange={handleShowResolvedChange}
                            />
                            <ActivityFeed.Header.MentionMeOption
                                checked={showOnlyMentionsMe}
                                hasTasks={hasTasks}
                                onCheckedChange={handleShowOnlyMentionsMeChange}
                            />
                        </ActivityFeed.Header.FilterMenu>
                        {hasTasks && (
                            <ActivityFeed.Header.TaskButton
                                disabled={isDisabled}
                                onMenuItemClick={selectedTaskType => {
                                    setTaskType(selectedTaskType);
                                    setIsTaskFormOpen(true);
                                }}
                            />
                        )}
                    </ActivityFeed.Header.Actions>
                </ActivityFeed.Header>
                {feedItems && (
                    <div className="bcs-NewActivityFeed-list">
                        <ActivityFeed.List>
                            {filteredItems.map(item => (
                                <FeedItemRow
                                    key={item.id}
                                    currentUserId={currentUserId}
                                    fps={fps}
                                    isDisabled={isDisabled}
                                    item={item}
                                    onAnnotationCopyLink={onAnnotationCopyLink}
                                    onAnnotationDelete={onAnnotationDelete}
                                    onAnnotationEdit={onAnnotationEdit}
                                    onAnnotationSelect={onAnnotationSelect}
                                    onAnnotationStatusChange={onAnnotationStatusChange}
                                    onCommentCopyLink={onCommentCopyLink}
                                    onCommentDelete={onCommentDelete}
                                    onCommentUpdate={onCommentUpdate}
                                    onReplyCreate={onReplyCreate}
                                    onReplyDelete={onReplyDelete}
                                    onReplyUpdate={onReplyUpdate}
                                    onTaskAssignmentUpdate={onTaskAssignmentUpdate}
                                    onTaskDelete={onTaskDelete}
                                    onTaskEdit={onTaskUpdate ? handleTaskEdit : undefined}
                                    onTaskView={onTaskView}
                                    onVersionHistoryClick={onVersionHistoryClick}
                                    timeFormat={timeFormat}
                                    userSelectorProps={userSelectorProps}
                                />
                            ))}
                        </ActivityFeed.List>
                    </div>
                )}
                <div className="bcs-NewActivityFeed-editor">
                    <ActivityFeed.Editor
                        disableComponent={isDisabled || !currentUser}
                        onPost={handleCommentPost}
                        userSelectorProps={userSelectorProps}
                        videoTimestamp={editorVideoTimestamp}
                    />
                </div>
            </ActivityFeed.Root>
            <TaskModal
                editMode={editingTask ? TASK_EDIT_MODE_EDIT : undefined}
                error={taskError}
                isTaskFormOpen={isTaskFormOpen}
                onModalClose={handleTaskModalClose}
                onSubmitError={setTaskError}
                onSubmitSuccess={handleTaskModalClose}
                taskFormProps={
                    editingTask
                        ? {
                              approvers: editingAssignees?.entries ?? [],
                              approverSelectorContacts,
                              completionRule: editingTask.completion_rule,
                              createTask: noop,
                              dueDate: editingTask.due_at,
                              editTask: onTaskUpdate,
                              getApproverWithQuery,
                              getAvatarUrl,
                              id: editingTask.id,
                              message: editingTask.description,
                          }
                        : {
                              approvers: [],
                              approverSelectorContacts,
                              completionRule: TASK_COMPLETION_RULE_ALL,
                              createTask,
                              getApproverWithQuery,
                              getAvatarUrl,
                              id: '',
                              message: '',
                          }
                }
                taskType={taskType}
            />
        </div>
    );
};

export default ActivityFeedV2;
export type { ActivityFeedV2Props };
