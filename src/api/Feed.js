/**
 * @flow
 * @file Helper for activity feed API's
 * @author Box
 */
import type { $AxiosXHR } from 'axios';
import uniqueId from 'lodash/uniqueId';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import Base from './Base';
import {
    COMMENTS_FIELDS_TO_FETCH,
    TASKS_FIELDS_TO_FETCH,
    VERSIONS_FIELDS_TO_FETCH,
    TASK_ASSIGNMENTS_FIELDS_TO_FETCH,
} from '../util/fields';
import CommentsAPI from './Comments';
import VersionsAPI from './Versions';
import TasksAPI from './Tasks';
import TaskAssignmentsAPI from './TaskAssignments';
import { getBadItemError, getBadUserError } from '../util/error';
import messages from '../components/messages';
import {
    VERSION_UPLOAD_ACTION,
    VERSION_RESTORE_ACTION,
    TYPED_ID_FEED_PREFIX,
    CONFLICT_CODE,
    UNAUTHORIZED_CODE,
    RATE_LIMIT_CODE,
    INTERNAL_SERVER_ERROR_CODE,
} from '../constants';
import { sortFeedItems } from '../util/sorter';

const DEFAULT_START = 0;
const DEFAULT_END = 1000;
const TASK_INCOMPLETE = 'incomplete';
const TASK = 'task';
const TASK_ASSIGNMENT = 'task_assignment';
const TASK_ASSIGNMENT_COLLECTION = 'task_assignment_collection';

