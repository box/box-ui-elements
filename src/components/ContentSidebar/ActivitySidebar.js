/**
 * @flow
 * @file Activity feed sidebar component
 * @author Box
 */

import * as React from 'react';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import ActivityFeed from './ActivityFeed/activity-feed/ActivityFeed';
import SidebarContent from './SidebarContent';
import messages from '../messages';
import { withAPIContext } from '../APIContext';
import { withErrorBoundary } from '../ErrorBoundary';
import { getBadUserError, getBadItemError } from '../../util/error';
import { DEFAULT_COLLAB_DEBOUNCE, ORIGIN_ACTIVITY_SIDEBAR } from '../../constants';
import API from '../../api';
import './ActivitySidebar.scss';
import { ACTIVITY_SIDEBAR_TAGS, EVENT_JS_READY } from '../../logger/loggingConstants';

type ExternalProps = {
    onCommentCreate?: Function,
    onCommentDelete?: Function,
    onTaskCreate?: Function,
    onTaskDelete?: Function,
    onTaskUpdate?: Function,
    onTaskAssignmentUpdate?: Function,
    getUserProfileUrl?: string => Promise<string>,
    currentUser?: User,
};

type PropsWithoutContext = {
    file: BoxItem,
    translations?: Translations,
    isDisabled?: boolean,
    onVersionHistoryClick?: Function,
} & ExternalProps;

type Props = {
    api: API,
} & PropsWithoutContext &
    ErrorContextProps;

type State = {
    currentUser?: User,
    approverSelectorContacts?: SelectorItems,
    mentionSelectorContacts?: SelectorItems,
    activityFeedError?: Errors,
    currentUserError?: Errors,
    feedItems?: FeedItems,
};

window.performance.mark(ACTIVITY_SIDEBAR_TAGS.JSReady);
const ACTIVITY_SIDEBAR_COMPONENT = 'activity_sidebar';

export const activityFeedInlineError: Errors = {
    inlineError: {
        title: messages.errorOccured,
        content: messages.activityFeedItemApiError,
    },
};

class ActivitySidebar extends React.PureComponent<Props, State> {
    state = {};

    constructor(props: Props) {
        super(props);

        const { logger } = this.props;
        if (!logger.hasLoggedEvent(ACTIVITY_SIDEBAR_COMPONENT, EVENT_JS_READY)) {
            logger.logTimeMetric(
                ACTIVITY_SIDEBAR_COMPONENT,
                EVENT_JS_READY,
                undefined,
                ACTIVITY_SIDEBAR_TAGS.JSReady,
                true,
            );
        }
    }

    componentDidMount() {
        const { currentUser } = this.props;
        this.fetchFeedItems(true);
        this.fetchCurrentUser(currentUser);
        // Start time to interaction timer
        window.performance.mark(ACTIVITY_SIDEBAR_TAGS.Initialized);
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
    updateTask = ({ text, id }: { text: string, id: string }): void => {
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
    createTask = (message: string, assignees: SelectorItems, dueAt: string): void => {
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
     * Fetches the feed items for the sidebar
     *
     * @param {boolean} shouldDestroy true if the api factory should be destroyed
     */
    fetchFeedItems(shouldRefreshCache: boolean = false, shouldDestroy: boolean = false) {
        const { file, api } = this.props;
        api.getFeedAPI(shouldDestroy).feedItems(
            file,
            shouldRefreshCache,
            this.fetchFeedItemsSuccessCallback,
            this.fetchFeedItemsErrorCallback,
            this.errorCallback,
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

    render() {
        const { file, isDisabled = false, onVersionHistoryClick, getUserProfileUrl } = this.props;
        const {
            currentUser,
            approverSelectorContacts,
            mentionSelectorContacts,
            feedItems,
            activityFeedError,
            currentUserError,
        } = this.state;

        return (
            <SidebarContent title={<FormattedMessage {...messages.sidebarActivityTitle} />}>
                <ActivityFeed
                    file={file}
                    activityFeedError={activityFeedError}
                    approverSelectorContacts={approverSelectorContacts}
                    mentionSelectorContacts={mentionSelectorContacts}
                    currentUser={currentUser}
                    isDisabled={isDisabled}
                    onCommentCreate={this.createComment}
                    onCommentDelete={this.deleteComment}
                    onTaskCreate={this.createTask}
                    onTaskDelete={this.deleteTask}
                    onTaskUpdate={this.updateTask}
                    onTaskAssignmentUpdate={this.updateTaskAssignment}
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
export default withErrorBoundary(ORIGIN_ACTIVITY_SIDEBAR)(withAPIContext(ActivitySidebar));
