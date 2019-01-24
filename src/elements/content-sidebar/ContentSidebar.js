/**
 * @flow
 * @file Content Sidebar Component
 * @author Box
 */

import 'regenerator-runtime/runtime';
import * as React from 'react';
import classNames from 'classnames';
import uniqueid from 'lodash/uniqueId';
import noop from 'lodash/noop';
import flow from 'lodash/flow';
import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator/LoadingIndicator';
import APIContext from 'elements/common/api-context';
import Internationalize from 'elements/common/Internationalize';
import { withErrorBoundary } from 'elements/common/error-boundary';
import { SIDEBAR_FIELDS_TO_FETCH } from 'utils/fields';
import API from 'api';
import { withLogger } from 'elements/common/logger';
import { withFeatureProvider } from 'elements/common/feature-checking';
import { mark } from 'utils/performance';
import { EVENT_JS_READY } from 'elements/common/logger/constants';
import {
    DEFAULT_HOSTNAME_API,
    CLIENT_NAME_CONTENT_SIDEBAR,
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_METADATA,
    ORIGIN_CONTENT_SIDEBAR,
} from '../../constants';
import SidebarUtils from './SidebarUtils';
import type { DetailsSidebarProps } from './DetailsSidebar';
import type { ActivitySidebarProps } from './ActivitySidebar';
import type { MetadataSidebarProps } from './MetadataSidebar';
import type { $AxiosXHR } from 'axios'; // eslint-disable-line
import SidebarNav from './SidebarNav';
import Sidebar from './Sidebar';
import 'elements/common/fonts.scss';
import 'elements/common/base.scss';
import 'elements/common/modal.scss';
import './ContentSidebar.scss';

type Props = {
    activitySidebarProps: ActivitySidebarProps,
    apiHost: string,
    cache?: APICache,
    className: string,
    clientName: string,
    currentUser?: User,
    defaultView?: SidebarView,
    detailsSidebarProps: DetailsSidebarProps,
    features: FeatureConfig,
    fileId?: string,
    getPreview: Function,
    getViewer: Function,
    hasActivityFeed: boolean,
    hasMetadata: boolean,
    hasSkills: boolean,
    isLarge?: boolean,
    language?: string,
    messages?: StringMap,
    metadataSidebarProps: MetadataSidebarProps,
    onVersionHistoryClick?: Function,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    sharedLink?: string,
    sharedLinkPassword?: string,
    token: Token,
} & ErrorContextProps &
    WithLoggerProps;

type State = {
    file?: BoxItem,
    isLoading: boolean,
    isOpen: boolean,
    metadataEditors?: Array<MetadataEditor>,
    view?: SidebarView,
};

const MARK_NAME_JS_READY = `${ORIGIN_CONTENT_SIDEBAR}_${EVENT_JS_READY}`;

mark(MARK_NAME_JS_READY);

class ContentSidebar extends React.PureComponent<Props, State> {
    id: string;

    props: Props;

    state: State;

    api: API;

    static defaultProps = {
        activitySidebarProps: {},
        apiHost: DEFAULT_HOSTNAME_API,
        className: '',
        clientName: CLIENT_NAME_CONTENT_SIDEBAR,
        detailsSidebarProps: {},
        getPreview: noop,
        getViewer: noop,
        hasActivityFeed: false,
        hasMetadata: false,
        hasSkills: false,
        isLarge: true,
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
            isLarge,
            requestInterceptor,
            responseInterceptor,
            sharedLink,
            sharedLinkPassword,
            token,
        } = props;

        this.id = uniqueid('bcs_');
        this.api = new API({
            apiHost,
            cache,
            clientName,
            requestInterceptor,
            responseInterceptor,
            sharedLink,
            sharedLinkPassword,
            token,
        });

        this.state = { isLoading: true, isOpen: !!isLarge };
        /* eslint-disable react/prop-types */
        const { logger } = this.props;
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
        const { fileId, isLarge }: Props = this.props;
        const { fileId: prevFileId, isLarge: prevIsLarge }: Props = prevProps;
        const { view }: State = this.state;

