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

    deleteComment = (args: any): void => {
        // remove comment from list of comments
        // removeItemByTypeAndId('comment', args.id);
        // delete the comment via V2 API
        // call user passed in handlers.comments.delete, if it exists
        const deleteComment = getProp(this.props, 'handlers.comments.delete', noop);
        deleteComment(args);
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

    updateTask = (args: any): void => {
        // get previous task assignment state
        // update the task via v2 api
        // update task state OR
        // if it fails, revert to previous task state
        // call user passed in handlers.tasks.edit, if it exists
        const updateTask = getProp(this.props, 'handlers.tasks.edit', noop);
        updateTask(args);
    };

    deleteTask = (args: any): void => {
        // remove task from task list
        // removeItemByTypeAndId('task', args.id);
        // delete the task via v2 api
        // call user passed in handlers.tasks.delete, if it exists
        const deleteTask = getProp(this.props, 'handlers.tasks.delete', noop);
        deleteTask(args);
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
        if (!comments || !tasks || !versions) {
            return false;
        }

        return true;
    }

    /**
     *  If the file has changed, clear out the feed state.
     *
     * @param {BoxItem} [file] The box file that comments, tasks, and versions belong to.
     * @return {Promise} - A promise that resolves in 'true' if the feedItems are empty.
     */
    clearFeedItems(file?: BoxItem): Promise<boolean> {
        const { file: oldFile } = this.props;
        if (file && file.id !== oldFile.id) {
            return new Promise((resolve) => {
                this.setState({ feedItems: [] }, () => {
                    resolve(true);
                });
            });
        }

        // Also check to see if the feedItems list is empty.
        const { feedItems } = this.state;
        return Promise.resolve(!feedItems.length);
    }

    componentDidMount(): void {
        const { comments, tasks, versions, file } = this.props;
        this.updateFeedItems(comments, tasks, versions, file);
    }

    componentWillReceiveProps(nextProps: any): void {
        const { comments, tasks, versions, file } = nextProps;
        this.updateFeedItems(comments, tasks, versions, file);
    }

    updateFeedItems(comments, tasks, versions, file) {
        this.clearFeedItems(file).then((isEmpty) => {
            const shouldSort = this.shouldSortFeedItems(comments, tasks, versions);
            if (shouldSort && isEmpty) {
                // $FlowFixMe
                this.sortFeedItems(comments, tasks, versions);
            }
        });
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
