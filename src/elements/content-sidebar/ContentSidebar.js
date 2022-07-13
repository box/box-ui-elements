/**
 * @flow
 * @file Content Sidebar Container
 * @author Box
 */

import 'regenerator-runtime/runtime';
import * as React from 'react';
import noop from 'lodash/noop';
import flow from 'lodash/flow';
import type { RouterHistory } from 'react-router-dom';
import API from '../../api';
import APIContext from '../common/api-context';
import Internationalize from '../common/Internationalize';
import Sidebar from './Sidebar';
import NavRouter from '../common/nav-router';
import SidebarUtils from './SidebarUtils';
import { DEFAULT_HOSTNAME_API, CLIENT_NAME_CONTENT_SIDEBAR, ORIGIN_CONTENT_SIDEBAR } from '../../constants';
import { EVENT_JS_READY } from '../common/logger/constants';
import { mark } from '../../utils/performance';
import { SIDEBAR_FIELDS_TO_FETCH } from '../../utils/fields';
import { withErrorBoundary } from '../common/error-boundary';
import { withFeatureProvider } from '../common/feature-checking';
import { withLogger } from '../common/logger';

import type { DetailsSidebarProps } from './DetailsSidebar';
import type { ActivitySidebarProps } from './ActivitySidebar';
import type { MetadataSidebarProps } from './MetadataSidebar';
import type { VersionsSidebarProps } from './versions';
import type { WithLoggerProps } from '../../common/types/logging';
import type { ElementsXhrError, RequestOptions, ErrorContextProps } from '../../common/types/api';
import type { MetadataEditor } from '../../common/types/metadata';
import type { StringMap, Token, User, BoxItem } from '../../common/types/core';
import type { AdditionalSidebarTab } from './flowTypes';
import type { FeatureConfig } from '../common/feature-checking';
import type APICache from '../../utils/Cache';

import '../common/fonts.scss';
import '../common/base.scss';
import '../common/modal.scss';
import './ContentSidebar.scss';

type Props = {
    activitySidebarProps: ActivitySidebarProps,
    additionalTabs?: Array<AdditionalSidebarTab>,
    apiHost: string,
    cache?: APICache,
    className: string,
    clientName: string,
    currentUser?: User,
    defaultView: string,
    detailsSidebarProps: DetailsSidebarProps,
    features: FeatureConfig,
    fileId?: string,
    getPreview: Function,
    getViewer: Function,
    hasActivityFeed: boolean,
    hasAdditionalTabs: boolean,
    hasMetadata: boolean,
    hasSkills: boolean,
    hasVersions: boolean,
    history?: RouterHistory,
    isDefaultOpen?: boolean,
    language?: string,
    messages?: StringMap,
    metadataSidebarProps: MetadataSidebarProps,
    onAnnotationSelect?: Function,
    onVersionChange?: Function,
    onVersionHistoryClick?: Function,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    sharedLink?: string,
    sharedLinkPassword?: string,
    token: Token,
    versionsSidebarProps: VersionsSidebarProps,
} & ErrorContextProps &
    WithLoggerProps;

type State = {
    file?: BoxItem,
    isLoading: boolean,
    metadataEditors?: Array<MetadataEditor>,
};

