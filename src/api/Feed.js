/**
 * @flow
 * @file Helper for activity feed API's
 * @author Box
 */
import noop from 'lodash/noop';
import uniqueId from 'lodash/uniqueId';
import type { MessageDescriptor } from 'react-intl';
import { getBadItemError, getBadUserError, getMissingItemTextOrStatus, isUserCorrectableError } from '../utils/error';
import commonMessages from '../elements/common/messages';
import messages from './messages';
import { sortFeedItems } from '../utils/sorter';
import { FEED_FILE_VERSIONS_FIELDS_TO_FETCH } from '../utils/fields';
import Base from './Base';
import AnnotationsAPI from './Annotations';
import CommentsAPI from './Comments';
import ThreadedCommentsAPI from './ThreadedComments';
import FileActivitiesAPI from './FileActivities';
import VersionsAPI from './Versions';
import TasksNewAPI from './tasks/TasksNew';
import GroupsAPI from './Groups';
import TaskCollaboratorsAPI from './tasks/TaskCollaborators';
import TaskLinksAPI from './tasks/TaskLinks';
import AppActivityAPI from './AppActivity';
import {
    ACTION_TYPE_CREATED,
    ACTION_TYPE_RESTORED,
    ACTION_TYPE_TRASHED,
    ERROR_CODE_CREATE_TASK,
    ERROR_CODE_UPDATE_TASK,
    ERROR_CODE_GROUP_EXCEEDS_LIMIT,
    FEED_ITEM_TYPE_ANNOTATION,
    FEED_ITEM_TYPE_COMMENT,
    FEED_ITEM_TYPE_TASK,
    FEED_ITEM_TYPE_VERSION,
    FILE_ACTIVITY_TYPE_ANNOTATION,
    FILE_ACTIVITY_TYPE_APP_ACTIVITY,
    FILE_ACTIVITY_TYPE_COMMENT,
    FILE_ACTIVITY_TYPE_TASK,
    FILE_ACTIVITY_TYPE_VERSION,
    HTTP_STATUS_CODE_CONFLICT,
    IS_ERROR_DISPLAYED,
    PERMISSION_CAN_VIEW_ANNOTATIONS,
    PERMISSION_CAN_COMMENT,
    TASK_NEW_APPROVED,
    TASK_NEW_COMPLETED,
    TASK_NEW_REJECTED,
    TASK_NEW_NOT_STARTED,
    TYPED_ID_FEED_PREFIX,
    TASK_MAX_GROUP_ASSIGNEES,
} from '../constants';
import type {
    TaskCompletionRule,
    TaskCollabAssignee,
    TaskCollabStatus,
    TaskLink,
    TaskNew,
    TaskType,
    TaskPayload,
    TaskUpdatePayload,
} from '../common/types/tasks';
import type { ElementsXhrError, ErrorResponseData, APIOptions } from '../common/types/api';
import type {
    SelectorItems,
    SelectorItem,
    UserMini,
    GroupMini,
    BoxItem,
    BoxItemPermission,
    BoxItemVersion,
    FileVersions,
    User,
} from '../common/types/core';
import type {
    Annotation,
    AnnotationPermission,
    Annotations,
    AppActivityItems,
    BoxCommentPermission,
    Comment,
    CommentFeedItemType,
    Comments,
    FeedItem,
    FeedItems,
    FeedItemStatus,
    FileActivity,
    FileActivityTypes,
    Task,
    Tasks,
    ThreadedComments as ThreadedCommentsType,
} from '../common/types/feed';
import { collapseFeedState } from '../elements/content-sidebar/activity-feed/activity-feed/activityFeedUtils';

const TASK_NEW_INITIAL_STATUS = TASK_NEW_NOT_STARTED;

type FeedItemsCache = {
    errors: ErrorResponseData[],
    items: FeedItems,
};

type ErrorCallback = (e: ElementsXhrError, code: string, contextInfo?: Object) => void;

const getItemWithFilteredReplies = <T: { replies?: Array<Comment> }>(item: T, replyId: string): T => {
    const { replies = [], ...rest } = item;
    return { replies: replies.filter(({ id }) => id !== replyId), ...rest };
};

const getItemWithPendingReply = <T: { replies?: Array<Comment> }>(item: T, reply: Comment): T => {
    const { replies = [], ...rest } = item;
    return { replies: [...replies, reply], ...rest };
};

const parseReplies = (replies: Comment[]): Comment[] => {
    const parsedReplies = [...replies];

    return parsedReplies.map(reply => {
        return { ...reply, tagged_message: reply.tagged_message || reply.message || '' };
    });
};

export const getParsedFileActivitiesResponse = (
    response?: { entries: FileActivity[] },
    permissions: BoxItemPermission = {},
) => {
    if (!response || !response.entries || !response.entries.length) {
        return [];
    }

    const data = response.entries;

    const parsedData: Array<Object> = data
        .map(item => {
            if (!item.source) {
                return null;
            }

            const source = { ...item.source };

            switch (item.activity_type) {
                case FILE_ACTIVITY_TYPE_TASK: {
                    const taskItem = { ...source[FILE_ACTIVITY_TYPE_TASK] };
                    // UAA follows a lowercased enum naming convention, convert to uppercase to align with task api
                    if (taskItem.assigned_to?.entries) {
                        const assignedToEntries = taskItem.assigned_to.entries.map(entry => {
                            const assignedToEntry = { ...entry };

                            assignedToEntry.role = entry.role.toUpperCase();
                            assignedToEntry.status = entry.status.toUpperCase();

                            return assignedToEntry;
                        });
                        // $FlowFixMe Using the toUpperCase method makes Flow assume role and status is a string type, which is incompatible with string literal
                        taskItem.assigned_to.entries = assignedToEntries;
                    }
                    if (taskItem.completion_rule) {
                        taskItem.completion_rule = taskItem.completion_rule.toUpperCase();
                    }
                    if (taskItem.status) {
                        taskItem.status = taskItem.status.toUpperCase();
                    }
                    if (taskItem.task_type) {
                        taskItem.task_type = taskItem.task_type.toUpperCase();
                    }
                    // $FlowFixMe File Activities only returns a created_by user, Flow type fix is needed
                    taskItem.created_by = { target: taskItem.created_by };

                    return taskItem;
                }
                case FILE_ACTIVITY_TYPE_COMMENT: {
                    const commentItem = { ...source[FILE_ACTIVITY_TYPE_COMMENT] };

                    if (commentItem.replies && commentItem.replies.length) {
                        const replies = parseReplies(commentItem.replies);

                        commentItem.replies = replies;
                    }

                    commentItem.tagged_message = commentItem.tagged_message || commentItem.message || '';

                    return commentItem;
                }
                case FILE_ACTIVITY_TYPE_ANNOTATION: {
                    const annotationItem = { ...source[FILE_ACTIVITY_TYPE_ANNOTATION] };

                    if (annotationItem.replies && annotationItem.replies.length) {
                        const replies = parseReplies(annotationItem.replies);

                        annotationItem.replies = replies;
                    }

                    return annotationItem;
                }
                case FILE_ACTIVITY_TYPE_APP_ACTIVITY: {
                    const appActivityItem = { ...source[FILE_ACTIVITY_TYPE_APP_ACTIVITY] };
                    const { can_delete } = permissions;

                    appActivityItem.created_at = appActivityItem.occurred_at;
                    appActivityItem.permissions = { can_delete };

                    return appActivityItem;
                }

                case FILE_ACTIVITY_TYPE_VERSION: {
                    const versionsItem = { ...source[FILE_ACTIVITY_TYPE_VERSION] };

                    versionsItem.type = FEED_ITEM_TYPE_VERSION;
                    if (versionsItem.action_by) {
                        const collaborators = {};

                        versionsItem.action_by.map(collaborator => {
                            collaborators[collaborator.id] = { ...collaborator };
                            return collaborator;
                        });

                        versionsItem.collaborators = collaborators;
                    }
                    if (versionsItem.end?.number) {
                        versionsItem.version_end = versionsItem.end.number;
                        versionsItem.id = versionsItem.end.id;
                    }
                    if (versionsItem.start?.number) {
                        versionsItem.version_start = versionsItem.start.number;
                    }

                    if (versionsItem.version_start === versionsItem.version_end) {
                        versionsItem.version_number = versionsItem.version_start;
                        versionsItem.uploader_display_name = versionsItem.start?.uploader_display_name;

                        if (
                            versionsItem.action_type === ACTION_TYPE_CREATED &&
                            versionsItem.start?.created_at &&
                            versionsItem.start?.created_by
                        ) {
                            versionsItem.modified_at = versionsItem.start.created_at;
                            versionsItem.modified_by = { ...versionsItem.start.created_by };
                        }
                        if (
                            versionsItem.action_type === ACTION_TYPE_TRASHED &&
                            versionsItem.start?.trashed_at &&
                            versionsItem.start?.trashed_by
                        ) {
                            versionsItem.trashed_at = versionsItem.start.trashed_at;
                            versionsItem.trashed_by = { ...versionsItem.start.trashed_by };
                        }
                        if (
                            versionsItem.action_type === ACTION_TYPE_RESTORED &&
                            versionsItem.start?.restored_at &&
                            versionsItem.start?.restored_by
                        ) {
                            versionsItem.restored_at = versionsItem.start.restored_at;
                            versionsItem.restored_by = { ...versionsItem.start.restored_by };
                        }
                        if (versionsItem.start?.promoted_from) {
                            versionsItem.version_promoted = versionsItem.start?.promoted_from;
                        }
                    }

                    return versionsItem;
                }

                default: {
                    return null;
                }
            }
        })
        .filter(item => !!item)
        .reverse();

    return parsedData;
};

