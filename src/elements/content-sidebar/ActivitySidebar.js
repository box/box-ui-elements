/**
 * @flow
 * @file Activity feed sidebar component
 * @author Box
 */

import * as React from 'react';
import debounce from 'lodash/debounce';
import flow from 'lodash/flow';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import { withRouter, type ContextRouter } from 'react-router-dom';
import ActivityFeed from './activity-feed';
import AddTaskButton from './AddTaskButton';
import API from '../../api';
import messages from '../common/messages';
import SidebarContent from './SidebarContent';
import { WithAnnotatorContextProps, withAnnotatorContext } from '../common/annotator-context';
import { EVENT_JS_READY } from '../common/logger/constants';
import { getBadUserError, getBadItemError } from '../../utils/error';
import { mark } from '../../utils/performance';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withFeatureConsumer, isFeatureEnabled } from '../common/feature-checking';
import { withLogger } from '../common/logger';
import {
    DEFAULT_COLLAB_DEBOUNCE,
    ORIGIN_ACTIVITY_SIDEBAR,
    SIDEBAR_VIEW_ACTIVITY,
    TASK_COMPLETION_RULE_ALL,
} from '../../constants';
import type {
    TaskCompletionRule,
    TaskType,
    TaskNew,
    TaskUpdatePayload,
    TaskCollabStatus,
} from '../../common/types/tasks';
import type { Annotation, FocusableFeedItemType, FeedItems } from '../../common/types/feed';
import type { ElementsErrorCallback, ErrorContextProps, ElementsXhrError } from '../../common/types/api';
import type { WithLoggerProps } from '../../common/types/logging';
import type { SelectorItems, User, UserMini, GroupMini, BoxItem, BoxItemPermission } from '../../common/types/core';
import type { GetProfileUrlCallback } from '../common/flowTypes';
import type { Translations, Collaborators, Errors } from './flowTypes';
import type { FeatureConfig } from '../common/feature-checking';
import './ActivitySidebar.scss';

type ExternalProps = {
    activeFeedEntryId?: string,
    activeFeedEntryType?: FocusableFeedItemType,
    currentUser?: User,
    getUserProfileUrl?: GetProfileUrlCallback,
    onCommentCreate: Function,
    onCommentDelete: (comment: Comment) => any,
    onCommentUpdate: () => any,
    onTaskAssignmentUpdate: Function,
    onTaskCreate: Function,
    onTaskDelete: (id: string) => any,
    onTaskUpdate: () => any,
    onTaskView: (id: string, isCreator: boolean) => any,
} & ErrorContextProps &
    WithAnnotatorContextProps;

type PropsWithoutContext = {
    elementId: string,
    file: BoxItem,
    isDisabled: boolean,
    onAnnotationSelect: Function,
    onVersionChange: Function,
    onVersionHistoryClick?: Function,
    translations?: Translations,
} & ExternalProps &
    WithLoggerProps &
    ContextRouter;

type Props = {
    api: API,
    features: FeatureConfig,
} & PropsWithoutContext;

