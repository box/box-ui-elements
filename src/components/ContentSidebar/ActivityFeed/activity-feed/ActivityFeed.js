/**
 * @flow
 * @file Component for Activity feed
 */

import * as React from 'react';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import uniqueId from 'lodash/uniqueId';
import classNames from 'classnames';

import ActiveState from './ActiveState';
import ApprovalCommentForm from '../approval-comment-form';
import EmptyState from './EmptyState';
import { collapseFeedState, shouldShowEmptyState } from './activityFeedUtils';
import messages from '../../../messages';
import './ActivityFeed.scss';

const VERSION_RESTORE_ACTION = 'restore';
const TASK_INCOMPLETE = 'incomplete';

type Props = {
    file: BoxItem,
    versions?: FileVersions,
    comments?: Comments,
    tasks?: Tasks,
    activityFeedError?: Errors,
    approverSelectorContacts?: SelectorItems,
    mentionSelectorContacts?: SelectorItems,
    currentUser?: User,
    isDisabled?: boolean,
    onCommentCreate?: Function,
    onCommentDelete?: Function,
    onTaskCreate?: Function,
    onTaskDelete?: Function,
    onTaskUpdate?: Function,
    onTaskAssignmentUpdate?: Function,
    getApproverWithQuery?: Function,
    getMentionWithQuery?: Function,
    onVersionHistoryClick?: Function,
    translations?: Translations,
    getAvatarUrl: (string) => Promise<?string>,
    getUserProfileUrl?: (string) => Promise<string>
};

type State = {
    isInputOpen: boolean,
    feedItems: Array<Comment | Task | BoxItemVersion>
};

class ActivityFeed extends React.Component<Props, State> {
    state = {
        isInputOpen: false,
        feedItems: []
    };

    feedContainer: null | HTMLElement;

    onKeyDown = (event: SyntheticKeyboardEvent<>): void => {
        const { nativeEvent } = event;
        nativeEvent.stopImmediatePropagation();
    };

    approvalCommentFormFocusHandler = (): void => this.setState({ isInputOpen: true });
    approvalCommentFormCancelHandler = (): void => this.setState({ isInputOpen: false });
    approvalCommentFormSubmitHandler = (): void => this.setState({ isInputOpen: false });

    /**
     * Add a placeholder pending feed item.
     *
     * @param {Object} itemBase - Base properties for item to be added to the feed as pending.
     * @return {void}
     */
    addPendingItem = (itemBase: Object): void => {
        const { currentUser } = this.props;
        const date = new Date().toISOString();
        const feedItem = {
            created_at: date,
            created_by: currentUser,
            modified_at: date,
            isPending: true,
            ...itemBase
        };

        const { feedItems } = this.state;
        this.setState({ feedItems: [feedItem, ...feedItems] });
    };

    /**
     * Replace a feed item with new feed item data.
     * @param {Object} updates - The new data to be applied to the feed item.
     * @param {string} id - ID of the feed item to replace.
     * @return {void}
     */
    updateFeedItem = (updates: Object, id: string): void => {
        this.setState({
            feedItems: this.state.feedItems.map((item: Comment | Task | BoxItemVersion) => {
                if (item.id === id) {
                    // $FlowFixMe
                    return {
                        ...item,
                        ...updates
                    };
                }
                return item;
            })
        });
    };

    /**
     * Callback for successful creation of a Comment.
     *
     * @param {Comment} commentData - API returned Comment
     * @param {string} id - ID of the feed item to update with the new comment data
     * @return {void}
     */
    createCommentSuccessCallback = (commentData: Comment, id: string): void => {
        const { message = '', tagged_message = '' } = commentData;
        // Comment component uses tagged_message only
        commentData.tagged_message = tagged_message || message;

        this.updateFeedItem(
            {
                ...commentData,
                isPending: false
            },
            id
        );
    };

    /**
     * Create a comment, and make a pending item to be replaced once the API is successful.
     *
     * @param {any} args - Data returned by the Comment component on comment creation.
     * @return {void}
     */
    createComment = ({ text, hasMention }: { text: string, hasMention: boolean }): void => {
        const uuid = uniqueId('comment_');
        const comment = {
            id: uuid,
            tagged_message: text,
            type: 'comment'
        };

        this.addPendingItem(comment);

        const createComment = this.props.onCommentCreate || noop;

        createComment(
            text,
            hasMention,
            (commentData: Comment) => {
                this.createCommentSuccessCallback(commentData, uuid);
            },
            (e) => {
                const errorMessage =
                    e.status === 409 ? messages.commentCreateConflictMessage : messages.commentCreateErrorMessage;
                this.updateFeedItem(this.createFeedError(errorMessage), uuid);
            }
        );

        this.approvalCommentFormSubmitHandler();
    };

