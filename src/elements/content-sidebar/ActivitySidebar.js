/**
 * @flow
 * @file Activity feed sidebar component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import flow from 'lodash/flow';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import uniqueId from 'lodash/uniqueId';
import { FormattedMessage } from 'react-intl';
import { generatePath, type ContextRouter } from 'react-router-dom';
import ActivityFeed from './activity-feed';
import AddTaskButton from './AddTaskButton';
import API from '../../api';
import messages from '../common/messages';
import SidebarContent from './SidebarContent';
import { EVENT_DATA_READY, EVENT_JS_READY } from '../common/logger/constants';
import { getBadUserError } from '../../utils/error';
import { mark } from '../../utils/performance';
import { withAnnotatorContext } from '../common/annotator-context';
import { withAPIContext } from '../common/api-context';
import { withErrorBoundary } from '../common/error-boundary';
import { withFeatureConsumer, isFeatureEnabled } from '../common/feature-checking';
import { withLogger } from '../common/logger';
import { withRouterAndRef } from '../common/routing';
import ActivitySidebarFilter from './ActivitySidebarFilter';
import { ViewType, FeedEntryType } from '../common/types/SidebarNavigation';
import {
    ACTIVITY_FILTER_OPTION_ALL,
    ACTIVITY_FILTER_OPTION_RESOLVED,
    ACTIVITY_FILTER_OPTION_TASKS,
    ACTIVITY_FILTER_OPTION_UNRESOLVED,
    DEFAULT_COLLAB_DEBOUNCE,
    ERROR_CODE_FETCH_ACTIVITY,
    FEED_ITEM_TYPE_ANNOTATION,
    FEED_ITEM_TYPE_COMMENT,
    FEED_ITEM_TYPE_TASK,
    FEED_ITEM_TYPE_VERSION,
    ORIGIN_ACTIVITY_SIDEBAR,
    SIDEBAR_VIEW_ACTIVITY,
    TASK_COMPLETION_RULE_ALL,
    METRIC_TYPE_UAA_PARITY_METRIC,
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
    ActivityFilterItemType,
    ActivityFilterOption,
    BoxCommentPermission,
    Comment,
    CommentFeedItemType,
    FocusableFeedItem,
    FocusableFeedItemType,
    FeedItem,
    FeedItems,
    FeedItemStatus,
    FeedItemType,
} from '../../common/types/feed';
import type { ErrorContextProps, ElementsXhrError } from '../../common/types/api';
import type { WithLoggerProps } from '../../common/types/logging';
import type { SelectorItems, User, UserMini, GroupMini, BoxItem } from '../../common/types/core';
import type { Errors, GetProfileUrlCallback } from '../common/flowTypes';
import type { Translations } from './flowTypes';
import type { FeatureConfig } from '../common/feature-checking';
import type { WithAnnotatorContextProps } from '../common/annotator-context';
import './ActivitySidebar.scss';

import type { OnAnnotationEdit, OnAnnotationStatusChange } from './activity-feed/comment/types';
import type { InternalSidebarNavigation, InternalSidebarNavigationHandler } from '../common/types/SidebarNavigation';

type ExternalProps = {
    activeFeedEntryId?: string,
    activeFeedEntryType?: FocusableFeedItemType,
    currentUser?: User,
    currentUserError?: Errors,
    getUserProfileUrl?: GetProfileUrlCallback,
    hasReplies?: boolean,
    hasTasks?: boolean,
    hasVersions?: boolean,
    internalSidebarNavigation?: InternalSidebarNavigation,
    internalSidebarNavigationHandler?: InternalSidebarNavigationHandler,
    onCommentCreate: Function,
    onCommentDelete: (comment: Comment) => any,
    onCommentUpdate: () => any,
    onTaskAssignmentUpdate: Function,
    onTaskCreate: Function,
    onTaskDelete: (id: string) => any,
    onTaskUpdate: () => any,
    onTaskView: (id: string, isCreator: boolean) => any,
    routerDisabled?: boolean,
} & ErrorContextProps &
    WithAnnotatorContextProps;

type PropsWithoutContext = {
    elementId: string,
    file: BoxItem,
    hasSidebarInitialized?: boolean,
    isDisabled: boolean,
    onAnnotationSelect: Function,
    onFilterChange: (status?: ActivityFilterItemType) => void,
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
    feedItemsStatusFilter?: ActivityFilterItemType,
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
        emitActiveAnnotationChangeEvent: noop,
        emitAnnotationRemoveEvent: noop,
        emitAnnotationReplyCreateEvent: noop,
        emitAnnotationReplyDeleteEvent: noop,
        emitAnnotationReplyUpdateEvent: noop,
        emitAnnotationUpdateEvent: noop,
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
        onFilterChange: noop,
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
        const { api, emitAnnotationRemoveEvent, file } = this.props;

        emitAnnotationRemoveEvent(id, true);
        api.getFeedAPI(false).deleteAnnotation(
            file,
            id,
            permissions,
            this.deleteAnnotationSuccess.bind(this, id),
            this.feedErrorCallback,
        );

        this.fetchFeedItems();
    };

    handleAnnotationEdit: OnAnnotationEdit = ({ id, text, permissions }) => {
        const { api, emitAnnotationUpdateEvent, file } = this.props;

        emitAnnotationUpdateEvent(
            {
                id,
                description: {
                    message: text,
                },
            },
            true,
        );
        api.getFeedAPI(false).updateAnnotation(
            file,
            id,
            text,
            undefined,
            permissions,
            (annotation: Annotation) => {
                emitAnnotationUpdateEvent(annotation);
                this.feedSuccessCallback();
            },
            this.feedErrorCallback,
        );

        this.fetchFeedItems();
    };

    handleAnnotationStatusChange: OnAnnotationStatusChange = ({ id, permissions, status }) => {
        const { api, emitAnnotationUpdateEvent, file } = this.props;

        emitAnnotationUpdateEvent({ id, status }, true);
        api.getFeedAPI(false).updateAnnotation(
            file,
            id,
            undefined,
            status,
            permissions,
            (annotation: Annotation) => {
                emitAnnotationUpdateEvent(annotation);
                this.feedSuccessCallback();
            },
            this.feedErrorCallback,
        );

        this.fetchFeedItems();
    };

    deleteAnnotationSuccess(id: string) {
        const { emitAnnotationRemoveEvent } = this.props;

        this.feedSuccessCallback();
        emitAnnotationRemoveEvent(id);
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
        const { api, emitAnnotationReplyDeleteEvent, file } = this.props;

        emitAnnotationReplyDeleteEvent(id, parentId, true);
        api.getFeedAPI(false).deleteReply(
            file,
            id,
            parentId,
            permissions,
            this.deleteReplySuccessCallback.bind(this, id, parentId),
            this.feedErrorCallback,
        );

        // need to load the pending item
        this.fetchFeedItems();
    };

    /**
     * Handles a successful deletion of a reply
     *
     * @private
     * @param {string} id - The id of the reply
     * @param {string} parentId - The id of the reply's parent item
     * @return {void}
     */
    deleteReplySuccessCallback = (id: string, parentId: string) => {
        const { emitAnnotationReplyDeleteEvent } = this.props;

        this.feedSuccessCallback();
        emitAnnotationReplyDeleteEvent(id, parentId);
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
        const { api, emitAnnotationReplyUpdateEvent, file } = this.props;

        emitAnnotationReplyUpdateEvent({ id, tagged_message: text }, parentId, true);
        api.getFeedAPI(false).updateReply(
            file,
            id,
            parentId,
            text,
            permissions,
            this.updateReplySuccessCallback.bind(this, parentId, onSuccess),
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
     * Updates replies of a comment or annotation in the Feed
     *
     * @param {string} id - id of the feed item
     * @param {Array<Comment>} replies - replies
     * @return {void}
     */
    updateReplies = (id: string, replies: Array<Comment>) => {
        const { activeFeedEntryId, api, file, history, internalSidebarNavigationHandler, routerDisabled } = this.props;
        const { feedItems } = this.state;

        if (!feedItems) {
            return;
        }

        const feedAPI = api.getFeedAPI(false);
        feedAPI.file = file;

        // Detect if replies are being hidden and activeFeedEntryId belongs to a reply
        // that is in currently being updated parent, in order to disable active item
        if (
            activeFeedEntryId &&
            replies.length === 1 &&
            feedItems.some(
                (item: FeedItem) =>
                    item.id === id && item === this.getCommentFeedItemByReplyId(feedItems, activeFeedEntryId),
            )
        ) {
            if (routerDisabled && internalSidebarNavigationHandler) {
                internalSidebarNavigationHandler(
                    {
                        sidebar: ViewType.ACTIVITY,
                    },
                    true,
                );
            } else {
                history.replace(this.getActiveCommentPath());
            }
        }

        feedAPI.updateFeedItem({ replies }, id);

        this.fetchFeedItems();
    };

    /**
     * Handles a successful update of a reply
     *
     * @private
     * @param {string} parentId - The id of the reply's parent item
     * @param {Function} onSuccess - the success callback
     * @param {Comment} reply - The reply comment object
     * @return {void}
     */
    updateReplySuccessCallback = (parentId: string, onSuccess: ?Function, reply: Comment) => {
        const { emitAnnotationReplyUpdateEvent } = this.props;

        this.feedSuccessCallback();
        emitAnnotationReplyUpdateEvent(reply, parentId);
        if (onSuccess) {
            onSuccess();
        }
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
        const { api, currentUser, emitAnnotationReplyCreateEvent, file } = this.props;

        if (!currentUser) {
            throw getBadUserError();
        }

        const eventRequestId = uniqueId('comment_');
        emitAnnotationReplyCreateEvent({ tagged_message: text }, eventRequestId, parentId, true);
        api.getFeedAPI(false).createReply(
            file,
            currentUser,
            parentId,
            parentType,
            text,
            this.createReplySuccessCallback.bind(this, eventRequestId, parentId),
            this.feedErrorCallback,
        );

        // need to load the pending item
        this.fetchFeedItems();
    };

    /**
     * Handles a successful creation of a reply
     *
     * @private
     * @param {string} eventRequestId - The id of the parent item
     * @param {string} parentId - The id of the reply's parent item
     * @param {Comment} reply - The reply comment object
     * @return {void}
     */
    createReplySuccessCallback = (eventRequestId: string, parentId: string, reply: Comment) => {
        const { emitAnnotationReplyCreateEvent } = this.props;

        this.feedSuccessCallback();
        emitAnnotationReplyCreateEvent(reply, eventRequestId, parentId);
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
            activeFeedEntryId,
            activeFeedEntryType,
            api,
            file,
            features,
            hasReplies: shouldShowReplies,
            hasTasks: shouldShowTasks,
            hasVersions: shouldShowVersions,
        } = this.props;
        const shouldFetchReplies =
            shouldRefreshCache &&
            shouldShowReplies &&
            activeFeedEntryId &&
            activeFeedEntryType === FEED_ITEM_TYPE_COMMENT;
        const shouldShowAppActivity = isFeatureEnabled(features, 'activityFeed.appActivity.enabled');
        const shouldShowAnnotations = isFeatureEnabled(features, 'activityFeed.annotations.enabled');
        const shouldUseUAA = isFeatureEnabled(features, 'activityFeed.uaaIntegration.enabled');

        api.getFeedAPI(shouldDestroy).feedItems(
            file,
            shouldRefreshCache,
            shouldFetchReplies ? this.fetchRepliesForFeedItems : this.fetchFeedItemsSuccessCallback,
            this.fetchFeedItemsErrorCallback,
            this.errorCallback,
            {
                shouldShowAnnotations,
                shouldShowAppActivity,
                shouldShowReplies,
                shouldShowTasks,
                shouldShowVersions,
                shouldUseUAA,
            },
            shouldUseUAA ? this.logAPIParity : undefined,
        );
    }

    fetchRepliesForFeedItems = (feedItems: FeedItems) => {
        const { activeFeedEntryId } = this.props;

        if (!activeFeedEntryId) {
            return;
        }

        this.getActiveFeedEntryData(feedItems)
            .then(({ id, type }) => {
                if (
                    !id ||
                    !type ||
                    this.isActiveEntryInFeed(feedItems, activeFeedEntryId) ||
                    !this.isItemTypeComment(type)
                ) {
                    return Promise.resolve(feedItems);
                }

                const parentType: CommentFeedItemType =
                    type === FEED_ITEM_TYPE_COMMENT ? FEED_ITEM_TYPE_COMMENT : FEED_ITEM_TYPE_ANNOTATION;

                return this.getFeedItemsWithReplies(feedItems, id, parentType);
            })
            .then(updatedItems => this.fetchFeedItemsSuccessCallback(updatedItems))
            .catch(error => this.fetchFeedItemsErrorCallback(feedItems, [error]));
    };

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
     * Logs diff between UAA and v2 API data
     *
     * @param {{}[]} responseParity array of aggragated responses from UAA and v2
     * @param {{}} parsedDataParity parsed data from UAA and v2
     * @return {void}
     */
    logAPIParity = (parityData: { uaaFeedItems: FeedItems, v2FeedItems: FeedItems }): void => {
        const { logger } = this.props;

        logger.onPreviewMetric({
            parityData,
            type: METRIC_TYPE_UAA_PARITY_METRIC,
        });
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

    getCommentFeedItemWithReplies = <T: { replies?: Array<Comment> }>(feedItem: T, replies: Array<Comment>): T => ({
        ...feedItem,
        replies,
    });

    getFeedItemsWithReplies = (feedItems: FeedItems, id?: string, type?: CommentFeedItemType): Promise<FeedItems> => {
        const { api, file } = this.props;

        return new Promise((resolve, reject) => {
            if (!id || !type) {
                resolve(feedItems);
                return;
            }
            api.getFeedAPI(false).fetchReplies(
                file,
                id,
                type,
                replies => {
                    const updatedFeedItems = feedItems.map(item => {
                        if (item.id === id && this.isItemTypeComment(item.type)) {
                            if (item.type === FEED_ITEM_TYPE_ANNOTATION) {
                                return this.getCommentFeedItemWithReplies<Annotation>(item, replies);
                            }
                            if (item.type === FEED_ITEM_TYPE_COMMENT) {
                                return this.getCommentFeedItemWithReplies<Comment>(item, replies);
                            }
                        }
                        return item;
                    });
                    resolve(updatedFeedItems);
                },
                error => {
                    reject(error);
                },
            );
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
                respectHiddenCollabs: true,
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
     * Returns feed item based on the item id
     *
     * @param {FeedItems} feedItems - the feed items
     * @param {string} itemId - feed item id
     * @return {FeedItem | undefined}
     */
    getFocusableFeedItemById = (feedItems: FeedItems, itemId?: string): FeedItem | typeof undefined => {
        if (!itemId) {
            return undefined;
        }
        return feedItems.find(({ id, type }) => id === itemId && this.isItemTypeFocusable(type));
    };

    /**
     * Returns parent feed item based on the reply id
     *
     * @param {FeedItems} feedItems - the feed items
     * @param {string} replyId - feed item's reply id
     * @return {FeedItem | undefined}
     */
    getCommentFeedItemByReplyId = (feedItems: FeedItems, replyId?: string): FeedItem | typeof undefined => {
        if (!replyId) {
            return undefined;
        }
        return feedItems.find(item => {
            if ((item.type !== FEED_ITEM_TYPE_ANNOTATION && item.type !== FEED_ITEM_TYPE_COMMENT) || !item.replies) {
                return false;
            }
            return item.replies.some(({ id }) => id === replyId);
        });
    };

    /**
     * Returns true if item (based on given item id) is found within feed items or its replies and it, or its parent, can be active (focusable)
     *
     * @param {FeedItems} feedItems - the feed items
     * @param {string} itemId - feed item id
     * @return {boolean}
     */
    isActiveEntryInFeed = (feedItems: FeedItems, itemId: string): boolean =>
        !!(this.getFocusableFeedItemById(feedItems, itemId) || this.getCommentFeedItemByReplyId(feedItems, itemId));

    isItemTypeFocusable = (type?: FeedItemType | FocusableFeedItem | CommentFeedItemType): boolean =>
        type === FEED_ITEM_TYPE_ANNOTATION || type === FEED_ITEM_TYPE_COMMENT || type === FEED_ITEM_TYPE_TASK;

    isItemTypeComment = (type?: FeedItemType | FocusableFeedItem | CommentFeedItemType): boolean =>
        type === FEED_ITEM_TYPE_ANNOTATION || type === FEED_ITEM_TYPE_COMMENT;

    /**
     * Returns active entry data (id, type) based on the activeFeedEntryId and activeFeedEntryType values
     * (it can be existing item or parent if the active entry id belongs to a reply)
     *
     * @param {FeedItems} feedItems - the feed items
     * @return {Promise<{ id: string, type?: FocusableFeedItemType }>}
     */
    getActiveFeedEntryData = (feedItems: FeedItems): Promise<{ id?: string, type?: FeedItemType }> => {
        const { activeFeedEntryId, activeFeedEntryType, api, file } = this.props;
        return new Promise((resolve, reject) => {
            if (!activeFeedEntryId || !activeFeedEntryType || !this.isItemTypeFocusable(activeFeedEntryType)) {
                resolve({});
                return;
            }

            // Check if the active entry is a first level Feed item
            const firstLevelItem = this.getFocusableFeedItemById(feedItems, activeFeedEntryId);
            if (firstLevelItem) {
                const { id, type } = firstLevelItem;
                resolve({ id, type });
                return;
            }

            // Check if the active entry is within replies of any first level Feed items
            const firstLevelItemWithActiveReply = this.getCommentFeedItemByReplyId(feedItems, activeFeedEntryId);
            if (firstLevelItemWithActiveReply) {
                const { id, type } = firstLevelItemWithActiveReply;
                resolve({ id, type });
                return;
            }

            // If the active entry could not be found within feed items, it's most likely a reply that
            // is not yet visible in feed and we need to fetch its data in order to find parent
            api.getFeedAPI(false).fetchThreadedComment(
                file,
                activeFeedEntryId,
                ({ parent }) => {
                    const parentItem = this.getFocusableFeedItemById(feedItems, parent?.id);
                    const { id, type } = parentItem || {};
                    resolve({ id, type });
                },
                (error: ElementsXhrError) => {
                    if (error.status === 404) {
                        resolve({});
                    } else {
                        reject(error);
                    }
                },
            );
        });
    };

    getActiveCommentPath(commentId?: string): string {
        if (!commentId) {
            return '/activity';
        }

        return generatePath('/:sidebar/comments/:commentId?', {
            sidebar: 'activity',
            commentId,
        });
    }

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
            emitActiveAnnotationChangeEvent,
            file,
            getAnnotationsMatchPath,
            getAnnotationsPath,
            history,
            internalSidebarNavigation,
            internalSidebarNavigationHandler,
            location,
            onAnnotationSelect,
            routerDisabled,
        } = this.props;
        const annotationFileVersionId = getProp(file_version, 'id');
        const currentFileVersionId = getProp(file, 'file_version.id');

        let selectedFileVersionId = currentFileVersionId;
        if (routerDisabled && internalSidebarNavigation) {
            selectedFileVersionId = getProp(internalSidebarNavigation, 'fileVersionId', currentFileVersionId);
        } else {
            const match = getAnnotationsMatchPath(location);
            selectedFileVersionId = getProp(match, 'params.fileVersionId', currentFileVersionId);
        }

        emitActiveAnnotationChangeEvent(nextActiveAnnotationId);

        if (annotationFileVersionId && annotationFileVersionId !== selectedFileVersionId) {
            if (routerDisabled && internalSidebarNavigationHandler) {
                internalSidebarNavigationHandler({
                    sidebar: ViewType.ACTIVITY,
                    activeFeedEntryId: nextActiveAnnotationId,
                    activeFeedEntryType: FeedEntryType.ANNOTATIONS,
                    fileVersionId: annotationFileVersionId,
                });
            } else {
                history.push(getAnnotationsPath(annotationFileVersionId, nextActiveAnnotationId));
            }

            const deferScrollToOnload = annotation?.target?.location?.type === 'frame';
            onAnnotationSelect(annotation, deferScrollToOnload);
        } else {
            onAnnotationSelect(annotation);
        }
    };

    handleItemsFiltered = (status?: ActivityFilterItemType) => {
        const { onFilterChange } = this.props;

        this.setState({ feedItemsStatusFilter: status });
        onFilterChange(status);
    };

    getFilteredFeedItems = (): FeedItems | typeof undefined => {
        const { feedItems, feedItemsStatusFilter } = this.state;
        if (!feedItems || !feedItemsStatusFilter || feedItemsStatusFilter === ACTIVITY_FILTER_OPTION_ALL) {
            return feedItems;
        }
        // Filter is completed on two properties (status and type) because filtering on comments (resolved vs. unresolved)
        // requires looking at item status to see if it is open or resolved. To filter all tasks, we need to look at the
        // item type. Item type is also used to keep versions in the feed. Task also has a status but it's status will be
        // "NOT_STARTED" or "COMPLETED" so it will not conflict with comment's status.
        return feedItems.filter(item => {
            return (
                item.status === feedItemsStatusFilter ||
                item.type === FEED_ITEM_TYPE_VERSION ||
                item.type === feedItemsStatusFilter
            );
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
        const { isDisabled, hasTasks, internalSidebarNavigation, internalSidebarNavigationHandler, routerDisabled } =
            this.props;
        const { approverSelectorContacts } = this.state;
        const { getApprover, getAvatarUrl, createTask, onTaskModalClose } = this;

        if (!hasTasks) {
            return null;
        }

        return (
            <AddTaskButton
                internalSidebarNavigation={internalSidebarNavigation}
                internalSidebarNavigationHandler={internalSidebarNavigationHandler}
                isDisabled={isDisabled}
                onTaskModalClose={onTaskModalClose}
                routerDisabled={routerDisabled}
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
        const { features, hasTasks } = this.props;
        const { feedItemsStatusFilter } = this.state;
        const shouldShowActivityFeedFilter = isFeatureEnabled(features, 'activityFeed.filter.enabled');
        const shouldShowAdditionalFilterOptions = isFeatureEnabled(features, 'activityFeed.newThreadedReplies.enabled');

        if (!shouldShowActivityFeedFilter) {
            return null;
        }

        const activityFilterOptions: ActivityFilterOption[] = [
            ACTIVITY_FILTER_OPTION_ALL,
            ACTIVITY_FILTER_OPTION_UNRESOLVED,
        ];
        if (shouldShowAdditionalFilterOptions) {
            // Determine which filter options to show based on what activity types are available in current context
            activityFilterOptions.push(ACTIVITY_FILTER_OPTION_RESOLVED);
            if (hasTasks) {
                activityFilterOptions.push(ACTIVITY_FILTER_OPTION_TASKS);
            }
        }

        return (
            <ActivitySidebarFilter
                activityFilterOptions={activityFilterOptions}
                feedItemType={feedItemsStatusFilter}
                onFeedItemTypeClick={selectedStatus => {
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
        const shouldHideTitle = isFeatureEnabled(features, 'activityFeed.filter.enabled');

        if (shouldHideTitle) {
            return null;
        }
        return <FormattedMessage {...messages.sidebarActivityTitle} />;
    };

    render() {
        const {
            activeFeedEntryId,
            activeFeedEntryType,
            currentUser,
            currentUserError,
            elementId,
            features,
            file,
            hasReplies,
            hasVersions,
            isDisabled = false,
            onVersionHistoryClick,
            getUserProfileUrl,
            onTaskView,
        } = this.props;
        const { activityFeedError, approverSelectorContacts, contactsLoaded, mentionSelectorContacts } = this.state;
        const isNewThreadedRepliesEnabled = isFeatureEnabled(features, 'activityFeed.newThreadedReplies.enabled');
        const shouldUseUAA = isFeatureEnabled(features, 'activityFeed.uaaIntegration.enabled');

        return (
            <SidebarContent
                actions={this.renderActions()}
                className={classNames('bcs-activity', { 'bcs-activity--full': hasReplies })}
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
                    hasNewThreadedReplies={isNewThreadedRepliesEnabled}
                    hasReplies={hasReplies}
                    hasVersions={hasVersions}
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
                    onHideReplies={this.updateReplies}
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
                    shouldUseUAA={shouldUseUAA}
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