type State = {
    activityFeedError?: Errors,
    approverSelectorContacts: SelectorItems<UserMini | GroupMini>,
    currentUser?: User,
    currentUserError?: Errors,
    feedItems?: FeedItems,
    mentionSelectorContacts?: SelectorItems<UserMini>,
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
    static defaultProps = {
        annotatorState: {},
        emitAnnotatorActiveChangeEvent: noop,
        getAnnotationsMatchPath: noop,
        isDisabled: false,
        onAnnotationSelect: noop,
        onCommentCreate: noop,
        onCommentDelete: noop,
        onCommentUpdate: noop,
        onTaskAssignmentUpdate: noop,
        onTaskCreate: noop,
        onTaskDelete: noop,
        onTaskUpdate: noop,
        onVersionChange: noop,
        onVersionHistoryClick: noop,
    };

    constructor(props: Props) {
        super(props);
        // eslint-disable-next-line react/prop-types
        const { logger } = this.props;

        logger.onReadyMetric({
            endMarkName: MARK_NAME_JS_READY,
        });
        this.state = {};

        // On hard load with deep link for annotation on previous version -- replace the
        // file version with the latest file version until ContentPreview can support loading
        // a previous version on mount
        this.handleDeeplinkedAnnotationRedirect();
    }

    handleDeeplinkedAnnotationRedirect = () => {
        const { file, getAnnotationsMatchPath, history } = this.props;
        const currentFileVersionId = getProp(file, 'file_version.id');
        const match = getAnnotationsMatchPath(history);
        const fileVersionId = getProp(match, 'params.fileVersionId');
        const annotationId = getProp(match, 'params.annotationId');

        if (fileVersionId && fileVersionId !== currentFileVersionId) {
            history.replace(`/activity/annotations/${currentFileVersionId}/${annotationId}`);
        }
    };

    componentDidMount() {
        const { currentUser } = this.props;
        this.fetchFeedItems(true);
        this.fetchCurrentUser(currentUser);
    }

    componentDidUpdate({ annotatorState: prevAnnotatorState, match: prevMatch }: Props): void {
        const { activeAnnotationId: prevActiveAnnotationId, annotation: prevAnnotation } = prevAnnotatorState;
        const {
            annotatorState: { activeAnnotationId, annotation },
            match,
        } = this.props;
        const prevFileVersionId = getProp(prevMatch, 'params.fileVersionId');
        const fileVersionId = getProp(match, 'params.fileVersionId');

        if (prevAnnotation !== annotation) {
            this.addAnnotation();
        }

        if (prevActiveAnnotationId !== activeAnnotationId) {
            this.updateActiveAnnotation();
        }

        if (prevFileVersionId !== fileVersionId) {
            this.handleVersionChange();
        }
    }

    addAnnotation() {
        const {
            annotatorState: { action, annotation, meta },
            api,
            file,
        } = this.props;
        const { requestId } = meta || {};
        const { currentUser } = this.state;
        const isPending = action === 'create_start';

        if (!currentUser) {
            throw getBadUserError();
        }

        api.getFeedAPI(false).addAnnotation(file, currentUser, annotation, requestId, isPending);

        this.fetchFeedItems();
    }

    updateActiveAnnotation = () => {
        const { annotatorState: { activeAnnotationId } = {}, file, getAnnotationsMatchPath, history } = this.props;
        const match = getAnnotationsMatchPath(history);
        const currentFileVersionId = getProp(file, 'file_version.id');
        const fileVersionId = getProp(match, 'params.fileVersionId', currentFileVersionId);

        history.push(
            activeAnnotationId
                ? `/activity/annotations/${fileVersionId}/${activeAnnotationId}`
                : `/activity/annotations/${fileVersionId}`,
        );
    };

    handleVersionChange = () => {
        const { file, history, match, onVersionChange } = this.props;
        const { feedItems = [] } = this.state;
        const currentFileVersionId = getProp(file, 'file_version.id');
        const fileVersionId = getProp(match, 'params.fileVersionId');
        const version = feedItems.filter(item => item.type === 'file_version').find(item => item.id === fileVersionId);

        if (version) {
            onVersionChange(version, {
                currentVersionId: currentFileVersionId,
                updateVersionToCurrent: () => history.push(`/activity/annotations/${currentFileVersionId}`),
            });
        }
    };

    /**
     * Fetches a Users info
     *
     * @private
     * @param {User} [user] - Box User. If missing, gets user that the current token was generated for.
     * @param {boolean} shouldDestroy
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

    createTask = (
        message: string,
        assignees: SelectorItems<>,
        taskType: TaskType,
        dueAt: ?string,
        completionRule: TaskCompletionRule,
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
            completionRule,
            successCallback,
            errorCallback,
        );

        // need to load the pending item
        this.fetchFeedItems();
    };

    deleteTask = (task: TaskNew): void => {
        const { file, api, onTaskDelete } = this.props;
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
    };

    updateTask = (task: TaskUpdatePayload, onSuccess: ?Function, onError: ?Function): void => {
        const { file, api, onTaskUpdate } = this.props;
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
    };

    updateTaskAssignment = (taskId: string, taskAssignmentId: string, status: TaskCollabStatus): void => {
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
    };

    /**
     * Deletes a comment via the API.
     *
     * @param {Object} args - A subset of the comment
     * @return void
     */
    deleteComment = ({ id, permissions }: { id: string, permissions: BoxItemPermission }): void => {
        const { file, api, onCommentDelete } = this.props;

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

    updateComment = (
        id: string,
        text: string,
        hasMention: boolean,
        permissions: BoxItemPermission,
        onSuccess: ?Function,
        onError: ?Function,
    ): void => {
        const { file, api, onCommentUpdate } = this.props;

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
            onCommentUpdate();
        };

        api.getFeedAPI(false).updateComment(file, id, text, hasMention, permissions, successCallback, errorCallback);

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
        const { file, api, onCommentCreate } = this.props;
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
        const shouldShowAppActivity = isFeatureEnabled(features, 'activityFeed.appActivity.enabled');
        const shouldShowAnnotations = isFeatureEnabled(features, 'activityFeed.annotations.enabled');

        api.getFeedAPI(shouldDestroy).feedItems(
            file,
            shouldRefreshCache,
            this.fetchFeedItemsSuccessCallback,
            this.fetchFeedItemsErrorCallback,
            this.errorCallback,
            { shouldShowAnnotations, shouldShowAppActivity },
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
    getApproverContactsSuccessCallback = (collaborators: { entries: SelectorItems<> }): void => {
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
    getMentionContactsSuccessCallback = (collaborators: { entries: SelectorItems<> }): void => {
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
        (searchStr: string) =>
            this.getCollaborators(this.getApproverContactsSuccessCallback, this.errorCallback, searchStr, {
                includeGroups: true,
            }),
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
        (searchStr: string) =>
            this.getCollaborators(this.getMentionContactsSuccessCallback, this.errorCallback, searchStr),
        DEFAULT_COLLAB_DEBOUNCE,
    );

    /**
     * Fetches file collaborators
     *
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @param {string} searchStr - the search string
     * @param {Object} [options]
     * @param {boolean} [options.includeGroups] - return groups as well as users
     * @return {void}
     */
    getCollaborators(
        successCallback: Collaborators => void,
        errorCallback: ElementsErrorCallback,
        searchStr: string,
        { includeGroups = false }: { includeGroups: boolean } = {},
    ): void {
        // Do not fetch without filter
        const { file, api } = this.props;
        if (!searchStr || searchStr.trim() === '') {
            return;
        }

        api.getFileCollaboratorsAPI(true).getFileCollaborators(file.id, successCallback, errorCallback, {
            filter_term: searchStr,
            include_groups: includeGroups,
            include_uploader_collabs: false,
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

    handleAnnotationSelect = (annotation: Annotation): void => {
        const {
            file_version: { id: annotationFileVersionId },
            id: nextActiveAnnotationId,
        } = annotation;
        const {
            emitAnnotatorActiveChangeEvent,
            file,
            history,
            getAnnotationsMatchPath,
            onAnnotationSelect,
        } = this.props;
        const currentFileVersionId = getProp(file, 'file_version.id');
        const match = getAnnotationsMatchPath(history);
        const selectedFileVersionId = getProp(match, 'params.fileVersionId', currentFileVersionId);

        emitAnnotatorActiveChangeEvent(nextActiveAnnotationId);

        if (annotationFileVersionId !== selectedFileVersionId) {
            history.push(`/activity/annotations/${annotationFileVersionId}/${nextActiveAnnotationId}`);
        }

        onAnnotationSelect(annotation);
    };

    onTaskModalClose = () => {
        this.setState({
            approverSelectorContacts: [],
        });
    };

    refresh(): void {
        this.fetchFeedItems(true);
    }

    renderAddTaskButton = () => {
        const { isDisabled } = this.props;
        const { approverSelectorContacts } = this.state;
        const { getApproverWithQuery, getAvatarUrl, createTask, onTaskModalClose } = this;
        const taskFormProps = {
            approverSelectorContacts,
            completionRule: TASK_COMPLETION_RULE_ALL,
            createTask,
            getApproverWithQuery,
            getAvatarUrl,
            id: '',
            message: '',
            approvers: [],
        };
        return (
            <AddTaskButton isDisabled={isDisabled} onTaskModalClose={onTaskModalClose} taskFormProps={taskFormProps} />
        );
    };

    render() {
        const {
            elementId,
            file,
            isDisabled = false,
            onVersionHistoryClick,
            getUserProfileUrl,
            activeFeedEntryId,
            activeFeedEntryType,
            onTaskView,
        } = this.props;
        const {
            currentUser,
            approverSelectorContacts,
            mentionSelectorContacts,
            feedItems,
            activityFeedError,
            currentUserError,
        } = this.state;

        return (
            <SidebarContent
                actions={this.renderAddTaskButton()}
                className="bcs-activity"
                elementId={elementId}
                sidebarView={SIDEBAR_VIEW_ACTIVITY}
                title={<FormattedMessage {...messages.sidebarActivityTitle} />}
            >
                <ActivityFeed
                    file={file}
                    activityFeedError={activityFeedError}
                    approverSelectorContacts={approverSelectorContacts}
                    mentionSelectorContacts={mentionSelectorContacts}
                    currentUser={currentUser}
                    isDisabled={isDisabled}
                    onAnnotationSelect={this.handleAnnotationSelect}
                    onAppActivityDelete={this.deleteAppActivity}
                    onCommentCreate={this.createComment}
                    onCommentDelete={this.deleteComment}
                    onCommentUpdate={this.updateComment}
                    onTaskCreate={this.createTask}
                    onTaskDelete={this.deleteTask}
                    onTaskUpdate={this.updateTask}
                    onTaskView={onTaskView}
                    onTaskModalClose={this.onTaskModalClose}
                    onTaskAssignmentUpdate={this.updateTaskAssignment}
                    getApproverWithQuery={this.getApproverWithQuery}
                    getMentionWithQuery={this.getMentionWithQuery}
                    onVersionHistoryClick={onVersionHistoryClick}
                    getAvatarUrl={this.getAvatarUrl}
                    getUserProfileUrl={getUserProfileUrl}
                    feedItems={feedItems}
                    currentUserError={currentUserError}
                    activeFeedEntryId={activeFeedEntryId}
                    activeFeedEntryType={activeFeedEntryType}
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
    withAnnotatorContext,
    withRouter,
])(ActivitySidebar);