    /**
     * Deletes a comment.
     *
     * @param {string} id - Comment ID
     * @param {BoxItemPermission} permissions - Permissions for the comment
     * @return {void}
     */
    deleteComment = ({ id, permissions }: { id: string, permissions: BoxItemPermission }): void => {
        const deleteComment = this.props.onCommentDelete || noop;
        this.updateFeedItem({ isPending: true }, id);
        deleteComment(id, permissions, this.deleteFeedItem, () =>
            this.updateFeedItem(this.createFeedError(messages.commentDeleteErrorMessage), id)
        );
    };

    /**
     * Callback for successful creation of a Task.
     *
     * @param {Task} task - API returned task
     * @param {string} id - ID of the feed item to update with the new task data
     * @return {void}
     */
    createTaskSuccessCallback(task: Task, id: string): void {
        this.updateFeedItem(
            {
                ...task,
                isPending: false
            },
            id
        );
    }

    /**
     * Creates a task.
     *
     * @param {string} text - Task text
     * @param {Array} assignees - List of assignees
     * @param {number} dueAt - Task's due date
     * @return {void}
     */
    createTask = ({ text, assignees, dueAt }: { text: string, assignees: SelectorItems, dueAt: string }): void => {
        const uuid = uniqueId('task_');
        let dueAtString;
        if (dueAt) {
            const dueAtDate: Date = new Date(dueAt);
            dueAtString = dueAtDate.toISOString();
        }

        const pendingAssignees = assignees.map((assignee: SelectorItem) => ({
            assigned_to: {
                id: assignee.id,
                name: assignee.name
            },
            resolution_state: TASK_INCOMPLETE
        }));

        const task = {
            due_at: dueAtString,
            id: uuid,
            is_completed: false,
            message: text,
            task_assignment_collection: {
                entries: pendingAssignees,
                total_count: pendingAssignees.length
            },
            type: 'task'
        };

        this.addPendingItem(task);
        const createTask = this.props.onTaskCreate || noop;
        createTask(
            text,
            assignees,
            dueAtString,
            (taskData: Task) => {
                this.createTaskSuccessCallback(taskData, uuid);
            },
            () => {
                this.updateFeedItem(this.createFeedError(messages.taskCreateErrorMessage), uuid);
            }
        );

        this.approvalCommentFormSubmitHandler();
    };

    /**
     * Deletes a feed item from the state.
     *
     * @param {Object} item - The item to be deleted
     */
    deleteFeedItem = (id: string) => {
        this.setState({
            feedItems: this.state.feedItems.filter((feedItem) => feedItem.id !== id)
        });
    };

    /**
     * Updates a given task on a successful update.
     *
     * @param {Object} task - The updated task
     */
    updateTaskSuccessCallback = (task: Task) => {
        const { id } = task;
        this.updateFeedItem({ ...task, isPending: false }, id);
    };

    /**
     * Updates a task in the state via the API.
     *
     * @param {Object} args - A subset of the task
     */
    updateTask = ({ text, id }: { text: string, id: string }): void => {
        const updateTask = this.props.onTaskUpdate || noop;
        this.updateFeedItem({ isPending: true }, id);
        updateTask(id, text, this.updateTaskSuccessCallback, () =>
            this.updateFeedItem(this.createFeedError(messages.taskUpdateErrorMessage), id)
        );
    };

    /**
     * Deletes a task via the API.
     *
     * @param {Object} args - A subset of the task
     */
    deleteTask = ({ id }: { id: string }): void => {
        const deleteTask = this.props.onTaskDelete || noop;
        this.updateFeedItem({ isPending: true }, id);
        deleteTask(id, this.deleteFeedItem, () =>
            this.updateFeedItem(this.createFeedError(messages.taskDeleteErrorMessage), id)
        );
    };

