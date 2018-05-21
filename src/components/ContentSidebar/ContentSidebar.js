/**
 * @flow
 * @file Content Preview Component
 * @author Box
 */

import 'regenerator-runtime/runtime';
import React, { PureComponent } from 'react';
import uniqueid from 'lodash/uniqueId';
import getProp from 'lodash/get';
import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator/LoadingIndicator';
import Sidebar from './Sidebar';
import API from '../../api';
import Cache from '../../util/Cache';
import Internationalize from '../Internationalize';
import {
    DEFAULT_HOSTNAME_API,
    CLIENT_NAME_CONTENT_SIDEBAR,
    FIELD_METADATA_SKILLS,
    DEFAULT_COLLAB_DEBOUNCE,
    DEFAULT_MAX_COLLABORATORS
} from '../../constants';
import { COMMENTS_FIELDS_TO_FETCH, TASKS_FIELDS_TO_FETCH, VERSIONS_FIELDS_TO_FETCH } from '../../util/fields';
import messages from '../messages';
import { shouldRenderSidebar } from './sidebarUtil';
import type {
    FileAccessStats,
    Token,
    BoxItem,
    StringMap,
    FileVersions,
    Errors,
    Comments,
    Tasks,
    User,
    Collaborators,
    SkillCard,
    SkillCardEntry,
    JsonPatchData,
    SelectorItems
} from '../../flowTypes';
import '../fonts.scss';
import '../base.scss';
import '../modal.scss';
import './ContentSidebar.scss';

type Props = {
    fileId?: string,
    isSmall?: boolean,
    clientName: string,
    apiHost: string,
    token: Token,
    className: string,
    currentUser?: User,
    getPreviewer: Function,
    hasSkills: boolean,
    hasProperties: boolean,
    hasMetadata: boolean,
    hasNotices: boolean,
    hasAccessStats: boolean,
    hasClassification: boolean,
    hasActivityFeed: boolean,
    hasVersions: boolean,
    language?: string,
    messages?: StringMap,
    cache?: Cache,
    sharedLink?: string,
    sharedLinkPassword?: string,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    onAccessStatsClick?: Function,
    onClassificationClick?: Function,
    onVersionHistoryClick?: Function,
    onCommentCreate?: Function,
    onCommentDelete?: Function,
    onTaskCreate?: Function,
    onTaskDelete?: Function,
    onTaskUpdate?: Function,
    onTaskAssignmentUpdate?: Function
};

type State = {
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
    currentUserError?: Errors
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
        isSmall: false,
        clientName: CLIENT_NAME_CONTENT_SIDEBAR,
        apiHost: DEFAULT_HOSTNAME_API,
        getPreviewer: noop,
        currentUser: undefined,
        hasSkills: false,
        hasProperties: false,
        hasMetadata: false,
        hasNotices: false,
        hasAccessStats: false,
        hasClassification: false,
        hasActivityFeed: false,
        hasVersions: false
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

        this.state = {};
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
    }

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
        const { fileId }: Props = this.props;
        const { fileId: newFileId }: Props = nextProps;

        const hasFileIdChanged = newFileId !== fileId;

        if (hasFileIdChanged) {
            this.setState({});
            this.fetchData(nextProps);
        }
    }

    /**
     * Fetches the data for the sidebar
     *
     * @param {Object} Props the component props
     * @param {boolean} hasFileIdChanged true if the file id has changed
     */
    fetchData({ fileId, hasActivityFeed, hasAccessStats, currentUser }: Props) {
        if (fileId) {
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
     * File fetch success callback
     *
     * @private
     * @param {Object} file - Box file
     * @return {void}
     */
    fetchFileSuccessCallback = (file: BoxItem): void => {
        this.setState({ file });
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
     * File tasks fetch success callback
     *
     * @private
     * @param {Object} tasks - Box task
     * @return {void}
     */
    fetchTasksSuccessCallback = (tasks: Tasks): void => {
        this.setState({ tasks, tasksError: undefined });
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
        if (shouldRenderSidebar(this.props)) {
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
        if (shouldRenderSidebar(this.props)) {
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
        if (shouldRenderSidebar(this.props)) {
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

        if (shouldRenderSidebar(this.props)) {
            this.api
                .getTasksAPI(shouldDestroy)
                .get(id, this.fetchTasksSuccessCallback, this.fetchTasksErrorCallback, requestData);
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
        if (shouldRenderSidebar(this.props)) {
            this.api
                .getFileAccessStatsAPI(shouldDestroy)
                .get(id, this.fetchFileAccessStatsSuccessCallback, this.fetchFileAccessStatsErrorCallback);
        }
    }

    /**
     * Fetches a Users info
     *
     * @private
     * @param {string} [id] - User id. If missing, gets user that the current token was generated for.
     * @return {void}
     */
    fetchCurrentUser(user?: User, shouldDestroy?: boolean = false): void {
        if (shouldRenderSidebar(this.props)) {
            if (typeof user === 'undefined') {
                this.api
                    .getUsersAPI(shouldDestroy)
                    .get('', this.fetchCurrentUserSuccessCallback, this.fetchCurrentUserErrorCallback);
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
            hasSkills,
            hasProperties,
            hasMetadata,
            hasNotices,
            hasAccessStats,
            hasClassification,
            hasActivityFeed,
            hasVersions,
            className,
            onVersionHistoryClick,
            onAccessStatsClick,
            onClassificationClick,
            onCommentCreate,
            onCommentDelete,
            onTaskCreate,
            onTaskDelete,
            onTaskUpdate,
            onTaskAssignmentUpdate
        }: Props = this.props;
        const {
            file,
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
            currentUserError
        }: State = this.state;

        const shouldRender = shouldRenderSidebar(this.props) && !!file;

        return (
            <Internationalize language={language} messages={intlMessages}>
                <aside id={this.id} className={`be bcs ${className}`}>
                    <div className='be-app-element'>
                        {shouldRender ? (
                            <Sidebar
                                file={((file: any): BoxItem)}
                                versions={versions}
                                getPreviewer={getPreviewer}
                                hasSkills={hasSkills}
                                hasProperties={hasProperties}
                                hasMetadata={hasMetadata}
                                hasNotices={hasNotices}
                                hasAccessStats={hasAccessStats}
                                hasClassification={hasClassification}
                                hasActivityFeed={hasActivityFeed}
                                appElement={this.appElement}
                                rootElement={this.rootElement}
                                onDescriptionChange={this.onDescriptionChange}
                                accessStats={accessStats}
                                onAccessStatsClick={onAccessStatsClick}
                                onClassificationClick={onClassificationClick}
                                onVersionHistoryClick={onVersionHistoryClick}
                                onSkillChange={this.onSkillChange}
                                hasVersions={hasVersions}
                                accessStatsError={accessStatsError}
                                fileError={fileError}
                                versionError={versionError}
                                tasks={tasks}
                                tasksError={tasksError}
                                comments={comments}
                                commentsError={commentsError}
                                currentUser={currentUser}
                                currentUserError={currentUserError}
                                onCommentCreate={onCommentCreate}
                                onCommentDelete={onCommentDelete}
                                onTaskCreate={onTaskCreate}
                                onTaskDelete={onTaskDelete}
                                onTaskUpdate={onTaskUpdate}
                                onTaskAssignmentUpdate={onTaskAssignmentUpdate}
                                getApproverWithQuery={this.getApproverWithQuery}
                                getMentionWithQuery={this.getMentionWithQuery}
                                approverSelectorContacts={approverSelectorContacts}
                                mentionSelectorContacts={mentionSelectorContacts}
                                getAvatarUrl={this.getAvatarUrl}
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