type FeedItemsCache = {
    hasError: boolean,
    items: FeedItems,
};

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
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     */
    feedItems(
        file: BoxItem,
        successCallback: Function,
        errorCallback: Function,
    ): void {
        const { id } = file;
        const cachedItems = this.getCachedItems(id);
        if (cachedItems) {
            const { hasError, items } = cachedItems;
            if (hasError) {
                errorCallback(items);
            } else {
                successCallback(items);
            }

            return;
        }

        this.id = id;
        this.hasError = false;
        const versionsPromise = this.fetchVersions();
        const commentsPromise = this.fetchComments();
        const tasksPromise = this.fetchTasks();

        Promise.all([versionsPromise, commentsPromise, tasksPromise]).then(
            feedItems => {
                const versions: ?FileVersions = feedItems[0];
                const versionsWithRestoredVersion = this.addCurrentVersion(
                    versions,
                    file,
                );
                const unsortedFeedItems = [
                    versionsWithRestoredVersion,
                    ...feedItems.slice(1),
                ];
                const sortedFeedItems = sortFeedItems(...unsortedFeedItems);
                if (!this.isDestroyed()) {
                    this.setCachedItems(id, sortedFeedItems);
                    if (this.hasError) {
                        errorCallback(sortedFeedItems);
                    } else {
                        successCallback(sortedFeedItems);
                    }
                }
            },
        );
    }

    /**
     * Fetches the comments for a file
     *
     * @return {Promise} - the file comments
     */
    fetchComments(): Promise<?Comments> {
        this.commentsAPI = new CommentsAPI(this.options);
        return new Promise(resolve => {
            this.commentsAPI.offsetGet(
                this.id,
                resolve,
                this.fetchFeedItemErrorCallback.bind(this, resolve),
                DEFAULT_START,
                DEFAULT_END,
                COMMENTS_FIELDS_TO_FETCH,
                true,
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
            this.versionsAPI.offsetGet(
                this.id,
                resolve,
                this.fetchFeedItemErrorCallback.bind(this, resolve),
                DEFAULT_START,
                DEFAULT_END,
                VERSIONS_FIELDS_TO_FETCH,
                true,
            );
        });
    }

    /**
     * Fetches the tasks for a file
     *
     * @return {Promise} - the feed items
     */
    fetchTasks(): Promise<?Tasks> {
        this.tasksAPI = new TasksAPI(this.options);
        const requestData = {
            params: {
                fields: TASKS_FIELDS_TO_FETCH.toString(),
            },
        };

        return new Promise(resolve => {
            this.tasksAPI.get({
                id: this.id,
                successCallback: tasks => {
                    this.fetchTaskAssignments(tasks).then(resolve);
                },
                errorCallback: this.fetchFeedItemErrorCallback.bind(
                    this,
                    resolve,
                ),
                params: requestData,
            });
        });
    }

    /**
     * Error callback for fetching feed items.
     * Should only call the error callback if the response is a 401, 429 or >= 500
     *
     * @param {Object} e - the axios error
     * @param {Function} cb - optional callback to be executed
     * @return {void}
     */
    fetchFeedItemErrorCallback = (cb: ?Function, e: $AxiosXHR<any>) => {
        const { status } = e;
        if (
            status === RATE_LIMIT_CODE ||
            status === UNAUTHORIZED_CODE ||
            status >= INTERNAL_SERVER_ERROR_CODE
        ) {
            this.errorCallback(e);
        }

        if (typeof cb === 'function') {
            cb();
        }
    };

    /**
     * Updates a task assignment
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {string} taskId - ID of task to be updated
     * @param {string} taskAssignmentId - Task assignment ID
     * @param {string} resolutionState - New task assignment status
     * @param {string} message - optional the message to the assignee
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    updateTaskAssignment = (
        file: BoxItem,
        taskId: string,
        taskAssignmentId: string,
        resolutionState: string,
        message?: string,
        successCallback: Function,
        errorCallback: Function,
    ): void => {
        if (!file.id) {
            throw getBadItemError();
        }

        this.id = file.id;
        this.updateFeedItem({ isPending: true }, taskId);
        const assignmentAPI = new TaskAssignmentsAPI(this.options);
        this.taskAssignmentsAPI.push(assignmentAPI);
        assignmentAPI.updateTaskAssignment({
            file,
            taskAssignmentId,
            resolutionState,
            message,
            successCallback: (taskAssignment: TaskAssignment) => {
                this.updateTaskAssignmentSuccessCallback(
                    taskId,
                    taskAssignment,
                    successCallback,
                );
            },
            errorCallback: (e: $AxiosXHR<any>) => {
                errorCallback(e);
                this.errorCallback(e);
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
            const task: ?Task = cachedItems.items.find(
                item => item.type === TASK && item.id === taskId,
            );
            if (task) {
                const {
                    entries,
                    total_count,
                } = task.task_assignment_collection;
                const assignments = entries.map((item: TaskAssignment) => {
                    if (item.id === updatedAssignment.id) {
                        return {
                            ...item,
                            ...updatedAssignment,
                            resolution_state: updatedAssignment.message.toLowerCase(),
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
        errorCallback: (e: $AxiosXHR<any>) => void = noop,
        dueAt?: string,
    ) => {
        if (!file.id) {
            throw getBadItemError();
        }

        this.id = file.id;
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
            errorCallback: (e: $AxiosXHR<any>) => {
                this.updateTaskErrorCallback(e, errorCallback);
            },
        });
    };

    /**
     * Update task error callback
     *
     * @param {Object} e - Axios error
     * @param {Function} errorCallback - The error callback
     * @return {void}
     */
    updateTaskErrorCallback = (e: $AxiosXHR<any>, errorCallback: Function) => {
        this.errorCallback(e);
        if (!this.isDestroyed()) {
            errorCallback(e);
        }
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
        errorCallback: Function,
    ): void => {
        this.commentsAPI = new CommentsAPI(this.options);
        if (!file.id) {
            throw getBadItemError();
        }

        this.id = file.id;
        this.updateFeedItem({ isPending: true }, commentId);

        this.commentsAPI.deleteComment({
            file,
            commentId,
            permissions,
            successCallback: this.deleteFeedItem.bind(
                this,
                commentId,
                successCallback,
            ),
            errorCallback: this.deleteCommentErrorCallback.bind(
                this,
                commentId,
                errorCallback,
            ),
        });
    };

    /**
     * Error callback for deleting a comment
     *
     * @param {string} commentId - the comment id
     * @param {Function} errorCallback - the error callback
     * @return {void}
     */
    deleteCommentErrorCallback = (
        commentId: string,
        errorCallback: Function,
    ) => {
        this.updateFeedItem(
            this.createFeedError(messages.commentDeleteErrorMessage),
            commentId,
        );
        if (!this.isDestroyed()) {
            errorCallback();
        }
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
        errorCallback: Function,
    ): void {
        if (!file) {
            throw getBadItemError();
        }

        const assignmentPromises = [];
        assignees.forEach((assignee: SelectorItem) => {
            // Create a promise for each assignment
            assignmentPromises.push(
                this.createTaskAssignment(file, task, assignee, errorCallback),
            );
        });

        Promise.all(assignmentPromises).then(
            (taskAssignments: Array<TaskAssignment>) => {
                const formattedTask = this.appendAssignmentsToTask(
                    task,
                    taskAssignments,
                );
                this.updateFeedItem(
                    {
                        ...formattedTask,
                        isPending: false,
                    },
                    id,
                );
                successCallback(task);
            },
            errorCallback,
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
        dueAt: string,
        successCallback: Function,
        errorCallback: Function,
    ): void => {
        if (!file.id) {
            throw getBadItemError();
        }

        this.id = file.id;
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
            resolution_state: TASK_INCOMPLETE,
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
                this.createTaskSuccessCallback(
                    file,
                    uuid,
                    taskData,
                    assignees,
                    successCallback,
                    errorCallback,
                );
            },
            errorCallback: () => {
                this.updateFeedItem(
                    this.createFeedError(messages.taskCreateErrorMessage),
                    uuid,
                );
                errorCallback();
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
    createTaskAssignment(
        file: BoxItem,
        task: Task,
        assignee: SelectorItem,
        errorCallback: Function,
    ): Promise<TaskAssignment> {
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
                errorCallback: e => {
                    this.createTaskAssignmentErrorCallback(
                        e,
                        file,
                        task,
                        errorCallback,
                    );
                    reject();
                },
            });
        });
    }

    /**
     * Handles a failed task assignment create
     *
     * @param {Object} e - The axios error
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {Task} task - The task for which the assignment create failed
     * @param {Function} errorCallback - Passed in error callback
     * @return {void}
     */
    createTaskAssignmentErrorCallback(
        e: $AxiosXHR<any>,
        file: BoxItem,
        task: Task,
        errorCallback: Function,
    ) {
        this.errorCallback(e);
        errorCallback(e);
        // Attempt to delete the task due to it's bad assignment
        this.deleteTask(file, task.id);
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
        errorCallback: (e: $AxiosXHR<any>, taskId: string) => void = noop,
    ) => {
        if (!file.id) {
            throw getBadItemError();
        }

        this.id = file.id;
        this.tasksAPI = new TasksAPI(this.options);
        this.updateFeedItem({ isPending: true }, taskId);

        this.tasksAPI.deleteTask({
            file,
            taskId,
            successCallback: this.deleteFeedItem.bind(
                this,
                taskId,
                successCallback,
            ),
            errorCallback: (e: $AxiosXHR<any>) => {
                this.errorCallback(e);
                if (!this.isDestroyed()) {
                    errorCallback(e, taskId);
                }
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
            const feedItems = cachedItems.items.filter(
                feedItem => feedItem.id !== id,
            );
            this.setCachedItems(this.id, feedItems);

            if (!this.isDestroyed()) {
                successCallback(id);
            }
        }
    };

    /**
     * Network error callback
     *
     * @param {Error} error - Axios error object
     * @return {void}
     */
    errorCallback = (error: $AxiosXHR<any>): void => {
        console.error(error); // eslint-disable-line no-console
        this.hasError = true;
    };

    /**
     * Fetches the task assignments for each task
     *
     * @param {Array} tasksWithoutAssignments - Box tasks
     * @return {Promise}
     */
    fetchTaskAssignments(tasksWithoutAssignments: Tasks): Promise<?Tasks> {
        const requestData = {
            params: {
                fields: TASK_ASSIGNMENTS_FIELDS_TO_FETCH.toString(),
            },
        };
        const { entries } = tasksWithoutAssignments;
        const assignmentPromises = entries.map(
            (task: Task) =>
                new Promise(resolve => {
                    const tasksAPI = new TasksAPI(this.options);
                    this.taskAssignmentsAPI.push(tasksAPI);
                    tasksAPI.getAssignments(
                        this.id,
                        task.id,
                        assignments => {
                            const formattedTask = this.appendAssignmentsToTask(
                                task,
                                assignments.entries,
                            );
                            resolve(formattedTask);
                        },
                        this.fetchFeedItemErrorCallback.bind(this, resolve),
                        requestData,
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
    appendAssignmentsToTask(
        task: Task,
        assignments: Array<TaskAssignment>,
    ): Task {
        if (!assignments) {
            return task;
        }

        task.task_assignment_collection.entries = assignments.map(
            taskAssignment => {
                const {
                    id,
                    assigned_to,
                    message,
                    resolution_state,
                } = taskAssignment;
                return {
                    type: TASK_ASSIGNMENT,
                    id,
                    assigned_to,
                    message,
                    resolution_state: message
                        ? message.toLowerCase()
                        : resolution_state,
                };
            },
        );

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
    addPendingItem = (
        id: string,
        currentUser: User,
        itemBase: Object,
    ): Comment | Task | BoxItemVersion => {
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
    createCommentSuccessCallback = (
        commentData: Comment,
        id: string,
        successCallback: Function,
    ): void => {
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
     * Callback for successful creation of a Comment.
     *
     * @param {Object} e - The axios error
     * @param {string} id - ID of the feed item to update
     * @param {Function} errorCallback - the error callback
     * @return {void}
     */
    createCommentErrorCallback = (
        e: $AxiosXHR<any>,
        id: string,
        errorCallback: Function,
    ) => {
        const errorMessage =
            e.status === CONFLICT_CODE
                ? messages.commentCreateConflictMessage
                : messages.commentCreateErrorMessage;
        this.updateFeedItem(this.createFeedError(errorMessage), id);
        if (!this.isDestroyed()) {
            errorCallback(e);
        }
    };

    /**
     * Constructs an error object that renders to an inline feed error
     *
     * @param {string} message - The error message body.
     * @param {string} title - The error message title.
     * @return {Object} An error message object
     */
    createFeedError(message: string, title?: string = messages.errorOccured) {
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
            const updatedFeedItems = cachedItems.items.map(
                (item: Comment | Task | BoxItemVersion) => {
                    if (item.id === id) {
                        return {
                            ...item,
                            ...updates,
                        };
                    }

                    return item;
                },
            );

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
        errorCallback: Function,
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
                this.createCommentSuccessCallback(
                    comment,
                    uuid,
                    successCallback,
                );
            },
            errorCallback: (e: $AxiosXHR<any>) => {
                this.createCommentErrorCallback(e, uuid, errorCallback);
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
            const restoredVersion = versions.entries.find(
                (version: BoxItemVersion) => version.id === restoredFromId,
            );
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
