/**
 * @flow
 * @file Helper for activity feed API's
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
const TASK_INCOMPLETE = 'incomplete';
const VERSION_RESTORE_ACTION = 'restore';

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

    /**
     * Gets the items from the cache
     *
     * @private
     * @param {string} id the cache id
     */
    getCachedItems(id: string): ?FeedItems {
        const cache = this.getCache();
        const cacheKey = this.getCacheKey(id);
        const feedItems: FeedItems = cache.get(cacheKey);
        return feedItems;
    }

    /**
     * Sets the items in the cache
     *
     * @private
     * @param {string} id - the cache id
     * @param {Array} items - the feed items to cache
     */
    setCachedItems(id: string, items: FeedItems) {
        const cache = this.getCache();
        const cacheKey = this.getCacheKey(id);
        cache.set(cacheKey, items);
    }

    /**
     * Gets the feed items
     *
     * @private
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     */
    feedItems(file: BoxItem, successCallback: Function, errorCallback: Function): void {
        const { id } = file;

        if (!id) {
            throw getBadItemError();
        }

        const cachedItems: ?FeedItems = this.getCachedItems(id);
        if (cachedItems) {
            successCallback(cachedItems);
            return;
        }

        this.id = id;
        this.hasError = false;
        const versionsPromise = this.fetchVersions();
        const commentsPromise = this.fetchComments();
        const tasksPromise = this.fetchTasks();

        Promise.all([versionsPromise, commentsPromise, tasksPromise]).then((feedItems) => {
            const versions: ?FileVersions = feedItems[0];
            const versionsWithRestoredVersion = this.addRestoredVersion(file, versions);
            const unsortedFeedItems = [versionsWithRestoredVersion, ...feedItems.slice(1)];
            const sortedFeedItems = this.sortFeedItems.apply(null, unsortedFeedItems);
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
     * @private
     * @param {Array<?Comments | ?Tasks | ?FileVersions>} args - Arguments list of each item container
     * type that is allowed in the feed.
     * @return {Array<?Comments | ?Tasks | ?FileVersions>} the sorted feed items
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
     * @return {Promise} - the file comments
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
     * @return {Promise} - the file versions
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
     * @return {Promise} - the feed items
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
     * Updates a task assignment
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {string} taskId - ID of task to be updated
     * @param {string} taskAssignmentId - Task assignment ID
     * @param {string} resolutionState - New task assignment status
     * @param {string} message - the message to the assignee
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
        errorCallback: Function
    ): void => {
        if (!file.id) {
            throw getBadItemError();
        }

        this.id = file.id;
        this.updateFeedItem({ isPending: true }, taskId);
        const taskAssignmentsAPI = new TaskAssignmentsAPI(this.options);
        taskAssignmentsAPI.updateTaskAssignment({
            file,
            taskAssignmentId,
            resolutionState,
            message,
            successCallback: (taskAssignment: TaskAssignment) => {
                this.updateTaskAssignmentSuccessCallback(taskId, taskAssignment, successCallback);
            },
            errorCallback: (e: $AxiosXHR<any>) => {
                errorCallback(e);
                this.errorCallback(e);
            }
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
        successCallback: Function
    ): void => {
        const feedItems = this.getCachedItems(this.id);
        if (feedItems) {
            // $FlowFixMe
            const task: ?Task = feedItems.find((item) => item.type === 'task' && item.id === taskId);
            if (task) {
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
                        },
                        isPending: false
                    },
                    taskId
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
     * @param {string} dueAt - The date the task is due
     * @return {void}
     */
    updateTask = (
        file: BoxItem,
        taskId: string,
        message: string,
        successCallback: (task: Task) => void = noop,
        errorCallback: (e: $AxiosXHR<any>) => void = noop,
        dueAt?: string
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
                this.updateFeedItem(
                    {
                        ...task,
                        isPending: false
                    },
                    task.id
                );
                if (!this.isDestroyed()) {
                    successCallback(task);
                }
            },
            errorCallback: (e: $AxiosXHR<any>) => {
                this.errorCallback(e);
                if (!this.isDestroyed()) {
                    errorCallback(e);
                }
            }
        });
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
        errorCallback: Function
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
            successCallback: () => {
                this.deleteFeedItemSuccessCallback(commentId);
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

    /**
     * Error callback for deleting a comment
     *
     * @private
     * @param {string} commentId - the comment id
     * @return {void}
     */
    deleteCommentErrorCallback = (commentId: string) => {
        this.updateFeedItem(this.createFeedError(messages.commentDeleteErrorMessage), commentId);
    };

    /**
     * Callback for successful creation of a Task. Creates a task assignment
     *
     * @private
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
        errorCallback: Function
    ): void {
        if (!file) {
            throw getBadItemError();
        }

        const assignmentPromises = [];
        assignees.forEach((assignee: SelectorItem) => {
            // Create a promise for each assignment
            assignmentPromises.push(this.createTaskAssignment(file, task, assignee, errorCallback));
        });

        Promise.all(assignmentPromises).then((taskAssignments: Array<TaskAssignment>) => {
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
        errorCallback: Function
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
                errorCallback: (e) => {
                    this.createTaskAssignmentErrorCallback(e, file, task, errorCallback);
                    reject();
                }
            });
        });
    }

    /**
     * Handles a failed task assignment create
     *
     * @private
     * @param {Object} e - The axios error
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {Task} task - The task for which the assignment create failed
     * @param {Function} errorCallback - Passed in error callback
     * @return {void}
     */
    createTaskAssignmentErrorCallback(e: $AxiosXHR<any>, file: BoxItem, task: Task, errorCallback: Function) {
        this.errorCallback(e);
        errorCallback(e);
        // Attempt to delete the task due to it's bad assignment
        this.deleteTask(file, task.id);
    }

    /**
     * Deletes a task
     *
     * @private
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
        errorCallback: (e: $AxiosXHR<any>, taskId: string) => void = noop
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
            successCallback: () => {
                this.deleteFeedItemSuccessCallback(taskId);
                if (!this.isDestroyed()) {
                    successCallback(taskId);
                }
            },
            errorCallback: (e: $AxiosXHR<any>) => {
                this.errorCallback(e);
                if (!this.isDestroyed()) {
                    errorCallback(e, taskId);
                }
            }
        });
    };

    /**
     * Feed item delete success callback
     *
     * @private
     * @param {string} id - the feed items id
     * @return {void}
     */
    deleteFeedItemSuccessCallback = (id: string) => {
        this.deleteFeedItem(this.id, id);
    };

    /**
     * Deletes a feed item from the cache
     *
     * @param {string} fileId - the file id
     * @param {string} id - The id of the feed item to be deleted
     * @param {string} type - the type of the feed item to be deleted
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
     * @private
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
     * @private
     * @param {string} id - the feed item's id
     * @param {Object} currentUser - the user who performed the action
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
     * @private
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
     * Constructs an error object that renders to an inline feed error
     * @private
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
     * @private
     * @param {Object} updates - The new data to be applied to the feed item.
     * @param {string} id - ID of the feed item to replace.
     * @return {void}
     */
    updateFeedItem = (updates: Object, id: string): void => {
        if (!this.id) {
            throw new Error('Missing file id');
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
        errorCallback: Function
    ): void => {
        const uuid = uniqueId('comment_');
        const commentData = {
            id: uuid,
            tagged_message: text,
            type: 'comment'
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
     * Adds a versions entry if the current file version was restored from a previous version
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {FileVersions} versions - API returned file versions for this file
     * @return {FileVersions} modified versions array including the version restore
     */
    addRestoredVersion(file: BoxItem, versions: ?FileVersions): ?FileVersions {
        if (!versions) {
            return undefined;
        }

        const { restored_from, modified_at, file_version } = file;
        if (restored_from && file_version) {
            const restoredVersion: ?BoxItemVersion = versions.entries.find(
                (version) => version.id === restored_from.id
            );

            if (restoredVersion) {
                versions.entries.push({
                    ...restoredVersion,
                    id: file_version.id,
                    created_at: modified_at,
                    action: VERSION_RESTORE_ACTION
                });
                versions.total_count += 1;
            }
        }

        return versions;
    }

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
