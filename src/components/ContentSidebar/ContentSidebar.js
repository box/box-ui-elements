/**
 * @flow
 * @file Content Preview Component
 * @author Box
 */

import 'regenerator-runtime/runtime';
import React, { PureComponent } from 'react';
import uniqueid from 'lodash/uniqueId';
import noop from 'lodash/noop';
import cloneDeep from 'lodash/cloneDeep';
import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator/LoadingIndicator';
import Sidebar from './Sidebar';
import API from '../../api';
import Cache from '../../util/Cache';
import Internationalize from '../Internationalize';
import { DEFAULT_HOSTNAME_API, CLIENT_NAME_CONTENT_SIDEBAR } from '../../constants';
import messages from '../messages';
import type { AccessStats, Token, BoxItem, StringMap, FileVersions, Errors, Comments, Tasks } from '../../flowTypes';
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
    getPreviewer: Function,
    hasTitle: boolean,
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
    activityFeedState?: Array<any>,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    onInteraction: Function,
    onAccessStatsClick?: Function,
    onClassificationClick?: Function,
    onVersionHistoryClick?: Function,
    onCommentCreate?: Function,
    onCommentDelete?: Function,
    onTaskCreate?: Function,
    onTaskDelete?: Function,
    onTaskUpdate?: Function,
    onTaskAssignmentUpdate?: Function,
    getApproverWithQuery?: Function,
    getMentionWithQuery?: Function
};