class Feed extends Base {
    /**
     * @property {AnnotationsAPI}
     */
    annotationsAPI: AnnotationsAPI;

    /**
     * @property {VersionsAPI}
     */
    versionsAPI: VersionsAPI;

    /**
     * @property {CommentsAPI}
     */
    commentsAPI: CommentsAPI;

    /**
     * @property {AppActivityAPI}
     */
    appActivityAPI: AppActivityAPI;

    /**
     * @property {TasksNewAPI}
     */
    tasksNewAPI: TasksNewAPI;

    /**
     * @property {TaskCollaboratorsAPI}
     */
    taskCollaboratorsAPI: TaskCollaboratorsAPI[];

    /**
     * @property {TaskLinksAPI}
     */
    taskLinksAPI: TaskLinksAPI[];

    /**
     * @property {ThreadedCommentsAPI}
     */
    threadedCommentsAPI: ThreadedCommentsAPI;

    /**
     * @property {FileActivitiesAPI}
     */
    fileActivitiesAPI: FileActivitiesAPI;

    /**
     * @property {BoxItem}
     */
    file: BoxItem;

    /**
     * @property {ElementsXhrError}
     */
    errors: ElementsXhrError[];

    constructor(options: APIOptions) {
        super(options);
        this.taskCollaboratorsAPI = [];
        this.taskLinksAPI = [];
        this.errors = [];
    }

    /**
     * Creates pending card on create_start action, then updates card on next call
     * @param {BoxItem} file - The file to which the annotation is assigned
     * @param {Object} currentUser - the user who performed the action
     * @param {Annotation} annotation - the current annotation to be created
     * @param {string} id - unique id for the incoming annotation
     * @param {boolean} isPending - indicates the current creation process of the annotation
     */
    addAnnotation(file: BoxItem, currentUser: User, annotation: Annotation, id: string, isPending: boolean): void {
        if (!file.id) {
            throw getBadItemError();
        }

        this.file = file;

        // Add the pending interstitial card
        if (isPending) {
            const newAnnotation = {
                ...annotation,
                created_by: currentUser,
                id,
                type: FEED_ITEM_TYPE_ANNOTATION,
            };

            this.addPendingItem(this.file.id, currentUser, newAnnotation);

            return;
        }
        // Create action has completed, so update the existing pending item
        this.updateFeedItem({ ...annotation, isPending: false }, id);
    }

    updateAnnotation = (
        file: BoxItem,
        annotationId: string,
        text?: string,
        status?: FeedItemStatus,
        permissions: AnnotationPermission,
        successCallback: (annotation: Annotation) => void,
        errorCallback: ErrorCallback,
    ): void => {
        if (!file.id) {
            throw getBadItemError();
        }
        if (!text && !status) {
            throw getMissingItemTextOrStatus();
        }

        this.annotationsAPI = new AnnotationsAPI(this.options);

        this.file = file;
        this.errorCallback = errorCallback;

        const feedItemChanges = {};
        if (text) {
            feedItemChanges.message = text;
        }
        if (status) {
            feedItemChanges.status = status;
        }
        this.updateFeedItem({ ...feedItemChanges, isPending: true }, annotationId);

        this.annotationsAPI.updateAnnotation(
            this.file.id,
            annotationId,
            permissions,
            feedItemChanges,
            (annotation: Annotation) => {
                const { replies, total_reply_count, ...annotationBase } = annotation;
                this.updateFeedItem(
                    {
                        // Do not update replies and total_reply_count props as their current values are not included in the response
                        ...annotationBase,
                        isPending: false,
                    },
                    annotationId,
                );
                if (!this.isDestroyed()) {
                    successCallback(annotation);
                }
            },
            (e: ErrorResponseData, code: string) => {
                this.updateCommentErrorCallback(e, code, annotationId);
            },
        );
    };

    /**
     * Error callback for updating a comment
     *
     * @param {ElementsXhrError} e - the error returned by the API
     * @param {string} code - the error code
     * @param {string} id - the id of either an annotation or comment
     * @return {void}
     */
    updateCommentErrorCallback = (e: ElementsXhrError, code: string, id: string) => {
        this.updateFeedItem(this.createFeedError(messages.commentUpdateErrorMessage), id);
        this.feedErrorCallback(true, e, code);
    };

    /**
     * Error callback for updating a reply
     *
     * @param {ElementsXhrError} error - the error returned by the API
     * @param {string} code - the error code
     * @param {string} id - the id of the reply (comment)
     * @param {string} parentId - the id of either the parent item (an annotation or comment)
     * @return {void}
     */
    updateReplyErrorCallback = (error: ElementsXhrError, code: string, id: string, parentId: string) => {
        this.updateReplyItem(this.createFeedError(messages.commentUpdateErrorMessage), parentId, id);
        this.feedErrorCallback(true, error, code);
    };

    /**
     * Error callback for fetching replies
     *
     * @param {ElementsXhrError} error - the error returned by the API
     * @param {string} code - the error code
     * @param {string} id - the id of either an annotation or comment
     * @return {void}
     */
    fetchRepliesErrorCallback = (error: ElementsXhrError, code: string, id: string) => {
        this.updateFeedItem(this.createFeedError(messages.repliesFetchErrorMessage), id);
        this.feedErrorCallback(true, error, code);
    };

    deleteAnnotation = (
        file: BoxItem,
        annotationId: string,
        permissions: AnnotationPermission,
        successCallBack: Function,
        errorCallback: Function,
    ): void => {
        this.annotationsAPI = new AnnotationsAPI(this.options);

        if (!file.id) {
            throw getBadItemError();
        }

        this.file = file;
        this.errorCallback = errorCallback;

        this.updateFeedItem({ isPending: true }, annotationId);
        this.annotationsAPI.deleteAnnotation(
            this.file.id,
            annotationId,
            permissions,
            this.deleteFeedItem.bind(this, annotationId, successCallBack),
            (error: ElementsXhrError, code: string) => {
                // Reusing comment error handler since annotations are treated as comments to user
                this.deleteCommentErrorCallback(error, code, annotationId);
            },
        );
    };

    /**
     * Creates a key for the cache
     *
     * @param {string} id folder id
     * @return {string} key
     */
    getCacheKey(id: string): string {
        return `${TYPED_ID_FEED_PREFIX}${id}`;
    }

    /**
     * Gets the items from the cache
     *
     * @param {string} id the cache id
     */
    getCachedItems(id: string): ?FeedItemsCache {
        const cache = this.getCache();
        const cacheKey = this.getCacheKey(id);
        return cache.get(cacheKey);
    }

    /**
     * Sets the items in the cache
     *
     * @param {string} id - the cache id
     * @param {Array} items - the feed items to cache
     */
    setCachedItems(id: string, items: FeedItems) {
        const cache = this.getCache();
        const cacheKey = this.getCacheKey(id);
        cache.set(cacheKey, {
            errors: this.errors,
            items,
        });
    }

