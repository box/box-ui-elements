/**
 * @flow
 * @file Content Preview Component
 * @author Box
 */

import 'regenerator-runtime/runtime';
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import uniqueid from 'lodash/uniqueId';
import getProp from 'lodash/get';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import cloneDeep from 'lodash/cloneDeep';
import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator/LoadingIndicator';
import Sidebar from './Sidebar';
import API from '../../api';
import Internationalize from '../Internationalize';
import {
    DEFAULT_HOSTNAME_API,
    CLIENT_NAME_CONTENT_SIDEBAR,
    FIELD_METADATA_SKILLS,
    DEFAULT_COLLAB_DEBOUNCE,
    DEFAULT_MAX_COLLABORATORS,
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS
} from '../../constants';
import {
    COMMENTS_FIELDS_TO_FETCH,
    TASKS_FIELDS_TO_FETCH,
    VERSIONS_FIELDS_TO_FETCH,
    TASK_ASSIGNMENTS_FIELDS_TO_FETCH
} from '../../util/fields';
import messages from '../messages';
import { getBadItemError } from '../../util/error';
import SidebarUtils from './SidebarUtils';
import type { DetailsSidebarProps } from './DetailsSidebar';
import type { ActivitySidebarProps } from './ActivitySidebar';
import '../fonts.scss';
import '../base.scss';
import '../modal.scss';
import './ContentSidebar.scss';

type Props = {
    fileId?: string,
    isCollapsed?: boolean,
    clientName: string,
    apiHost: string,
    token: Token,
    className: string,
    currentUser?: User,
    getPreviewer: Function,
    hasSkills: boolean,
    activitySidebarProps: ActivitySidebarProps,
    detailsSidebarProps: DetailsSidebarProps,
    hasMetadata: boolean,
    hasActivityFeed: boolean,
    language?: string,
    messages?: StringMap,
    cache?: APICache,
    sharedLink?: string,
    sharedLinkPassword?: string,
    requestInterceptor?: Function,
    responseInterceptor?: Function
};

type State = {
    view: SidebarView,
    file?: BoxItem,
    accessStats?: FileAccessStats,
    versions?: FileVersions,
    comments?: Comments,
    tasks?: Tasks,
    currentUser?: User,
    approverSelectorContacts?: SelectorItems,
    mentionSelectorContacts?: SelectorItems,
    fileError?: Errors,
    versionError?: Errors,
    commentsError?: Errors,
    tasksError?: Errors,
    accessStatsError?: Errors,
    currentUserError?: Errors,
    isCollapsed?: boolean
};

class ContentSidebar extends PureComponent<Props, State> {
    id: string;
    props: Props;
    state: State;
    rootElement: HTMLElement;
    appElement: HTMLElement;
    api: API;

    static defaultProps = {
        className: '',
        isCollapsed: false,
        clientName: CLIENT_NAME_CONTENT_SIDEBAR,
        apiHost: DEFAULT_HOSTNAME_API,
        getPreviewer: noop,
        currentUser: undefined,
        hasSkills: false,
        hasMetadata: false,
        hasActivityFeed: false,
        activitySidebarProps: {},
        detailsSidebarProps: {}
    };

    initialState: State = {
        view: undefined,
        file: undefined,
        accessStats: undefined,
        versions: undefined,
        comments: undefined,
        tasks: undefined,
        currentUser: undefined,
        approverSelectorContacts: undefined,
        mentionSelectorContacts: undefined,
        fileError: undefined,
        versionError: undefined,
        commentsError: undefined,
        tasksError: undefined,
        accessStatsError: undefined,
        currentUserError: undefined
    };

    /**
     * [constructor]
     *
     * @private
     * @return {ContentSidebar}
     */
    constructor(props: Props) {
        super(props);
        const {
            cache,
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            clientName,
            requestInterceptor,
            responseInterceptor,
            isCollapsed
        } = props;

        this.id = uniqueid('bcs_');
        this.api = new API({
            cache,
            token,
            sharedLink,
            sharedLinkPassword,
            apiHost,
            clientName,
            requestInterceptor,
            responseInterceptor
        });

        // Clone initial state to allow for state reset on new files
        this.state = cloneDeep({
            ...this.initialState,
            isCollapsed
        });
    }

    /**
     * Destroys api instances
     *
     * @private
     * @return {void}
     */
    clearCache(): void {
        this.api.destroy(true);
    }

