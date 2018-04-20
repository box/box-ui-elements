/**
 * @flow
 * @file Component for Activity feed
 */

import * as React from 'react';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import classNames from 'classnames';

import API from '../../../../api';
import FileCollaborators from '../../../../api/FileCollaborators';
import ActiveState from './ActiveState';
import ApprovalCommentForm from '../approval-comment-form';
import EmptyState from './EmptyState';
import { collapseFeedState, shouldShowEmptyState } from './activityFeedUtils';
import type { User, UserCollection, SelectorItems, BoxItem } from '../../../../flowTypes';
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
    api: API,
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

type Collaborator = {
    id: string,
    name: string,
    item: {
        email: string,
        name: string,
        id: string
    }
};

type State = {
    isInputOpen: boolean,
    approverSelectorContacts: Array<Collaborator>,
    mentionSelectorContacts: Array<Collaborator>
};

class ActivityFeed extends React.Component<Props, State> {
    static defaultProps = {
        isLoading: false,
        feedState: []
    };

    state = {
        isInputOpen: false,
        approverSelectorContacts: [],
        mentionSelectorContacts: []
    };

    feedContainer: null | HTMLElement;

    approverCollabsAPI: FileCollaborators;
    mentionCollabsAPI: FileCollaborators;

    approverSelectorTimeout: null | TimeoutID;
    mentionSelectorTimeout: null | TimeoutID;

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

    /**
     * Re-formats file collaborators response
     *
     * @private
     * @param {Array<User>} contacts - Collection of collaborated users
     * @return {Array<Collaborator>}
     */
    parseContacts = (contacts: Array<User>): Array<Collaborator> => {
        const parsedContacts = [];

        contacts.forEach((collab) => {
            const { id, name, login } = collab;
            parsedContacts.push({
                id,
                name,
                item: { id, name, email: login }
            });
        });
        return parsedContacts;
    };

    /**
     * File approver contacts fetch success callback
     *
     * @private
     * @param {BoxItemCollection} data - Collaborators response data
     * @return {void}
     */
    getApproverContactsSuccessCallback = (data: UserCollection): void => {
        const contacts = data.entries || [];
        this.setState({ approverSelectorContacts: this.parseContacts(contacts) });
    };

    /**
     * File @mention contacts fetch success callback
     *
     * @private
     * @param {BoxItemCollection} data - Collaborators response data
     * @return {void}
     */
    getMentionContactsSuccessCallback = (data: UserCollection): void => {
        const contacts = data.entries || [];
        this.setState({ mentionSelectorContacts: this.parseContacts(contacts) });
    };

    /**
     * Network error callback
     *
     * @private
     * @param {Error} error - Error object
     * @return {void}
     */
    errorCallback = (error: Error): void => {
        /* eslint-disable no-console */
        console.error(error);
        /* eslint-enable no-console */
    };

    /**
     * File @mention contacts fetch success callback
     *
     * @private
     * @param {FileCollaborators} api - Box API instance
     * @param {string} searchStr - Search string to filter file collaborators by
     * @param {Function} successCallback - Fetch success callback
     * @return {void}
     */
    fetchFileCollaborators(api: FileCollaborators, searchStr: string, successCallback: Function) {
        // Do not fetch without filter
        if (!searchStr || searchStr.trim() === '') {
            return;
        }

        api.markerGet({
            id: getProp(this.props, 'file.id', null),
            params: {
                filter_term: searchStr
            },
            successCallback,
            errorCallback: this.errorCallback
        });
    }

    /**
     * File @mention contacts fetch success callback
     *
     * @private
     * @param {API} api - Box API instance
     * @param {string} searchStr - Search string to filter file collaborators by
     * @param {Function} successCallback - Fetch success callback
     * @return {void}
     */
    getApproverSelectorContacts = (searchStr: string): void => {
        if (this.approverSelectorTimeout) {
            clearTimeout(this.approverSelectorTimeout);
            this.approverSelectorTimeout = null;

            if (this.approverCollabsAPI) {
                this.approverCollabsAPI.destroy();
            }
        }

        const api = getProp(this.props, 'api', null);
        this.approverCollabsAPI = api.getFileCollaboratorsAPI();

        this.approverSelectorTimeout = setTimeout(() => {
            this.fetchFileCollaborators(this.approverCollabsAPI, searchStr, this.getApproverContactsSuccessCallback);
        }, 2);
    };

    /**
     * File @mention contacts fetch success callback
     *
     * @private
     * @param {string} searchStr - Search string to filter file collaborators by
     * @return {void}
     */
    getMentionSelectorContacts = (searchStr: string): void => {
        if (this.mentionSelectorTimeout) {
            clearTimeout(this.mentionSelectorTimeout);
            this.mentionSelectorTimeout = null;

            if (this.mentionCollabsAPI) {
                this.mentionCollabsAPI.destroy();
            }
        }

        const api = getProp(this.props, 'api', null);
        this.mentionCollabsAPI = api.getFileCollaboratorsAPI();

        this.mentionSelectorTimeout = setTimeout(() => {
            this.fetchFileCollaborators(this.mentionCollabsAPI, searchStr, this.getMentionContactsSuccessCallback);
        }, 2);
    };

    render(): React.Node {
        const { feedState, handlers, inputState, isLoading, permissions, translations } = this.props;
        const { approverSelectorContacts, mentionSelectorContacts, isInputOpen } = this.state;
        const { currentUser } = inputState;
        const showApprovalCommentForm = !!(currentUser && getProp(handlers, 'comments.create', false));
        const hasCommentPermission = getProp(permissions, 'comments', false);
        const hasTaskPermission = getProp(permissions, 'tasks', false);

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
                        getApproverContactsWithQuery={this.getApproverSelectorContacts}
                        getMentionContactsWithQuery={this.getMentionSelectorContacts}
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
