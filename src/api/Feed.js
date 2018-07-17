/**
 * @flow
 * @file Helper for the box versions API
 * @author Box
 */
import type { $AxiosXHR } from 'axios';
import uniqueId from 'lodash/uniqueId';
import noop from 'lodash/noop';
import Base from './Base';
import {
    COMMENTS_FIELDS_TO_FETCH,
    TASKS_FIELDS_TO_FETCH,
    VERSIONS_FIELDS_TO_FETCH,
    TASK_ASSIGNMENTS_FIELDS_TO_FETCH
} from '../util/fields';
import CommentsAPI from './Comments';
import VersionsAPI from './Versions';
import TasksAPI from './Tasks';
import TaskAssignmentsAPI from './TaskAssignments';
import { getBadItemError } from '../util/error';
import messages from '../components/messages';

const DEFAULT_START = 0;
const DEFAULT_END = 1000;
const VERSION_RESTORE_ACTION = 'restore';
const TASK_INCOMPLETE = 'incomplete';

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
        return `feedItems_${id}`;
    }

    getCachedItems(id: string): ?FeedItems {
        const cache = this.getCache();
        const cacheKey = this.getCacheKey(id);
        const feedItems: FeedItems = cache.get(cacheKey);
        return feedItems;
    }

    setCachedItems(id: string, items: FeedItems) {
        const cache = this.getCache();
        const cacheKey = this.getCacheKey(id);
        cache.set(cacheKey, items);
    }

    /**
     *
     * @param {string} id - File id
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     */
    feedItems(id: string, successCallback: Function, errorCallback: Function): void {
        const cachedItems: ?FeedItems = this.getCachedItems(id);
        if (cachedItems) {
            successCallback(cachedItems);
            return;
        }

        this.id = id;
        this.hasError = false;
        const comments = this.fetchComments();
        const versions = this.fetchVersions();
        const tasks = this.fetchTasks();

        Promise.all([comments, versions, tasks]).then((feedItems: Array<?Comments | ?Tasks | ?FileVersions>) => {
            const sortedFeedItems = this.sortFeedItems.apply(null, feedItems);
            this.setCachedItems(id, sortedFeedItems);
            if (!this.isDestroyed()) {
                if (this.hasError) {
                    errorCallback(sortedFeedItems);
                } else {
                    successCallback(sortedFeedItems);
                }
            }
        });
    }

    /**
     * Sort valid feed items, descending by created_at time.
     *
     * @param {Array<?Comments | ?Tasks | ?FileVersions>} args - Arguments list of each item container
     * type that is allowed in the feed.
     */
    sortFeedItems(...args: Array<?Comments | ?Tasks | ?FileVersions>): FeedItems {
        const feedItems = [];
        args.forEach((itemContainer) => {
            if (itemContainer) {
                feedItems.push(...itemContainer.entries);
            }
        });
        return feedItems.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
    }

    /**
     * Fetches the comments for a file
     *
     * @private
     * @return {Promise} the file comments
     */
    fetchComments(): Promise<?Comments> {
        if (this.commentsAPI) {
            this.commentsAPI.destroy();
        }

        this.commentsAPI = new CommentsAPI(this.options);
        return new Promise((resolve) => {
            this.commentsAPI.offsetGet(
                this.id,
                resolve,
                (err) => {
                    this.errorCallback(err);
                    resolve();
                },
                DEFAULT_START,
                DEFAULT_END,
                COMMENTS_FIELDS_TO_FETCH,
                true
            );
        });
    }

    /**
     * Fetches the versions for a file
     *
     * @private
     * @return {Promise} the file versions
     */
    fetchVersions(): Promise<?FileVersions> {
        if (this.versionsAPI) {
            this.versionsAPI.destroy();
        }

        this.versionsAPI = new VersionsAPI(this.options);
        return new Promise((resolve) => {
            this.versionsAPI.offsetGet(
                this.id,
                resolve,
                (err) => {
                    this.errorCallback(err);
                    resolve();
                },
                DEFAULT_START,
                DEFAULT_END,
                VERSIONS_FIELDS_TO_FETCH,
                true
            );
        });
    }

    /**
     * Fetches the tasks for a file
     *
     * @private
     * @param {string} id - File id
     * @return {Promise} the tasks with assignments
     */
    fetchTasks(): Promise<?Tasks> {
        if (this.tasksAPI) {
            this.tasksAPI.destroy();
        }

        this.tasksAPI = new TasksAPI(this.options);
        const requestData = {
            params: {
                fields: TASKS_FIELDS_TO_FETCH.toString()
            }
        };

        return new Promise((resolve) => {
            this.tasksAPI.get({
                id: this.id,
                successCallback: (tasks) => {
                    this.fetchTaskAssignments(tasks).then(resolve);
                },
                errorCallback: (err) => {
                    this.errorCallback(err);
                    resolve();
                },
                params: requestData
            });
        });
    }

    /**
     * Updates a task assignment via the API.
     *
     * @param {string} taskId - ID of task to be updated
     * @param {string} taskAssignmentId - Task assignment ID
     * @param {string} status - New task assignment status
     * @return {void}
     */
    updateTaskAssignment = (
        file: BoxItem,
        taskId: string,
        taskAssignmentId: string,
        resolutionState: string,
        message: string,
        successCallback: Function,
        errorCallback: Function
    ): void => {
        if (!file || !file.id) {
            throw getBadItemError();
        }

        this.id = file.id;
        const feedItems = this.getCachedItems(this.id);
        if (feedItems) {
            const taskAssignmentsAPI = new TaskAssignmentsAPI(this.options);

            taskAssignmentsAPI.updateTaskAssignment({
                file,
                taskAssignmentId,
                resolutionState,
                message,
                successCallback: this.updateTaskAssignmentSuccessCallback,
                errorCallback: (e: $AxiosXHR<any>) => {
                    errorCallback(e);
                    this.errorCallback(e);
                }
            });
        }
    };

    /**
     * Updates the task assignment state of the updated task
     *
     * @param {Task} task - Box task
     * @param {TaskAssignment} updatedAssignment - New task assignment from API
     * @return {void}
     */
    updateTaskAssignmentSuccessCallback = (task: Task, updatedAssignment: TaskAssignment) => {
        const { entries, total_count } = task.task_assignment_collection;

        const assignments = entries.map((item: TaskAssignment) => {
            if (item.id === updatedAssignment.id) {
                return {
                    ...item,
                    ...updatedAssignment,
                    resolution_state: updatedAssignment.message.toLowerCase()
                };
            }

            return item;
        });

        this.updateFeedItem(
            {
                task_assignment_collection: {
                    entries: assignments,
                    total_count
                }
            },
            task.id
        );
    };

    /**
     * Deletes a comment.
     *
     * @param {string} id - Comment ID
     * @param {BoxItemPermission} permissions - Permissions for the comment
     * @return {void}
     */
    deleteComment = ({
        file,
        commentId,
        permissions,
        successCallback,
        errorCallback
    }: {
        file: BoxItem,
        commentId: string,
        permissions: BoxItemPermission,
        successCallback: Function,
        errorCallback: Function
    }): void => {
        this.updateFeedItem({ isPending: true }, commentId);
        this.commentsAPI = new CommentsAPI(this.options);
        if (!file || !file.id) {
            throw getBadItemError();
        }

        const fileId = file.id;

        this.commentsAPI.deleteComment({
            file,
            commentId,
            permissions,
            successCallback: () => {
                this.deleteCommentSuccessCallback(fileId, commentId);
                if (!this.isDestroyed()) {
                    successCallback();
                }
            },
            errorCallback: () => {
                this.deleteCommentErrorCallback(commentId);
                if (!this.isDestroyed()) {
                    errorCallback();
                }
            }
        });
    };

    deleteCommentSuccessCallback = (fileId: string, commentId: string) => {
        this.deleteFeedItem(fileId, commentId);
    };

    deleteCommentErrorCallback = (commentId: string) => {
        this.updateFeedItem(this.createFeedError(messages.commentDeleteErrorMessage), commentId);
    };

    /**
     * Callback for successful creation of a Task.
     *
     * @param {Task} task - API returned task
     * @param {string} id - ID of the feed item to update with the new task data
     * @return {void}
     */

    createTaskSuccessCallback(
        file: BoxItem,
        id: string,
        task: Task,
        assignees: SelectorItems,
        successCallback: Function,
        errorCallback: Function
    ): Promise<any> {
        if (!file) {
            throw getBadItemError();
        }

        const assignmentPromises = [];
        assignees.forEach((assignee: SelectorItem) => {
            // Create a promise for each assignment
            assignmentPromises.push(this.createTaskAssignment(file, task, assignee, errorCallback));
        });

        return Promise.all(assignmentPromises).then((taskAssignments: Array<TaskAssignment>) => {
            const formattedTask = this.appendAssignmentsToTask(task, taskAssignments);
            this.updateFeedItem(
                {
                    ...formattedTask,
                    isPending: false
                },
                id
            );

            successCallback(task);
        });
    }

    /**
     * Creates a task.
     *
     * @param {string} text - Task text
     * @param {Array} assignees - List of assignees
     * @param {number} dueAt - Task's due date
     * @return {void}
     */
    createTask = (
        file: BoxItem,
        currentUser: User,
        message: string,
        assignees: SelectorItems,
        dueAt: string,
        successCallback: Function,
        errorCallback: Function
    ): void => {
        if (!file || !file.id) {
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
                name: assignee.name
            },
            resolution_state: TASK_INCOMPLETE
        }));

        const task = {
            due_at: dueAtString,
            id: uuid,
            is_completed: false,
            message,
            task_assignment_collection: {
                entries: pendingAssignees,
                total_count: pendingAssignees.length
            },
            type: 'task'
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
            errorCallback: () => {
                this.updateFeedItem(this.createFeedError(messages.taskCreateErrorMessage), uuid);
                errorCallback();
            }
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
        errorCallback: Function
    ): Promise<TaskAssignment> {
        if (!file || !file.id) {
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
                errorCallback: (e) => {
                    this.createTaskAssignmentErrorCallback(e, task, errorCallback);
                    reject();
                }
            });
        });
    }

    /**
     * Handles a failed task assignment create
     *
     * @param {Task} task - The task for which the assignment create failed
     * @param {Task} e - The API error
     * @param {Function} errorCallback - Passed in error callback
     * @return {void}
     */
    createTaskAssignmentErrorCallback(e: $AxiosXHR<any>, task: Task, errorCallback: Function) {
        this.errorCallback(e);
        errorCallback(e);
        // Attempt to delete the task due to it's bad assignment
        this.deleteTask(task.id);
    }

    /**
     * Deletes a task
     *
     * @private
     * @param {string} taskId - The task's id
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    deleteTask = (
        file: BoxItem,
        taskId: string,
        successCallback: (taskId: string) => void = noop,
        errorCallback: (e: $AxiosXHR<any>, taskId: string) => void = noop
    ) => {
        if (!file || !file.id) {
            throw getBadItemError();
        }

        this.id = file.id;
        this.tasksAPI = new TasksAPI(this.options);

        this.tasksAPI.deleteTask({
            file,
            taskId,
            successCallback: () => {
                successCallback(taskId);
                this.deleteTaskSuccessCallback(taskId);
            },
            errorCallback: (e: $AxiosXHR<any>) => {
                errorCallback(e, taskId);
                this.errorCallback(e);
            }
        });
    };

    /**
     * Task update success callback
     *
     * @private
     * @param {Object} task - Box task
     * @return {void}
     */
    deleteTaskSuccessCallback = (taskId: string) => {
        this.deleteFeedItem(this.id, taskId);
    };

    /**
     * Deletes a feed item from the state.
     *
     * @param {Object} item - The item to be deleted
     */
    deleteFeedItem = (fileId: string, id: string) => {
        this.id = fileId;
        const cachedItems = this.getCachedItems(this.id);
        if (cachedItems) {
            const feedItems = cachedItems.filter((feedItem) => feedItem.id !== id);
            this.setCachedItems(this.id, feedItems);
        }
    };

    /**
     * Network error callback
     *
     * @private
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
     * @private
     * @param {Array} tasksWithoutAssignments - Box tasks
     * @return {Promise}
     */
    async fetchTaskAssignments(tasksWithoutAssignments: Tasks): Promise<?Tasks> {
        this.destroyTaskAssignments();

        const requestData = {
            params: {
                fields: TASK_ASSIGNMENTS_FIELDS_TO_FETCH.toString()
            }
        };
        const { entries } = tasksWithoutAssignments;
        const assignmentPromises = entries.map(
            (task: Task) =>
                new Promise((resolve) => {
                    const tasksAPI = new TasksAPI(this.options);
                    this.taskAssignmentsAPI.push(tasksAPI);
                    tasksAPI.getAssignments(
                        this.id,
                        task.id,
                        (assignments) => {
                            const formattedTask = this.appendAssignmentsToTask(task, assignments.entries);
                            resolve(formattedTask);
                        },
                        (err) => {
                            this.errorCallback(err);
                            resolve();
                        },
                        requestData
                    );
                })
        );

        const formattedTasks: Tasks = { total_count: 0, entries: [] };
        const assignments = await Promise.all(assignmentPromises);
        assignments.forEach((task) => {
            if (task) {
                formattedTasks.entries.push(task);
                formattedTasks.total_count += 1;
            }
        });

        return formattedTasks;
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

        task.task_assignment_collection.entries = assignments.map((taskAssignment) => {
            const { id, assigned_to, message, resolution_state } = taskAssignment;
            return {
                type: 'task_assignment',
                id,
                assigned_to,
                message,
                resolution_state: message ? message.toLowerCase() : resolution_state
            };
        });

        // Increment the assignment collection count by the number of new assignments
        task.task_assignment_collection.total_count += assignments.length;
        return task;
    }

    /**
     * Add a placeholder pending feed item.
     *
     * @param {Object} itemBase - Base properties for item to be added to the feed as pending.
     * @return {void}
     */
    addPendingItem = (id: string, currentUser: User, itemBase: Object): void => {
        const date = new Date().toISOString();
        const pendingFeedItem = {
            created_at: date,
            created_by: currentUser,
            modified_at: date,
            isPending: true,
            ...itemBase
        };
        const feedItems = this.getCachedItems(id) || [];
        const feedItemsWithPedingItem = [pendingFeedItem, ...feedItems];
        this.setCachedItems(id, feedItemsWithPedingItem);
    };

    /**
     * Callback for successful creation of a Comment.
     *
     * @param {Comment} commentData - API returned Comment
     * @param {string} id - ID of the feed item to update with the new comment data
     * @return {void}
     */
    createCommentSuccessCallback = (commentData: Comment, id: string): void => {
        const { message = '', tagged_message = '' } = commentData;
        // Comment component uses tagged_message only
        commentData.tagged_message = tagged_message || message;

        this.updateFeedItem(
            {
                ...commentData,
                isPending: false
            },
            id
        );
    };
    /**
     *  Constructs an error object that renders to an inline feed error
     *
     * @param {string} message - The error message body.
     * @param {string} title - The error message title.

     * @return {Object} An error message object
     */
    createFeedError(message: string, title?: string = messages.errorOccured) {
        return {
            error: { message, title }
        };
    }

    /**
     * Replace a feed item with new feed item data.
     * @param {Object} updates - The new data to be applied to the feed item.
     * @param {string} id - ID of the feed item to replace.
     * @return {void}
     */
    updateFeedItem = (updates: Object, id: string): void => {
        if (!this.id) {
            throw new Error('Missing cache id');
        }

        const feedItems = this.getCachedItems(this.id);

        if (feedItems) {
            const updatedFeedItems = feedItems.map((item: Comment | Task | BoxItemVersion) => {
                if (item.id === id) {
                    return {
                        ...item,
                        ...updates
                    };
                }

                return item;
            });

            this.setCachedItems(this.id, updatedFeedItems);
        }
    };

    /**
     * Create a comment, and make a pending item to be replaced once the API is successful.
     *
     * @param {any} args - Data returned by the Comment component on comment creation.
     * @return {void}
     */
    createComment = (
        file: BoxItem,
        currentUser: User,
        text: string,
        hasMention: boolean,
        successCallback: Function,
        errorCallback: Function
    ): void => {
        const uuid = uniqueId('comment_');
        const commentData = {
            id: uuid,
            tagged_message: text,
            type: 'comment'
        };

        if (!file || !file.id) {
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
                this.createCommentSuccessCallback(comment, uuid);
                if (!this.isDestroyed()) {
                    successCallback(comment);
                }
            },
            errorCallback: (e: $AxiosXHR<any>) => {
                const errorMessage =
                    e.status === 409 ? messages.commentCreateConflictMessage : messages.commentCreateErrorMessage;
                this.updateFeedItem(this.createFeedError(errorMessage), uuid);
                if (!this.isDestroyed()) {
                    errorCallback(e);
                }
            }
        });
    };

    /**
     * Destroys all the task assignment API's
     *
     * @private
     * @return {void}
     */
    destroyTaskAssignments() {
        if (Array.isArray(this.taskAssignmentsAPI)) {
            this.taskAssignmentsAPI.forEach((api) => api.destroy());
            this.taskAssignmentsAPI = [];
        }
    }

    /**
     * Destroys all the task feed API's
     *
     * @private
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