    /**
     * Cleanup
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentWillUnmount() {
        this.clearCache();
    }

    /**
     * Fetches the root folder on load
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentDidMount() {
        this.rootElement = ((document.getElementById(this.id): any): HTMLElement);
        this.appElement = ((this.rootElement.firstElementChild: any): HTMLElement);

        this.fetchData(this.props);
    }

    /**
     * Called when sidebar gets new properties
     *
     * @private
     * @return {void}
     */
    componentWillReceiveProps(nextProps: Props): void {
        const { fileId, isCollapsed }: Props = this.props;
        const { file }: State = this.state;
        const hasVisibilityChanged = nextProps.isCollapsed !== isCollapsed;
        const hasFileIdChanged = nextProps.fileId !== fileId;

        if (hasFileIdChanged) {
            this.fetchData(nextProps);
        } else if (hasVisibilityChanged) {
            this.setState({
                isCollapsed: nextProps.isCollapsed,
                view: this.getDefaultSidebarView(nextProps.isCollapsed, file)
            });
        }
    }

    /**
     * Toggle the sidebar view state
     *
     * @param {string} view - the selected view
     * @return {void}
     */
    onToggle = (view: SidebarView): void => {
        this.setState({ view: view === this.state.view ? undefined : view });
    };

    /**
     * Gets the user avatar URL
     *
     * @param {string} userId the user id
     * @param {string} fileId the file id
     *
     * @return the user avatar URL string for a given user with access token attached
     */
    getAvatarUrl = async (userId: string): Promise<?string> => {
        const { fileId } = this.props;

        if (!fileId) {
            return null;
        }

        return this.api.getUsersAPI(false).getAvatarUrlWithAccessToken(userId, fileId);
    };

    /**
     * Fetches the data for the sidebar
     *
     * @param {Object} Props the component props
     * @param {boolean} hasFileIdChanged true if the file id has changed
     */
    fetchData({ fileId, hasActivityFeed, detailsSidebarProps, currentUser }: Props) {
        const { hasAccessStats = false } = detailsSidebarProps;
        if (!fileId) {
            return;
        }

        // Clear out existing state
        this.setState(cloneDeep(this.initialState));

        // Fetch the new file
        this.fetchFile(fileId);

        if (hasAccessStats) {
            this.fetchFileAccessStats(fileId);
        }

        if (hasActivityFeed) {
            this.fetchComments({
                id: fileId,
                fields: COMMENTS_FIELDS_TO_FETCH
            });
            this.fetchTasks(fileId);
            this.fetchVersions({
                id: fileId,
                fields: VERSIONS_FIELDS_TO_FETCH
            });
            this.fetchCurrentUser(currentUser);
        }
    }

    /**
     * Function to update file description
     *
     * @private
     * @param {string} newDescription - New file description
     * @return {void}
     */
    onDescriptionChange = (newDescription: string): void => {
        const { file } = this.state;
        if (!file) {
            return;
        }

        const { description, id } = file;
        if (newDescription === description || !id) {
            return;
        }

        this.api
            .getFileAPI()
            .setFileDescription(
                file,
                newDescription,
                this.setFileDescriptionSuccessCallback,
                this.setFileDescriptionErrorCallback
            );
    };

    /**
     * File update description callback
     *
     * @private
     * @param {BoxItem} file - Updated file object
     * @return {void}
     */
    setFileDescriptionSuccessCallback = (file: BoxItem): void => {
        const { onDescriptionChange = noop } = this.props.detailsSidebarProps;
        onDescriptionChange(file);

        this.setState({ file, fileError: undefined });
    };

    /**
     * Handles a failed file description update
     *
     * @private
     * @param {Error} e - API error
     * @param {BoxItem} file - Original file description
     * @return {void}
     */
    setFileDescriptionErrorCallback = (e: Error, file: BoxItem): void => {
        // Reset the state back to the original description since the API call failed
        this.setState({
            file,
            fileError: {
                inlineError: {
                    title: messages.fileDescriptionInlineErrorTitleMessage,
                    content: messages.defaultInlineErrorContentMessage
                }
            }
        });
        this.errorCallback(e);
    };

    /**
     * Handles a failed file version fetch
     *
     * @private
     * @param {Error} e - API error
     * @return {void}
     */
    fetchVersionsErrorCallback = (e: Error) => {
        this.setState({
            versions: undefined,
            versionError: {
                maskError: {
                    errorHeader: messages.versionHistoryErrorHeaderMessage,
                    errorSubHeader: messages.defaultErrorMaskSubHeaderMessage
                }
            }
        });
        this.errorCallback(e);
    };

