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
import type {
    CommentHandlers,
    TaskHandlers,
    ContactHandlers,
    VersionHandlers,
    Translations
} from '../activityFeedFlowTypes';

import './ActivityFeed.scss';

type Props = {
    file: BoxItem,
    versions?: FileVersions,
    comments?: Comments,
    tasks?: Tasks,
    approverSelectorContacts?: SelectorItems,
    mentionSelectorContacts?: SelectorItems,
    isLoading?: boolean,
    currentUser?: User,
    isDisabled?: boolean,
    handlers: {
        comments?: CommentHandlers,
        tasks?: TaskHandlers,
        contacts?: ContactHandlers,
        versions?: VersionHandlers
    },
    translations?: Translations,
    getAvatarUrl: (string) => Promise<?string>,
    getUserProfileUrl?: (string) => Promise<string>
};

type State = {
    isInputOpen: boolean,
    feedItems: Array<Comment | Task | BoxItemVersion>
};

class ActivityFeed extends React.Component<Props, State> {
    static defaultProps = {
        isLoading: false
    };

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
     *
     * @param {Comment | Task} feedItem - API returned feed item data.
     * @param {string} id - ID of the feed item to replace.
     * @return {void}
     */
    updateFeedItem = (feedItem: Comment | Task, id: string): void => {
        this.setState({
            feedItems: this.state.feedItems.map((item: Comment | Task | BoxItemVersion) => {
                if (item.id === id) {
                    // $FlowFixMe
                    return {
                        ...item,
                        ...feedItem
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

        const createComment = getProp(this.props, 'handlers.comments.create', noop);

        createComment(
            text,
            hasMention,
            (commentData: Comment) => {
                this.createCommentSuccessCallback(commentData, uuid);
            },
            () => {
                this.deleteFeedItem(uuid);
            }
        );

        this.approvalCommentFormSubmitHandler();
    };

    /**
     * Deletes a comment
     *
     * @param {string} id - Comment id
     * @param {BoxItemPermission} permissions - Permissions for the comment
     * @return {void}
     */
    deleteComment = ({ id, permissions }: { id: string, permissions: BoxItemPermission }): void => {
        // remove comment from list of comments
        // removeItemByTypeAndId('comment', args.id);
        // delete the comment via V2 API
        // call user passed in handlers.comments.delete, if it exists
        const deleteComment = getProp(this.props, 'handlers.comments.delete', noop);
        this.updateFeedItemPendingStatus(id, true);
        deleteComment(id, permissions, this.deleteFeedItem, () => this.updateFeedItemPendingStatus(id, false));
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
     * Creates a task
     *
     * @param {string} text - Task text
     * @param {Array} assignees - List of assignees
     * @param {number} dueAt - Task's due date
     * @return {void}
     */
    createTask = ({
        text,
        assignees,
        dueAt
    }: {
        text: string,
        assignees: Array<SelectorItems>,
        dueAt: string
    }): void => {
        const uuid = uniqueId('task_');
        let dueAtString;
        if (dueAt) {
            const dueAtDate: Date = new Date(dueAt);
            dueAtString = dueAtDate.toISOString();
        }

        const task = {
            due_at: dueAtString,
            id: uuid,
            is_completed: false,
            message: text,
            task_assignment_collection: [],
            type: 'task'
        };

        this.addPendingItem(task);

        // create a placeholder pending task
        // create actual task and send to Box V2 api
        // call user passed in handlers.tasks.create, if it exists
        const createTask = getProp(this.props, 'handlers.tasks.create', noop);
        createTask(
            text,
            assignees,
            dueAtString,
            (taskData: Task) => {
                this.createTaskSuccessCallback(taskData, uuid);
            },
            () => {
                this.deleteFeedItem(uuid);
            }
        );

        this.approvalCommentFormSubmitHandler();
    };

    /**
     * Called on successful update of a task
     *
     * @param {Object} task the updated task
     */
    updateTaskSuccessCallback = (task: Task) => {
        const { id } = task;

        this.updateFeedItem(
            {
                ...task,
                isPending: false
            },
            id
        );
    };

    /**
     * Updates a feed item's pending status
     *
     * @param {Object} item the feed item to update
     * @param {boolean} isPending true if the feed item is to be updated to pending=true
     */
    updateFeedItemPendingStatus = (id: string, isPending: boolean) => {
        this.setState({
            feedItems: this.state.feedItems.map((feedItem: Comment | Task | BoxItemVersion) => {
                if (feedItem.id === id) {
                    // $FlowFixMe
                    return {
                        ...feedItem,
                        isPending
                    };
                }
                return feedItem;
            })
        });
    };

    /**
     * Deletes a feed item from the state
     *
     * @param {Object} item the item to be deleted
     */
    deleteFeedItem = (id: string) => {
        this.setState({
            feedItems: this.state.feedItems.filter((feedItem) => feedItem.id !== id)
        });
    };

    /**
     * Updates a task in the state
     *
     * @param {Object} args a subset of the task
     */
    updateTask = ({ text, id }: { text: string, id: string }): void => {
        // get previous task assignment state
        // update the task via v2 api
        // update task state OR
        // if it fails, revert to previous task state
        // call user passed in handlers.tasks.edit, if it exists
        const updateTask = getProp(this.props, 'handlers.tasks.edit', noop);
        this.updateFeedItemPendingStatus(id, true);
        updateTask(id, text, this.updateTaskSuccessCallback, () => this.updateFeedItemPendingStatus(id, false));
    };

    /**
     * Updates a task in the state
     *
     * @param {Object} args a subset of the task
     */
    deleteTask = ({ id }: { id: string }): void => {
        // remove task from task list
        // removeItemByTypeAndId('task', args.id);
        // delete the task via v2 api
        // call user passed in handlers.tasks.delete, if it exists
        const deleteTask = getProp(this.props, 'handlers.tasks.delete', noop);
        this.updateFeedItemPendingStatus(id, true);
        deleteTask(id, this.deleteFeedItem, () => {
            this.updateFeedItemPendingStatus(id, false);
        });
    };

    updateTaskAssignment = (taskId: string, taskAssignmentId: string, status: string): void => {
        // Determine fixedStatus from status. 'approved' === 'complete', 'rejected' === 'done'
        // get previous task state
        // add task to state
        // update assignment via V2 API
        // failure? revert to previous task state
        // call user passed in handlers.tasks.onTaskAssignmentUpdate, if it exists
        const updateTaskAssignment = getProp(this.props, 'handlers.tasks.onTaskAssignmentUpdate', noop);
        updateTaskAssignment(taskId, taskAssignmentId, status);
    };

    openVersionHistoryPopup = (data: any): void => {
        // get version number from data
        // open the pop for version history
        // call user passed in handlers.versions.info, if it exists
        const versionInfoHandler = getProp(this.props, 'handlers.versions.info', noop);
        versionInfoHandler(data);
    };

    /**
     * Determine whether or not a sort should occur, based on new comments, tasks, versions.
     *
     * @param {Comments} - [comments] - Object containing comments for the file.
     * @param {Tasks} - [tasks] - Object containing tasks for the file.
     * @param {FileVersions} - [versions] Object containing versions of the file.
     * @return {boolean} True if the feed should be sorted with new items.
     */
    shouldSortFeedItems(comments?: Comments, tasks?: Tasks, versions?: FileVersions): boolean {
        return !!(comments && tasks && versions);
    }

    /**
     *  If the file has changed, clear out the feed state.
     *
     * @param {BoxItem} [file] The box file that comments, tasks, and versions belong to.
     * @return {boolean} - True if the feedItems were emptied.
     */
    clearFeedItems(file?: BoxItem): boolean {
        const { file: oldFile } = this.props;
        if (file && file.id !== oldFile.id) {
            this.setState({ feedItems: [] });
            return true;
        }

        return false;
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
        const shouldSort = this.shouldSortFeedItems(comments, tasks, versions);
        const { feedItems } = this.state;

        if (shouldSort && (isFeedEmpty || !feedItems.length)) {
            // $FlowFixMe
            this.sortFeedItems(comments, tasks, versions);
        }
    }

    /**
     * Sort valid feed items, descending by created_at time
     *
     * @param args Array<?Comments | ?Tasks | ?FileVersions> - Arguments list of each item container
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
            handlers,
            isLoading,
            translations,
            approverSelectorContacts,
            mentionSelectorContacts,
            currentUser,
            isDisabled,
            getAvatarUrl,
            getUserProfileUrl,
            file
        } = this.props;
        const { isInputOpen, feedItems } = this.state;
        const hasCommentPermission = getProp(file, 'permissions.can_comment', false);
        const showApprovalCommentForm = !!(
            currentUser &&
            hasCommentPermission &&
            getProp(handlers, 'comments.create', false)
        );
        const getApproverWithQuery = getProp(handlers, 'contacts.approver', noop);
        const getMentionWithQuery = getProp(handlers, 'contacts.mention', noop);

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
                            handlers={handlers}
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
                        getApproverContactsWithQuery={getApproverWithQuery}
                        getMentionContactsWithQuery={getMentionWithQuery}
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
