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
import { isListNode } from '@box/threaded-annotations';
import type { BlockNodeV2, ParagraphNodeV2 } from '@box/threaded-annotations';
import type { UserContactType } from '@box/user-selector';

import TaskModalV2 from './task-modal-v2';

import FeedItemRow from './FeedItemRow';
import { resolveFeedItemIdForEntry, serializeEditorContent } from './helpers';
import { mapCollaboratorToUserContact } from './task-modal-v2/utils/contactMapping';
import { buildTimestampMarkup } from './timestampMarkup';
import { transformFeedItem, transformTaskAssignees } from './transformers';
import { useAvatarUrls } from './useAvatarUrls';
import { useCommentMarkerSelectedId } from './useCommentMarkerSelectedId';
import { useTimeFormat } from './useTimeFormat';
import { useMediaTimestamp } from './useMediaTimestamp';

import type { TaskFormV2SubmitPayload } from './task-modal-v2/types';
import type { ActivityFeedV2Props, TransformedFeedItem, ViewerHandle } from './types';
import type { ElementsXhrError } from '../../../common/types/api';
import type { GroupMini, SelectorItem, UserMini } from '../../../common/types/core';
import type { TaskAssigneeCollection, TaskNew, TaskType, TaskUpdatePayload } from '../../../common/types/tasks';

import { FILE_EXTENSIONS } from '../../common/item/constants';
import { TASK_TYPE_APPROVAL } from '../../../constants';

import commonMessages from '../../common/messages';
import draftJsMentionSelectorMessages from '../../../components/form-elements/draft-js-mention-selector/messages';
import messages from '../messages';

import './ActivityFeedV2.scss';

const hasMentionInParagraph = (paragraph: ParagraphNodeV2, userId: string): boolean =>
    (paragraph.content ?? []).some(node => node.type === 'mention' && node.attrs.mentionedUserId === userId);

const hasMentionInBlocks = (blocks: BlockNodeV2[] | undefined, userId: string): boolean =>
    (blocks ?? []).some(block => {
        if (block.type === 'paragraph') {
            return hasMentionInParagraph(block, userId);
        }
        if (!isListNode(block)) {
            return false;
        }
        return (block.content ?? []).some(item => hasMentionInBlocks(item.content, userId));
    });

type CommentMarkerPayload = {
    avatarUrl?: string;
    colorIndex?: number;
    id: string;
    initial?: string;
    isSelected?: boolean;
    time: number;
    type: 'annotation' | 'comment';
};

/** ContentPreview.getViewer() waits for playable. The waveform shell exists earlier. */
const COMMENT_MARKERS_VIEWER_POLL_MS = 100;

const buildCommentMarkers = (
    items: readonly TransformedFeedItem[],
    selectedFeedItemId: string | null,
): CommentMarkerPayload[] => {
    const markers: CommentMarkerPayload[] = [];
    for (const item of items) {
        if (item.type === 'comment' && item.annotationTimestampMs != null) {
            const author = item.messages[0]?.author;
            markers.push({
                avatarUrl: author?.avatarUrl ?? undefined,
                colorIndex: author?.id ?? 0,
                id: item.id,
                initial: author?.name?.[0] ?? undefined,
                isSelected: item.id === selectedFeedItemId,
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
                    isSelected: item.id === selectedFeedItemId,
                    time: loc.value / 1000,
                    type: 'annotation',
                });
            }
        }
    }
    return markers;
};

