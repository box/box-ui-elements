/**
 * @file Activity Feed V2 adapter - wraps @box/activity-feed compound components.
 *
 * Read data comes from the file activities endpoint (already parsed into BUIE FeedItem types by Feed.js).
 * Write/mutate operations still use the traditional v2 API via ActivitySidebar callbacks.
 * @author Box
 */

import * as React from 'react';
import noop from 'lodash/noop';
import { useIntl } from 'react-intl';

import { ActivityFeed, useActivityFeedScroll } from '@box/activity-feed';
import { serializeMentionMarkup } from '@box/threaded-annotations';

import TaskModal from '../TaskModal';

import FeedItemRow from './FeedItemRow';
import { transformFeedItem } from './transformers';

import type { ActivityFeedV2Props, TransformedFeedItem, UserContact } from './types';

import { TASK_COMPLETION_RULE_ALL, TASK_TYPE_APPROVAL } from '../../../constants';

import commonMessages from '../../common/messages';
import messages from '../messages';

import './ActivityFeedV2.scss';

const ActivityFeedV2 = ({
    activeFeedEntryId,
    approverSelectorContacts = [],
    createTask,
    currentUser,
    feedItems,
    getApproverWithQuery,
    getAvatarUrl,
    getMentionAsync,
    hasTasks = true,
    isDisabled = false,
    onAnnotationDelete,
    onAnnotationSelect,
    onAnnotationStatusChange,
    onCommentCreate,
    onCommentDelete,
    onCommentUpdate,
    onReplyCreate,
    onTaskDelete,
    onTaskView,
    onVersionHistoryClick,
}: ActivityFeedV2Props) => {
    const intl = useIntl();
    const scrollHandle = useActivityFeedScroll();
    const currentUserId = currentUser?.id;
    const headerTitle = intl.formatMessage(commonMessages.sidebarActivityTitle);

    React.useEffect(() => {
        if (activeFeedEntryId && scrollHandle) {
            scrollHandle.scrollTo(activeFeedEntryId);
        }
    }, [activeFeedEntryId, scrollHandle]);

    const fetchUsers = React.useCallback(
        async (inputValue: string): Promise<UserContact[]> => {
            if (!getMentionAsync) {
                return [];
            }
            try {
                const entries = await getMentionAsync(inputValue);
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
            ariaRoleDescription: intl.formatMessage(messages.mentionUserSelectorRoleDescription),
            fetchAvatarUrls,
            fetchUsers,
            loadingAriaLabel: intl.formatMessage(messages.mentionUserSelectorLoading),
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

    const [mentionMe, setMentionMe] = React.useState(false);
    const [showResolved, setShowResolved] = React.useState(false);
    const [isTaskFormOpen, setIsTaskFormOpen] = React.useState(false);
    const [taskType, setTaskType] = React.useState<string>(TASK_TYPE_APPROVAL);
    const [taskError, setTaskError] = React.useState<Error | null>(null);

    const handleTaskModalClose = React.useCallback(() => {
        setIsTaskFormOpen(false);
        setTaskError(null);
    }, []);

    const transformedItems: TransformedFeedItem[] = React.useMemo(() => {
        if (!feedItems) return [];
        return feedItems.reduce<TransformedFeedItem[]>((acc, item) => {
            const transformed = transformFeedItem(item, currentUserId);
            if (transformed) {
                acc.push(transformed);
            }
            return acc;
        }, []);
    }, [currentUserId, feedItems]);

    const filteredItems = React.useMemo(() => {
        return transformedItems.filter(item => {
            if ((item.type === 'comment' || item.type === 'annotation') && item.isResolved && !showResolved) {
                return false;
            }
            if (mentionMe && currentUserId) {
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
    }, [currentUserId, mentionMe, showResolved, transformedItems]);

    const handleCommentPost = React.useCallback(
        async (content: unknown) => {
            if (!onCommentCreate) return;
            let serialized;
            try {
                serialized = serializeMentionMarkup(content as Parameters<typeof serializeMentionMarkup>[0]);
            } catch {
                return;
            }
            if (!serialized.text.trim()) return;
            onCommentCreate(serialized.text, serialized.hasMention);
        },
        [onCommentCreate],
    );

    return (
        <div className="bcs-NewActivityFeed">
            <ActivityFeed.Root mentionContext={mentionContext} scrollTo={scrollHandle}>
                <ActivityFeed.Header title={headerTitle}>
                    <ActivityFeed.Header.Actions>
                        <ActivityFeed.Header.FilterMenu>
                            <ActivityFeed.Header.ShowResolvedOption
                                checked={showResolved}
                                onCheckedChange={setShowResolved}
                            />
                            <ActivityFeed.Header.MentionMeOption
                                checked={mentionMe}
                                hasTasks={hasTasks}
                                onCheckedChange={setMentionMe}
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
                                    isDisabled={isDisabled}
                                    item={item}
                                    onAnnotationDelete={onAnnotationDelete}
                                    onAnnotationSelect={onAnnotationSelect}
                                    onAnnotationStatusChange={onAnnotationStatusChange}
                                    onCommentDelete={onCommentDelete}
                                    onCommentUpdate={onCommentUpdate}
                                    onReplyCreate={onReplyCreate}
                                    onTaskDelete={onTaskDelete}
                                    onTaskView={onTaskView}
                                    onVersionHistoryClick={onVersionHistoryClick}
                                    userSelectorProps={userSelectorProps}
                                />
                            ))}
                        </ActivityFeed.List>
                    </div>
                )}
                <ActivityFeed.Editor
                    disableComponent={isDisabled || !currentUser}
                    onPost={handleCommentPost}
                    userSelectorProps={userSelectorProps}
                />
            </ActivityFeed.Root>
            <TaskModal
                error={taskError}
                isTaskFormOpen={isTaskFormOpen}
                onModalClose={handleTaskModalClose}
                onSubmitError={setTaskError}
                onSubmitSuccess={handleTaskModalClose}
                taskFormProps={{
                    approvers: [],
                    approverSelectorContacts,
                    completionRule: TASK_COMPLETION_RULE_ALL,
                    createTask,
                    getApproverWithQuery,
                    getAvatarUrl,
                    id: '',
                    message: '',
                }}
                taskType={taskType}
            />
        </div>
    );
};

export default ActivityFeedV2;
export type { ActivityFeedV2Props };