type State = {
    file?: BoxItem,
    accessStats?: AccessStats,
    versions?: FileVersions,
    comments?: Comments,
    tasks?: Tasks,
    fileError?: Errors,
    versionError?: Errors,
    commentsError?: Errors,
    tasksError?: Errors
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
        hasTitle: false,
        hasSkills: false,
        hasProperties: false,
        hasMetadata: false,
        hasNotices: false,
        hasAccessStats: false,
        hasClassification: false,
        hasActivityFeed: false,
        hasVersions: false,
        onInteraction: noop
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
        const { fileId, token }: Props = this.props;
        const { fileId: newFileId, token: newToken }: Props = nextProps;

        const hasTokenChanged = newToken !== token;
        const hasFileIdChanged = newFileId !== fileId;
        const currentFileId = newFileId || fileId;

        if (currentFileId && (hasTokenChanged || hasFileIdChanged)) {
            this.fetchData(nextProps, hasFileIdChanged);
        }
    }

    /**
     * Fetches the data for the sidebar
     *
     * @param {Object} Props the component props
     * @param {boolean} hasFileIdChanged true if the file id has changed
     */
    fetchData({ fileId, hasVersions, hasActivityFeed }: Props, hasFileIdChanged?: boolean) {
        if (hasFileIdChanged) {
            this.setState({});
        }

        if (fileId) {
            this.fetchFile(fileId);
            if (hasActivityFeed) {
                this.fetchComments(fileId, false, true);
                this.fetchTasks(fileId);
                this.fetchVersions(fileId, false, true);
            } else if (hasVersions) {
                // we dont need to fetch all the versions (for now), since all we care about is the total count
                this.fetchVersions(fileId);
            }
        }
    }

    /**
     * Determines if we should bother fetching or rendering
     *
     * @private
     * @param {string} id - file id
     * @param {Boolean|void} [forceFetch] - To void cache
     * @return {Boolean} true if we should fetch or render
     */
    shouldFetchOrRender(): boolean {
        const {
            hasSkills,
            hasProperties,
            hasMetadata,
            hasNotices,
            hasAccessStats,
            hasClassification,
            hasActivityFeed,
            hasVersions
        }: Props = this.props;

        return (
            hasSkills ||
            hasProperties ||
            hasMetadata ||
            hasAccessStats ||
            hasClassification ||
            hasActivityFeed ||
            hasVersions ||
            hasNotices
        );
    }

    /**
     * Function to log interactions
     *
     * @private
     * @param {Object} data - some data
     * @return {void}
     */
    onInteraction = (data: any): void => {
        const { onInteraction }: Props = this.props;
        const { file }: State = this.state;
        onInteraction(Object.assign({}, { file: cloneDeep(file) }, data));
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
        this.onInteraction({ target: 'description-change' });
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
     * @param {Object} file - Box file
     * @return {void}
     */
    fetchVersionsSuccessCallback = (versions: FileVersions): void => {
        this.setState({ versions, versionError: undefined });
    };

    /**
     * File comments fetch success callback
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
     * @param {Object} file - Box file
     * @return {void}
     */
    fetchTasksSuccessCallback = (tasks: Tasks): void => {
        this.setState({ tasks, tasksError: undefined });
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
        if (this.shouldFetchOrRender()) {
            this.api.getFileAPI().file(id, this.fetchFileSuccessCallback, this.errorCallback, forceFetch, true);
        }
    }

    /**
     * Fetches the versions for a file
     *
     * @private
     * @param {string} id - File id
     * @return {void}
     */
    fetchVersions(id: string, shouldDestroy?: boolean = false, shouldFetchAll?: boolean): void {
        if (this.shouldFetchOrRender()) {
            this.api
                .getVersionsAPI(shouldDestroy)
                .get(id, this.fetchVersionsSuccessCallback, this.fetchVersionsErrorCallback, [], shouldFetchAll);
        }
    }

    /**
     * Fetches the comments for a file
     *
     * @private
     * @param {string} id - File id
     * @return {void}
     */
    fetchComments(id: string, shouldDestroy?: boolean = false, shouldFetchAll?: boolean): void {
        if (this.shouldFetchOrRender()) {
            this.api
                .getCommentsAPI(shouldDestroy)
                .get(id, this.fetchCommentsSuccessCallback, this.fetchCommentsErrorCallback, [], shouldFetchAll);
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
        if (this.shouldFetchOrRender()) {
            this.api.getTasksAPI(shouldDestroy).tasks(id, this.fetchTasksSuccessCallback, this.fetchTasksErrorCallback);
        }
    }

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
            hasTitle,
            hasSkills,
            hasProperties,
            hasMetadata,
            hasNotices,
            hasAccessStats,
            hasClassification,
            hasActivityFeed,
            hasVersions,
            className,
            activityFeedState,
            onVersionHistoryClick,
            onAccessStatsClick,
            onClassificationClick,
            onCommentCreate,
            onCommentDelete,
            onTaskCreate,
            onTaskDelete,
            onTaskUpdate,
            onTaskAssignmentUpdate,
            getApproverWithQuery,
            getMentionWithQuery
        }: Props = this.props;
        const {
            file,
            accessStats,
            versions,
            comments,
            tasks,
            fileError,
            versionError,
            commentsError,
            tasksError
        }: State = this.state;

        const shouldRender = this.shouldFetchOrRender() && !!file;

        return (
            <Internationalize language={language} messages={intlMessages}>
                <aside id={this.id} className={`be bcs ${className}`}>
                    <div className='be-app-element'>
                        {shouldRender ? (
                            <Sidebar
                                file={file}
                                versions={versions}
                                getPreviewer={getPreviewer}
                                hasTitle={hasTitle}
                                hasSkills={hasSkills}
                                hasProperties={hasProperties}
                                hasMetadata={hasMetadata}
                                hasNotices={hasNotices}
                                hasAccessStats={hasAccessStats}
                                hasClassification={hasClassification}
                                hasActivityFeed={hasActivityFeed}
                                appElement={this.appElement}
                                rootElement={this.rootElement}
                                onInteraction={this.onInteraction}
                                onDescriptionChange={this.onDescriptionChange}
                                accessStats={accessStats}
                                activityFeedState={activityFeedState}
                                onAccessStatsClick={onAccessStatsClick}
                                onClassificationClick={onClassificationClick}
                                onVersionHistoryClick={onVersionHistoryClick}
                                hasVersions={hasVersions}
                                fileError={fileError}
                                versionError={versionError}
                                tasks={tasks}
                                tasksError={tasksError}
                                comments={comments}
                                commentsError={commentsError}
                                onCommentCreate={onCommentCreate}
                                onCommentDelete={onCommentDelete}
                                onTaskCreate={onTaskCreate}
                                onTaskDelete={onTaskDelete}
                                onTaskUpdate={onTaskUpdate}
                                onTaskAssignmentUpdate={onTaskAssignmentUpdate}
                                getApproverWithQuery={getApproverWithQuery}
                                getMentionWithQuery={getMentionWithQuery}
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

export default ContentSidebar;