    /**
     * Gets the feed items
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {boolean} shouldRefreshCache - Optionally updates the cache
     * @param {Function} successCallback - the success callback  which is called after data fetching is complete
     * @param {Function} errorCallback - the error callback which is called after data fetching is complete if there was an error
     * @param {Function} onError - the function to be called immediately after an error occurs
     * @param {Object} [options]- feature flips, etc
     * @param {Object} [options.shouldShowAppActivity] - feature flip the new app activity api
     */
    feedItems(
        file: BoxItem,
        shouldRefreshCache: boolean,
        successCallback: Function,
        errorCallback: (feedItems: FeedItems, errors: ElementsXhrError[]) => void,
        onError: ErrorCallback,
        {
            shouldShowAnnotations = false,
            shouldShowAppActivity = false,
            shouldShowReplies = false,
            shouldShowTasks = true,
            shouldShowVersions = true,
            shouldUseUAA = false,
        }: {
            shouldShowAnnotations?: boolean,
            shouldShowAppActivity?: boolean,
            shouldShowReplies?: boolean,
            shouldShowTasks?: boolean,
            shouldShowVersions?: boolean,
            shouldUseUAA?: boolean,
        } = {},
        logAPIParity?: Function,
    ): void {
        const { id, permissions = {} } = file;
        const cachedItems = this.getCachedItems(id);
        if (cachedItems) {
            const { errors, items } = cachedItems;
            if (errors.length) {
                errorCallback(items, errors);
            } else {
                successCallback(items);
            }

            if (!shouldRefreshCache) {
                return;
            }
        }

        this.file = file;
        this.errors = [];
        this.errorCallback = onError;

        // Using the UAA File Activities endpoint replaces the need for these calls
        const annotationsPromise = shouldShowAnnotations
            ? this.fetchAnnotations(permissions, shouldShowReplies)
            : Promise.resolve();
        const commentsPromise = () => {
            return shouldShowReplies ? this.fetchThreadedComments(permissions) : this.fetchComments(permissions);
        };
        const tasksPromise = shouldShowTasks ? this.fetchTasksNew() : Promise.resolve();
        const appActivityPromise = shouldShowAppActivity ? this.fetchAppActivity(permissions) : Promise.resolve();
        const versionsPromise = shouldShowVersions ? this.fetchVersions() : Promise.resolve();
        const currentVersionPromise = shouldShowVersions ? this.fetchCurrentVersion() : Promise.resolve();

        const annotationActivityType =
            shouldShowAnnotations && permissions[PERMISSION_CAN_VIEW_ANNOTATIONS]
                ? [FILE_ACTIVITY_TYPE_ANNOTATION]
                : [];
        const appActivityActivityType = shouldShowAppActivity ? [FILE_ACTIVITY_TYPE_APP_ACTIVITY] : [];
        const taskActivityType = shouldShowTasks ? [FILE_ACTIVITY_TYPE_TASK] : [];
        const versionsActivityType = shouldShowVersions ? [FILE_ACTIVITY_TYPE_VERSION] : [];
        const commentActivityType = permissions[PERMISSION_CAN_COMMENT] ? [FILE_ACTIVITY_TYPE_COMMENT] : [];
        const filteredActivityTypes = [
            ...annotationActivityType,
            ...appActivityActivityType,
            ...commentActivityType,
            ...taskActivityType,
            ...versionsActivityType,
        ];

        const fileActivitiesPromise =
            // Only fetch when activity types are explicitly stated
            shouldUseUAA && filteredActivityTypes.length
                ? this.fetchFileActivities(permissions, filteredActivityTypes, shouldShowReplies)
                : Promise.resolve();

        const handleFeedItems = (feedItems: FeedItems) => {
            if (!this.isDestroyed()) {
                this.setCachedItems(id, feedItems);
                if (this.errors.length) {
                    errorCallback(feedItems, this.errors);
                } else {
                    successCallback(feedItems);
                }
            }
        };

        const v2Promises = [
            versionsPromise,
            currentVersionPromise,
            commentsPromise(),
            tasksPromise,
            appActivityPromise,
            annotationsPromise,
        ];

        const fetchV2FeedItems = async promises => {
            return Promise.all(promises).then(
                ([versions: ?FileVersions, currentVersion: ?BoxItemVersion, ...feedItems]) => {
                    const versionsWithCurrent = currentVersion
                        ? this.versionsAPI.addCurrentVersion(currentVersion, versions, this.file)
                        : undefined;
                    return sortFeedItems(versionsWithCurrent, ...feedItems);
                },
            );
        };

        const compareV2AndUaaFeedItems = async (uaaFeedItems, uaaResponse) => {
            fetchV2FeedItems(v2Promises).then(v2FeedItems => {
                const transformedV2FeedItems = collapseFeedState(v2FeedItems);
                const transformedUAAFeedItems = collapseFeedState(uaaFeedItems);

                if (logAPIParity) {
                    logAPIParity({
                        uaaResponse,
                        uaaFeedItems: transformedUAAFeedItems,
                        v2FeedItems: transformedV2FeedItems,
                    });
                }
            });
        };

        if (shouldUseUAA) {
            fileActivitiesPromise.then(response => {
                if (!response) {
                    return;
                }

                const uaaFeedItems = getParsedFileActivitiesResponse(response, permissions);
                compareV2AndUaaFeedItems(uaaFeedItems, response);
                handleFeedItems(uaaFeedItems);
            });
        } else {
            fetchV2FeedItems(v2Promises).then(v2FeedItems => {
                handleFeedItems(v2FeedItems);
            });
        }
    }

    fetchAnnotations(permissions: BoxItemPermission, shouldFetchReplies?: boolean): Promise<?Annotations> {
        this.annotationsAPI = new AnnotationsAPI(this.options);
        return new Promise(resolve => {
            this.annotationsAPI.getAnnotations(
                this.file.id,
                undefined,
                permissions,
                resolve,
                this.fetchFeedItemErrorCallback.bind(this, resolve),
                undefined,
                undefined,
                shouldFetchReplies,
            );
        });
    }

    /**
     * Fetches the comments for a file
     *
     * @param {Object} permissions - the file permissions
     * @return {Promise} - the file comments
     */
    fetchComments(permissions: BoxItemPermission): Promise<?Comments> {
        this.commentsAPI = new CommentsAPI(this.options);
        return new Promise(resolve => {
            this.commentsAPI.getComments(
                this.file.id,
                permissions,
                resolve,
                this.fetchFeedItemErrorCallback.bind(this, resolve),
            );
        });
    }

    /**
     * Fetches a comment for a file
     *
     * @param {BoxItem} file - The file to which the comment belongs to
     * @param {string} commentId - comment id
     * @param {Function} successCallback
     * @param {ErrorCallback} errorCallback
     * @return {Promise} - the file comments
     */
    fetchThreadedComment(
        file: BoxItem,
        commentId: string,
        successCallback: (comment: Comment) => void,
        errorCallback: ErrorCallback,
    ): Promise<?Comment> {
        const { id, permissions } = file;
        if (!id || !permissions) {
            throw getBadItemError();
        }

        this.threadedCommentsAPI = new ThreadedCommentsAPI(this.options);
        return new Promise(resolve => {
            this.threadedCommentsAPI.getComment({
                commentId,
                errorCallback,
                fileId: id,
                permissions,
                successCallback: this.fetchThreadedCommentSuccessCallback.bind(this, resolve, successCallback),
            });
        });
    }

    /**
     * Callback for successful fetch of a comment
     *
     * @param {Function} resolve - resolve function
     * @param {Function} successCallback - success callback
     * @param {Comment} comment - comment data
     * @return {void}
     */
    fetchThreadedCommentSuccessCallback = (resolve: Function, successCallback: Function, comment: Comment): void => {
        successCallback(comment);
        resolve();
    };

    /**
     * Fetches the comments with replies for a file
     *
     * @param {Object} permissions - the file permissions
     * @return {Promise} - the file comments
     */
    fetchThreadedComments(permissions: BoxItemPermission): Promise<?ThreadedCommentsType> {
        this.threadedCommentsAPI = new ThreadedCommentsAPI(this.options);
        return new Promise(resolve => {
            this.threadedCommentsAPI.getComments({
                errorCallback: this.fetchFeedItemErrorCallback.bind(this, resolve),
                fileId: this.file.id,
                permissions,
                successCallback: resolve,
            });
        });
    }

    /**
     * Fetches the file activities for a file
     *
     * @param {BoxItemPermission} permissions - the file permissions
     * @param {FileActivityTypes[]} activityTypes - the activity types to filter by
     * @param {boolean} shouldShowReplies - specify if replies should be included in the response
     * @return {Promise} - the file comments
     */
    fetchFileActivities(
        permissions: BoxItemPermission,
        activityTypes: FileActivityTypes[],
        shouldShowReplies?: boolean = false,
    ): Promise<Object> {
        this.fileActivitiesAPI = new FileActivitiesAPI(this.options);
        return new Promise(resolve => {
            this.fileActivitiesAPI.getActivities({
                errorCallback: this.fetchFeedItemErrorCallback.bind(this, resolve),
                fileID: this.file.id,
                permissions,
                successCallback: resolve,
                activityTypes,
                shouldShowReplies,
            });
        });
    }

    /**
     * Fetches replies (comments) of a comment or annotation
     *
     * @param {BoxItem} file - The file to which the comment or annotation belongs to
     * @param {string} commentFeedItemId - ID of the comment or annotation
     * @param {CommentFeedItemType} commentFeedItemType - Type of the comment or annotation
     * @param {Function} successCallback
     * @param {ErrorCallback} errorCallback
     * @return {void}
     */
    fetchReplies(
        file: BoxItem,
        commentFeedItemId: string,
        commentFeedItemType: CommentFeedItemType,
        successCallback: (comments: Array<Comment>) => void,
        errorCallback: ErrorCallback,
    ): void {
        const { id, permissions } = file;
        if (!id || !permissions) {
            throw getBadItemError();
        }

        this.file = file;
        this.errorCallback = errorCallback;

        this.updateFeedItem({ isRepliesLoading: true }, commentFeedItemId);

        const successCallbackFn = ({ entries }: ThreadedCommentsType) => {
            this.updateFeedItem(
                { isRepliesLoading: false, replies: entries, total_reply_count: entries.length },
                commentFeedItemId,
            );
            successCallback(entries);
        };
        const errorCallbackFn = (error: ErrorResponseData, code: string) => {
            this.fetchRepliesErrorCallback(error, code, commentFeedItemId);
        };

        if (commentFeedItemType === FEED_ITEM_TYPE_ANNOTATION) {
            this.annotationsAPI = new AnnotationsAPI(this.options);

            this.annotationsAPI.getAnnotationReplies(
                file.id,
                commentFeedItemId,
                permissions,
                successCallbackFn,
                errorCallbackFn,
            );
        } else if (commentFeedItemType === FEED_ITEM_TYPE_COMMENT) {
            this.threadedCommentsAPI = new ThreadedCommentsAPI(this.options);

            this.threadedCommentsAPI.getCommentReplies({
                fileId: file.id,
                commentId: commentFeedItemId,
                permissions,
                successCallback: successCallbackFn,
                errorCallback: errorCallbackFn,
            });
        }
    }