    /**
     * Updates the task assignment state of the updated task
     *
     * @param {Task} task - Box task
     * @param {TaskAssignment} updatedAssignment - New task assignment from API
     * @return {void}
     */
    updateTaskAssignmentSuccessCallback = (task: Task, updatedAssignment: TaskAssignment) => {
        const { entries, total_count } = task.task_assignment_collection;

        const assignments = entries.map((item: TaskAssignment) => {
            if (item.id === updatedAssignment.id) {
                return {
                    ...item,
                    ...updatedAssignment,
                    resolution_state: updatedAssignment.message.toLowerCase()
                };
            }
            return item;
        });

        this.updateFeedItem(
            {
                task_assignment_collection: {
                    entries: assignments,
                    total_count
                }
            },
            task.id
        );
    };

    /**
     * Updates a task assignment via the API.
     *
     * @param {string} taskId - ID of task to be updated
     * @param {string} taskAssignmentId - Task assignment ID
     * @param {string} status - New task assignment status
     * @return {void}
     */
    updateTaskAssignment = (taskId: string, taskAssignmentId: string, status: string): void => {
        const updateTaskAssignment = this.props.onTaskAssignmentUpdate || noop;
        const { feedItems } = this.state;
        const task = feedItems.find((item) => !!(item.id === taskId));
        if (!task || task.type !== 'task') {
            return;
        }

        updateTaskAssignment(
            taskId,
            taskAssignmentId,
            status,
            (updatedAssignment) => {
                // $FlowFixMe
                this.updateTaskAssignmentSuccessCallback(task, updatedAssignment);
            },
            () => this.updateFeedItem(this.createFeedError(messages.taskUpdateErrorMessage), taskAssignmentId)
        );
    };

    /**
     * Invokes version history popup handler.
     *
     * @param {Object} data - Version history data
     * @return {void}
     */
    openVersionHistoryPopup = (data: any): void => {
        const versionInfoHandler = this.props.onVersionHistoryClick || noop;
        versionInfoHandler(data);
    };

    /**
     * Determine whether or not the feed items have been fetched and loaded
     *
     * @param {Comments} comments - Object containing comments for the file.
     * @param {Tasks} tasks - Object containing tasks for the file.
     * @param {FileVersions} versions - Object containing versions of the file.
     * @return {boolean} True if the feed items have successfully fetched
     */
    areFeedItemsLoaded(comments?: Comments, tasks?: Tasks, versions?: FileVersions): boolean {
        return !!(comments && tasks && versions);
    }

    /**
     *  If the file has changed, clear out the feed state.
     *
     * @param {BoxItem} file - The box file that comments, tasks, and versions belong to.
     * @return {boolean} True if the feedItems were emptied.
     */
    clearFeedItems(file?: BoxItem): boolean {
        const { file: oldFile } = this.props;
        if (file && file.id !== oldFile.id) {
            this.setState({ feedItems: [] });
            return true;
        }

        return false;
    }

    /**
     *  Constructs an error object that renders to an inline feed error
     *
     * @param {string} message - The error message body.
     * @param {string} title - The error message title.

     * @return {Object} An error message object
     */
    createFeedError(message: string, title?: string = messages.errorOccured) {
        return {
            error: { message, title }
        };
    }

    componentDidMount(): void {
        const { comments, tasks, versions, file } = this.props;
        this.updateFeedItems(comments, tasks, versions, file);
    }

    componentWillReceiveProps(nextProps: any): void {
        const { comments, tasks, versions, file } = nextProps;
        this.updateFeedItems(comments, tasks, versions, file);
    }

    /**
     * Adds a versions entry if the current file version was restored from a previous version
     *
     * @param {FileVersions} versions - API returned file versions for this file
     * @return {FileVersions} modified versions array including the version restore
     */
    addRestoredVersion(versions: FileVersions) {
        const { file } = this.props;
        const { restored_from, modified_at } = file;

        if (restored_from) {
            const restoredVersion = versions.entries.find((version) => version.id === restored_from.id);

            if (restoredVersion) {
                // $FlowFixMe
                versions.entries.push({
                    ...restoredVersion,
                    created_at: modified_at,
                    action: VERSION_RESTORE_ACTION
                });
                versions.total_count += 1;
            }
        }

        return versions;
    }