const MARK_NAME_JS_READY = `${ORIGIN_CONTENT_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

class ContentSidebar extends React.Component<Props, State> {
    props: Props;

    state: State = { isLoading: true };

    api: API;

    sidebarRef: Sidebar;

    static defaultProps = {
        activitySidebarProps: {},
        apiHost: DEFAULT_HOSTNAME_API,
        className: '',
        clientName: CLIENT_NAME_CONTENT_SIDEBAR,
        defaultView: '',
        detailsSidebarProps: {},
        getPreview: noop,
        getViewer: noop,
        hasActivityFeed: false,
        hasAdditionalTabs: false,
        hasMetadata: false,
        hasSkills: false,
        isDefaultOpen: true,
        metadataSidebarProps: {},
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
            apiHost,
            cache,
            clientName,
            language,
            requestInterceptor,
            responseInterceptor,
            sharedLink,
            sharedLinkPassword,
            token,
        } = props;

        this.api = new API({
            apiHost,
            cache,
            clientName,
            language,
            requestInterceptor,
            responseInterceptor,
            sharedLink,
            sharedLinkPassword,
            token,
        });

        /* eslint-disable react/prop-types */
        const { logger } = props;
        logger.onReadyMetric({
            endMarkName: MARK_NAME_JS_READY,
        });
        /* eslint-enable react/prop-types */
    }

    /**
     * Destroys api instances with caches
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
        // Don't destroy the cache while unmounting
        this.api.destroy(false);
    }

    /**
     * Fetches the file data on load
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentDidMount() {
        this.fetchFile();
    }

    /**
     * Fetches new file data on update
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentDidUpdate(prevProps: Props): void {
        const { fileId }: Props = this.props;
        const { fileId: prevFileId }: Props = prevProps;

        if (fileId !== prevFileId) {
            this.fetchFile();
        }
    }

    /**
     * Network error callback
     *
     * @private
     * @param {Error} error - Error object
     * @param {string} code - error code
     * @return {void}
     */
    errorCallback = (error: ElementsXhrError, code: string): void => {
        /* eslint-disable no-console */
        console.error(error);
        /* eslint-enable no-console */

        /* eslint-disable react/prop-types */
        this.props.onError(error, code, {
            error,
        });
        /* eslint-enable react/prop-types */
    };

    /**
     * File fetch success callback that sets the file and view
     * Only set file if there is data to show in the sidebar.
     * Skills sidebar doesn't show when there is no data.
     *
     * @private
     * @param {Object} file - Box file
     * @return {void}
     */
    fetchMetadataSuccessCallback = ({ editors }: { editors: Array<MetadataEditor> }): void => {
        this.setState({ metadataEditors: editors });
    };

    /**
     * Fetches file metadata editors if required
     *
     * @private
     * @return {void}
     */
    fetchMetadata(): void {
        const { file }: State = this.state;
        const { metadataSidebarProps }: Props = this.props;
        const { isFeatureEnabled = true }: MetadataSidebarProps = metadataSidebarProps;

        // Only fetch metadata if we think that the file may have metadata on it
        // but currently the metadata feature is turned off. Use case of this would be a free
        // user who doesn't have the metadata feature but is collabed on a file from a user
        // who added metadata on the file. If the feature is enabled we always end up showing
        // the metadata sidebar irrespective of there being any existing metadata or not.
        const canHaveMetadataSidebar = !isFeatureEnabled && SidebarUtils.canHaveMetadataSidebar(this.props);

        if (canHaveMetadataSidebar) {
            this.api
                .getMetadataAPI(false)
                .getMetadata(((file: any): BoxItem), this.fetchMetadataSuccessCallback, noop, isFeatureEnabled);
        }
    }

    /**
     * File fetch success callback that sets the file and sidebar visibility.
     * Also makes an optional request to fetch metadata editors
     *
     * @private
     * @param {Object} file - Box file
     * @return {void}
     */
    fetchFileSuccessCallback = (file: BoxItem): void => {
        this.setState(
            {
                file,
                isLoading: false,
            },
            this.fetchMetadata,
        );
    };

    /**
     * Fetches a file
     *
     * @private
     * @param {Object|void} [fetchOptions] - Fetch options
     * @return {void}
     */
    fetchFile(fetchOptions: RequestOptions = {}): void {
        const { fileId }: Props = this.props;
        this.setState({ isLoading: true });
        if (fileId && SidebarUtils.canHaveSidebar(this.props)) {
            this.api.getFileAPI().getFile(fileId, this.fetchFileSuccessCallback, this.errorCallback, {
                ...fetchOptions,
                fields: SIDEBAR_FIELDS_TO_FETCH,
            });
        }
    }

    /**
     * Refreshes the sidebar panel
     * @returns {void}
     */
    refresh(): void {
        if (this.sidebarRef) {
            this.sidebarRef.refresh();
        }
    }

    /**
     * Renders the sidebar
     *
     * @private
     * @inheritdoc
     * @return {Element}
     */
    render() {
        const {
            activitySidebarProps,
            additionalTabs,
            className,
            currentUser,
            defaultView,
            detailsSidebarProps,
            fileId,
            getPreview,
            getViewer,
            hasAdditionalTabs,
            hasActivityFeed,
            hasMetadata,
            hasSkills,
            hasVersions,
            history,
            isDefaultOpen,
            language,
            messages,
            metadataSidebarProps,
            onAnnotationSelect,
            onVersionChange,
            onVersionHistoryClick,
            versionsSidebarProps,
        }: Props = this.props;
        const { file, isLoading, metadataEditors }: State = this.state;
        const initialPath = defaultView.charAt(0) === '/' ? defaultView : `/${defaultView}`;

        if (!file || !fileId || !SidebarUtils.shouldRenderSidebar(this.props, file, metadataEditors)) {
            return null;
        }

        return (
            <Internationalize language={language} messages={messages}>
                <APIContext.Provider value={(this.api: any)}>
                    <NavRouter history={history} initialEntries={[initialPath]}>
                        <Sidebar
                            activitySidebarProps={activitySidebarProps}
                            additionalTabs={additionalTabs}
                            className={className}
                            currentUser={currentUser}
                            detailsSidebarProps={detailsSidebarProps}
                            file={file}
                            fileId={fileId}
                            getPreview={getPreview}
                            getViewer={getViewer}
                            hasActivityFeed={hasActivityFeed}
                            hasAdditionalTabs={hasAdditionalTabs}
                            hasMetadata={hasMetadata}
                            hasSkills={hasSkills}
                            hasVersions={hasVersions}
                            isDefaultOpen={isDefaultOpen}
                            isLoading={isLoading}
                            metadataEditors={metadataEditors}
                            metadataSidebarProps={metadataSidebarProps}
                            onAnnotationSelect={onAnnotationSelect}
                            onVersionChange={onVersionChange}
                            onVersionHistoryClick={onVersionHistoryClick}
                            versionsSidebarProps={versionsSidebarProps}
                            wrappedComponentRef={ref => {
                                this.sidebarRef = ref;
                            }}
                        />
                    </NavRouter>
                </APIContext.Provider>
            </Internationalize>
        );
    }
}

export type ContentSidebarProps = Props;
export { ContentSidebar as ContentSidebarComponent };
export default flow([
    withFeatureProvider,
    withLogger(ORIGIN_CONTENT_SIDEBAR),
    withErrorBoundary(ORIGIN_CONTENT_SIDEBAR),
])(ContentSidebar);