    /**
     * Fetches the versions for a file
     *
     * @return {Promise} - the file versions
     */
    fetchVersions(): Promise<?FileVersions> {
        this.versionsAPI = new VersionsAPI(this.options);

        return new Promise(resolve => {
            this.versionsAPI.getVersions(
                this.file.id,
                resolve,
                this.fetchFeedItemErrorCallback.bind(this, resolve),
                undefined,
                undefined,
                FEED_FILE_VERSIONS_FIELDS_TO_FETCH,
            );
        });
    }

    /**
     * Fetches the current version for a file
     *
     * @return {Promise} - the file versions
     */
    fetchCurrentVersion(): Promise<?BoxItemVersion> {
        this.versionsAPI = new VersionsAPI(this.options);

        return new Promise(resolve => {
            const { file_version = {} } = this.file;
            this.versionsAPI.getVersion(
                this.file.id,
                file_version.id,
                resolve,
                this.fetchFeedItemErrorCallback.bind(this, resolve),
            );
        });
    }

    /**
     * Fetches the tasks for a file
     *
     * @return {Promise} - the feed items
     */
    fetchTasksNew(): Promise<?Tasks> {
        this.tasksNewAPI = new TasksNewAPI(this.options);

        return new Promise(resolve => {
            this.tasksNewAPI.getTasksForFile({
                file: { id: this.file.id },
                successCallback: resolve,
                errorCallback: (err, code) => this.fetchFeedItemErrorCallback(resolve, err, code),
            });
        });
    }

    /**
     * Error callback for fetching feed items.
     * Should only call the error callback if the response is a 401, 429 or >= 500
     *
     * @param {Function} resolve - the function which will be called on error
     * @param {Object} e - the axios error
     * @param {string} code - the error code
     * @return {void}
     */
    fetchFeedItemErrorCallback(resolve: Function, e: ElementsXhrError, code: string) {
        const { status } = e;
        const shouldDisplayError = isUserCorrectableError(status);
        this.feedErrorCallback(shouldDisplayError, e, code);
        resolve();
    }

    /**
     * Updates a task assignment
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {string} taskId - ID of task to be updated
     * @param {string} taskCollaboratorId - Task assignment ID
     * @param {TaskCollabStatus} taskCollaboratorStatus - New task assignment status
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    updateTaskCollaborator = (
        file: BoxItem,
        taskId: string,
        taskCollaboratorId: string,
        taskCollaboratorStatus: TaskCollabStatus,
        successCallback: Function,
        errorCallback: ErrorCallback,
    ): void => {
        if (!file.id) {
            throw getBadItemError();
        }

        this.file = file;
        this.errorCallback = errorCallback;
        this.updateFeedItem({ isPending: true }, taskId);
        const collaboratorsApi = new TaskCollaboratorsAPI(this.options);
        this.taskCollaboratorsAPI.push(collaboratorsApi);
        const taskCollaboratorPayload = {
            id: taskCollaboratorId,
            status: taskCollaboratorStatus,
        };
        const handleError = (e: ElementsXhrError, code: string) => {
            let errorMessage;
            switch (taskCollaboratorStatus) {
                case TASK_NEW_APPROVED:
                    errorMessage = messages.taskApproveErrorMessage;
                    break;
                case TASK_NEW_COMPLETED:
                    errorMessage = messages.taskCompleteErrorMessage;
                    break;
                case TASK_NEW_REJECTED:
                    errorMessage = messages.taskRejectErrorMessage;
                    break;
                default:
                    errorMessage = messages.taskCompleteErrorMessage;
            }
            this.updateFeedItem(this.createFeedError(errorMessage, messages.taskActionErrorTitle), taskId);
            this.feedErrorCallback(true, e, code);
        };
        collaboratorsApi.updateTaskCollaborator({
            file,
            taskCollaborator: taskCollaboratorPayload,
            successCallback: (taskCollab: TaskCollabAssignee) => {
                this.updateTaskCollaboratorSuccessCallback(taskId, file, taskCollab, successCallback, handleError);
            },
            errorCallback: handleError,
        });
    };

    /**
     * Updates the task assignment state of the updated task
     *
     * @param {string} taskId - Box task id
     * @param {TaskAssignment} updatedCollaborator - New task assignment from API
     * @param {Function} successCallback - the function which will be called on success
     * @return {void}
     */
    updateTaskCollaboratorSuccessCallback = (
        taskId: string,
        file: { id: string },
        updatedCollaborator: TaskCollabAssignee,
        successCallback: Function,
        errorCallback: Function,
    ): void => {
        this.tasksNewAPI = new TasksNewAPI(this.options);
        this.tasksNewAPI.getTask({
            id: taskId,
            file,
            successCallback: task => {
                this.updateFeedItem({ ...task, isPending: false }, taskId);
                successCallback(updatedCollaborator);
            },
            errorCallback,
        });
    };

    /**
     * Updates a task in the new API
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {string} task - The update task payload object
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    updateTaskNew = async (
        file: BoxItem,
        task: TaskUpdatePayload,
        successCallback: () => void = noop,
        errorCallback: ErrorCallback = noop,
    ) => {
        if (!file.id) {
            throw getBadItemError();
        }

        this.file = file;
        this.errorCallback = errorCallback;
        this.tasksNewAPI = new TasksNewAPI(this.options);
        this.updateFeedItem({ isPending: true }, task.id);

        try {
            // create request for the size of each group by ID
            // TODO: use async/await for both creating and editing tasks
            const groupInfoPromises: Array<Promise<any>> = task.addedAssignees
                .filter(
                    (assignee: SelectorItem<UserMini | GroupMini>) => assignee.item && assignee.item.type === 'group',
                )
                .map(assignee => assignee.id)
                .map(groupId => {
                    return new GroupsAPI(this.options).getGroupCount({
                        file,
                        group: { id: groupId },
                    });
                });

            const groupCounts: Array<{ total_count: number }> = await Promise.all(groupInfoPromises);
            const hasAnyGroupCountExceeded: boolean = groupCounts.some(
                groupInfo => groupInfo.total_count > TASK_MAX_GROUP_ASSIGNEES,
            );
            const warning = {
                code: ERROR_CODE_GROUP_EXCEEDS_LIMIT,
                type: 'warning',
            };

            if (hasAnyGroupCountExceeded) {
                this.feedErrorCallback(false, warning, ERROR_CODE_GROUP_EXCEEDS_LIMIT);
                return;
            }

            await new Promise((resolve, reject) => {
                this.tasksNewAPI.updateTaskWithDeps({
                    file,
                    task,
                    successCallback: resolve,
                    errorCallback: reject,
                });
            });

            await new Promise((resolve, reject) => {
                this.tasksNewAPI.getTask({
                    file,
                    id: task.id,
                    successCallback: (taskData: Task) => {
                        this.updateFeedItem(
                            {
                                ...taskData,
                                isPending: false,
                            },
                            task.id,
                        );

                        resolve();
                    },
                    errorCallback: (e: ElementsXhrError) => {
                        this.updateFeedItem({ isPending: false }, task.id);
                        this.feedErrorCallback(false, e, ERROR_CODE_UPDATE_TASK);
                        reject();
                    },
                });
            });

            // everything succeeded, so call the passed in success callback
            if (!this.isDestroyed()) {
                successCallback();
            }
        } catch (e) {
            this.updateFeedItem({ isPending: false }, task.id);
            this.feedErrorCallback(false, e, ERROR_CODE_UPDATE_TASK);
        }
    };

    /**
     * Deletes a comment.
     *
     * @param {BoxItem} file - The file to which the comment belongs to
     * @param {string} commentId - Comment ID
     * @param {BoxCommentPermission} permissions - Permissions for the comment
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    deleteComment = (
        file: BoxItem,
        commentId: string,
        permissions: BoxCommentPermission,
        successCallback: Function,
        errorCallback: ErrorCallback,
    ): void => {
        this.commentsAPI = new CommentsAPI(this.options);
        if (!file.id) {
            throw getBadItemError();
        }

        this.file = file;
        this.errorCallback = errorCallback;
        this.updateFeedItem({ isPending: true }, commentId);

        this.commentsAPI.deleteComment({
            file,
            commentId,
            permissions,
            successCallback: this.deleteFeedItem.bind(this, commentId, successCallback),
            errorCallback: (e: ElementsXhrError, code: string) => {
                this.deleteCommentErrorCallback(e, code, commentId);
            },
        });
    };

    /**
     * Deletes a threaded comment (using ThreadedComments API).
     *
     * @param {BoxItem} file - The file to which the comment belongs to
     * @param {string} commentId - Comment ID
     * @param {BoxCommentPermission} permissions - Permissions for the comment
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    deleteThreadedComment = (
        file: BoxItem,
        commentId: string,
        permissions: BoxCommentPermission,
        successCallback: Function,
        errorCallback: ErrorCallback,
    ): void => {
        if (!file.id) {
            throw getBadItemError();
        }

        this.file = file;
        this.errorCallback = errorCallback;
        this.updateFeedItem({ isPending: true }, commentId);

        this.threadedCommentsAPI = new ThreadedCommentsAPI(this.options);

        this.threadedCommentsAPI.deleteComment({
            fileId: file.id,
            commentId,
            permissions,
            successCallback: this.deleteFeedItem.bind(this, commentId, successCallback),
            errorCallback: (e: ElementsXhrError, code: string) => {
                this.deleteCommentErrorCallback(e, code, commentId);
            },
        });
    };

    /**
     * Deletes a reply (using ThreadedComments API).
     *
     * @param {BoxItem} file - The file to which the comment belongs to
     * @param {string} id - id of the reply (comment)
     * @param {string} parentId - id of the parent feed item
     * @param {BoxCommentPermission} permissions - Permissions for the comment
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    deleteReply = (
        file: BoxItem,
        id: string,
        parentId: string,
        permissions: BoxCommentPermission,
        successCallback: () => void,
        errorCallback: ErrorCallback,
    ): void => {
        if (!file.id) {
            throw getBadItemError();
        }

        this.file = file;
        this.errorCallback = errorCallback;
        this.updateReplyItem({ isPending: true }, parentId, id);

        this.threadedCommentsAPI = new ThreadedCommentsAPI(this.options);

        this.threadedCommentsAPI.deleteComment({
            fileId: file.id,
            commentId: id,
            permissions,
            successCallback: this.deleteReplySuccessCallback.bind(this, id, parentId, successCallback),
            errorCallback: (e: ElementsXhrError, code: string) => {
                this.deleteReplyErrorCallback(e, code, id, parentId);
            },
        });
    };

    /**
     * Callback for successful deletion of a reply.
     *
     * @param {string} id - ID of the reply
     * @param {string} parentId - ID of the parent feed item
     * @param {Function} successCallback - success callback
     * @return {void}
     */
    deleteReplySuccessCallback = (id: string, parentId: string, successCallback: Function): void => {
        this.modifyFeedItemRepliesCountBy(parentId, -1);
        this.deleteReplyItem(id, parentId, successCallback);
    };

