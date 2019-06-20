/**
 * @flow
 * @file Activity feed sidebar component
 * @author Box
 */

import * as React from 'react';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import flow from 'lodash/flow';
import messages from '../common/messages';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { FeatureFlag, withFeatureConsumer, isFeatureEnabled, getFeatureConfig } from '../common/feature-checking';
import { getBadUserError, getBadItemError } from '../../utils/error';
import API from '../../api';
import { withLogger } from '../common/logger';
import { mark } from '../../utils/performance';
import { EVENT_JS_READY } from '../common/logger/constants';
import ActivityFeed from './activity-feed';
import SidebarContent from './SidebarContent';
import AddTaskButton from './AddTaskButton';
import SidebarUtils from './SidebarUtils';
import { DEFAULT_COLLAB_DEBOUNCE, ORIGIN_ACTIVITY_SIDEBAR, SIDEBAR_VIEW_ACTIVITY } from '../../constants';
import './ActivitySidebar.scss';

type ExternalProps = {
    currentUser?: User,
    getUserProfileUrl?: GetProfileUrlCallback,
    onCommentCreate?: Function,
    onCommentDelete?: Function,
    onTaskAssignmentUpdate?: Function,
    onTaskCreate?: Function,
    onTaskDelete?: Function,
    onTaskUpdate?: Function,
} & ErrorContextProps;

type PropsWithoutContext = {
    file: BoxItem,
    isDisabled: boolean,
    onVersionHistoryClick?: Function,
    translations?: Translations,
} & ExternalProps &
    WithLoggerProps;

type Props = {
    api: API,
    features: FeatureConfig,
} & PropsWithoutContext;

type State = {
    activityFeedError?: Errors,
    approverSelectorContacts: SelectorItems,
    currentUser?: User,
    currentUserError?: Errors,
    feedItems?: FeedItems,
    mentionSelectorContacts?: SelectorItems,
};

export const activityFeedInlineError: Errors = {
    inlineError: {
        title: messages.errorOccured,
        content: messages.activityFeedItemApiError,
    },
};