    /**
     * Handles a failed file comment fetch
     *
     * @private
     * @param {Error} e - API error
     * @return {void}
     */
    fetchCommentsErrorCallback = (e: Error) => {
        this.setState({
            comments: undefined,
            commentsError: e
        });
        this.errorCallback(e);
    };

    /**
     * Handles a failed file task fetch
     *
     * @private
     * @param {Error} e - API error
     * @return {void}
     */
    fetchTasksErrorCallback = (e: Error) => {
        this.setState({
            tasks: undefined,
            tasksError: e
        });
    };

    /**
     * Handles a failed file access stats fetch
     *
     * @private
     * @param {Error} e - API error
     * @return {void}
     */
    fetchFileAccessStatsErrorCallback = (e: Error) => {
        this.setState({
            accessStats: undefined,
            accessStatsError: {
                maskError: {
                    errorHeader: messages.fileAccessStatsErrorHeaderMessage,
                    errorSubHeader: messages.defaultErrorMaskSubHeaderMessage
                }
            }
        });
        this.errorCallback(e);
    };

    /**
     * Handles a failed file user info fetch
     *
     * @private
     * @param {Error} e - API error
     * @return {void}
     */
    fetchCurrentUserErrorCallback = (e: Error) => {
        this.setState({
            currentUser: undefined,
            currentUserError: {
                maskError: {
                    errorHeader: messages.currentUserErrorHeaderMessage,
                    errorSubHeader: messages.defaultErrorMaskSubHeaderMessage
                }
            }
        });
        this.errorCallback(e);
    };

    /**
     * Network error callback
     *
     * @private
     * @param {Error} error - Error object
     * @return {void}
     */
    errorCallback = (error: Error): void => {
        /* eslint-disable no-console */
        console.error(error);
        /* eslint-enable no-console */
    };

    /**
     * File fetch success callback that sets the file and view
     *
     * @private
     * @param {Object} file - Box file
     * @return {string} Sidebar view to use
     */
    getDefaultSidebarView(isCollapsed?: boolean, file?: BoxItem): SidebarView {
        // If collapsed no need to return any view
        if (isCollapsed || !file) {
            return undefined;
        }

        let defaultView;
        const { view }: State = this.state;
        const canDefaultToSkills = SidebarUtils.shouldRenderSkillsSidebar(this.props, file);
        const canDefaultToDetails = SidebarUtils.shouldRenderDetailsSidebar(this.props);
        const canDefaultToActivity = SidebarUtils.shouldRenderActivitySidebar(this.props);

        // Calculate the default view with latest props
        if (canDefaultToSkills) {
            defaultView = SIDEBAR_VIEW_SKILLS;
        } else if (canDefaultToActivity) {
            defaultView = SIDEBAR_VIEW_ACTIVITY;
        } else if (canDefaultToDetails) {
            defaultView = SIDEBAR_VIEW_DETAILS;
        }

        // Only reset the view if prior view is no longer applicable
        if (
            !view ||
            (view === SIDEBAR_VIEW_SKILLS && !canDefaultToSkills) ||
            (view === SIDEBAR_VIEW_ACTIVITY && !canDefaultToActivity) ||
            (view === SIDEBAR_VIEW_DETAILS && !canDefaultToDetails)
        ) {
            return defaultView;
        }

        return view;
    }

    /**
     * File fetch success callback that sets the file and view
     *
     * @private
     * @param {Object} file - Box file
     * @return {void}
     */
    fetchFileSuccessCallback = (file: BoxItem): void => {
        this.setState({ file, view: this.getDefaultSidebarView(this.state.isCollapsed, file) });
    };

    /**
     * File versions fetch success callback
     *
     * @private
     * @param {Object} versions - Box file versions
     * @return {void}
     */
    fetchVersionsSuccessCallback = (versions: FileVersions): void => {
        this.setState({ versions, versionError: undefined });
    };

    /**
     * File versions fetch success callback
     *
     * @private
     * @param {Object} file - Box file
     * @return {void}
     */
    fetchCommentsSuccessCallback = (comments: Comments): void => {
        this.setState({ comments, commentsError: undefined });
    };