    /**
     * Checks to see if feed items should be added to the feed, and invokes the add and sort.
     *
     * @param {Comments} comments - API returned comments for this file
     * @param {Tasks} tasks - API returned tasks for this file
     * @param {FileVersions} versions - API returned file versions for this file
     * @param {BoxItem} file - The file that owns all of the activity feed items
     * @return {void}
     */
    updateFeedItems(comments?: Comments, tasks?: Tasks, versions?: FileVersions, file: BoxItem): void {
        const isFeedEmpty = this.clearFeedItems(file);
        const shouldSort = this.areFeedItemsLoaded(comments, tasks, versions);
        const { feedItems } = this.state;

        if (shouldSort && (isFeedEmpty || !feedItems.length)) {
            // $FlowFixMe
            this.sortFeedItems(comments, tasks, this.addRestoredVersion(versions));
        }
    }

    /**
     * Sort valid feed items, descending by created_at time.
     *
     * @param {Array<?Comments | ?Tasks | ?FileVersions>} args - Arguments list of each item container
     * type that is allowed in the feed.
     */
    sortFeedItems(...args: Array<Comments | Tasks | FileVersions>): void {
        const feedItems = [];
        args.forEach((itemContainer) => {
            // $FlowFixMe
            feedItems.push(...itemContainer.entries);
        });

        feedItems.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));

        this.setState({ feedItems });
    }

    render(): React.Node {
        const {
            translations,
            approverSelectorContacts,
            mentionSelectorContacts,
            currentUser,
            isDisabled,
            getAvatarUrl,
            getUserProfileUrl,
            file,
            onCommentCreate,
            getApproverWithQuery,
            getMentionWithQuery,
            comments,
            tasks,
            versions,
            activityFeedError
        } = this.props;
        const { isInputOpen, feedItems } = this.state;
        const hasCommentPermission = getProp(file, 'permissions.can_comment', false);
        const showApprovalCommentForm = !!(currentUser && hasCommentPermission && onCommentCreate);
        const isLoading = !this.areFeedItemsLoaded(comments, tasks, versions);

        return (
            // eslint-disable-next-line
            <div className="bcs-activity-feed" onKeyDown={this.onKeyDown}>
                <div
                    ref={(ref) => {
                        this.feedContainer = ref;
                    }}
                    className='bcs-activity-feed-items-container'
                >
                    {shouldShowEmptyState(feedItems) ? (
                        <EmptyState isLoading={isLoading} showCommentMessage={showApprovalCommentForm} />
                    ) : (
                        <ActiveState
                            {...activityFeedError}
                            items={collapseFeedState(feedItems)}
                            isDisabled={isDisabled}
                            currentUser={currentUser}
                            onTaskAssignmentUpdate={this.updateTaskAssignment}
                            onCommentDelete={hasCommentPermission ? this.deleteComment : noop}
                            // We don't know task edit/delete specific permissions,
                            // but you must at least be able to comment to do these operations.
                            onTaskDelete={hasCommentPermission ? this.deleteTask : noop}
                            onTaskEdit={hasCommentPermission ? this.updateTask : noop}
                            onVersionInfo={this.openVersionHistoryPopup}
                            translations={translations}
                            getAvatarUrl={getAvatarUrl}
                            getUserProfileUrl={getUserProfileUrl}
                            mentionSelectorContacts={mentionSelectorContacts}
                            getMentionWithQuery={getMentionWithQuery}
                        />
                    )}
                </div>
                {showApprovalCommentForm ? (
                    <ApprovalCommentForm
                        onSubmit={() => {
                            if (this.feedContainer) {
                                this.feedContainer.scrollTop = 0;
                            }
                        }}
                        isDisabled={isDisabled}
                        approverSelectorContacts={approverSelectorContacts}
                        mentionSelectorContacts={mentionSelectorContacts}
                        className={classNames('bcs-activity-feed-comment-input', {
                            'bcs-is-disabled': isDisabled
                        })}
                        createComment={hasCommentPermission ? this.createComment : noop}
                        createTask={hasCommentPermission ? this.createTask : noop}
                        updateTask={hasCommentPermission ? this.updateTask : noop}
                        getApproverWithQuery={getApproverWithQuery}
                        getMentionWithQuery={getMentionWithQuery}
                        isOpen={isInputOpen}
                        user={currentUser}
                        onCancel={this.approvalCommentFormCancelHandler}
                        onFocus={this.approvalCommentFormFocusHandler}
                        getAvatarUrl={getAvatarUrl}
                    />
                ) : null}
            </div>
        );
    }
}

export default ActivityFeed;