    /**
     * Error callback for deleting a comment
     *
     * @param {ElementsXhrError} e - the error returned by the API
     * @param {string} code - the error code
     * @param {string} commentId - the comment id
     * @return {void}
     */
    deleteCommentErrorCallback = (e: ElementsXhrError, code: string, commentId: string) => {
        this.updateFeedItem(this.createFeedError(messages.commentDeleteErrorMessage), commentId);
        this.feedErrorCallback(true, e, code);
    };

    /**
     * Error callback for deleting a reply
     *
     * @param {ElementsXhrError} error - the error returned by the API
     * @param {string} code - the error code
     * @param {string} id - the reply (comment) id
     * @param {string} parentId - the comment id of the parent feed item
     * @return {void}
     */
    deleteReplyErrorCallback = (error: ElementsXhrError, code: string, id: string, parentId: string) => {
        this.updateReplyItem(this.createFeedError(messages.commentDeleteErrorMessage), parentId, id);
        this.feedErrorCallback(true, error, code);
    };

    /**
     * Creates a task.
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {Object} currentUser - the user who performed the action
     * @param {string} message - Task text
     * @param {Array} assignees - List of assignees
     * @param {number} dueAt - Task's due date
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    createTaskNew = (
        file: BoxItem,
        currentUser: User,
        message: string,
        assignees: SelectorItems<>,
        taskType: TaskType,
        dueAt: ?string,
        completionRule: TaskCompletionRule,
        successCallback: Function,
        errorCallback: ErrorCallback,
    ): void => {
        if (!file.id) {
            throw getBadItemError();
        }

        this.file = file;
        this.errorCallback = errorCallback;
        const uuid = uniqueId('task_');
        let dueAtString;
        if (dueAt) {
            const dueAtDate: Date = new Date(dueAt);
            dueAtString = dueAtDate.toISOString();
        }

        // TODO: make pending task generator a function
        const pendingTask: TaskNew = {
            created_by: {
                type: 'task_collaborator',
                target: currentUser,
                id: uniqueId(),
                role: 'CREATOR',
                status: TASK_NEW_INITIAL_STATUS,
            },
            completion_rule: completionRule,
            created_at: new Date().toISOString(),
            due_at: dueAtString,
            id: uuid,
            description: message,
            type: FEED_ITEM_TYPE_TASK,
            assigned_to: {
                entries: assignees.map((assignee: SelectorItem<UserMini | GroupMini>) => ({
                    id: uniqueId(),
                    target: { ...assignee, avatar_url: '', type: 'user' },
                    status: TASK_NEW_INITIAL_STATUS,
                    permissions: {
                        can_delete: false,
                        can_update: false,
                    },
                    role: 'ASSIGNEE',
                    type: 'task_collaborator',
                })),
                limit: 10,
                next_marker: null,
            },
            permissions: {
                can_update: false,
                can_delete: false,
                can_create_task_collaborator: false,
                can_create_task_link: false,
            },
            task_links: {
                entries: [
                    {
                        id: uniqueId(),
                        type: 'task_link',
                        target: {
                            type: 'file',
                            ...file,
                        },
                        permissions: {
                            can_delete: false,
                            can_update: false,
                        },
                    },
                ],
                limit: 1,
                next_marker: null,
            },
            task_type: taskType,
            status: TASK_NEW_NOT_STARTED,
        };

        const taskPayload: TaskPayload = {
            description: message,
            due_at: dueAtString,
            task_type: taskType,
            completion_rule: completionRule,
        };

        // create request for the size of each group by ID
        const groupInfoPromises: Array<Promise<any>> = assignees
            .filter((assignee: SelectorItem<UserMini | GroupMini>) => (assignee.item && assignee.item.type) === 'group')
            .map(assignee => assignee.id)
            .map(groupId => {
                return new GroupsAPI(this.options).getGroupCount({
                    file,
                    group: { id: groupId },
                });
            });

        // Fetch each group size in parallel --> return an array of group sizes
        Promise.all(groupInfoPromises)
            .then((groupCounts: Array<{ total_count: number }>) => {
                const hasAnyGroupCountExceeded: boolean = groupCounts.some(
                    groupInfo => groupInfo.total_count > TASK_MAX_GROUP_ASSIGNEES,
                );
                const warning = {
                    code: ERROR_CODE_GROUP_EXCEEDS_LIMIT,
                    type: 'warning',
                };
                if (hasAnyGroupCountExceeded) {
                    this.feedErrorCallback(false, warning, ERROR_CODE_GROUP_EXCEEDS_LIMIT);
                    return;
                }

                this.tasksNewAPI = new TasksNewAPI(this.options);
                this.tasksNewAPI.createTaskWithDeps({
                    file,
                    task: taskPayload,
                    assignees,
                    successCallback: (taskWithDepsData: any) => {
                        this.addPendingItem(this.file.id, currentUser, pendingTask);
                        this.updateFeedItem(
                            {
                                ...taskWithDepsData,
                                task_links: {
                                    entries: taskWithDepsData.task_links,
                                    next_marker: null,
                                    limit: 1,
                                },
                                assigned_to: {
                                    entries: taskWithDepsData.assigned_to,
                                    next_marker: null,
                                    limit: taskWithDepsData.assigned_to.length,
                                },
                                isPending: false,
                            },
                            uuid,
                        );
                        successCallback(taskWithDepsData);
                    },
                    errorCallback: (e: ElementsXhrError, code: string) => {
                        this.feedErrorCallback(false, e, code);
                    },
                });
            })
            .catch(error => {
                this.feedErrorCallback(false, error, ERROR_CODE_CREATE_TASK);
            });
    };

    /**
     * Creates a task group via the API.
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {Task|TaskUpdatePayload} task - The newly created or existing task from the API
     * @param {SelectorItem} assignee - The user assigned to this task
     * @param {Function} errorCallback - Task create error callback
     * @return {Promise<TaskAssignment>}
     */
    createTaskCollaboratorsforGroup(
        file: BoxItem,
        task: Task | TaskUpdatePayload,
        assignee: SelectorItem<UserMini | GroupMini>,
    ): Promise<Array<TaskCollabAssignee>> {
        if (!file.id) {
            throw getBadItemError();
        }

        this.file = file;
        return new Promise((resolve, reject) => {
            const taskCollaboratorsAPI = new TaskCollaboratorsAPI(this.options);
            this.taskCollaboratorsAPI.push(taskCollaboratorsAPI);
            taskCollaboratorsAPI.createTaskCollaboratorsforGroup({
                file,
                task,
                group: assignee,
                successCallback: resolve,
                errorCallback: (e: ElementsXhrError) => {
                    reject(e);
                },
            });
        });
    }

