/**
 * @flow
 * @file Helper for activity feed API's
 * @author Box
 */
import uniqueId from 'lodash/uniqueId';
import noop from 'lodash/noop';
import omit from 'lodash/omit';
import type { MessageDescriptor } from 'react-intl';
import { getBadItemError, getBadUserError, isUserCorrectableError } from '../utils/error';
import messages from '../elements/common/messages';
import { sortFeedItems } from '../utils/sorter';
import Base from './Base';
import CommentsAPI from './Comments';
import VersionsAPI from './Versions';
import TasksAPI from './tasks/Tasks';
import TasksNewAPI from './tasks/TasksNew';
import TaskCollaboratorsAPI from './tasks/TaskCollaborators';
import TaskLinksAPI from './tasks/TaskLinks';
import TaskAssignmentsAPI from './tasks/TaskAssignments';
import AppActivityAPI from './AppActivity';
import {
    ERROR_CODE_CREATE_TASK,
    ERROR_CODE_CREATE_TASK_ASSIGNMENT,
    HTTP_STATUS_CODE_CONFLICT,
    IS_ERROR_DISPLAYED,
    TASK_INCOMPLETE,
    TASK_NEW_APPROVED,
    TASK_NEW_COMPLETED,
    TASK_NEW_REJECTED,
    TASK_NEW_NOT_STARTED,
    TYPED_ID_FEED_PREFIX,
} from '../constants';

const TASK_NEW_INITIAL_STATUS = TASK_NEW_NOT_STARTED;
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
     * @property {BoxItem}
     */
    file: BoxItem;

    /**
     * @property {boolean}
     */
    hasError: boolean;

    constructor(options: Options) {
        super(options);
        this.taskAssignmentsAPI = [];
        this.taskCollaboratorsAPI = [];
        this.taskLinksAPI = [];
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
     * @param {boolean} shouldShowNewTasks - feature flip the new tasks api
     * @param {boolean} shouldShowAppActivity - feature flip the new app activity api
     */
    feedItems(
        file: BoxItem,
        shouldRefreshCache: boolean,
        successCallback: Function,
        errorCallback: (feedItems: FeedItems) => void,
        onError: ErrorCallback,
        shouldShowNewTasks?: boolean = false, // TODO: could the class understand feature flips natively instead?
        shouldShowAppActivity?: boolean = false,
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

        this.file = file;
        this.hasError = false;
        this.errorCallback = onError;
        const versionsPromise = this.fetchVersions();
        const currentVersionPromise = this.fetchCurrentVersion();
        const commentsPromise = this.fetchComments(permissions);
        const tasksPromise = shouldShowNewTasks ? this.fetchTasksNew() : this.fetchTasks();
        const appActivityPromise = shouldShowAppActivity ? this.fetchAppActivity(permissions) : Promise.resolve();

        Promise.all([versionsPromise, currentVersionPromise, commentsPromise, tasksPromise, appActivityPromise]).then(
            ([versions: ?FileVersions, currentVersion: ?BoxItemVersion, ...feedItems]) => {
                const versionsWithCurrent = this.versionsAPI.addCurrentVersion(currentVersion, versions, this.file);
                const sortedFeedItems = sortFeedItems(versionsWithCurrent, ...feedItems);
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
     * Fetches the versions for a file
     *
     * @return {Promise} - the file versions
     */
    fetchVersions(): Promise<?FileVersions> {
        this.versionsAPI = new VersionsAPI(this.options);

        return new Promise(resolve => {
            this.versionsAPI.getVersions(this.file.id, resolve, this.fetchFeedItemErrorCallback.bind(this, resolve));
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
            this.versionsAPI.getCurrentVersion(
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
    fetchTasks(): Promise<?Tasks> {
        this.tasksAPI = new TasksAPI(this.options);

        return new Promise(resolve => {
            this.tasksAPI.getTasks(
                this.file.id,
                tasks => {
                    this.fetchTaskAssignments(tasks).then(resolve);
                },
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

        this.file = file;
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
        const cachedItems = this.getCachedItems(this.file.id);
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

        this.file = file;
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
     * Updates a task in the new API
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {string} task - The update task payload object
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    updateTaskNew = (
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
        this.tasksNewAPI.updateTask({
            file,
            task,
            successCallback: (taskData: Task) => {
                this.updateFeedItem(
                    {
                        ...taskData,
                        isPending: false,
                    },
                    task.id,
                );
                if (!this.isDestroyed()) {
                    successCallback();
                }
            },
            errorCallback: (e: ElementsXhrError, code: string) => {
                this.updateFeedItem({ isPending: false }, task.id);
                this.feedErrorCallback(false, e, code);
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

        this.file = file;
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
        this.addPendingItem(this.file.id, currentUser, task);
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
        assignees: SelectorItems,
        taskType: TaskType,
        dueAt: ?string,
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
            created_at: new Date().toISOString(),
            due_at: dueAtString,
            id: uuid,
            description: message,
            type: TASK,
            assigned_to: {
                entries: assignees.map((assignee: SelectorItem) => ({
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

        const taskPayload: TaskPayload = { description: message, due_at: dueAtString, task_type: taskType };

        this.tasksNewAPI = new TasksNewAPI(this.options);
        this.tasksNewAPI.createTask({
            file,
            task: taskPayload,
            successCallback: (taskData: Task) => {
                this.addPendingItem(this.file.id, currentUser, pendingTask);
                this.createTaskNewSuccessCallback(file, uuid, taskData, assignees, successCallback, errorCallback);
            },
            errorCallback: (e: ElementsXhrError, code: string) => {
                this.feedErrorCallback(false, e, code);
            },
        });
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
    async createTaskNewSuccessCallback(
        file: BoxItem,
        id: string,
        task: Task,
        assignees: SelectorItems,
        successCallback: Function,
        errorCallback: ErrorCallback,
    ) {
        if (!file) {
            throw getBadItemError();
        }
        this.errorCallback = errorCallback;

        try {
            const taskLink = await this.createTaskLink(file, task);
            const taskAssignments: Array<TaskCollabAssignee> = await Promise.all(
                assignees.map((assignee: SelectorItem) => {
                    return this.createTaskCollaborator(file, task, assignee);
                }),
            );

            this.updateFeedItem(
                {
                    ...task,
                    task_links: {
                        entries: [taskLink],
                        next_marker: null,
                        limit: 1,
                    },
                    assigned_to: {
                        entries: taskAssignments,
                        next_marker: null,
                        limit: taskAssignments.length,
                    },
                    isPending: false,
                },
                id,
            );
            successCallback(task);
        } catch (err) {
            this.feedErrorCallback(false, err, ERROR_CODE_CREATE_TASK);
        }
    }

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

        this.file = file;
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
     * Creates a task collaborator via the API.
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {Task} task - The newly created task from the API
     * @param {SelectorItem} assignee - The user assigned to this task
     * @param {Function} errorCallback - Task create error callback
     * @return {Promise<TaskAssignment}
     */
    createTaskCollaborator(file: BoxItem, task: Task, assignee: SelectorItem): Promise<TaskCollabAssignee> {
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

        this.file = file;
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
                        this.file.id,
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
    createFeedError(message: MessageDescriptor, title: MessageDescriptor = messages.errorOccured) {
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

        if (this.appActivityAPI) {
            this.appActivityAPI.destroy();
            delete this.appActivityAPI;
        }

        if (this.tasksNewAPI) {
            this.tasksNewAPI.destroy();
            delete this.tasksNewAPI;
        }

        this.destroyTaskAssignments();
        this.destroyTaskCollaborators();
        this.destroyTaskLinks();
    }
}

export default Feed;