        if (fileId !== prevFileId) {
            this.fetchFile();
        } else if (!view && isLarge !== prevIsLarge) {
            this.setState({ isOpen: isLarge });
        }
    }

    /**
     * Toggle the sidebar view state
     *
     * @param {string} view - the selected view
     * @return {void}
     */
    onToggle = (view: SidebarView): void => {
        const { isOpen, view: priorView }: State = this.state;
        const lastView = priorView || this.getSidebarView();
        const isClosing = isOpen && view === lastView;

        this.setState({
            view,
            isOpen: !isClosing,
        });
    };

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
     * Determines the current sidebar tab view
     *
     * @private
     * @return {string} Sidebar view to use
     */
    getSidebarView(): ?SidebarView {
        const { file, isOpen, metadataEditors, view }: State = this.state;
        const { defaultView }: Props = this.props;

        if (!isOpen) {
            return undefined;
        }

        // If there was a default view provided, force use that
        // only if the view has not been set
        if (!view && defaultView) {
            return defaultView;
        }

        let newView = view;
        const canDefaultToSkills = SidebarUtils.shouldRenderSkillsSidebar(this.props, file);
        const canDefaultToDetails = SidebarUtils.canHaveDetailsSidebar(this.props);
        const canDefaultToActivity = SidebarUtils.canHaveActivitySidebar(this.props);
        const canDefaultToMetadata = SidebarUtils.shouldRenderMetadataSidebar(this.props, metadataEditors);

        // Only reset the view if prior view is no longer applicable
        if (
            !view ||
            (view === SIDEBAR_VIEW_SKILLS && !canDefaultToSkills) ||
            (view === SIDEBAR_VIEW_ACTIVITY && !canDefaultToActivity) ||
            (view === SIDEBAR_VIEW_DETAILS && !canDefaultToDetails) ||
            (view === SIDEBAR_VIEW_METADATA && !canDefaultToMetadata)
        ) {
            if (canDefaultToSkills) {
                newView = SIDEBAR_VIEW_SKILLS;
            } else if (canDefaultToActivity) {
                newView = SIDEBAR_VIEW_ACTIVITY;
            } else if (canDefaultToDetails) {
                newView = SIDEBAR_VIEW_DETAILS;
            } else if (canDefaultToMetadata) {
                newView = SIDEBAR_VIEW_METADATA;
            }
        }

        return newView;
    }

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
                .getMetadataAPI(true)
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
    fetchFile(fetchOptions: FetchOptions = {}): void {
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
     * Renders the sidebar
     *
     * @private
     * @inheritdoc
     * @return {Element}
     */
    render() {
        const {
            activitySidebarProps,
            className,
            currentUser,
            detailsSidebarProps,
            fileId,
            getPreview,
            getViewer,
            hasActivityFeed,
            language,
            messages,
            metadataSidebarProps,
            onVersionHistoryClick,
        }: Props = this.props;
        const { file, isLoading, isOpen, metadataEditors }: State = this.state;
        const hasSidebar = SidebarUtils.shouldRenderSidebar(this.props, file, metadataEditors);

        if (!file || !hasSidebar || !fileId) {
            return null;
        }

        const selectedView = this.getSidebarView();
        const hasSkills = SidebarUtils.shouldRenderSkillsSidebar(this.props, file);
        const hasDetails = SidebarUtils.canHaveDetailsSidebar(this.props);
        const hasMetadata = SidebarUtils.shouldRenderMetadataSidebar(this.props, metadataEditors);
        const styleClassName = classNames(
            'be bcs',
            {
                [selectedView ? `bcs-${selectedView}` : '']: isOpen,
                'bcs-is-open': isOpen,
            },
            className,
        );

        return (
            <Internationalize language={language} messages={messages}>
                <aside id={this.id} className={styleClassName}>
                    <div className="be-app-element">
                        {isLoading ? (
                            <div className="bcs-loading">
                                <LoadingIndicator />
                            </div>
                        ) : (
                            <APIContext.Provider value={(this.api: any)}>
                                <SidebarNav
                                    hasSkills={hasSkills}
                                    hasMetadata={hasMetadata}
                                    hasActivityFeed={hasActivityFeed}
                                    hasDetails={hasDetails}
                                    onToggle={this.onToggle}
                                    selectedView={selectedView}
                                />
                                <Sidebar
                                    activitySidebarProps={activitySidebarProps}
                                    currentUser={currentUser}
                                    detailsSidebarProps={detailsSidebarProps}
                                    file={file}
                                    fileId={fileId}
                                    getPreview={getPreview}
                                    getViewer={getViewer}
                                    key={file.id}
                                    metadataSidebarProps={metadataSidebarProps}
                                    onVersionHistoryClick={onVersionHistoryClick}
                                    selectedView={selectedView}
                                />
                            </APIContext.Provider>
                        )}
                    </div>
                </aside>
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
