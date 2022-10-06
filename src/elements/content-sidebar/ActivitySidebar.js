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
import { type ContextRouter } from 'react-router-dom';
import ActivityFeed from './activity-feed';
import AddTaskButton from './AddTaskButton';
import API from '../../api';
import messages from '../common/messages';
import SidebarContent from './SidebarContent';
import { WithAnnotatorContextProps, withAnnotatorContext } from '../common/annotator-context';
import { EVENT_DATA_READY, EVENT_JS_READY } from '../common/logger/constants';
import { getBadUserError } from '../../utils/error';
import { mark } from '../../utils/performance';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withFeatureConsumer, isFeatureEnabled } from '../common/feature-checking';
import { withLogger } from '../common/logger';
import { withRouterAndRef } from '../common/routing';
import ActivitySidebarFilter from './ActivitySidebarFilter';
import {
    DEFAULT_COLLAB_DEBOUNCE,
    ERROR_CODE_FETCH_ACTIVITY,
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
import type {
    Annotation,
    AnnotationPermission,
    BoxCommentPermission,
    CommentFeedItemType,
    FocusableFeedItemType,
    FeedItems,
    FeedItemStatus,
} from '../../common/types/feed';
import type { ErrorContextProps, ElementsXhrError } from '../../common/types/api';
import type { WithLoggerProps } from '../../common/types/logging';
import type { SelectorItems, User, UserMini, GroupMini, BoxItem } from '../../common/types/core';
import type { Errors, GetProfileUrlCallback } from '../common/flowTypes';
import type { Translations } from './flowTypes';
import type { FeatureConfig } from '../common/feature-checking';
import './ActivitySidebar.scss';

type ExternalProps = {
    activeFeedEntryId?: string,
    activeFeedEntryType?: FocusableFeedItemType,
    currentUser?: User,
    currentUserError?: Errors,
    getUserProfileUrl?: GetProfileUrlCallback,
    hasReplies?: boolean,
    hasTasks?: boolean,
    hasVersions?: boolean,
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
    hasSidebarInitialized?: boolean,
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
    contactsLoaded?: boolean,
    feedItems?: FeedItems,
    feedItemsStatusFilter?: FeedItemStatus,
    mentionSelectorContacts?: SelectorItems<UserMini>,
};

export const activityFeedInlineError: Errors = {
    inlineError: {
        title: messages.errorOccured,
        content: messages.activityFeedItemApiError,
    },
};

const MARK_NAME_DATA_LOADING = `${ORIGIN_ACTIVITY_SIDEBAR}_data_loading`;
const MARK_NAME_DATA_READY = `${ORIGIN_ACTIVITY_SIDEBAR}_${EVENT_DATA_READY}`;
const MARK_NAME_JS_READY = `${ORIGIN_ACTIVITY_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

class ActivitySidebar extends React.PureComponent<Props, State> {
    static defaultProps = {
        annotatorState: {},
        emitAnnotatorActiveChangeEvent: noop,
        getAnnotationsMatchPath: noop,
        getAnnotationsPath: noop,
        hasReplies: false,
        hasTasks: true,
        hasVersions: true,
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

        mark(MARK_NAME_DATA_LOADING);

        logger.onReadyMetric({
            endMarkName: MARK_NAME_JS_READY,
        });
        this.state = {};
    }

    componentDidMount() {
        this.fetchFeedItems(true);
    }

    handleAnnotationDelete = ({ id, permissions }: { id: string, permissions: AnnotationPermission }) => {
        const { api, file } = this.props;

        api.getFeedAPI(false).deleteAnnotation(
            file,
            id,
            permissions,
            this.deleteAnnotationSuccess.bind(this, id),
            this.feedErrorCallback,
        );

        this.fetchFeedItems();
    };

    handleAnnotationEdit = (id: string, text: string, permissions: AnnotationPermission) => {
        const { api, file } = this.props;

        api.getFeedAPI(false).updateAnnotation(
            file,
            id,
            text,
            undefined,
            permissions,
            this.feedSuccessCallback,
            this.feedErrorCallback,
        );

        this.fetchFeedItems();
    };

    handleAnnotationStatusChange = (id: string, status: FeedItemStatus, permissions: AnnotationPermission) => {
        const { api, file } = this.props;

        api.getFeedAPI(false).updateAnnotation(
            file,
            id,
            undefined,
            status,
            permissions,
            this.feedSuccessCallback,
            this.feedErrorCallback,
        );

        this.fetchFeedItems();
    };

    deleteAnnotationSuccess(id: string) {
        const { emitRemoveEvent } = this.props;

        this.feedSuccessCallback();
        emitRemoveEvent(id);
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
        const { api, currentUser, file } = this.props;

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
        const { api, file, onTaskUpdate } = this.props;
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
        const { api, currentUser = {}, file, onTaskAssignmentUpdate } = this.props;

        const successCallback = () => {
            this.feedSuccessCallback();
            onTaskAssignmentUpdate(taskId, taskAssignmentId, status, currentUser.id);
        };

        api.getFeedAPI(false).updateTaskCollaborator(
            file,
            taskId,
            taskAssignmentId,
            status,
            successCallback,
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
    deleteComment = ({ id, permissions }: { id: string, permissions: BoxCommentPermission }): void => {
        const { api, file, hasReplies, onCommentDelete } = this.props;

        const successCallback = (comment: Comment) => {
            this.feedSuccessCallback();
            onCommentDelete(comment);
        };

        if (hasReplies) {
            api.getFeedAPI(false).deleteThreadedComment(file, id, permissions, successCallback, this.feedErrorCallback);
        } else {
            api.getFeedAPI(false).deleteComment(file, id, permissions, successCallback, this.feedErrorCallback);
        }

        // need to load the pending item
        this.fetchFeedItems();
    };

    /**
     * Deletes a reply via the API.
     *
     * @param {Object} args - A subset of the comment
     * @return void
     */
    deleteReply = ({
        id,
        parentId,
        permissions,
    }: {
        id: string,
        parentId: string,
        permissions: BoxCommentPermission,
    }): void => {
        const { file, api } = this.props;

        api.getFeedAPI(false).deleteReply(
            file,
            id,
            parentId,
            permissions,
            this.feedSuccessCallback,
            this.feedErrorCallback,
        );

        // need to load the pending item
        this.fetchFeedItems();
    };

    updateComment = (
        id: string,
        text?: string,
        status?: FeedItemStatus,
        hasMention: boolean,
        permissions: BoxCommentPermission,
        onSuccess: ?Function,
        onError: ?Function,
    ): void => {
        const { api, file, hasReplies, onCommentUpdate } = this.props;

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

        if (hasReplies) {
            api.getFeedAPI(false).updateThreadedComment(
                file,
                id,
                text,
                status,
                permissions,
                successCallback,
                errorCallback,
            );
        } else {
            api.getFeedAPI(false).updateComment(
                file,
                id,
                text || '',
                hasMention,
                permissions,
                successCallback,
                errorCallback,
            );
        }

        // need to load the pending item
        this.fetchFeedItems();
    };

    /**
     * Updates a reply
     *
     * @param {string} id - id of the reply
     * @param {string} parentId - id of the parent item
     * @param {string} text - the reply updated text
     * @param {BoxCommentPermission} permissions - permissions associated with the reply
     * @param {Function} onSuccess - the success callback
     * @param {Function} onError - the error callback
     * @return {void}
     */
    updateReply = (
        id: string,
        parentId: string,
        text: string,
        permissions: BoxCommentPermission,
        onSuccess: ?Function,
        onError: ?Function,
    ): void => {
        const { api, file } = this.props;

        api.getFeedAPI(false).updateReply(
            file,
            id,
            parentId,
            text,
            permissions,
            () => {
                this.feedSuccessCallback();
                if (onSuccess) {
                    onSuccess();
                }
            },
            (error, code) => {
                if (onError) {
                    onError(error, code);
                }
                this.feedErrorCallback(error, code);
            },
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
        const { api, currentUser, file, hasReplies, onCommentCreate } = this.props;

        if (!currentUser) {
            throw getBadUserError();
        }

        const successCallback = (comment: Comment) => {
            onCommentCreate(comment);
            this.feedSuccessCallback();
        };

        if (hasReplies) {
            api.getFeedAPI(false).createThreadedComment(
                file,
                currentUser,
                text,
                successCallback,
                this.feedErrorCallback,
            );
        } else {
            api.getFeedAPI(false).createComment(
                file,
                currentUser,
                text,
                hasMention,
                successCallback,
                this.feedErrorCallback,
            );
        }

        // need to load the pending item
        this.fetchFeedItems();
    };

    /**
     * Posts a new reply to the API
     *
     * @param {string} parentId - The id of the parent item
     * @param {CommentFeedItemType} parentType - The type of the parent item
     * @param {string} text - The text of reply
     * @return {void}
     */
    createReply = (parentId: string, parentType: CommentFeedItemType, text: string): void => {
        const { api, currentUser, file } = this.props;

        if (!currentUser) {
            throw getBadUserError();
        }

        api.getFeedAPI(false).createReply(
            file,
            currentUser,
            parentId,
            parentType,
            text,
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
        const { api, file } = this.props;

        api.getFeedAPI(false).deleteAppActivity(file, id, this.feedSuccessCallback, this.feedErrorCallback);

        // need to load the pending item
        this.fetchFeedItems();
    };

    /**
     * Fetches the feed items for the sidebar
     *
     * @param {boolean} shouldRefreshCache true if the cache should be refreshed
     * @param {boolean} shouldDestroy true if the api factory should be destroyed
     */
    fetchFeedItems(shouldRefreshCache: boolean = false, shouldDestroy: boolean = false) {
        const {
            api,
            file,
            features,
            hasReplies: shouldShowReplies,
            hasTasks: shouldShowTasks,
            hasVersions: shouldShowVersions,
        } = this.props;
        const shouldShowAppActivity = isFeatureEnabled(features, 'activityFeed.appActivity.enabled');
        const shouldShowAnnotations = isFeatureEnabled(features, 'activityFeed.annotations.enabled');

        api.getFeedAPI(shouldDestroy).feedItems(
            file,
            shouldRefreshCache,
            this.fetchFeedItemsSuccessCallback,
            this.fetchFeedItemsErrorCallback,
            this.errorCallback,
            { shouldShowAnnotations, shouldShowAppActivity, shouldShowReplies, shouldShowTasks, shouldShowVersions },
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
        const {
            file: { id: fileId },
            logger,
        } = this.props;

        mark(MARK_NAME_DATA_READY);

        // Only emit metric if has >1 activity feed items (there should always at least be the current version)
        if (feedItems.length > 1) {
            logger.onDataReadyMetric(
                {
                    endMarkName: MARK_NAME_DATA_READY,
                    startMarkName: MARK_NAME_DATA_LOADING,
                },
                fileId,
            );
        }

        this.setState({ feedItems, activityFeedError: undefined });
    };

    /**
     * Handles a failed feed item fetch
     *
     * @private
     * @param {Error} e - API error
     * @return {void}
     */
    fetchFeedItemsErrorCallback = (feedItems: FeedItems, errors: ElementsXhrError[]): void => {
        const { onError } = this.props;

        this.setState({
            feedItems,
            activityFeedError: activityFeedInlineError,
        });

        if (Array.isArray(errors) && errors.length) {
            onError(new Error('Fetch feed items error'), ERROR_CODE_FETCH_ACTIVITY, {
                showNotification: true,
                errors: errors.map(({ code }) => code),
            });
        }
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
        this.setState({ contactsLoaded: false }, () =>
            this.setState({
                contactsLoaded: true,
                mentionSelectorContacts: entries,
            }),
        );
    };

    /**
     * Fetches file @mention's with groups
     *
     * @private
     * @param {string} searchStr - Search string to filter file collaborators by
     * @return {void}
     */
    getApprover = debounce((searchStr: string) => {
        const { file, api } = this.props;
        api.getFileCollaboratorsAPI(false).getCollaboratorsWithQuery(
            file.id,
            this.getApproverContactsSuccessCallback,
            this.errorCallback,
            searchStr,
            {
                includeGroups: true,
            },
        );
    }, DEFAULT_COLLAB_DEBOUNCE);

    /**
     * Fetches file @mention's
     *
     * @private
     * @param {string} searchStr - Search string to filter file collaborators by
     * @return {void}
     */
    getMention = debounce((searchStr: string) => {
        const { file, api } = this.props;
        api.getFileCollaboratorsAPI(false).getCollaboratorsWithQuery(
            file.id,
            this.getMentionContactsSuccessCallback,
            this.errorCallback,
            searchStr,
        );
    }, DEFAULT_COLLAB_DEBOUNCE);

    /**
     * Fetches replies (comments) of a comment or annotation
     *
     * @param {string} id - id of the feed item
     * @param {CommentFeedItemType} type - type of the feed item
     * @return {void}
     */
    getReplies = (id: string, type: CommentFeedItemType): void => {
        const { api, file } = this.props;

        api.getFeedAPI(false).fetchReplies(file, id, type, this.feedSuccessCallback, this.feedErrorCallback);

        // need to load the pending item
        this.fetchFeedItems();
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
        const { file_version, id: nextActiveAnnotationId } = annotation;
        const {
            emitAnnotatorActiveChangeEvent,
            file,
            getAnnotationsMatchPath,
            getAnnotationsPath,
            history,
            location,
            onAnnotationSelect,
        } = this.props;
        const annotationFileVersionId = getProp(file_version, 'id');
        const currentFileVersionId = getProp(file, 'file_version.id');
        const match = getAnnotationsMatchPath(location);
        const selectedFileVersionId = getProp(match, 'params.fileVersionId', currentFileVersionId);

        emitAnnotatorActiveChangeEvent(nextActiveAnnotationId);

        if (annotationFileVersionId && annotationFileVersionId !== selectedFileVersionId) {
            history.push(getAnnotationsPath(annotationFileVersionId, nextActiveAnnotationId));
        }

        onAnnotationSelect(annotation);
    };

    handleItemsFiltered = (status?: FeedItemStatus) => {
        this.setState({ feedItemsStatusFilter: status });
    };

    getFilteredFeedItems = (): FeedItems | typeof undefined => {
        const { feedItems, feedItemsStatusFilter } = this.state;
        if (!feedItems || !feedItemsStatusFilter) {
            return feedItems;
        }
        return feedItems.filter(item => {
            return item.status === feedItemsStatusFilter || item.type === 'file_version';
        });
    };

    onTaskModalClose = () => {
        this.setState({
            approverSelectorContacts: [],
        });
    };

    refresh(shouldRefreshCache: boolean = true): void {
        this.fetchFeedItems(shouldRefreshCache);
    }

    renderAddTaskButton = () => {
        const { isDisabled, hasTasks } = this.props;
        const { approverSelectorContacts } = this.state;
        const { getApprover, getAvatarUrl, createTask, onTaskModalClose } = this;

        if (!hasTasks) {
            return null;
        }

        return (
            <AddTaskButton
                isDisabled={isDisabled}
                onTaskModalClose={onTaskModalClose}
                taskFormProps={{
                    approvers: [],
                    approverSelectorContacts,
                    completionRule: TASK_COMPLETION_RULE_ALL,
                    createTask,
                    getApproverWithQuery: getApprover,
                    getAvatarUrl,
                    id: '',
                    message: '',
                }}
            />
        );
    };

    renderActivitySidebarFilter = () => {
        const { features } = this.props;
        const { feedItemsStatusFilter } = this.state;
        const shouldShowActivityFeedFilter = isFeatureEnabled(features, 'activityFeed.filter.enabled');

        if (!shouldShowActivityFeedFilter) {
            return null;
        }
        return (
            <ActivitySidebarFilter
                feedItemStatus={feedItemsStatusFilter}
                onFeedItemStatusClick={selectedStatus => {
                    this.handleItemsFiltered(selectedStatus);
                }}
            />
        );
    };

    renderActions = () => (
        <>
            {this.renderActivitySidebarFilter()}
            {this.renderAddTaskButton()}
        </>
    );

    renderTitle = () => {
        const { features } = this.props;
        if (isFeatureEnabled(features, 'activityFeed.filter.enabled')) {
            return undefined;
        }
        return <FormattedMessage {...messages.sidebarActivityTitle} />;
    };

    render() {
        const {
            currentUser,
            currentUserError,
            elementId,
            file,
            hasReplies,
            isDisabled = false,
            onVersionHistoryClick,
            getUserProfileUrl,
            activeFeedEntryId,
            activeFeedEntryType,
            onTaskView,
        } = this.props;
        const { activityFeedError, approverSelectorContacts, contactsLoaded, mentionSelectorContacts } = this.state;

        return (
            <SidebarContent
                actions={this.renderActions()}
                className="bcs-activity"
                elementId={elementId}
                sidebarView={SIDEBAR_VIEW_ACTIVITY}
                title={this.renderTitle()}
            >
                <ActivityFeed
                    activeFeedEntryId={activeFeedEntryId}
                    activeFeedEntryType={activeFeedEntryType}
                    activityFeedError={activityFeedError}
                    approverSelectorContacts={approverSelectorContacts}
                    currentUser={currentUser}
                    currentUserError={currentUserError}
                    feedItems={this.getFilteredFeedItems()}
                    file={file}
                    getApproverWithQuery={this.getApprover}
                    getAvatarUrl={this.getAvatarUrl}
                    getMentionWithQuery={this.getMention}
                    getUserProfileUrl={getUserProfileUrl}
                    hasReplies={hasReplies}
                    isDisabled={isDisabled}
                    mentionSelectorContacts={mentionSelectorContacts}
                    contactsLoaded={contactsLoaded}
                    onAnnotationDelete={this.handleAnnotationDelete}
                    onAnnotationEdit={this.handleAnnotationEdit}
                    onAnnotationSelect={this.handleAnnotationSelect}
                    onAnnotationStatusChange={this.handleAnnotationStatusChange}
                    onAppActivityDelete={this.deleteAppActivity}
                    onCommentCreate={this.createComment}
                    onCommentDelete={this.deleteComment}
                    onCommentUpdate={this.updateComment}
                    onReplyCreate={this.createReply}
                    onReplyDelete={this.deleteReply}
                    onReplyUpdate={this.updateReply}
                    onShowReplies={this.getReplies}
                    onTaskAssignmentUpdate={this.updateTaskAssignment}
                    onTaskCreate={this.createTask}
                    onTaskDelete={this.deleteTask}
                    onTaskModalClose={this.onTaskModalClose}
                    onTaskUpdate={this.updateTask}
                    onTaskView={onTaskView}
                    onVersionHistoryClick={onVersionHistoryClick}
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
    withRouterAndRef,
])(ActivitySidebar);