    /**
     * Creates a task collaborator via the API.
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {Task|TaskUpdatePayload} task - The newly created or existing task from the API
     * @param {SelectorItem} assignee - The user assigned to this task
     * @param {Function} errorCallback - Task create error callback
     * @return {Promise<TaskAssignment>}
     */
    createTaskCollaborator(
        file: BoxItem,
        task: Task | TaskUpdatePayload,
        assignee: SelectorItem<UserMini | GroupMini>,
    ): Promise<TaskCollabAssignee> {
        if (!file.id) {
            throw getBadItemError();
        }

        this.file = file;
        return new Promise((resolve, reject) => {
            const taskCollaboratorsAPI = new TaskCollaboratorsAPI(this.options);
            this.taskCollaboratorsAPI.push(taskCollaboratorsAPI);

            taskCollaboratorsAPI.createTaskCollaborator({
                file,
                task,
                user: assignee,
                successCallback: resolve,
                errorCallback: (e: ElementsXhrError) => {
                    reject(e);
                },
            });
        });
    }

    /**
     * Deletes a task collaborator via the API.
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {Task|TaskUpdatePayload} task - The newly deleted or existing task from the API
     * @param {TaskCollabAssignee} assignee - The user assigned to this task
     * @param {Function} errorCallback - Task delete error callback
     * @return {Promise<TaskAssignment>}
     */
    deleteTaskCollaborator(
        file: BoxItem,
        task: Task | TaskUpdatePayload,
        assignee: TaskCollabAssignee,
    ): Promise<TaskCollabAssignee> {
        if (!file.id) {
            throw getBadItemError();
        }

        this.file.id = file.id;
        return new Promise((resolve, reject) => {
            const taskCollaboratorsAPI = new TaskCollaboratorsAPI(this.options);
            this.taskCollaboratorsAPI.push(taskCollaboratorsAPI);

            taskCollaboratorsAPI.deleteTaskCollaborator({
                file,
                task,
                taskCollaborator: { id: assignee.id },
                successCallback: resolve,
                errorCallback: (e: ElementsXhrError) => {
                    reject(e);
                },
            });
        });
    }

    /**
     * Creates a task link via the API.
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {Task} task - The newly created task from the API
     * @param {Function} errorCallback - Task create error callback
     * @return {Promise<TaskAssignment}
     */
    createTaskLink(file: BoxItem, task: Task): Promise<TaskLink> {
        if (!file.id) {
            throw getBadItemError();
        }

        this.file = file;
        return new Promise((resolve, reject) => {
            const taskLinksAPI = new TaskLinksAPI(this.options);
            this.taskLinksAPI.push(taskLinksAPI);

            taskLinksAPI.createTaskLink({
                file,
                task,
                successCallback: resolve,
                errorCallback: reject,
            });
        });
    }

    /**
     * Deletes a task in the new API
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {string} taskId - The task's id
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    deleteTaskNew = (
        file: BoxItem,
        task: TaskNew,
        successCallback: (taskId: string) => void = noop,
        errorCallback: ErrorCallback = noop,
    ) => {
        if (!file.id) {
            throw getBadItemError();
        }

        this.file = file;
        this.errorCallback = errorCallback;
        this.tasksNewAPI = new TasksNewAPI(this.options);
        this.updateFeedItem({ isPending: true }, task.id);

        this.tasksNewAPI.deleteTask({
            file,
            task,
            successCallback: this.deleteFeedItem.bind(this, task.id, successCallback),
            errorCallback: (e: ElementsXhrError, code: string) => {
                this.updateFeedItem(this.createFeedError(messages.taskDeleteErrorMessage), task.id);
                this.feedErrorCallback(true, e, code);
            },
        });
    };

    /**
     * Deletes a feed item from the cache
     *
     * @param {string} id - The id of the feed item to be deleted
     * @param {Function} successCallback - function to be called after the delete
     */
    deleteFeedItem = (id: string, successCallback: Function = noop) => {
        const cachedItems = this.getCachedItems(this.file.id);
        if (cachedItems) {
            const feedItems = cachedItems.items.filter(feedItem => feedItem.id !== id);
            this.setCachedItems(this.file.id, feedItems);

            if (!this.isDestroyed()) {
                successCallback(id);
            }
        }
    };

    /**
     * Deletes a reply from the cache
     *
     * @param {string} id - The id of the feed item to be deleted
     * @param {string} parentId - The id of the parent feed item
     * @param {Function} successCallback - function to be called after the delete
     */
    deleteReplyItem = (
        id: string,
        parentId: string,
        successCallback: (id: string, parentId: string) => void = noop,
    ) => {
        const cachedItems = this.getCachedItems(this.file.id) || { items: [], errors: [] };
        const feedItems = cachedItems.items.map(item => {
            if (item.id !== parentId) {
                return item;
            }
            if (item.type === FEED_ITEM_TYPE_ANNOTATION) {
                return getItemWithFilteredReplies<Annotation>(item, id);
            }
            if (item.type === FEED_ITEM_TYPE_COMMENT) {
                return getItemWithFilteredReplies<Comment>(item, id);
            }
            return item;
        });
        this.setCachedItems(this.file.id, feedItems);

        if (!this.isDestroyed()) {
            successCallback(id, parentId);
        }
    };

    /**
     * Network error callback
     *
     * @param {boolean} hasError - true if the UI should display an error
     * @param {ElementsXhrError} e - the error returned by the API
     * @param {string} code - the error code for the error which occured
     * @return {void}
     */
    feedErrorCallback = (hasError: boolean = false, e: ElementsXhrError, code: string): void => {
        if (hasError) {
            this.errors.push({ ...e, code });
        }

        if (!this.isDestroyed() && this.errorCallback) {
            this.errorCallback(e, code, {
                error: e,
                [IS_ERROR_DISPLAYED]: hasError,
            });
        }

        console.error(e); // eslint-disable-line no-console
    };

    /**
     * Add a placeholder pending feed item.
     *
     * @param {string} id - the file id
     * @param {Object} currentUser - the user who performed the action
     * @param {Object} itemBase - Base properties for item to be added to the feed as pending.
     * @return {void}
     */
    addPendingItem = (id: string, currentUser: User, itemBase: Object): Comment | Task | TaskNew | BoxItemVersion => {
        if (!currentUser) {
            throw getBadUserError();
        }

        const date = new Date().toISOString();
        const pendingFeedItem = {
            created_at: date,
            created_by: currentUser,
            modified_at: date,
            isPending: true,
            ...itemBase,
        };
        const cachedItems = this.getCachedItems(this.file.id);
        const feedItems = cachedItems ? cachedItems.items : [];
        const feedItemsWithPendingItem = [...feedItems, pendingFeedItem];
        this.setCachedItems(id, feedItemsWithPendingItem);

        return pendingFeedItem;
    };

    /**
     * Add a placeholder pending comment (reply).
     *
     * @param {string} parentId - id of parent comment or annotation
     * @param {Object} currentUser - the user who performed the action
     * @param {Object} commentBase - Base properties for reply (comment) to be added to the feed as pending.
     * @return {Comment} - newly created pending reply
     */
    addPendingReply = (parentId: string, currentUser: User, commentBase: Object): Comment => {
        if (!this.file.id) {
            throw getBadItemError();
        }
        if (!currentUser) {
            throw getBadUserError();
        }

        const date = new Date().toISOString();
        const pendingReply: Comment = {
            created_at: date,
            created_by: currentUser,
            modified_at: date,
            isPending: true,
            ...commentBase,
        };

        const cachedItems = this.getCachedItems(this.file.id);
        if (cachedItems) {
            const updatedFeedItems = cachedItems.items.map(item => {
                if (item.id === parentId && item.type === FEED_ITEM_TYPE_COMMENT) {
                    return getItemWithPendingReply<Comment>(item, pendingReply);
                }
                if (item.id === parentId && item.type === FEED_ITEM_TYPE_ANNOTATION) {
                    return getItemWithPendingReply<Annotation>(item, pendingReply);
                }
                return item;
            });

            this.setCachedItems(this.file.id, updatedFeedItems);
        }

        return pendingReply;
    };