const MARK_NAME_JS_READY = `${ORIGIN_ACTIVITY_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

class ActivitySidebar extends React.PureComponent<Props, State> {
    state = {};

    constructor(props: Props) {
        super(props);
        // eslint-disable-next-line react/prop-types
        const { logger } = this.props;
        logger.onReadyMetric({
            endMarkName: MARK_NAME_JS_READY,
        });
    }

    static defaultProps = {
        isDisabled: false,
    };

    componentDidMount() {
        const { currentUser } = this.props;
        this.fetchFeedItems(true);
        this.fetchCurrentUser(currentUser);
    }

    /**
     * Fetches a Users info
     *
     * @private
     * @param {User} [user] - Box User. If missing, gets user that the current token was generated for.
     * @return {void}
     */
    fetchCurrentUser(user?: User, shouldDestroy?: boolean = false): void {
        const { api, file } = this.props;

        if (!file) {
            throw getBadItemError();
        }

        if (typeof user === 'undefined') {
            api.getUsersAPI(shouldDestroy).getUser(
                file.id,
                this.fetchCurrentUserSuccessCallback,
                this.fetchCurrentUserErrorCallback,
            );
        } else {
            this.setState({ currentUser: user, currentUserError: undefined });
        }
    }

    /**
     * Success callback for fetching feed items
     */
    feedSuccessCallback = (): void => {
        this.fetchFeedItems();
    };

    /**
     * Error callback for fetching feed items
     *
     * @param {Error} e - the error which occured
     * @param {Error} code - the code for the error
     * @param {Object} contextInfo - the context info for the error
     */
    feedErrorCallback = (e: ElementsXhrError, code: string, contextInfo?: Object) => {
        this.errorCallback(e, code, contextInfo);
        this.fetchFeedItems();
    };

    tasksApiNew = {
        createTask: (
            message: string,
            assignees: SelectorItems,
            taskType: TaskType,
            dueAt: ?string,
            onSuccess: ?Function,
            onError: ?Function,
        ): void => {
            const { currentUser } = this.state;
            const { file, api } = this.props;

            if (!currentUser) {
                throw getBadUserError();
            }
            const errorCallback = (e, code, contextInfo) => {
                if (onError) {
                    onError(e, code, contextInfo);
                }
                this.feedErrorCallback(e, code, contextInfo);
            };
            const successCallback = () => {
                if (onSuccess) {
                    onSuccess();
                }
                this.feedSuccessCallback();
            };

            api.getFeedAPI(false).createTaskNew(
                file,
                currentUser,
                message,
                assignees,
                taskType,
                dueAt,
                successCallback,
                errorCallback,
            );

            // need to load the pending item
            this.fetchFeedItems();
        },
        deleteTask: (task: TaskNew): void => {
            const { file, api, onTaskDelete = noop } = this.props;
            api.getFeedAPI(false).deleteTaskNew(
                file,
                task,
                (taskId: string) => {
                    this.feedSuccessCallback();
                    onTaskDelete(taskId);
                },
                this.feedErrorCallback,
            );

            // need to load the pending item
            this.fetchFeedItems();
        },
        updateTask: (task: TaskUpdatePayload, onSuccess: ?Function, onError: ?Function): void => {
            const { file, api, onTaskUpdate = noop } = this.props;
            const errorCallback = (e, code) => {
                if (onError) {
                    onError(e, code);
                }
                this.feedErrorCallback(e, code);
            };
            const successCallback = () => {
                this.feedSuccessCallback();

                if (onSuccess) {
                    onSuccess();
                }

                onTaskUpdate();
            };

            api.getFeedAPI(false).updateTaskNew(file, task, successCallback, errorCallback);

            // need to load the pending item
            this.fetchFeedItems();
        },
        updateTaskAssignment: (taskId: string, taskAssignmentId: string, status: TaskAssignmentStatus): void => {
            const { file, api } = this.props;

            api.getFeedAPI(false).updateTaskCollaborator(
                file,
                taskId,
                taskAssignmentId,
                status,
                this.feedSuccessCallback,
                this.feedErrorCallback,
            );

            // need to load the pending item
            this.fetchFeedItems();
        },
    };

    /**
     * Deletes a task via the API.
     *
     * @param {Object} args - A subset of the task
     */
    deleteTask = ({ id }: { id: string }): void => {
        const { file, api, onTaskDelete = noop } = this.props;
        api.getFeedAPI(false).deleteTask(
            file,
            id,
            (taskId: string) => {
                this.feedSuccessCallback();
                onTaskDelete(taskId);
            },
            this.feedErrorCallback,
        );

        // need to load the pending item
        this.fetchFeedItems();
    };

    /**
     * Updates a task in the state via the API.
     *
     * @param {Object} args - A subset of the task
     * @return void
     */
    updateTask = ({ text, id }: { id: string, text: string }): void => {
        const { file, api } = this.props;
        api.getFeedAPI(false).updateTask(file, id, text, this.feedSuccessCallback, this.feedErrorCallback);

        // need to load the pending item
        this.fetchFeedItems();
    };

    /**
     * Updates the task assignment
     *
     * @param {string} taskId - ID of task to be updated
     * @param {string} taskAssignmentId - Task assignment ID
     * @param {TaskAssignmentStatus} status - New task assignment status
     * @return void
     */
    updateTaskAssignment = (taskId: string, taskAssignmentId: string, status: TaskAssignmentStatus): void => {
        const { file, api } = this.props;

        api.getFeedAPI(false).updateTaskAssignment(
            file,
            taskId,
            taskAssignmentId,
            status,
            this.feedSuccessCallback,
            this.feedErrorCallback,
        );

        // need to load the pending item
        this.fetchFeedItems();
    };

    /**
     * Deletes a comment via the API.
     *
     * @param {Object} args - A subset of the comment
     * @return void
     */
    deleteComment = ({ id, permissions }: { id: string, permissions: BoxItemPermission }): void => {
        const { file, api, onCommentDelete = noop } = this.props;

        api.getFeedAPI(false).deleteComment(
            file,
            id,
            permissions,
            (comment: Comment) => {
                this.feedSuccessCallback();
                onCommentDelete(comment);
            },
            this.feedErrorCallback,
        );

        // need to load the pending item
        this.fetchFeedItems();
    };

    /**
     * Posts a new comment to the API
     *
     * @param {string} text - The comment's text
     * @param {boolean} hasMention - The comment's text
     * @return {void}
     */
    createComment = (text: string, hasMention: boolean): void => {
        const { file, api, onCommentCreate = noop } = this.props;
        const { currentUser } = this.state;

        if (!currentUser) {
            throw getBadUserError();
        }

        api.getFeedAPI(false).createComment(
            file,
            currentUser,
            text,
            hasMention,
            (comment: Comment) => {
                onCommentCreate(comment);
                this.feedSuccessCallback();
            },
            this.feedErrorCallback,
        );

        // need to load the pending item
        this.fetchFeedItems();
    };

    /**
     * Creates a task via the API
     *
     * @param {string} message - Task text
     * @param {Array} assignees - List of assignees
     * @param {number} dueAt - Task's due date
     * @return {void}
     */
    createTask = (message: string, assignees: SelectorItems, dueAt: ?string): void => {
        const { currentUser } = this.state;
        const { file, api } = this.props;

        if (!currentUser) {
            throw getBadUserError();
        }

        api.getFeedAPI(false).createTask(
            file,
            currentUser,
            message,
            assignees,
            dueAt,
            this.feedSuccessCallback,
            this.feedErrorCallback,
        );

        // need to load the pending item
        this.fetchFeedItems();
    };

    /**
     * Deletes an app activity item via the API.
     *
     * @param {Object} args - A subset of the app activity
     * @return void
     */
    deleteAppActivity = ({ id }: { id: string }): void => {
        const { file, api } = this.props;

        api.getFeedAPI(false).deleteAppActivity(file, id, this.feedSuccessCallback, this.feedErrorCallback);

        // need to load the pending item
        this.fetchFeedItems();
    };

    /**
     * Fetches the feed items for the sidebar
     *
     * @param {boolean} shouldDestroy true if the api factory should be destroyed
     */
    fetchFeedItems(shouldRefreshCache: boolean = false, shouldDestroy: boolean = false) {
        const { file, api, features } = this.props;
        const shouldShowNewTasks = isFeatureEnabled(features, 'activityFeed.tasks.newApi');
        const shouldShowAppActivity = isFeatureEnabled(features, 'activityFeed.appActivity.enabled');
        api.getFeedAPI(shouldDestroy).feedItems(
            file,
            shouldRefreshCache,
            this.fetchFeedItemsSuccessCallback,
            this.fetchFeedItemsErrorCallback,
            this.errorCallback,
            shouldShowNewTasks,
            shouldShowAppActivity,
        );
    }

    /**
     * Handles a successful feed API fetch
     *
     * @private
     * @param {Array} feedItems - the feed items
     * @return {void}
     */
    fetchFeedItemsSuccessCallback = (feedItems: FeedItems): void => {
        this.setState({ feedItems, activityFeedError: undefined });
    };

    /**
     * Handles a failed feed item fetch
     *
     * @private
     * @param {Error} e - API error
     * @return {void}
     */
    fetchFeedItemsErrorCallback = (feedItems: FeedItems): void => {
        this.setState({
            feedItems,
            activityFeedError: activityFeedInlineError,
        });
    };

    /**
     * Network error callback
     *
     * @private
     * @param {Error} error - Error object
     * @param {Error} code - the code for the error
     * @param {Object} contextInfo - the context info for the error
     * @return {void}
     */
    errorCallback = (error: ElementsXhrError, code: string, contextInfo: Object = {}): void => {
        /* eslint-disable no-console */
        console.error(error);
        /* eslint-enable no-console */

        // eslint-disable-next-line react/prop-types
        this.props.onError(error, code, contextInfo);
    };

    /**
     * User fetch success callback
     *
     * @private
     * @param {Object} currentUser - User info object
     * @return {void}
     */
    fetchCurrentUserSuccessCallback = (currentUser: User): void => {
        this.setState({ currentUser, currentUserError: undefined });
    };

    /**
     * File approver contacts fetch success callback
     *
     * @private
     * @param {BoxItemCollection} collaborators - Collaborators response data
     * @return {void}
     */
    getApproverContactsSuccessCallback = (collaborators: Collaborators): void => {
        const { entries } = collaborators;
        this.setState({ approverSelectorContacts: entries });
    };

    /**
     * File @mention contacts fetch success callback
     *
     * @private
     * @param {BoxItemCollection} collaborators - Collaborators response data
     * @return {void}
     */
    getMentionContactsSuccessCallback = (collaborators: Collaborators): void => {
        const { entries } = collaborators;
        this.setState({ mentionSelectorContacts: entries });
    };

    /**
     * File @mention contacts fetch success callback
     *
     * @private
     * @param {string} searchStr - Search string to filter file collaborators by
     * @return {void}
     */
    getApproverWithQuery = debounce(
        this.getCollaborators.bind(this, this.getApproverContactsSuccessCallback, this.errorCallback),
        DEFAULT_COLLAB_DEBOUNCE,
    );

    /**
     * Fetches file @mention's
     *
     * @private
     * @param {string} searchStr - Search string to filter file collaborators by
     * @return {void}
     */
    getMentionWithQuery = debounce(
        this.getCollaborators.bind(this, this.getMentionContactsSuccessCallback, this.errorCallback),
        DEFAULT_COLLAB_DEBOUNCE,
    );

    /**
     * Fetches file collaborators
     *
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @param {string} searchStr - the search string
     * @return {void}
     */
    getCollaborators(successCallback: Function, errorCallback: ElementsErrorCallback, searchStr: string): void {
        // Do not fetch without filter
        const { file, api } = this.props;
        if (!searchStr || searchStr.trim() === '') {
            return;
        }

        api.getFileCollaboratorsAPI(true).getFileCollaborators(file.id, successCallback, errorCallback, {
            filter_term: searchStr,
        });
    }

    /**
     * Handles a failed file user info fetch
     *
     * @private
     * @param {ElementsXhrError} e - API error
     * @return {void}
     */
    fetchCurrentUserErrorCallback = (e: ElementsXhrError, code: string) => {
        this.setState({
            currentUser: undefined,
            currentUserError: {
                maskError: {
                    errorHeader: messages.currentUserErrorHeaderMessage,
                    errorSubHeader: messages.defaultErrorMaskSubHeaderMessage,
                },
            },
        });

        this.errorCallback(e, code, {
            error: e,
        });
    };

    /**
     * Gets the user avatar URL
     *
     * @param {string} userId the user id
     * @param {string} fileId the file id
     * @return the user avatar URL string for a given user with access token attached
     */
    getAvatarUrl = async (userId: string): Promise<?string> => {
        const { file, api } = this.props;

        return api.getUsersAPI(false).getAvatarUrlWithAccessToken(userId, file.id);
    };

    onTaskModalClose = () => {
        this.setState({
            approverSelectorContacts: [],
        });
    };

    renderAddTaskButton = () => {
        const { isDisabled, features } = this.props;
        const { approverSelectorContacts } = this.state;
        const {
            getApproverWithQuery,
            getAvatarUrl,
            tasksApiNew: { createTask },
            onTaskModalClose,
        } = this;
        const props = {
            isDisabled,
            feedbackUrl: getFeatureConfig(features, 'activityFeed.tasks').feedbackUrl || '',
            onTaskModalClose,
        };
        const taskFormProps = {
            approverSelectorContacts,
            createTask,
            getApproverWithQuery,
            getAvatarUrl,
            id: '',
            message: '',
            approvers: [],
        };
        return (
            <FeatureFlag feature="activityFeed.tasks.newApi">
                <AddTaskButton {...props} taskFormProps={taskFormProps} />
            </FeatureFlag>
        );
    };

    render() {
        const { file, isDisabled = false, onVersionHistoryClick, getUserProfileUrl, features } = this.props;
        const {
            currentUser,
            approverSelectorContacts,
            mentionSelectorContacts,
            feedItems,
            activityFeedError,
            currentUserError,
        } = this.state;

        const updateTaskAssignment = isFeatureEnabled(features, 'activityFeed.tasks.newApi')
            ? this.tasksApiNew.updateTaskAssignment
            : this.updateTaskAssignment;

        const updateTask = isFeatureEnabled(features, 'activityFeed.tasks.newApi')
            ? this.tasksApiNew.updateTask
            : this.updateTask;

        const deleteTask = isFeatureEnabled(features, 'activityFeed.tasks.newApi')
            ? this.tasksApiNew.deleteTask
            : this.deleteTask;

        return (
            <SidebarContent
                className="bcs-activity"
                title={SidebarUtils.getTitleForView(SIDEBAR_VIEW_ACTIVITY)}
                actions={<FeatureFlag feature="activityFeed.tasks.createButton" enabled={this.renderAddTaskButton} />}
            >
                <ActivityFeed
                    file={file}
                    activityFeedError={activityFeedError}
                    approverSelectorContacts={approverSelectorContacts}
                    mentionSelectorContacts={mentionSelectorContacts}
                    currentUser={currentUser}
                    isDisabled={isDisabled}
                    onAppActivityDelete={this.deleteAppActivity}
                    onCommentCreate={this.createComment}
                    onCommentDelete={this.deleteComment}
                    onTaskCreate={this.createTask}
                    onTaskDelete={deleteTask}
                    onTaskUpdate={updateTask}
                    onTaskModalClose={this.onTaskModalClose}
                    onTaskAssignmentUpdate={updateTaskAssignment}
                    getApproverWithQuery={this.getApproverWithQuery}
                    getMentionWithQuery={this.getMentionWithQuery}
                    onVersionHistoryClick={onVersionHistoryClick}
                    getAvatarUrl={this.getAvatarUrl}
                    getUserProfileUrl={getUserProfileUrl}
                    feedItems={feedItems}
                    currentUserError={currentUserError}
                />
            </SidebarContent>
        );
    }
}

export type ActivitySidebarProps = ExternalProps;
export { ActivitySidebar as ActivitySidebarComponent };
export default flow([
    withLogger(ORIGIN_ACTIVITY_SIDEBAR),
    withErrorBoundary(ORIGIN_ACTIVITY_SIDEBAR),
    withAPIContext,
    withFeatureConsumer,
])(ActivitySidebar);
