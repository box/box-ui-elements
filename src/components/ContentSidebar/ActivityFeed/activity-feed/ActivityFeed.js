/**
 * @flow
 * @file Component for Activity feed
 */

import * as React from 'react';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import classNames from 'classnames';

import FileCollaborators from '../../../../api/FileCollaborators';
import ActiveState from './ActiveState';
import ApprovalCommentForm from '../approval-comment-form';
import EmptyState from './EmptyState';
import { collapseFeedState, shouldShowEmptyState } from './activityFeedUtils';
import type { User, SelectorItems, BoxItem } from '../../../../flowTypes';
import type {
    CommentHandlers,
    TaskHandlers,
    ContactHandlers,
    VersionHandlers,
    Item,
    Translations
} from '../activityFeedFlowTypes';

import './ActivityFeed.scss';

type Props = {
    file: BoxItem,
    isLoading?: boolean,
    feedState: Array<Item>,
    inputState: {
        currentUser: User,
        approverSelectorContacts?: SelectorItems,
        mentionSelectorContacts?: SelectorItems,
        isDisabled?: boolean
    },
    handlers: {
        comments?: CommentHandlers,
        tasks?: TaskHandlers,
        contacts?: ContactHandlers,
        versions?: VersionHandlers
    },
    translations?: Translations,
    permissions?: {
        comments?: boolean,
        tasks?: boolean
    }
};

type State = {
    isInputOpen: boolean
};

class ActivityFeed extends React.Component<Props, State> {
    static defaultProps = {
        isLoading: false,
        feedState: []
    };

    state = {
        isInputOpen: false
    };

    feedContainer: null | HTMLElement;

    onKeyDown = (event: SyntheticKeyboardEvent<>): void => {
        const { nativeEvent } = event;
        nativeEvent.stopImmediatePropagation();
    };

    approvalCommentFormFocusHandler = (): void => this.setState({ isInputOpen: true });
    approvalCommentFormCancelHandler = (): void => this.setState({ isInputOpen: false });
    approvalCommentFormSubmitHandler = (): void => this.setState({ isInputOpen: false });

    createComment = (args: any): void => {
        // create a placeholder pending comment
        // create actual comment and send to Box V2 api
        // call user passed in handlers.comments.create, if it exists
        const createComment = getProp(this.props, 'handlers.comments.create', noop);
        createComment(args);

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

    createTask = (args: any): void => {
        // create a placeholder pending task
        // create actual task and send to Box V2 api
        // call user passed in handlers.tasks.create, if it exists
        const createTask = getProp(this.props, 'handlers.tasks.create', noop);
        createTask(args);

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

    render(): React.Node {
        const { feedState, handlers, inputState, isLoading, permissions, translations } = this.props;
        const { isInputOpen } = this.state;
        const { approverSelectorContacts, mentionSelectorContacts, currentUser } = inputState;
        const showApprovalCommentForm = !!(currentUser && getProp(handlers, 'comments.create', false));
        const hasCommentPermission = getProp(permissions, 'comments', false);
        const hasTaskPermission = getProp(permissions, 'tasks', false);
        const getApproverSelectorContacts = getProp(handlers, 'contacts.approver', false);
        const getMentionSelectorContacts = getProp(handlers, 'contacts.mention', false);

        return (
            // eslint-disable-next-line
            <div className="bcs-activity-feed" onKeyDown={this.onKeyDown}>
                <div
                    ref={(ref) => {
                        this.feedContainer = ref;
                    }}
                    className='bcs-activity-feed-items-container'
                >
                    {shouldShowEmptyState(feedState) ? (
                        <EmptyState isLoading={isLoading} showCommentMessage={showApprovalCommentForm} />
                    ) : (
                        <ActiveState
                            handlers={handlers}
                            items={collapseFeedState(feedState)}
                            currentUser={currentUser}
                            onTaskAssignmentUpdate={this.updateTaskAssignment}
                            onCommentDelete={hasCommentPermission ? this.deleteComment : noop}
                            onTaskDelete={hasTaskPermission ? this.deleteTask : noop}
                            onTaskEdit={hasTaskPermission ? this.updateTask : noop}
                            onVersionInfo={this.openVersionHistoryPopup}
                            translations={translations}
                            inputState={inputState}
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
                        isDisabled={inputState.isDisabled}
                        approverSelectorContacts={approverSelectorContacts}
                        mentionSelectorContacts={mentionSelectorContacts}
                        className={classNames('bcs-activity-feed-comment-input', {
                            'bcs-is-disabled': inputState.isDisabled
                        })}
                        createComment={hasCommentPermission ? this.createComment : noop}
                        createTask={hasTaskPermission ? this.createTask : noop}
                        getApproverContactsWithQuery={getApproverSelectorContacts}
                        getMentionContactsWithQuery={getMentionSelectorContacts}
                        isOpen={isInputOpen}
                        user={currentUser}
                        onCancel={this.approvalCommentFormCancelHandler}
                        onFocus={this.approvalCommentFormFocusHandler}
                    />
                ) : null}
            </div>
        );
    }
}

export default ActivityFeed;
