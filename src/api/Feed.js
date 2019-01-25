/**
 * @flow
 * @file Helper for activity feed API's
 * @author Box
 */
import uniqueId from 'lodash/uniqueId';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import { getBadItemError, getBadUserError, isUserCorrectableError } from 'utils/error';
import messages from 'elements/common/messages';
import { sortFeedItems } from 'utils/sorter';
import Base from './Base';
import CommentsAPI from './Comments';
import VersionsAPI from './Versions';
import TasksAPI from './Tasks';
import TaskAssignmentsAPI from './TaskAssignments';
import {
    VERSION_UPLOAD_ACTION,
    VERSION_RESTORE_ACTION,
    TYPED_ID_FEED_PREFIX,
    HTTP_STATUS_CODE_CONFLICT,
    IS_ERROR_DISPLAYED,
    ERROR_CODE_CREATE_TASK_ASSIGNMENT,
} from '../constants';

const TASK_INCOMPLETE = 'incomplete';
const TASK = 'task';
const TASK_ASSIGNMENT = 'task_assignment';
const TASK_ASSIGNMENT_COLLECTION = 'task_assignment_collection';

type FeedItemsCache = {
    hasError: boolean,
    items: FeedItems,
};

type ErrorCallback = (e: ElementsXhrError, code: string, contextInfo?: Object) => void;

class Feed extends Base {
    /**
     * @property {VersionsAPI}
     */
    versionsAPI: VersionsAPI;

    /**
     * @property {CommentsAPI}
     */
    commentsAPI: CommentsAPI;

    /**
     * @property {TasksAPI}
     */
    tasksAPI: TasksAPI;

    /**
     * @property {TaskAssignmentsAPI}
     */
    taskAssignmentsAPI: Array<TasksAPI | TaskAssignmentsAPI>;

    /**
     * @property {string}
     */
    id: string;

    /**
     * @property {boolean}
     */
    hasError: boolean;