const ActivityFeedV2 = ({
    activeFeedEntryId,
    createTask,
    currentUser,
    feedItems,
    file,
    getApproverAsync,
    getAvatarUrl,
    getMentionAsync,
    getPreview,
    getTaskCollaborators,
    getViewer,
    hasTasks = true,
    isAudioPlayerV2Enabled = false,
    isDisabled = false,
    isRichTextEnabled = false,
    isTimestampedCommentsEnabled = false,
    onAnnotationCopyLink,
    onAnnotationDelete,
    onAnnotationEdit,
    onAnnotationSelect,
    onAnnotationStatusChange,
    onCommentCopyLink,
    onCommentCreate,
    onCommentDelete,
    onCommentSelect,
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
    const canComment = file?.permissions?.can_comment ?? false;

    const scrolledEntryIdRef = React.useRef<string | null>(null);
    const hasScrolledToEndRef = React.useRef(false);
    const knownIdsBeforePostRef = React.useRef<Set<string> | null>(null);

    const fetchUsers = React.useCallback(
        async (inputValue: string): Promise<UserContactType[]> => {
            const trimmed = inputValue.trim();
            if (!trimmed || !getMentionAsync) {
                return [];
            }
            try {
                const entries = await getMentionAsync(trimmed);
                return entries.map(mapCollaboratorToUserContact);
            } catch {
                return [];
            }
        },
        [getMentionAsync],
    );

    const fetchApprovers = React.useCallback(
        async (inputValue: string): Promise<UserContactType[]> => {
            const trimmed = inputValue.trim();
            if (!trimmed || !getApproverAsync) {
                return [];
            }
            try {
                const entries = await getApproverAsync(trimmed);
                return entries.map(mapCollaboratorToUserContact);
            } catch {
                return [];
            }
        },
        [getApproverAsync],
    );

    const fetchAvatarUrls = React.useCallback(
        async (userContacts: UserContactType[]) => {
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
            // Mentions are restricted to file collaborators; the invite popover is intentionally never shown.
            fetchCollaboratorState: async () => true,
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
    const [taskType, setTaskType] = React.useState<TaskType>(TASK_TYPE_APPROVAL);
    const [taskError, setTaskError] = React.useState<ElementsXhrError | undefined>(undefined);
    const [editingTask, setEditingTask] = React.useState<TaskNew | null>(null);
    const [editingAssignees, setEditingAssignees] = React.useState<TaskAssigneeCollection | null>(null);

    const handleTaskModalClose = React.useCallback(() => {
        setIsTaskFormOpen(false);
        setTaskError(undefined);
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

    // Loads the full assignee list when "Show more" is clicked. Assignee-fetch failures are
    // rethrown so AssigneeList shows its inline error; avatar failures fall back to initials.
    const handleTaskLoadAllAssignees = React.useCallback(
        async (task: TaskNew) => {
            if (!getTaskCollaborators) {
                throw new Error('ActivityFeedV2: getTaskCollaborators is required to load assignees');
            }
            try {
                const collection = await getTaskCollaborators(task);

                // Resolve avatars for assignee ids the useAvatarUrls map doesn't have yet
                const missingIds = Array.from(
                    new Set<string>(
                        collection.entries
                            .map(entry => entry.target?.id)
                            .filter((id): id is string => Boolean(id) && !(id in avatarUrls)),
                    ),
                );
                const fetchedEntries = getAvatarUrl
                    ? await Promise.all(
                          missingIds.map(async id => {
                              try {
                                  return [id, await getAvatarUrl(id)] as const;
                              } catch (avatarError) {
                                  // eslint-disable-next-line no-console
                                  console.warn(`ActivityFeedV2: failed to load avatar for user "${id}"`, avatarError);
                                  return [id, null] as const;
                              }
                          }),
                      )
                    : [];
                const mergedAvatarUrls: Record<string, string> = { ...avatarUrls };
                fetchedEntries.forEach(([id, url]) => {
                    if (url) mergedAvatarUrls[id] = url;
                });

                return transformTaskAssignees(collection.entries, mergedAvatarUrls);
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(`ActivityFeedV2: failed to load assignees for task "${task.id}"`, error);
                throw error;
            }
        },
        [avatarUrls, getAvatarUrl, getTaskCollaborators],
    );

    const transformedItems: TransformedFeedItem[] = React.useMemo(() => {
        if (!feedItems) return [];
        return feedItems.reduce<TransformedFeedItem[]>((acc, item) => {
            const transformed = transformFeedItem(item, currentUserId, avatarUrls, isRichTextEnabled);
            if (transformed) {
                acc.push(transformed);
            }
            return acc;
        }, []);
    }, [avatarUrls, currentUserId, feedItems, isRichTextEnabled]);

    const filteredItems = React.useMemo(() => {
        const filtered = transformedItems.filter(item => {
            if ((item.type === 'comment' || item.type === 'annotation') && item.isResolved && !showResolved) {
                return false;
            }
            if (showOnlyMentionsMe && currentUserId) {
                if (item.type === 'comment' || item.type === 'annotation') {
                    const hasMention = item.messages.some(msg =>
                        hasMentionInBlocks(msg.message?.content, currentUserId),
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
        const scrollTargetId = resolveFeedItemIdForEntry(filteredItems, activeFeedEntryId) ?? activeFeedEntryId;
        const didScroll = scrollHandle.scrollTo(scrollTargetId, { block: 'start' });
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

    // Scroll only to comments/annotations/tasks the current user authored after the post
    // snapshot, so a concurrent push from another user doesn't hijack the viewport.
    React.useEffect(() => {
        const knownIds = knownIdsBeforePostRef.current;
        if (!knownIds || !scrollHandle || !currentUserId) return;
        const newItem = filteredItems.find(item => {
            if (knownIds.has(item.id)) return false;
            if (item.type === 'comment' || item.type === 'annotation') {
                const author = item.messages[0]?.author;
                return author ? String(author.id) === currentUserId : false;
            }
            if (item.type === 'task') {
                const authorId = item.originalTask?.created_by?.target?.id;
                return authorId != null && String(authorId) === currentUserId;
            }
            return false;
        });
        if (!newItem) return;
        if (scrollHandle.scrollTo(newItem.id)) {
            knownIdsBeforePostRef.current = null;
        }
    }, [currentUserId, filteredItems, scrollHandle]);

    const isVideo = file?.extension ? FILE_EXTENSIONS.video.includes(file.extension) : false;
    const isAudio = file?.extension ? FILE_EXTENSIONS.audio.includes(file.extension) : false;
    const fileVersionId = file?.file_version?.id;
    const allowVideoTimestamps = isVideo && isTimestampedCommentsEnabled && Boolean(fileVersionId);
    const allowAudioTimestamps =
        isAudio && isTimestampedCommentsEnabled && isAudioPlayerV2Enabled && Boolean(fileVersionId);
    const allowMediaTimestamps = allowVideoTimestamps || allowAudioTimestamps;
    const { timeFormat, fps } = useTimeFormat(isVideo);

    const {
        formattedTimestamp,
        isPressed: isTimestampPressed,
        onPressedChange,
        timestampEndMs,
        timestampMs,
    } = useMediaTimestamp(allowMediaTimestamps, timeFormat, fps);

    const editorMediaTimestamp = allowMediaTimestamps
        ? { formattedTimestamp, isPressed: isTimestampPressed, onPressedChange }
        : undefined;

    const allowCommentMarkers = isVideo || (isAudio && isAudioPlayerV2Enabled);
    const markerSelectedId = useCommentMarkerSelectedId(activeFeedEntryId, filteredItems);

    const filteredItemsRef = React.useRef(filteredItems);
    const markerSelectedIdRef = React.useRef(markerSelectedId);
    const onCommentSelectRef = React.useRef(onCommentSelect);
    const attachedViewerRef = React.useRef<ViewerHandle | null>(null);

    React.useLayoutEffect(() => {
        filteredItemsRef.current = filteredItems;
        markerSelectedIdRef.current = markerSelectedId;
        onCommentSelectRef.current = onCommentSelect;
    }, [filteredItems, markerSelectedId, onCommentSelect]);

    React.useEffect(() => {
        if ((!getViewer && !getPreview) || !allowCommentMarkers) return undefined;

        let pollId = 0;

        const handleMarkerSelect = ({ id }: { id: string }) => {
            const item = filteredItemsRef.current.find(filteredItem => filteredItem.id === id);
            // Annotation markers are already handled via the annotator pipeline, so only handle comments here.
            if (item?.type === 'comment' && onCommentSelectRef.current) {
                onCommentSelectRef.current(id);
            }
        };

        const resolveViewer = (): ViewerHandle | null => {
            const loaded = getViewer?.() ?? null;
            if (loaded) {
                return loaded;
            }
            const current = getPreview?.()?.getCurrentViewer?.() ?? null;
            if (!current || current.isDestroyed?.()) {
                return null;
            }
            return current;
        };

        const attachMarkerViewer = (viewer: ViewerHandle) => {
            attachedViewerRef.current = viewer;
            viewer.emit('comment_markers', buildCommentMarkers(filteredItemsRef.current, markerSelectedIdRef.current));
            viewer.addListener('comment_marker_select', handleMarkerSelect);
        };

        const attachMarkerViewerIfReady = (): boolean => {
            const viewer = resolveViewer();
            if (!viewer) {
                return false;
            }
            attachMarkerViewer(viewer);
            return true;
        };

        if (!attachMarkerViewerIfReady()) {
            pollId = window.setInterval(() => {
                if (attachMarkerViewerIfReady()) {
                    window.clearInterval(pollId);
                    pollId = 0;
                }
            }, COMMENT_MARKERS_VIEWER_POLL_MS);
        }

        return () => {
            if (pollId) {
                window.clearInterval(pollId);
            }
            const attachedViewer = attachedViewerRef.current;
            attachedViewerRef.current = null;
            if (!attachedViewer) {
                return;
            }
            attachedViewer.removeListener('comment_marker_select', handleMarkerSelect);
            attachedViewer.emit('comment_markers', []);
        };
    }, [allowCommentMarkers, getPreview, getViewer]);

    React.useEffect(() => {
        const viewer = attachedViewerRef.current;
        if (!viewer) {
            return;
        }
        viewer.emit('comment_markers', buildCommentMarkers(filteredItems, markerSelectedId));
    }, [filteredItems, markerSelectedId]);

    const handleCommentPost = React.useCallback(
        async (content: unknown) => {
            if (!onCommentCreate) return;
            const serialized = serializeEditorContent(content, isRichTextEnabled);
            if (!serialized || !serialized.text) return;
            const text =
                allowMediaTimestamps && isTimestampPressed && fileVersionId
                    ? `${buildTimestampMarkup({
                          endMs: timestampEndMs,
                          startMs: timestampMs,
                          versionId: fileVersionId,
                      })} ${serialized.text}`
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
        [
            allowMediaTimestamps,
            filteredItems,
            fileVersionId,
            isRichTextEnabled,
            isTimestampPressed,
            onCommentCreate,
            timestampEndMs,
            timestampMs,
        ],
    );

    const handleCreateTask = React.useCallback(
        (
            text: string,
            approvers: SelectorItem<UserMini | GroupMini>[],
            type: TaskType,
            dueDate: string | null,
            completionRule: TaskFormV2SubmitPayload['completionRule'],
            onSuccess: () => void,
            onError: (error: ElementsXhrError) => void,
        ) => {
            if (!createTask) {
                onError({ status: 0, code: 'create_task_unavailable' } as ElementsXhrError);
                return;
            }
            const snapshot = new Set(filteredItems.map(item => item.id));
            createTask(
                text,
                approvers,
                type,
                dueDate,
                completionRule,
                () => {
                    knownIdsBeforePostRef.current = snapshot;
                    onSuccess();
                },
                onError,
            );
        },
        [createTask, filteredItems],
    );

    const handleEditTask = React.useCallback(
        (payload: TaskUpdatePayload, onSuccess: () => void, onError: (error: ElementsXhrError) => void) => {
            if (!onTaskUpdate) {
                onError({ status: 0, code: 'edit_task_unavailable' } as ElementsXhrError);
                return;
            }
            onTaskUpdate(payload, onSuccess, onError);
        },
        [onTaskUpdate],
    );

    return (
        <div className="bcs-NewActivityFeed" data-resin-feature="activityfeedv2" data-resin-fileid={file?.id}>
            <ActivityFeed.Root
                areCommentsDisabled={!canComment}
                mentionContext={mentionContext}
                scrollTo={scrollHandle}
            >
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
                                    activeFeedEntryId={activeFeedEntryId}
                                    currentUserId={currentUserId}
                                    fps={fps}
                                    getViewer={getViewer}
                                    isDisabled={isDisabled}
                                    isRichTextEnabled={isRichTextEnabled}
                                    item={item}
                                    onAnnotationCopyLink={onAnnotationCopyLink}
                                    onAnnotationDelete={onAnnotationDelete}
                                    onAnnotationEdit={onAnnotationEdit}
                                    onAnnotationSelect={onAnnotationSelect}
                                    onAnnotationStatusChange={onAnnotationStatusChange}
                                    onCommentCopyLink={onCommentCopyLink}
                                    onCommentDelete={onCommentDelete}
                                    onCommentSelect={onCommentSelect}
                                    onCommentUpdate={onCommentUpdate}
                                    onReplyCreate={onReplyCreate}
                                    onReplyDelete={onReplyDelete}
                                    onReplyUpdate={onReplyUpdate}
                                    onTaskAssignmentUpdate={onTaskAssignmentUpdate}
                                    onTaskDelete={onTaskDelete}
                                    onTaskEdit={onTaskUpdate ? handleTaskEdit : undefined}
                                    onTaskLoadAllAssignees={
                                        getTaskCollaborators ? handleTaskLoadAllAssignees : undefined
                                    }
                                    onTaskView={onTaskView}
                                    onVersionHistoryClick={onVersionHistoryClick}
                                    timeFormat={timeFormat}
                                    userSelectorProps={userSelectorProps}
                                />
                            ))}
                        </ActivityFeed.List>
                    </div>
                )}
                {canComment && (
                    <div className="bcs-NewActivityFeed-editor">
                        <ActivityFeed.Editor
                            disableComponent={isDisabled || !currentUser}
                            isRichTextEnabled={isRichTextEnabled}
                            onPost={handleCommentPost}
                            userSelectorProps={userSelectorProps}
                            videoTimestamp={editorMediaTimestamp}
                        />
                    </div>
                )}
            </ActivityFeed.Root>
            {editingTask ? (
                <TaskModalV2
                    createTask={handleCreateTask}
                    editingAssignees={editingAssignees?.entries ?? []}
                    editingTask={editingTask}
                    editTask={handleEditTask}
                    error={taskError}
                    fetchAvatarUrls={fetchAvatarUrls}
                    fetchUsers={fetchApprovers}
                    fileId={file?.id}
                    isOpen={isTaskFormOpen}
                    mode="edit"
                    onClose={handleTaskModalClose}
                    onSubmitError={setTaskError}
                    onSubmitSuccess={handleTaskModalClose}
                    taskType={taskType}
                />
            ) : (
                <TaskModalV2
                    createTask={handleCreateTask}
                    error={taskError}
                    fetchAvatarUrls={fetchAvatarUrls}
                    fetchUsers={fetchApprovers}
                    fileId={file?.id}
                    isOpen={isTaskFormOpen}
                    onClose={handleTaskModalClose}
                    onSubmitError={setTaskError}
                    onSubmitSuccess={handleTaskModalClose}
                    taskType={taskType}
                />
            )}
        </div>
    );
};

export default ActivityFeedV2;
export type { ActivityFeedV2Props };
