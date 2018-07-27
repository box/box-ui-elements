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
import APIContext from '../APIContext';
import Internationalize from '../Internationalize';
import {
    DEFAULT_HOSTNAME_API,
    CLIENT_NAME_CONTENT_SIDEBAR,
    DEFAULT_COLLAB_DEBOUNCE,
    DEFAULT_MAX_COLLABORATORS,
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    UNAUTHORIZED_CODE
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
import type { MetadataSidebarProps } from './MetadataSidebar';
import type { $AxiosXHR } from 'axios'; // eslint-disable-line
import '../fonts.scss';
import '../base.scss';
import '../modal.scss';
import './ContentSidebar.scss';

type Props = {
    fileId?: string,
    isCollapsed: boolean,
    clientName: string,
    apiHost: string,
    token: Token,
    className: string,
    currentUser?: User,
    getPreview: Function,
    getViewer: Function,
    hasSkills: boolean,
    activitySidebarProps: ActivitySidebarProps,
    detailsSidebarProps: DetailsSidebarProps,
    metadataSidebarProps: MetadataSidebarProps,
    hasMetadata: boolean,
    hasActivityFeed: boolean,
    language?: string,
    messages?: StringMap,
    cache?: APICache,
    sharedLink?: string,
    sharedLinkPassword?: string,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    onVersionHistoryClick?: Function
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
    activityFeedError: ?Errors,
    accessStatsError?: Errors,
    currentUserError?: Errors,
    isFileLoading?: boolean
};

const activityFeedInlineError: Errors = {
    inlineError: {
        title: messages.errorOccured,
        content: messages.activityFeedItemApiError
    }
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
        getPreview: noop,
        getViewer: noop,
        currentUser: undefined,
        hasSkills: false,
        hasMetadata: false,
        hasActivityFeed: false,
        activitySidebarProps: {},
        detailsSidebarProps: {},
        metadataSidebarProps: {}
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
        activityFeedError: undefined,
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
            responseInterceptor
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
        this.state = cloneDeep(this.initialState);
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
            // Clear out existing state
            this.setState(cloneDeep(this.initialState));
            this.fetchData(nextProps);
        } else if (hasVisibilityChanged) {
            this.setState({
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
    setFileDescriptionErrorCallback = (e: $AxiosXHR<any>, file: BoxItem): void => {
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
    fetchVersionsErrorCallback = (e: $AxiosXHR<any>) => {
        this.setState({
            versions: {
                total_count: 0,
                entries: []
            },
            activityFeedError: this.getActivityFeedError(e)
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
    fetchCommentsErrorCallback = (e: $AxiosXHR<any>) => {
        this.setState({
            comments: {
                total_count: 0,
                entries: []
            },
            activityFeedError: this.getActivityFeedError(e)
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
    fetchTasksErrorCallback = (e: $AxiosXHR<any>) => {
        this.setState({
            tasks: {
                total_count: 0,
                entries: []
            },
            activityFeedError: this.getActivityFeedError(e)
        });
        this.errorCallback(e);
    };

    /**
     * Handles a failed file task assignment fetch
     *
     * @private
     * @param {Error} e - API error
     * @return {void}
     */
    fetchTaskAssignmentsErrorCallback = (e: $AxiosXHR<any>): void => {
        this.setState({
            activityFeedError: this.getActivityFeedError(e)
        });
        this.errorCallback(e);
    };

    /**
     * Gets the error for the activity feed if a fetch fails
     *
     * @param {Error} e - API error
     * @return {Object | undefined} - the error object
     */
    getActivityFeedError(e: $AxiosXHR<any>): ?Errors {
        // Don't show an error if its a permissions error
        if (getProp(e, 'status') === UNAUTHORIZED_CODE) {
            return undefined;
        }

        return activityFeedInlineError;
    }

    /**
     * Handles a failed file access stats fetch
     *
     * @private
     * @param {Error} e - API error
     * @return {void}
     */
    fetchFileAccessStatsErrorCallback = (e: $AxiosXHR<any>) => {
        let accessStatsError;

        if (getProp(e, 'status') === UNAUTHORIZED_CODE) {
            accessStatsError = {
                error: messages.fileAccessStatsPermissionsError
            };
        } else {
            accessStatsError = {
                maskError: {
                    errorHeader: messages.fileAccessStatsErrorHeaderMessage,
                    errorSubHeader: messages.defaultErrorMaskSubHeaderMessage
                }
            };
        }

        this.setState({
            accessStats: undefined,
            accessStatsError
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
    fetchCurrentUserErrorCallback = (e: $AxiosXHR<any>) => {
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
     * Handles a failed file info fetch
     *
     * @private
     * @param {Error} e - API error
     * @return {void}
     */
    fetchFileErrorCallback = (e: $AxiosXHR<any>) => {
        this.setState({
            isFileLoading: false
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
    errorCallback = (error: $AxiosXHR<any>): void => {
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
        this.setState({ file, view: this.getDefaultSidebarView(this.props.isCollapsed, file), isFileLoading: false });
    };

    /**
     * File versions fetch success callback
     *
     * @private
     * @param {Object} versions - Box file versions
     * @return {void}
     */
    fetchVersionsSuccessCallback = (versions: FileVersions): void => {
        this.setState({ versions });
    };

    /**
     * File versions fetch success callback
     *
     * @private
     * @param {Object} file - Box file
     * @return {void}
     */
    fetchCommentsSuccessCallback = (comments: Comments): void => {
        this.setState({ comments });
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
            this.setState({
                isFileLoading: true
            });

            this.api
                .getFileAPI()
                .file(id, this.fetchFileSuccessCallback, this.fetchFileErrorCallback, forceFetch, true);
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
        errorCallback: (e: $AxiosXHR<any>) => void = noop
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
            errorCallback: (e: $AxiosXHR<any>) => {
                this.errorCallback(e);
                errorCallback(e);
            }
        });
    };

    /**
     * Formats assignments, and then adds them to their task.
     *

     * @param {Task} task - Task to which the assignments belong
     * @param {Task} assignments - List of task assignments
     * @return {Task}
     */
    appendAssignmentsToTask(task: Task, assignments: Array<TaskAssignment>) {
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
     * Creates a task assignment via the API.
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {Task} task - The newly created task from the API
     * @param {SelectorItem} assignee - The user assigned to this task
     * @param {Function} errorCallback - Task create error callback

     * @return {Promise<TaskAssignment}
     */
    createTaskAssignment(file: BoxItem, task: Task, assignee: SelectorItem, errorCallback: Function) {
        return new Promise((resolve, reject) => {
            this.api.getTaskAssignmentsAPI(false).createTaskAssignment({
                file,
                taskId: task.id,
                assignTo: { id: assignee.id },
                successCallback: (data: TaskAssignment) => resolve(data),
                errorCallback: (e) => {
                    this.createTaskAssignmentErrorCallback(e, task, errorCallback);
                    reject();
                }
            });
        });
    }

    /**
     * Adds a task to the tasks state and increases total_count.
     *
     * @param {Task} task - The newly created task from the API
     * @param {SelectorItems} assignees - The list of users assigned to this task
     * @param {Function} successCallback - Task create success callback
     * @param {Function} errorCallback - Task create error callback

     * @return {Promise<any>}
     */
    createTaskSuccessCallback(
        task: Task,
        assignees: SelectorItems,
        successCallback: Function,
        errorCallback: Function
    ): Promise<any> {
        const { tasks, file } = this.state;

        if (!file) {
            throw getBadItemError();
        }

        if (!tasks || !tasks.entries) {
            return Promise.reject();
        }

        const assignmentPromises = [];
        assignees.forEach((assignee: SelectorItem) => {
            // Create a promise for each assignment
            assignmentPromises.push(this.createTaskAssignment(file, task, assignee, errorCallback));
        });

        return Promise.all(assignmentPromises).then((taskAssignments) => {
            const formattedTask = this.appendAssignmentsToTask(task, taskAssignments);
            // After all assignments have been created, update the state with
            // the updated task object
            this.setState({
                tasks: {
                    entries: [...tasks.entries, formattedTask],
                    total_count: tasks.total_count + 1
                }
            });

            successCallback(task);
        });
    }

    /**
     * Posts a new task to the API
     *
     * @private
     * @param {string} text - The task's text
     * @param {SelectorItems} assignees - List of users assigned to this task
     * @param {string} dueAt - The comment's text
     * @param {Function} successCallback - Called on successful task creation
     * @param {Function} errorCallback - Called on failure to create task
     * @return {void}
     */
    createTask = (
        text: string,
        assignees: SelectorItems,
        dueAt?: string,
        successCallback: (task: Task) => void = noop,
        errorCallback: (e: $AxiosXHR<any>) => void = noop
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
                this.createTaskSuccessCallback(task, assignees, successCallback, errorCallback);
            },
            errorCallback: (e: $AxiosXHR<any>) => {
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
        errorCallback: (e: $AxiosXHR<any>) => void = noop,
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
            errorCallback: (e: $AxiosXHR<any>) => {
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
        errorCallback: (e: $AxiosXHR<any>) => void = noop
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
            errorCallback: (e: $AxiosXHR<any>) => {
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
        errorCallback: (e: $AxiosXHR<any>, taskId: string) => void = noop
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
        errorCallback: (e: $AxiosXHR<any>, commentId: string) => void = noop
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
            errorCallback: (e: $AxiosXHR<any>) => {
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
        if (!SidebarUtils.canHaveSidebar(this.props) || !fileId) {
            return;
        }

        const requestData = {
            params: {
                fields: TASK_ASSIGNMENTS_FIELDS_TO_FETCH.toString()
            }
        };

        const { entries } = tasksWithoutAssignments;
        const formattedTasks = { total_count: 0, entries: [] };
        const assignmentPromises = [];
        entries.forEach((task: Task) => {
            const assignmentPromise = new Promise((resolve) => {
                this.api.getTasksAPI(shouldDestroy).getAssignments(
                    fileId,
                    task.id,
                    (assignments) => {
                        formattedTasks.entries.push(this.appendAssignmentsToTask(task, assignments.entries));
                        formattedTasks.total_count += 1;
                        resolve();
                    },
                    (e) => {
                        this.fetchTaskAssignmentsErrorCallback(e);
                        resolve();
                    },
                    requestData
                );
            });

            assignmentPromises.push(assignmentPromise);
        });

        Promise.all(assignmentPromises).then(() => {
            this.setState({ tasks: formattedTasks });
        });
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
        const { fileId } = this.props;
        if (!fileId) {
            return;
        }

        this.fetchFile(fileId, true);
    };

    /**
     * Add classification click handler
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
            getPreview,
            getViewer,
            hasActivityFeed,
            className,
            activitySidebarProps,
            detailsSidebarProps,
            metadataSidebarProps,
            onVersionHistoryClick,
            isCollapsed
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
            activityFeedError,
            approverSelectorContacts,
            mentionSelectorContacts,
            currentUserError,
            isFileLoading
        }: State = this.state;

        const styleClassName = classNames(
            'be bcs',
            {
                [`bcs-${view}`]: !!view,
                'bcs-is-open': !!view || !isCollapsed
            },
            className
        );

        const hasSkills = SidebarUtils.shouldRenderSkillsSidebar(this.props, file);
        const hasDetails = SidebarUtils.shouldRenderDetailsSidebar(this.props);
        const hasMetadata = SidebarUtils.canHaveMetadataSidebar(this.props);

        return (
            <Internationalize language={language} messages={intlMessages}>
                <aside id={this.id} className={styleClassName}>
                    <div className='be-app-element'>
                        {SidebarUtils.shouldRenderSidebar(this.props, file) ? (
                            // $FlowFixMe
                            <APIContext.Provider value={this.api}>
                                <Sidebar
                                    file={((file: any): BoxItem)}
                                    view={view}
                                    detailsSidebarProps={{
                                        accessStats,
                                        accessStatsError,
                                        fileError,
                                        isFileLoading,
                                        onDescriptionChange: this.onDescriptionChange,
                                        ...detailsSidebarProps,
                                        onClassificationClick: this.onClassificationClick
                                    }}
                                    activitySidebarProps={{
                                        ...activitySidebarProps,
                                        onCommentCreate: this.createComment,
                                        onCommentDelete: this.deleteComment,
                                        onTaskCreate: this.createTask,
                                        onTaskDelete: this.deleteTask,
                                        onTaskUpdate: this.updateTask,
                                        onTaskAssignmentUpdate: this.updateTaskAssignment
                                    }}
                                    metadataSidebarProps={{
                                        ...metadataSidebarProps
                                    }}
                                    versions={versions}
                                    getPreview={getPreview}
                                    getViewer={getViewer}
                                    hasSkills={hasSkills}
                                    hasDetails={hasDetails}
                                    hasMetadata={hasMetadata}
                                    hasActivityFeed={hasActivityFeed}
                                    accessStats={accessStats}
                                    accessStatsError={accessStatsError}
                                    fileError={fileError}
                                    tasks={tasks}
                                    comments={comments}
                                    activityFeedError={activityFeedError}
                                    currentUser={currentUser}
                                    currentUserError={currentUserError}
                                    getApproverWithQuery={this.getApproverWithQuery}
                                    getMentionWithQuery={this.getMentionWithQuery}
                                    approverSelectorContacts={approverSelectorContacts}
                                    mentionSelectorContacts={mentionSelectorContacts}
                                    getAvatarUrl={this.getAvatarUrl}
                                    onToggle={this.onToggle}
                                    onVersionHistoryClick={onVersionHistoryClick}
                                />
                            </APIContext.Provider>
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