    constructor(options: Options) {
        super(options);
        this.taskAssignmentsAPI = [];
    }

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
            hasError: !!this.hasError,
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
     */
    feedItems(
        file: BoxItem,
        shouldRefreshCache: boolean,
        successCallback: Function,
        errorCallback: (feedItems: FeedItems) => void,
        onError: ErrorCallback,
    ): void {
        const { id, permissions = {} } = file;
        const cachedItems = this.getCachedItems(id);
        if (cachedItems) {
            const { hasError, items } = cachedItems;
            if (hasError) {
                errorCallback(items);
            } else {
                successCallback(items);
            }

            if (!shouldRefreshCache) {
                return;
            }
        }

        this.id = id;
        this.hasError = false;
        this.errorCallback = onError;
        const versionsPromise = this.fetchVersions();
        const commentsPromise = this.fetchComments(permissions);
        const tasksPromise = this.fetchTasks();

        Promise.all([versionsPromise, commentsPromise, tasksPromise]).then(feedItems => {
            const versions: ?FileVersions = feedItems[0];
            const versionsWithRestoredVersion = this.addCurrentVersion(versions, file);
            const unsortedFeedItems = [versionsWithRestoredVersion, ...feedItems.slice(1)];
            const sortedFeedItems = sortFeedItems(...unsortedFeedItems);
            if (!this.isDestroyed()) {
                this.setCachedItems(id, sortedFeedItems);
                if (this.hasError) {
                    errorCallback(sortedFeedItems);
                } else {
                    successCallback(sortedFeedItems);
                }
            }
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
                this.id,
                permissions,
                resolve,
                this.fetchFeedItemErrorCallback.bind(this, resolve),
            );
        });
    }

    /**
     * Fetches the versions for a file
     *
     * @return {Promise} - the file versions
     */
    fetchVersions(): Promise<?FileVersions> {
        this.versionsAPI = new VersionsAPI(this.options);
        return new Promise(resolve => {
            this.versionsAPI.getVersions(this.id, resolve, this.fetchFeedItemErrorCallback.bind(this, resolve));
        });
    }

    /**
     * Fetches the tasks for a file
     *
     * @return {Promise} - the feed items
     */
    fetchTasks(): Promise<?Tasks> {
        this.tasksAPI = new TasksAPI(this.options);

        return new Promise(resolve => {
            this.tasksAPI.getTasks(
                this.id,
                tasks => {
                    this.fetchTaskAssignments(tasks).then(resolve);
                },
                this.fetchFeedItemErrorCallback.bind(this, resolve),
            );
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
     * @param {string} taskAssignmentId - Task assignment ID
     * @param {TaskAssignmentStatus} taskStatus - New task assignment status
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    updateTaskAssignment = (
        file: BoxItem,
        taskId: string,
        taskAssignmentId: string,
        taskStatus: TaskAssignmentStatus,
        successCallback: Function,
        errorCallback: ErrorCallback,
    ): void => {
        if (!file.id) {
            throw getBadItemError();
        }

        this.id = file.id;
        this.errorCallback = errorCallback;
        this.updateFeedItem({ isPending: true }, taskId);
        const assignmentAPI = new TaskAssignmentsAPI(this.options);
        this.taskAssignmentsAPI.push(assignmentAPI);
        assignmentAPI.updateTaskAssignment({
            file,
            taskAssignmentId,
            taskStatus,
            successCallback: (taskAssignment: TaskAssignment) => {
                this.updateTaskAssignmentSuccessCallback(taskId, taskAssignment, successCallback);
            },
            errorCallback: (e: ElementsXhrError, code: string) => {
                this.feedErrorCallback(true, e, code);
            },
        });
    };

    /**
     * Updates the task assignment state of the updated task
     *
     * @param {string} taskId - Box task id
     * @param {TaskAssignment} updatedAssignment - New task assignment from API
     * @param {Function} successCallback - the function which will be called on success
     * @return {void}
     */
    updateTaskAssignmentSuccessCallback = (
        taskId: string,
        updatedAssignment: TaskAssignment,
        successCallback: Function,
    ): void => {
        const cachedItems = this.getCachedItems(this.id);
        if (cachedItems) {
            // $FlowFixMe
            const task: ?Task = cachedItems.items.find(item => item.type === TASK && item.id === taskId);
            if (task) {
                const { entries, total_count } = task.task_assignment_collection;
                const assignments = entries.map((item: TaskAssignment) => {
                    if (item.id === updatedAssignment.id) {
                        return {
                            ...item,
                            ...updatedAssignment,
                        };
                    }

                    return item;
                });

                this.updateFeedItem(
                    {
                        task_assignment_collection: {
                            entries: assignments,
                            total_count,
                        },
                        isPending: false,
                    },
                    taskId,
                );
                successCallback(updatedAssignment);
            }
        }
    };

    /**
     * Updates a task
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {string} taskId - The task's id
     * @param {Array} message - The task's text
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @param {string} dueAt - The optional date the task is due
     * @return {void}
     */
    updateTask = (
        file: BoxItem,
        taskId: string,
        message: string,
        successCallback: (task: Task) => void = noop,
        errorCallback: ErrorCallback,
        dueAt?: string,
    ) => {
        if (!file.id) {
            throw getBadItemError();
        }

        this.id = file.id;
        this.errorCallback = errorCallback;
        this.updateFeedItem({ isPending: true }, taskId);
        this.tasksAPI = new TasksAPI(this.options);
        this.tasksAPI.updateTask({
            file,
            taskId,
            message,
            dueAt,
            successCallback: (task: Task) => {
                this.updateTaskSuccessCallback(task, successCallback);
            },
            errorCallback: (e: ErrorResponseData, code: string) => {
                this.feedErrorCallback(true, e, code);
            },
        });
    };

    /**
     * Update task success callback
     *
     * @param {Object} task - The updated task
     * @param {Function} successCallback - The success callback
     * @return {void}
     */
    updateTaskSuccessCallback = (task: Task, successCallback: Function) => {
        const updates = omit(task, TASK_ASSIGNMENT_COLLECTION);
        this.updateFeedItem(
            {
                ...updates,
                isPending: false,
            },
            task.id,
        );
        if (!this.isDestroyed()) {
            successCallback(task);
        }
    };

    /**
     * Deletes a comment.
     *
     * @param {BoxItem} file - The file to which the comment belongs to
     * @param {string} commentId - Comment ID
     * @param {BoxItemPermission} permissions - Permissions for the comment
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error     *
     * @return {void}
     */
    deleteComment = (
        file: BoxItem,
        commentId: string,
        permissions: BoxItemPermission,
        successCallback: Function,
        errorCallback: ErrorCallback,
    ): void => {
        this.commentsAPI = new CommentsAPI(this.options);
        if (!file.id) {
            throw getBadItemError();
        }

        this.id = file.id;
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
     * Callback for successful creation of a Task. Creates a task assignment
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {string} id - ID of the feed item to update with the new task data
     * @param {Task} task - API returned task
     * @param {Array} assignees - List of assignees
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error     *
     * @return {void}
     */
    createTaskSuccessCallback(
        file: BoxItem,
        id: string,
        task: Task,
        assignees: SelectorItems,
        successCallback: Function,
        errorCallback: ErrorCallback,
    ): void {
        if (!file) {
            throw getBadItemError();
        }

        this.errorCallback = errorCallback;
        const assignmentPromises = assignees.map((assignee: SelectorItem) => {
            return this.createTaskAssignment(file, task, assignee);
        });

        Promise.all(assignmentPromises).then(
            (taskAssignments: Array<TaskAssignment>) => {
                const formattedTask = this.appendAssignmentsToTask(task, taskAssignments);
                this.updateFeedItem(
                    {
                        ...formattedTask,
                        isPending: false,
                    },
                    id,
                );
                successCallback(task);
            },
            (e: ElementsXhrError) => {
                this.feedErrorCallback(false, e, ERROR_CODE_CREATE_TASK_ASSIGNMENT);
            },
        );
    }

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
    createTask = (
        file: BoxItem,
        currentUser: User,
        message: string,
        assignees: SelectorItems,
        dueAt: ?string,
        successCallback: Function,
        errorCallback: ErrorCallback,
    ): void => {
        if (!file.id) {
            throw getBadItemError();
        }

        this.id = file.id;
        this.errorCallback = errorCallback;
        const uuid = uniqueId('task_');
        let dueAtString;
        if (dueAt) {
            const dueAtDate: Date = new Date(dueAt);
            dueAtString = dueAtDate.toISOString();
        }

        const pendingAssignees = assignees.map((assignee: SelectorItem) => ({
            assigned_to: {
                id: assignee.id,
                name: assignee.name,
            },
            status: TASK_INCOMPLETE,
        }));

        const task = {
            due_at: dueAtString,
            id: uuid,
            is_completed: false,
            message,
            task_assignment_collection: {
                entries: pendingAssignees,
                total_count: pendingAssignees.length,
            },
            type: TASK,
        };
        this.addPendingItem(this.id, currentUser, task);
        this.tasksAPI = new TasksAPI(this.options);
        this.tasksAPI.createTask({
            file,
            message,
            dueAt: dueAtString,
            successCallback: (taskData: Task) => {
                this.createTaskSuccessCallback(file, uuid, taskData, assignees, successCallback, errorCallback);
            },
            errorCallback: (e: ElementsXhrError, code: string) => {
                this.updateFeedItem(this.createFeedError(messages.taskCreateErrorMessage), uuid);
                this.feedErrorCallback(false, e, code);
            },
        });
    };

    /**
     * Creates a task assignment via the API.
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {Task} task - The newly created task from the API
     * @param {SelectorItem} assignee - The user assigned to this task
     * @param {Function} errorCallback - Task create error callback
     * @return {Promise<TaskAssignment}
     */
    createTaskAssignment(file: BoxItem, task: Task, assignee: SelectorItem): Promise<TaskAssignment> {
        if (!file.id) {
            throw getBadItemError();
        }

        this.id = file.id;
        return new Promise((resolve, reject) => {
            const taskAssignmentsAPI = new TaskAssignmentsAPI(this.options);
            this.taskAssignmentsAPI.push(taskAssignmentsAPI);

            taskAssignmentsAPI.createTaskAssignment({
                file,
                taskId: task.id,
                assignTo: { id: assignee.id },
                successCallback: (taskAssignment: TaskAssignment) => {
                    resolve(taskAssignment);
                },
                errorCallback: (e: ElementsXhrError) => {
                    // Attempt to delete the task due to it's bad assignment
                    this.deleteTask(file, task.id);
                    reject(e);
                },
            });
        });
    }

    /**
     * Deletes a task
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {string} taskId - The task's id
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    deleteTask = (
        file: BoxItem,
        taskId: string,
        successCallback: (taskId: string) => void = noop,
        errorCallback: ErrorCallback = noop,
    ) => {
        if (!file.id) {
            throw getBadItemError();
        }

        this.id = file.id;
        this.errorCallback = errorCallback;
        this.tasksAPI = new TasksAPI(this.options);
        this.updateFeedItem({ isPending: true }, taskId);

        this.tasksAPI.deleteTask({
            file,
            taskId,
            successCallback: this.deleteFeedItem.bind(this, taskId, successCallback),
            errorCallback: (e: ElementsXhrError, code: string) => {
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
        const cachedItems = this.getCachedItems(this.id);
        if (cachedItems) {
            const feedItems = cachedItems.items.filter(feedItem => feedItem.id !== id);
            this.setCachedItems(this.id, feedItems);

            if (!this.isDestroyed()) {
                successCallback(id);
            }
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
            this.hasError = true;
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
     * Fetches the task assignments for each task
     *
     * @param {Array} tasksWithoutAssignments - Box tasks
     * @return {Promise}
     */
    fetchTaskAssignments(tasksWithoutAssignments: Tasks): Promise<?Tasks> {
        const { entries } = tasksWithoutAssignments;
        const assignmentPromises = entries.map(
            (task: Task) =>
                new Promise(resolve => {
                    const tasksAPI = new TasksAPI(this.options);
                    this.taskAssignmentsAPI.push(tasksAPI);
                    tasksAPI.getAssignments(
                        this.id,
                        task.id,
                        (assignments: TaskAssignments) => {
                            const formattedTask = this.appendAssignmentsToTask(task, assignments.entries);
                            resolve(formattedTask);
                        },
                        this.fetchFeedItemErrorCallback.bind(this, resolve),
                    );
                }),
        );

        const formattedTasks: Tasks = { total_count: 0, entries: [] };
        return Promise.all(assignmentPromises).then(
            assignments => {
                assignments.forEach(task => {
                    if (task) {
                        formattedTasks.entries.push(task);
                        formattedTasks.total_count += 1;
                    }
                });
                return formattedTasks;
            },
            () => formattedTasks,
        );
    }

    /**
     * Formats assignments, and then adds them to their task.
     *
     * @param {Task} task - Task to which the assignments belong
     * @param {Task} assignments - List of task assignments
     * @return {Task}
     */
    appendAssignmentsToTask(task: Task, assignments: Array<TaskAssignment>): Task {
        if (!assignments) {
            return task;
        }

        task.task_assignment_collection.entries = assignments.map(taskAssignment => {
            const { id, assigned_to, status } = taskAssignment;
            return {
                type: TASK_ASSIGNMENT,
                id,
                assigned_to,
                status,
            };
        });

        // Increment the assignment collection count by the number of new assignments
        task.task_assignment_collection.total_count += assignments.length;
        return task;
    }

    /**
     * Add a placeholder pending feed item.
     *
     * @param {string} id - the file id
     * @param {Object} currentUser - the user who performed the action
     * @param {Object} itemBase - Base properties for item to be added to the feed as pending.
     * @return {void}
     */
    addPendingItem = (id: string, currentUser: User, itemBase: Object): Comment | Task | BoxItemVersion => {
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
        const cachedItems = this.getCachedItems(this.id);
        const feedItems = cachedItems ? cachedItems.items : [];
        const feedItemsWithPendingItem = [...feedItems, pendingFeedItem];
        this.setCachedItems(id, feedItemsWithPendingItem);

        return pendingFeedItem;
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
     * Constructs an error object that renders to an inline feed error
     *
     * @param {string} message - The error message body.
     * @param {string} title - The error message title.
     * @return {Object} An error message object
     */
    createFeedError(message: string, title: string = messages.errorOccured) {
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
        if (!this.id) {
            throw getBadItemError();
        }

        const cachedItems = this.getCachedItems(this.id);
        if (cachedItems) {
            const updatedFeedItems = cachedItems.items.map((item: Comment | Task | BoxItemVersion) => {
                if (item.id === id) {
                    return {
                        ...item,
                        ...updates,
                    };
                }

                return item;
            });

            this.setCachedItems(this.id, updatedFeedItems);
            return updatedFeedItems;
        }

        return null;
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
            type: 'comment',
        };

        if (!file.id) {
            throw getBadItemError();
        }

        this.id = file.id;
        this.errorCallback = errorCallback;
        this.addPendingItem(this.id, currentUser, commentData);

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
     * Adds the current version from the file object, which may be a restore
     *
     * @param {FileVersions} versions - API returned file versions for this file
     * @return {FileVersions} modified versions array including the current/restored version
     */
    addCurrentVersion(versions: ?FileVersions, file: BoxItem): ?FileVersions {
        const { restored_from, modified_at, file_version } = file;

        if (!file_version || !versions) {
            return versions;
        }

        const { modified_by, version_number } = file;
        let currentVersion = file_version;
        let action = VERSION_UPLOAD_ACTION;
        let versionNumber = version_number;

        if (restored_from) {
            const { id: restoredFromId } = restored_from;
            const restoredVersion = versions.entries.find((version: BoxItemVersion) => version.id === restoredFromId);
            if (restoredVersion) {
                versionNumber = restoredVersion.version_number;
                action = VERSION_RESTORE_ACTION;
                currentVersion = {
                    ...restoredVersion,
                    ...currentVersion,
                };
            }
        }

        const currentFileVersion: BoxItemVersion = {
            ...currentVersion,
            action,
            modified_by,
            created_at: modified_at,
            version_number: versionNumber,
        };
        return {
            total_count: versions.total_count + 1,
            entries: [...versions.entries, currentFileVersion],
        };
    }

    /**
     * Destroys all the task assignment API's
     *
     * @return {void}
     */
    destroyTaskAssignments() {
        if (Array.isArray(this.taskAssignmentsAPI)) {
            this.taskAssignmentsAPI.forEach(api => api.destroy());
            this.taskAssignmentsAPI = [];
        }
    }

    /**
     * Destroys all the task feed API's
     *
     * @return {void}
     */
    destroy() {
        super.destroy();

        if (this.commentsAPI) {
            this.commentsAPI.destroy();
            delete this.commentsAPI;
        }

        if (this.versionsAPI) {
            this.versionsAPI.destroy();
            delete this.versionsAPI;
        }

        if (this.tasksAPI) {
            this.tasksAPI.destroy();
            delete this.tasksAPI;
        }

        this.destroyTaskAssignments();
    }
}

export default Feed;
