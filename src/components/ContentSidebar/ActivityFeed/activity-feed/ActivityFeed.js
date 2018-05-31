/**
 * @flow
 * @file Component for Activity feed
 */

import * as React from 'react';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
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
    getAvatarUrl: (string) => Promise<?string>
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
     * Creates a comment
     *
     * @param {string} text - Comment text
     * @param {boolean} hasMention - If this comment contains an at mention
     * @return {void}
     */
    createComment = ({ text, hasMention }: { text: string, hasMention: boolean }): void => {
        // create a placeholder pending comment
        // create actual comment and send to Box V2 api
        // call user passed in handlers.comments.create, if it exists
        const createComment = getProp(this.props, 'handlers.comments.create', noop);
        createComment(text, hasMention);

        this.approvalCommentFormSubmitHandler();
    };

    /**
     * Deletes a comment
     *
     * @param {string} id - Comment id
     * @return {void}
     */
    deleteComment = ({ id }: { id: string }): void => {
        // remove comment from list of comments
        // removeItemByTypeAndId('comment', args.id);
        // delete the comment via V2 API
        // call user passed in handlers.comments.delete, if it exists
        const deleteComment = getProp(this.props, 'handlers.comments.delete', noop);
        this.updateFeedItemPendingStatus(id, true);
        deleteComment(id, this.deleteFeedItem, this.feedItemErrorCallback);
    };

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
        // create a placeholder pending task
        // create actual task and send to Box V2 api
        // call user passed in handlers.tasks.create, if it exists
        const createTask = getProp(this.props, 'handlers.tasks.create', noop);
        const dueAtDate: Date = new Date(dueAt);
        const dueAtString: string = dueAtDate.toISOString();
        createTask(text, assignees, dueAtString);

        this.approvalCommentFormSubmitHandler();
    };

    // TODO: delete once Justin's PR merged as its duplicate
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
     * Called on failed update/delete of a feed item
     *
     * @param {Object} e the error
     * @param {string} id the feed item's id
     */
    feedItemErrorCallback = (e: Error, id: string) => {
        this.updateFeedItemPendingStatus(id, false);
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
        updateTask(id, text, this.updateTaskSuccessCallback, this.feedItemErrorCallback);
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
        deleteTask(id, this.deleteFeedItem, this.feedItemErrorCallback);
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

    componentDidMount(): void {
        const { comments, tasks, versions } = this.props;
        this.sortFeedItems(comments, tasks, versions);
    }

    componentWillReceiveProps(nextProps: any): void {
        const { comments, tasks, versions } = nextProps;
        if (this.state.feedItems.length > 0) {
            return;
        }
        this.sortFeedItems(comments, tasks, versions);
    }

    /**
     * Sort valid feed items, descending by created_at time
     *
     * @param args Array<?Comments | ?Tasks | ?FileVersions> - Arguments list of each item container
     * type that is allowed in the feed.
     */
    sortFeedItems(...args: Array<?Comments | ?Tasks | ?FileVersions>): void {
        const feedItems = [];

        // If all items are not ready, don't sort and render the feed
        if (args.some((itemContainer) => !itemContainer || !itemContainer.entries)) {
            return;
        }

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
            file
        } = this.props;
        const { isInputOpen, feedItems } = this.state;
        const showApprovalCommentForm = !!(currentUser && getProp(handlers, 'comments.create', false));
        const hasCommentPermission = getProp(file, 'permissions.can_comment', false);
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