    /**
     * Update Tasks to include task assignments
     *
     * @private
     * @param {Array<TaskAssignment>} entries - Box task assignment entries
     * @param {TaskAssignments} assignments - Box task assigments
     * @return {TaskAssignments} Updated Box task assignments
     */
    populateTaskAssignments(entries: Array<TaskAssignment>, assignments: TaskAssignments): TaskAssignments {
        return {
            total_count: assignments.entries.length,
            entries: entries.map((item: TaskAssignment) => {
                const assignment = assignments.entries.find((a) => a.id === item.id);
                if (assignment) {
                    const { message, resolution_state } = assignment;
                    return {
                        ...assignment,
                        resolution_state: message ? message.toLowerCase() : resolution_state
                    };
                }
                return item;
            })
        };
    }

    /**
     * File task assignment fetch success callback
     *
     * @private
     * @param {Tasks} tasks - Box tasks to be populated with assignments
     * @param {TaskAssignments} assignments - Fetched Box task assigments for specified task
     * @return {Object}
     */
    fetchTaskAssignmentsSuccessCallback = (tasks: Tasks, assignments: TaskAssignments): Tasks => {
        const { entries, total_count } = tasks;
        return {
            entries: entries.map((task) => ({
                ...task,
                task_assignment_collection: this.populateTaskAssignments(
                    task.task_assignment_collection.entries,
                    assignments
                )
            })),
            total_count
        };
    };

    /**
     * File access stats fetch success callback
     *
     * @private
     * @param {Object} accessStats - access stats for a file
     * @return {void}
     */
    fetchFileAccessStatsSuccessCallback = (accessStats: FileAccessStats): void => {
        this.setState({ accessStats, accessStatsError: undefined });
    };

    /**
     * User fetch success callback
     *
     * @private
     * @param {Object} currentUser - User info object
     * @return {void}
     */
    fetchCurrentUserSuccessCallback = (user: User): void => {
        this.setState({ currentUser: user, currentUserError: undefined });
    };

    /**
     * File approver contacts fetch success callback
     *
     * @private
     * @param {BoxItemCollection} data - Collaborators response data
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
     * @param {BoxItemCollection} data - Collaborators response data
     * @return {void}
     */
    getMentionContactsSuccessCallback = (collaborators: Collaborators): void => {
        const { entries } = collaborators;
        this.setState({ mentionSelectorContacts: entries });
    };

    /**
     * Fetches a file
     *
     * @private
     * @param {string} id - File id
     * @param {Boolean|void} [forceFetch] - To void cache
     * @return {void}
     */
    fetchFile(id: string, forceFetch: boolean = false): void {
        if (SidebarUtils.canHaveSidebar(this.props)) {
            this.api.getFileAPI().file(id, this.fetchFileSuccessCallback, this.errorCallback, forceFetch, true);
        }
    }

    /**
     * Fetches the versions for a file
     *
     * @private
     * @param {string} id - File id
     * @param {boolean} shouldDestroy true if the apiFactory should be destroyed
     * @param {number} offset the offset from the start to start fetching at
     * @param {number} limit the number of items to fetch
     * @param {array} fields the fields to fetch
     * @param {boolean} shouldFetchAll true if should get all the pages before calling the sucessCallback
     * @return {void}
     */
    fetchVersions({
        id,
        shouldDestroy = false,
        offset = 0,
        limit = 1000,
        fields,
        shouldFetchAll = true
    }: {
        id: string,
        shouldDestroy?: boolean,
        offset?: number,
        limit?: number,
        fields?: Array<string>,
        shouldFetchAll?: boolean
    }): void {
        if (SidebarUtils.canHaveSidebar(this.props)) {
            this.api
                .getVersionsAPI(shouldDestroy)
                .offsetGet(
                    id,
                    this.fetchVersionsSuccessCallback,
                    this.fetchVersionsErrorCallback,
                    offset,
                    limit,
                    fields,
                    shouldFetchAll
                );
        }
    }

    /**
     * Fetches the comments for a file
     *
     * @private
     * @param {string} id - File id
     * @param {boolean} shouldDestroy true if the apiFactory should be destroyed
     * @param {number} offset the offset from the start to start fetching at
     * @param {number} limit the number of items to fetch
     * @param {array} fields the fields to fetch
     * @param {boolean} shouldFetchAll true if should get all the pages before calling the sucessCallback
     * @return {void}
     */
    fetchComments({
        id,
        shouldDestroy = false,
        offset = 0,
        limit = 1000,
        fields,
        shouldFetchAll = true
    }: {
        id: string,
        shouldDestroy?: boolean,
        offset?: number,
        limit?: number,
        fields?: Array<string>,
        shouldFetchAll?: boolean
    }): void {
        if (SidebarUtils.canHaveSidebar(this.props)) {
            this.api
                .getCommentsAPI(shouldDestroy)
                .offsetGet(
                    id,
                    this.fetchCommentsSuccessCallback,
                    this.fetchCommentsErrorCallback,
                    offset,
                    limit,
                    fields,
                    shouldFetchAll
                );
        }
    }