    /**
     * Callback for successful creation of a Comment.
     *
     * @param {Comment} commentData - API returned Comment
     * @param {string} id - ID of the feed item to update with the new comment data
     * @return {void}
     */
    createCommentSuccessCallback = (commentData: Comment, id: string, successCallback: Function): void => {
        const { message = '', tagged_message = '' } = commentData;
        // Comment component uses tagged_message only
        commentData.tagged_message = tagged_message || message;

        this.updateFeedItem(
            {
                ...commentData,
                isPending: false,
            },
            id,
        );

        if (!this.isDestroyed()) {
            successCallback(commentData);
        }
    };

    /**
     * Callback for failed creation of a Comment.
     *
     * @param {Object} e - The axios error
     * @param {string} code - the error code
     * @param {string} id - ID of the feed item to update
     * @return {void}
     */
    createCommentErrorCallback = (e: ElementsXhrError, code: string, id: string) => {
        const errorMessage =
            e.status === HTTP_STATUS_CODE_CONFLICT
                ? messages.commentCreateConflictMessage
                : messages.commentCreateErrorMessage;
        this.updateFeedItem(this.createFeedError(errorMessage), id);
        this.feedErrorCallback(false, e, code);
    };

    /**
     * Callback for successful creation of a Comment.
     *
     * @param {Comment} commentData - API returned Comment
     * @param {string} parentId - ID of the parent feed item
     * @param {string} id - ID of the reply to update with the new comment data
     * @param {Function} successCallback - success callback
     * @return {void}
     */
    createReplySuccessCallback = (
        commentData: Comment,
        parentId: string,
        id: string,
        successCallback: Function,
    ): void => {
        this.updateReplyItem(
            {
                ...commentData,
                isPending: false,
            },
            parentId,
            id,
        );

        if (!this.isDestroyed()) {
            successCallback(commentData);
        }
    };

    /**
     * Callback for failed creation of a reply.
     *
     * @param {ElementsXhrError} error - The axios error
     * @param {string} code - the error code
     * @param {string} parentId - ID of the parent feed item
     * @param {string} id - ID of the feed item to update
     * @return {void}
     */
    createReplyErrorCallback = (error: ElementsXhrError, code: string, parentId: string, id: string) => {
        const errorMessage =
            error.status === HTTP_STATUS_CODE_CONFLICT
                ? messages.commentCreateConflictMessage
                : messages.commentCreateErrorMessage;
        this.updateReplyItem(this.createFeedError(errorMessage), parentId, id);
        this.feedErrorCallback(false, error, code);
    };

    /**
     * Constructs an error object that renders to an inline feed error
     *
     * @param {string} message - The error message body.
     * @param {string} title - The error message title.
     * @return {Object} An error message object
     */
    createFeedError(message: MessageDescriptor, title: MessageDescriptor = commonMessages.errorOccured) {
        return {
            error: { message, title },
        };
    }

    /**
     * Replace a feed item with new feed item data.
     *
     * @param {Object} updates - The new data to be applied to the feed item.
     * @param {string} id - ID of the feed item to replace.
     * @return {void}
     */
    updateFeedItem = (updates: Object, id: string): ?FeedItems => {
        if (!this.file.id) {
            throw getBadItemError();
        }

        const cachedItems = this.getCachedItems(this.file.id);
        if (cachedItems) {
            const updatedFeedItems = cachedItems.items.map((item: FeedItem) => {
                if (item.id === id) {
                    return {
                        ...item,
                        ...updates,
                    };
                }

                return item;
            });

            this.setCachedItems(this.file.id, updatedFeedItems);
            return updatedFeedItems;
        }

        return null;
    };

    /**
     * Replace a reply of feed item with new comment data.
     *
     * @param {Object} replyUpdates - New data to be applied to the reply.
     * @param {string} parentId - ID of the parent feed item.
     * @param {string} id - ID of the reply to replace.
     * @return {void}
     */
    updateReplyItem = (replyUpdates: Object, parentId: string, id: string) => {
        if (!this.file.id) {
            throw getBadItemError();
        }

        const getItemWithUpdatedReply = <T: { replies?: Array<Comment> }>(
            item: T,
            replyId: string,
            updates: Object,
        ): T => {
            const updatedItem: T = { ...item };
            if (updatedItem.replies) {
                updatedItem.replies = updatedItem.replies.map(reply => {
                    if (reply.id === replyId) {
                        return {
                            ...reply,
                            ...updates,
                        };
                    }
                    return reply;
                });
            }
            return updatedItem;
        };

        const cachedItems = this.getCachedItems(this.file.id);
        if (cachedItems) {
            const updatedFeedItems = cachedItems.items.map((item: FeedItem) => {
                if (item.id === parentId && item.type === FEED_ITEM_TYPE_COMMENT) {
                    return getItemWithUpdatedReply<Comment>(item, id, replyUpdates);
                }
                if (item.id === parentId && item.type === FEED_ITEM_TYPE_ANNOTATION) {
                    return getItemWithUpdatedReply<Annotation>(item, id, replyUpdates);
                }
                return item;
            });

            this.setCachedItems(this.file.id, updatedFeedItems);
        }
    };

    /**
     * Create a comment, and make a pending item to be replaced once the API is successful.
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {Object} currentUser - the user who performed the action
     * @param {string} text - the comment text
     * @param {boolean} hasMention - true if there is an @mention in the text
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @return {void}
     */
    createComment = (
        file: BoxItem,
        currentUser: User,
        text: string,
        hasMention: boolean,
        successCallback: Function,
        errorCallback: ErrorCallback,
    ): void => {
        const uuid = uniqueId('comment_');
        const commentData = {
            id: uuid,
            tagged_message: text,
            type: FEED_ITEM_TYPE_COMMENT,
        };

        if (!file.id) {
            throw getBadItemError();
        }

        this.file = file;
        this.errorCallback = errorCallback;
        this.addPendingItem(this.file.id, currentUser, commentData);

        const message = {};
        if (hasMention) {
            message.taggedMessage = text;
        } else {
            message.message = text;
        }

        this.commentsAPI = new CommentsAPI(this.options);

        this.commentsAPI.createComment({
            file,
            ...message,
            successCallback: (comment: Comment) => {
                this.createCommentSuccessCallback(comment, uuid, successCallback);
            },
            errorCallback: (e: ErrorResponseData, code: string) => {
                this.createCommentErrorCallback(e, code, uuid);
            },
        });
    };

    /**
     * Create a threaded comment (using ThreadedComments API),
     * and make a pending item to be replaced once the API is successful.
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {Object} currentUser - the user who performed the action
     * @param {string} text - the comment text
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @return {void}
     */
    createThreadedComment = (
        file: BoxItem,
        currentUser: User,
        text: string,
        successCallback: Function,
        errorCallback: ErrorCallback,
    ): void => {
        if (!file.id) {
            throw getBadItemError();
        }

        const uuid = uniqueId('comment_');
        const commentData = {
            id: uuid,
            tagged_message: text,
            type: FEED_ITEM_TYPE_COMMENT,
        };

        this.file = file;
        this.errorCallback = errorCallback;
        this.addPendingItem(this.file.id, currentUser, commentData);

        this.threadedCommentsAPI = new ThreadedCommentsAPI(this.options);

        this.threadedCommentsAPI.createComment({
            file,
            message: text,
            successCallback: (comment: Comment) => {
                this.createCommentSuccessCallback(comment, uuid, successCallback);
            },
            errorCallback: (e: ErrorResponseData, code: string) => {
                this.createCommentErrorCallback(e, code, uuid);
            },
        });
    };

    /**
     * Create a reply to annotation or comment, and make a pending item to be replaced once the API is successful.
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {Object} currentUser - the user who performed the action
     * @param {string} parentId - id of the parent item
     * @param {CommentFeedItemType} parentType - type of the parent item
     * @param {string} text - the comment text
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @return {void}
     */
    createReply(
        file: BoxItem,
        currentUser: User,
        parentId: string,
        parentType: CommentFeedItemType,
        text: string,
        successCallback: Function,
        errorCallback: ErrorCallback,
    ): void {
        const { id, permissions } = file;
        if (!id || !permissions) {
            throw getBadItemError();
        }

        const uuid = uniqueId('comment_');
        const commentData = {
            id: uuid,
            tagged_message: text,
            type: FEED_ITEM_TYPE_COMMENT,
        };

        this.file = file;
        this.errorCallback = errorCallback;
        this.addPendingReply(parentId, currentUser, commentData);
        this.modifyFeedItemRepliesCountBy(parentId, 1);

        const successCallbackFn = (comment: Comment) => {
            this.createReplySuccessCallback(comment, parentId, uuid, successCallback);
        };
        const errorCallbackFn = (error: ErrorResponseData, code: string) => {
            this.createReplyErrorCallback(error, code, parentId, uuid);
        };

        if (parentType === FEED_ITEM_TYPE_ANNOTATION) {
            this.annotationsAPI = new AnnotationsAPI(this.options);

            this.annotationsAPI.createAnnotationReply(
                file.id,
                parentId,
                permissions,
                text,
                successCallbackFn,
                errorCallbackFn,
            );
        } else if (parentType === FEED_ITEM_TYPE_COMMENT) {
            this.threadedCommentsAPI = new ThreadedCommentsAPI(this.options);

            this.threadedCommentsAPI.createCommentReply({
                fileId: file.id,
                commentId: parentId,
                permissions,
                message: text,
                successCallback: successCallbackFn,
                errorCallback: errorCallbackFn,
            });
        }
    }

