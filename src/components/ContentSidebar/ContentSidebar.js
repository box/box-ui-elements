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
import type { $AxiosXHR } from 'axios';
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
    SIDEBAR_VIEW_DETAILS,
    UNAUTHORIZED_CODE
} from '../../constants';
import messages from '../messages';
import { getBadItemError, getBadUserError } from '../../util/error';
import SidebarUtils from './SidebarUtils';
import type { DetailsSidebarProps } from './DetailsSidebar';
import type { ActivitySidebarProps } from './ActivitySidebar';
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
    responseInterceptor?: Function,
    onVersionHistoryClick?: Function
};

type State = {
    view: SidebarView,
    file?: BoxItem,
    accessStats?: FileAccessStats,
    currentUser?: User,
    approverSelectorContacts?: SelectorItems,
    mentionSelectorContacts?: SelectorItems,
    fileError?: Errors,
    activityFeedError?: Errors,
    accessStatsError?: Errors,
    currentUserError?: Errors,
    isFileLoading?: boolean,
    feedItems?: FeedItems
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
        activityFeedError: undefined,
        accessStatsError: undefined,
        currentUserError: undefined,
        feedItems: undefined
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

        // Clear out existing state
        this.setState(cloneDeep(this.initialState));

        // Fetch the new file
        this.fetchFile(fileId);

        if (hasAccessStats) {
            this.fetchFileAccessStats(fileId);
        }

        if (hasActivityFeed) {
            this.fetchFeedItems();
            this.fetchCurrentUser(currentUser);
        }
    }

    /**
     * Fetches the feed items for the sidebar
     *
     * @param {boolean} shouldDestroy true if the api factory should be destroyed
     */
    fetchFeedItems(shouldDestroy: boolean = false) {
        if (SidebarUtils.canHaveSidebar(this.props)) {
            const { fileId } = this.props;
            if (!fileId) {
                return;
            }

            this.api
                .getFeedAPI(shouldDestroy)
                .feedItems(fileId, this.fetchFeedItemsSuccessCallback, this.fetchFeedItemsErrorCallback);
        }
    }

    /**
     * Handles a successful feed API fetch
     *
     * @private
     * @param {BoxItem} file - Updated file object
     * @return {void}
     */
    fetchFeedItemsSuccessCallback = (feedItems: FeedItems): void => {
        this.setState({ feedItems, activityFeedError: undefined });
    };

    /**
     * Handles a failed file comment fetch
     *
     * @private
     * @param {Error} e - API error
     * @return {void}
     */
    fetchFeedItemsErrorCallback = (e: $AxiosXHR<any>) => {
        this.setState({
            feedItems: [],
            activityFeedError: activityFeedInlineError
        });
        this.errorCallback(e);
    };

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
     * Handles a failed file access stats fetch
     *
     * @private
     * @param {Error} e - API error
     * @return {void}
     */
    fetchFileAccessStatsErrorCallback = (e: $AxiosXHR<any>) => {
        let accessStatsError;

        if (getProp(e, 'status') !== UNAUTHORIZED_CODE) {
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
     * Adds a comment to the comments state and increases total_count.
     *
     * @param {Comment} comment - The newly created comment from the API
     * @return {void}
     */
    createCommentSuccessCallback = (): void => {
        this.fetchFeedItems();
    };

    createCommentErrorCallback = (e: $AxiosXHR<any>) => {
        this.errorCallback(e);
        this.fetchFeedItems();
    };

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
    createComment = (text: string, hasMention: boolean): void => {
        const { file, currentUser } = this.state;

        if (!file) {
            throw getBadItemError();
        }

        if (!currentUser) {
            throw getBadUserError();
        }

        this.api
            .getFeedAPI(false)
            .createComment(
                file,
                currentUser,
                text,
                hasMention,
                this.createCommentSuccessCallback,
                this.createCommentErrorCallback
            );

        // need to load the pending item
        this.fetchFeedItems();
    };

    /**
     * Adds a comment to the comments state and increases total_count.
     *
     * @param {Comment} comment - The newly created comment from the API
     * @return {void}
     */
    createTaskSuccessCallback = (): void => {
        this.fetchFeedItems();
    };

    createTaskErrorCallback = (e: $AxiosXHR<any>) => {
        this.errorCallback(e);
        this.fetchFeedItems();
    };

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
    createTask = (message: string, assignees: SelectorItems, dueAt: string): void => {
        const { file, currentUser } = this.state;

        if (!file) {
            throw getBadItemError();
        }

        if (!currentUser) {
            throw getBadUserError();
        }

        this.api
            .getFeedAPI(false)
            .createTask(
                file,
                currentUser,
                message,
                assignees,
                dueAt,
                this.createTaskSuccessCallback,
                this.createTaskErrorCallback
            );

        // need to load the pending item
        this.fetchFeedItems();
    };

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
            getPreviewer,
            hasMetadata,
            hasActivityFeed,
            className,
            activitySidebarProps,
            detailsSidebarProps,
            onVersionHistoryClick,
            isCollapsed
        }: Props = this.props;
        const {
            file,
            view,
            accessStats,
            currentUser,
            accessStatsError,
            fileError,
            activityFeedError,
            approverSelectorContacts,
            mentionSelectorContacts,
            currentUserError,
            isFileLoading,
            feedItems
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
                                    fileError,
                                    isFileLoading,
                                    onClassificationChange: this.onClassificationChange,
                                    onDescriptionChange: this.onDescriptionChange,
                                    ...detailsSidebarProps
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
                                getPreviewer={getPreviewer}
                                hasSkills={hasSkills}
                                hasDetails={hasDetails}
                                hasMetadata={hasMetadata}
                                hasActivityFeed={hasActivityFeed}
                                accessStats={accessStats}
                                onSkillChange={this.onSkillChange}
                                accessStatsError={accessStatsError}
                                fileError={fileError}
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
                                feedItems={feedItems}
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