    /**
     * Adds a comment to the comments state and increases total_count.
     *
     * @param {Comment} comment - The newly created comment from the API
     * @return {void}
     */
    createCommentSuccessCallback(comment: Comment): void {
        const { comments } = this.state;
        if (comments && comments.entries) {
            this.setState({
                comments: {
                    entries: [...comments.entries, comment],
                    total_count: comments.total_count + 1
                }
            });
        }
    }

    /**
     * Posts a new comment to the API
     *
     * @private
     * @param {string} text - The comment's text
     * @param {boolean} hasMention - The comment's text
     * @param {Function} successCallback - Called on successful comment creation
     * @param {Function} errorCallback - Called on failure to create comment
     * @return {void}
     */
    createComment = (
        text: string,
        hasMention: boolean,
        successCallback: (comment: Comment) => void = noop,
        errorCallback: (e: Error) => void = noop
    ): void => {
        const { file } = this.state;

        if (!file) {
            throw getBadItemError();
        }

        const message = {};

        if (hasMention) {
            message.taggedMessage = text;
        } else {
            message.message = text;
        }

        this.api.getCommentsAPI(false).createComment({
            file,
            ...message,
            successCallback: (comment: Comment) => {
                this.createCommentSuccessCallback(comment);
                successCallback(comment);
            },
            errorCallback: (e: Error) => {
                this.errorCallback(e);
                errorCallback(e);
            }
        });
    };

    /**
     * Adds a task to the tasks state and increases total_count.
     *
     * @param {Task} task - The newly created task from the API
     * @return {void}
     */
    createTaskSuccessCallback(task: Task): void {
        const { tasks } = this.state;
        if (tasks && tasks.entries) {
            this.setState({
                tasks: {
                    entries: [...tasks.entries, task],
                    total_count: tasks.total_count + 1
                }
            });
        }
    }

    /**
     * Posts a new task to the API
     *
     * @private
     * @param {string} text - The task's text
     * @param {Array} assignees - Array of assignees
     * @param {string} dueAt - The comment's text
     * @param {Function} successCallback - Called on successful task creation
     * @param {Function} errorCallback - Called on failure to create task
     * @return {void}
     */
    createTask = (
        text: string,
        assignees: Array<SelectorItems>,
        dueAt?: string,
        successCallback: (task: Task) => void = noop,
        errorCallback: (e: Error) => void = noop
    ) => {
        const { file } = this.state;

        if (!file) {
            throw getBadItemError();
        }

        this.api.getTasksAPI(false).createTask({
            file,
            message: text,
            dueAt,
            successCallback: (task: Task) => {
                this.createTaskSuccessCallback(task);
                successCallback(task);
            },
            errorCallback: (e: Error) => {
                this.errorCallback(e);
                errorCallback(e);
            }
        });
    };