    /**
     * Update a comment
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {string} commentId - Comment ID
     * @param {string} text - the comment text
     * @param {boolean} hasMention - true if there is an @mention in the text
     * @param {BoxCommentPermission} permissions - Permissions to attach to the app activity items
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @return {void}
     */
    updateComment = (
        file: BoxItem,
        commentId: string,
        text: string,
        hasMention: boolean,
        permissions: BoxCommentPermission,
        successCallback: Function,
        errorCallback: ErrorCallback,
    ): void => {
        const commentData = {
            tagged_message: text,
        };

        if (!file.id) {
            throw getBadItemError();
        }

        this.file = file;
        this.errorCallback = errorCallback;
        this.updateFeedItem({ ...commentData, isPending: true }, commentId);

        const message = {};
        if (hasMention) {
            message.tagged_message = text;
        } else {
            message.message = text;
        }

        this.commentsAPI = new CommentsAPI(this.options);

        this.commentsAPI.updateComment({
            file,
            commentId,
            permissions,
            ...message,
            successCallback: (comment: Comment) => {
                // use the request payload instead of response in the
                // feed item update because response may not contain
                // the tagged version of the message
                this.updateFeedItem(
                    {
                        ...message,
                        isPending: false,
                    },
                    commentId,
                );
                if (!this.isDestroyed()) {
                    successCallback(comment);
                }
            },
            errorCallback: (e: ErrorResponseData, code: string) => {
                this.updateCommentErrorCallback(e, code, commentId);
            },
        });
    };

    /**
     * Update a threaded comment
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {string} commentId - Comment ID
     * @param {string} text - the comment text
     * @param {FeedItemStatus} status - status of the comment
     * @param {BoxCommentPermission} permissions - Permissions to attach to the app activity items
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @return {void}
     */
    updateThreadedComment = (
        file: BoxItem,
        commentId: string,
        text?: string,
        status?: FeedItemStatus,
        permissions: BoxCommentPermission,
        successCallback: Function,
        errorCallback: ErrorCallback,
    ): void => {
        if (!file.id) {
            throw getBadItemError();
        }
        if (!text && !status) {
            throw getMissingItemTextOrStatus();
        }

        const commentData = {};
        if (text) {
            commentData.tagged_message = text;
        }
        if (status) {
            commentData.status = status;
        }

        this.file = file;
        this.errorCallback = errorCallback;
        this.updateFeedItem({ ...commentData, isPending: true }, commentId);

        this.threadedCommentsAPI = new ThreadedCommentsAPI(this.options);

        this.threadedCommentsAPI.updateComment({
            fileId: file.id,
            commentId,
            permissions,
            message: text,
            status,
            successCallback: (comment: Comment) => {
                const { replies, total_reply_count, ...commentBase } = comment;
                this.updateFeedItem(
                    {
                        // Do not update replies and total_reply_count props as their current values are not included in the response
                        ...commentBase,
                        isPending: false,
                    },
                    commentId,
                );
                if (!this.isDestroyed()) {
                    successCallback(comment);
                }
            },
            errorCallback: (e: ErrorResponseData, code: string) => {
                this.updateCommentErrorCallback(e, code, commentId);
            },
        });
    };

    /**
     * Update a reply
     *
     * @param {BoxItem} file - The file to which the reply with its parent is assigned
     * @param {string} id - id of the reply
     * @param {string} parentId - id of the parent item
     * @param {string} text - the updated text
     * @param {BoxCommentPermission} permissions - Permissions to attach to the app activity items
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @return {void}
     */
    updateReply = (
        file: BoxItem,
        id: string,
        parentId: string,
        text: string,
        permissions: BoxCommentPermission,
        successCallback: (comment: Comment) => void,
        errorCallback: ErrorCallback,
    ): void => {
        if (!file.id) {
            throw getBadItemError();
        }

        this.file = file;
        this.errorCallback = errorCallback;
        this.updateReplyItem({ tagged_message: text, isPending: true }, parentId, id);

        this.threadedCommentsAPI = new ThreadedCommentsAPI(this.options);

        this.threadedCommentsAPI.updateComment({
            fileId: file.id,
            commentId: id,
            permissions,
            message: text,
            undefined,
            successCallback: (comment: Comment) => {
                this.updateReplyItem(
                    {
                        ...comment,
                        isPending: false,
                    },
                    parentId,
                    id,
                );
                if (!this.isDestroyed()) {
                    successCallback(comment);
                }
            },
            errorCallback: (error: ErrorResponseData, code: string) => {
                this.updateReplyErrorCallback(error, code, id, parentId);
            },
        });
    };

    /**
     * Modify feed item replies count
     *
     * @param {string} id - id of the item
     * @param {number} n - number to modify the count by
     * @return {void}
     */
    modifyFeedItemRepliesCountBy = (id: string, n: number) => {
        if (!this.file.id) {
            throw getBadItemError();
        }

        const { items: feedItems = [] } = this.getCachedItems(this.file.id) || {};
        const feedItem = feedItems.find(({ id: itemId }) => itemId === id);

        if (!feedItem || (feedItem.type !== 'annotation' && feedItem.type !== 'comment')) {
            return;
        }

        const newReplyCount = (feedItem.total_reply_count || 0) + n;
        if (newReplyCount >= 0) {
            this.updateFeedItem({ total_reply_count: newReplyCount }, id);
        }
    };

    destroyTaskCollaborators() {
        if (Array.isArray(this.taskCollaboratorsAPI)) {
            this.taskCollaboratorsAPI.forEach(api => api.destroy());
            this.taskCollaboratorsAPI = [];
        }
    }

    destroyTaskLinks() {
        if (Array.isArray(this.taskLinksAPI)) {
            this.taskLinksAPI.forEach(api => api.destroy());
            this.taskLinksAPI = [];
        }
    }

    /**
     * Fetches app activities for a file
     * @param {BoxItemPermission} permissions - Permissions to attach to the app activity items
     *
     * @return {Promise} - the feed items
     */
    fetchAppActivity(permissions: BoxItemPermission): Promise<?AppActivityItems> {
        this.appActivityAPI = new AppActivityAPI(this.options);

        return new Promise(resolve => {
            this.appActivityAPI.getAppActivity(
                this.file.id,
                permissions,
                resolve,
                this.fetchFeedItemErrorCallback.bind(this, resolve),
            );
        });
    }

    /**
     * Deletes an app activity item.
     *
     * @param {BoxItem} file - The file to which the app activity belongs to
     * @param {string} appActivityId - The app activity item id to delete
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    deleteAppActivity = (
        file: BoxItem,
        appActivityId: string,
        successCallback: Function,
        errorCallback: ErrorCallback,
    ): void => {
        const { id } = file;
        if (!id) {
            throw getBadItemError();
        }

        this.appActivityAPI = new AppActivityAPI(this.options);

        this.file = file;
        this.errorCallback = errorCallback;
        this.updateFeedItem({ isPending: true }, appActivityId);

        this.appActivityAPI.deleteAppActivity({
            id,
            appActivityId,
            successCallback: this.deleteFeedItem.bind(this, appActivityId, successCallback),
            errorCallback: (e: ElementsXhrError, code: string) => {
                this.deleteAppActivityErrorCallback(e, code, appActivityId);
            },
        });
    };

    /**
     * Error callback for deleting an app activity item
     *
     * @param {ElementsXhrError} e - the error returned by the API
     * @param {string} code - the error code
     * @param {string} id - the app activity id
     * @return {void}
     */
    deleteAppActivityErrorCallback = (e: ElementsXhrError, code: string, id: string) => {
        this.updateFeedItem(this.createFeedError(messages.appActivityDeleteErrorMessage), id);
        this.feedErrorCallback(true, e, code);
    };

    /**
     * Destroys all the task feed API's
     *
     * @return {void}
     */
    destroy() {
        super.destroy();

        if (this.annotationsAPI) {
            this.annotationsAPI.destroy();
            delete this.annotationsAPI;
        }

        if (this.commentsAPI) {
            this.commentsAPI.destroy();
            delete this.commentsAPI;
        }

        if (this.threadedCommentsAPI) {
            this.threadedCommentsAPI.destroy();
            delete this.threadedCommentsAPI;
        }

        if (this.versionsAPI) {
            this.versionsAPI.destroy();
            delete this.versionsAPI;
        }

        if (this.appActivityAPI) {
            this.appActivityAPI.destroy();
            delete this.appActivityAPI;
        }

        if (this.tasksNewAPI) {
            this.tasksNewAPI.destroy();
            delete this.tasksNewAPI;
        }

        this.destroyTaskCollaborators();
        this.destroyTaskLinks();
    }
}

export default Feed;