    /**
     * Updates a task
     *
     * @private
     * @param {string} taskId - The task's id
     * @param {Array} message - The task's text
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @param {string} dueAt - The date the task is due
     * @return {void}
     */
    updateTask = (
        taskId: string,
        message: string,
        successCallback: (task: Task) => void = noop,
        errorCallback: (e: Error) => void = noop,
        dueAt?: string
    ) => {
        const { file } = this.state;
        const { onTaskUpdate = noop } = this.props.activitySidebarProps;

        if (!file) {
            throw getBadItemError();
        }

        this.api.getTasksAPI(false).updateTask({
            file,
            taskId,
            message,
            dueAt,
            successCallback: (task: Task) => {
                onTaskUpdate(task);
                successCallback(task);
                this.updateTaskSuccessCallback(task);
            },
            errorCallback: (e: Error) => {
                errorCallback(e);
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
    updateTaskSuccessCallback(task: Task) {
        const { tasks } = this.state;
        const { id } = task;

        if (tasks) {
            const { entries, total_count } = tasks;

            this.setState({
                tasks: {
                    entries: entries.map((item) => {
                        if (item.id === id) {
                            return {
                                ...task
                            };
                        }
                        return item;
                    }),
                    total_count
                }
            });
        }
    }

    /**
     * Updates a task assignment
     *
     * @private
     * @param {string} taskId - The task's id
     * @param {string} taskAssignmentId - The task assignments's id
     * @param {string} resolutionState - The new resolution state of the task assignment
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    updateTaskAssignment = (
        taskId: string,
        taskAssignmentId: string,
        resolutionState: string,
        successCallback: (taskAssignment: Task) => void = noop,
        errorCallback: (e: Error) => void = noop
    ) => {
        const { file } = this.state;

        if (!file) {
            throw getBadItemError();
        }

        this.api.getTaskAssignmentsAPI(false).updateTaskAssignment({
            file,
            taskAssignmentId,
            resolutionState,
            successCallback,
            errorCallback: (e: Error) => {
                errorCallback(e);
                this.errorCallback(e);
            }
        });
    };

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
        taskId: string,
        successCallback: (taskId: string) => void = noop,
        errorCallback: (e: Error, taskId: string) => void = noop
    ) => {
        const { file } = this.state;
        const { onTaskDelete = noop } = this.props.activitySidebarProps;

        if (!file) {
            throw getBadItemError();
        }

        this.api.getTasksAPI(false).deleteTask({
            file,
            taskId,
            successCallback: () => {
                onTaskDelete(taskId);
                successCallback(taskId);
                this.deleteTaskSuccessCallback(taskId);
            },
            errorCallback: (e: Error) => {
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
        const { tasks } = this.state;

        if (tasks) {
            const { entries } = tasks;

            const newEntries = entries.filter((task) => task.id !== taskId);

            this.setState({
                tasks: {
                    entries: newEntries,
                    total_count: newEntries.length
                }
            });
        }
    };

    /**
     * Deletes a comment
     *
     * @private
     * @param {string} commentId - The comment's id
     * @param {BoxItemPermission} permissions - The comment's permissions
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    deleteComment = (
        commentId: string,
        permissions: BoxItemPermission,
        successCallback: (commentId: string) => void = noop,
        errorCallback: (e: Error, commentId: string) => void = noop
    ) => {
        const { file } = this.state;
        const { onCommentDelete = noop } = this.props.activitySidebarProps;

        if (!file) {
            throw getBadItemError();
        }

        this.api.getCommentsAPI(false).deleteComment({
            file,
            commentId,
            permissions,
            successCallback: () => {
                onCommentDelete(commentId);
                successCallback(commentId);
                this.deleteCommentSuccessCallback(commentId);
            },
            errorCallback: (e: Error) => {
                errorCallback(e, commentId);
                this.errorCallback(e);
            }
        });
    };

    /**
     * Comment delete success callback
     *
     * @private
     * @param {string} commentId - The comment's id
     * @return {void}
     */
    deleteCommentSuccessCallback = (commentId: string) => {
        const { comments } = this.state;

        if (comments) {
            const { entries } = comments;

            const newEntries = entries.filter((comment) => comment.id !== commentId);

            this.setState({
                comments: {
                    entries: newEntries,
                    total_count: newEntries.length
                }
            });
        }
    };

    /**
     * Fetches the tasks for a file
     *
     * @private
     * @param {string} id - File id
     * @return {void}
     */
    fetchTasks(id: string, shouldDestroy?: boolean = false): void {
        const requestData = {
            params: {
                fields: TASKS_FIELDS_TO_FETCH.toString()
            }
        };

        if (SidebarUtils.canHaveSidebar(this.props)) {
            this.api.getTasksAPI(shouldDestroy).get({
                id,
                successCallback: this.fetchTaskAssignments,
                errorCallback: this.fetchTasksErrorCallback,
                params: requestData
            });
        }
    }

    /**
     * Fetches the task assignments for each task
     *
     * @private
     * @param {string} id - File id
     * @return {void}
     */
    fetchTaskAssignments = (tasksWithoutAssignments: Tasks, shouldDestroy?: boolean = false): void => {
        const { fileId }: Props = this.props;
        if (!SidebarUtils.canHaveSidebar(this.props) || !fileId || !tasksWithoutAssignments) {
            return;
        }

        const requestData = {
            params: {
                fields: TASK_ASSIGNMENTS_FIELDS_TO_FETCH.toString()
            }
        };

        let tasks = tasksWithoutAssignments;
        const { entries } = tasksWithoutAssignments;
        const taskAssignmentPromises = [];
        entries.forEach((task) => {
            const promise = this.api.getTasksAPI(shouldDestroy).getAssignments(
                fileId,
                task.id,
                (assignments) => {
                    tasks = this.fetchTaskAssignmentsSuccessCallback(tasks, assignments);
                },
                this.fetchTasksErrorCallback,
                requestData
            );
            taskAssignmentPromises.push(promise);
        });

        Promise.all(taskAssignmentPromises).then(() => this.setState({ tasks }));
    };

    /**
     * Fetches the access stats for a file
     *
     * @private
     * @param {string} id - File id
     * @return {void}
     */
    fetchFileAccessStats(id: string, shouldDestroy?: boolean = false): void {
        if (SidebarUtils.canHaveSidebar(this.props)) {
            this.api.getFileAccessStatsAPI(shouldDestroy).get({
                id,
                successCallback: this.fetchFileAccessStatsSuccessCallback,
                errorCallback: this.fetchFileAccessStatsErrorCallback
            });
        }
    }

    /**
     * Fetches a Users info
     *
     * @private
     * @param {User} [user] - Box User. If missing, gets user that the current token was generated for.
     * @return {void}
     */
    fetchCurrentUser(user?: User, shouldDestroy?: boolean = false): void {
        const { fileId = '' } = this.props;
        if (SidebarUtils.canHaveSidebar(this.props)) {
            if (typeof user === 'undefined') {
                this.api.getUsersAPI(shouldDestroy).get({
                    id: fileId,
                    successCallback: this.fetchCurrentUserSuccessCallback,
                    errorCallback: this.fetchCurrentUserErrorCallback
                });
            } else {
                this.setState({ currentUser: user, currentUserError: undefined });
            }
        }
    }

    /**
     * Patches skill metadata
     *
     * @private
     * @param {string} id - File id
     * @return {void}
     */
    onSkillChange = (
        index: number,
        removes: Array<SkillCardEntry> = [],
        adds: Array<SkillCardEntry> = [],
        replaces: Array<{ replaced: SkillCardEntry, replacement: SkillCardEntry }> = []
    ): void => {
        const { hasSkills }: Props = this.props;
        const { file }: State = this.state;
        if (!hasSkills || !file) {
            return;
        }

        const { metadata, permissions }: BoxItem = file;
        if (!metadata || !permissions || !permissions.can_upload) {
            return;
        }

        const cards: Array<SkillCard> = getProp(file, 'metadata.global.boxSkillsCards.cards');
        if (!cards || cards.length === 0 || !cards[index]) {
            return;
        }

        const card = cards[index];
        const path = `/cards/${index}`;
        const ops: JsonPatchData = [];

        if (Array.isArray(replaces)) {
            replaces.forEach(({ replaced, replacement }) => {
                const idx = card.entries.findIndex((entry) => entry === replaced);
                if (idx > -1) {
                    ops.push({
                        op: 'replace',
                        path: `${path}/entries/${idx}`,
                        value: replacement
                    });
                }
            });
        }

        if (Array.isArray(removes)) {
            removes.forEach((removed) => {
                const idx = card.entries.findIndex((entry) => entry === removed);
                if (idx > -1) {
                    ops.push({
                        op: 'remove',
                        path: `${path}/entries/${idx}`
                    });
                }
            });
        }

        if (Array.isArray(adds)) {
            adds.forEach((added) => {
                ops.push({
                    op: 'add',
                    path: `${path}/entries/-`,
                    value: added
                });
            });
        }

        // If no ops, don't proceed
        if (ops.length === 0) {
            return;
        }

        // Add test ops before any other ops
        ops.splice(0, 0, {
            op: 'test',
            path,
            value: card
        });

        this.api.getMetadataAPI(false).patch(
            file,
            FIELD_METADATA_SKILLS,
            ops,
            (updatedFile) => {
                this.setState({ file: updatedFile });
            },
            this.errorCallback
        );
    };

    /**
     * File @mention contacts fetch success callback
     *
     * @private
     * @param {API} api - Box API instance
     * @param {string} searchStr - Search string to filter file collaborators by
     * @param {Function} successCallback - Fetch success callback
     * @return {void}
     */
    getApproverWithQuery = debounce((searchStr: string): void => {
        // Do not fetch without filter
        const { fileId } = this.props;
        if (!searchStr || searchStr.trim() === '' || !fileId) {
            return;
        }

        this.api.getFileCollaboratorsAPI(true).markerGet({
            id: fileId,
            limit: DEFAULT_MAX_COLLABORATORS,
            params: {
                filter_term: searchStr
            },
            successCallback: this.getApproverContactsSuccessCallback,
            errorCallback: this.errorCallback
        });
    }, DEFAULT_COLLAB_DEBOUNCE);

    /**
     * File @mention contacts fetch success callback
     *
     * @private
     * @param {string} searchStr - Search string to filter file collaborators by
     * @return {void}
     */
    getMentionWithQuery = debounce((searchStr: string): void => {
        // Do not fetch without filter
        const { fileId } = this.props;
        if (!searchStr || searchStr.trim() === '' || !fileId) {
            return;
        }

        this.api.getFileCollaboratorsAPI(true).markerGet({
            id: fileId,
            limit: DEFAULT_MAX_COLLABORATORS,
            params: {
                filter_term: searchStr
            },
            successCallback: this.getMentionContactsSuccessCallback,
            errorCallback: this.errorCallback
        });
    }, DEFAULT_COLLAB_DEBOUNCE);

    /**
     * Refreshes sidebar when classification is changed
     *
     * @private
     * @return {void}
     */
    onClassificationChange = (): void => {
        this.setState({
            file: undefined
        });

        const { fileId } = this.props;
        if (!fileId) {
            return;
        }

        this.fetchFile(fileId, true);
    };

    /**
     * Opens classification modal with refresh callback
     *
     * @private
     * @return {void}
     */
    onClassificationClick = (): void => {
        const { onClassificationClick = noop } = this.props.detailsSidebarProps;

        onClassificationClick(this.onClassificationChange);
    };

    /**
     * Renders the file preview
     *
     * @private
     * @inheritdoc
     * @return {Element}
     */
    render() {
        const {
            language,
            messages: intlMessages,
            getPreviewer,
            hasMetadata,
            hasActivityFeed,
            className,
            activitySidebarProps,
            detailsSidebarProps
        }: Props = this.props;
        const {
            file,
            view,
            accessStats,
            versions,
            comments,
            tasks,
            currentUser,
            accessStatsError,
            fileError,
            versionError,
            commentsError,
            tasksError,
            approverSelectorContacts,
            mentionSelectorContacts,
            currentUserError,
            isCollapsed
        }: State = this.state;

        const styleClassName = classNames(
            'be bcs',
            {
                [`bcs-${view}`]: !!view,
                'bcs-is-open': !isCollapsed
            },
            className
        );

        const hasSkills = SidebarUtils.shouldRenderSkillsSidebar(this.props, file);
        const hasDetails = SidebarUtils.shouldRenderDetailsSidebar(this.props);

        return (
            <Internationalize language={language} messages={intlMessages}>
                <aside id={this.id} className={styleClassName}>
                    <div className='be-app-element'>
                        {SidebarUtils.shouldRenderSidebar(this.props, file) ? (
                            <Sidebar
                                file={((file: any): BoxItem)}
                                view={view}
                                detailsSidebarProps={{
                                    accessStats,
                                    accessStatsError,
                                    versionError,
                                    fileError,
                                    onDescriptionChange: this.onDescriptionChange,
                                    onClassificationChange: this.onClassificationChange,
                                    ...detailsSidebarProps
                                }}
                                activitySidebarProps={activitySidebarProps}
                                versions={versions}
                                getPreviewer={getPreviewer}
                                hasSkills={hasSkills}
                                hasDetails={hasDetails}
                                hasMetadata={hasMetadata}
                                hasActivityFeed={hasActivityFeed}
                                accessStats={accessStats}
                                onSkillChange={this.onSkillChange}
                                accessStatsError={accessStatsError}
                                fileError={fileError}
                                versionError={versionError}
                                tasks={tasks}
                                tasksError={tasksError}
                                comments={comments}
                                commentsError={commentsError}
                                currentUser={currentUser}
                                currentUserError={currentUserError}
                                onCommentCreate={this.createComment}
                                onCommentDelete={this.deleteComment}
                                onTaskCreate={this.createTask}
                                onTaskDelete={this.deleteTask}
                                onTaskUpdate={this.updateTask}
                                onTaskAssignmentUpdate={this.updateTaskAssignment}
                                getApproverWithQuery={this.getApproverWithQuery}
                                getMentionWithQuery={this.getMentionWithQuery}
                                approverSelectorContacts={approverSelectorContacts}
                                mentionSelectorContacts={mentionSelectorContacts}
                                getAvatarUrl={this.getAvatarUrl}
                                onToggle={this.onToggle}
                            />
                        ) : (
                            <div className='bcs-loading'>
                                <LoadingIndicator />
                            </div>
                        )}
                    </div>
                </aside>
            </Internationalize>
        );
    }
}

export type ContentSidebarProps = Props;
export default ContentSidebar;
