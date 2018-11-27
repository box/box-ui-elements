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
import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator/LoadingIndicator';
import Sidebar from './Sidebar';
import API from '../../api';
import APIContext from '../APIContext';
import Internationalize from '../Internationalize';
import { withErrorBoundary } from '../ErrorBoundary';
import { SIDEBAR_FIELDS_TO_FETCH } from '../../util/fields';
import {
    DEFAULT_HOSTNAME_API,
    CLIENT_NAME_CONTENT_SIDEBAR,
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_METADATA,
    SIDEBAR_VIEW_NONE,
    ORIGIN_CONTENT_SIDEBAR,
    ERROR_CODE_FETCH_FILE,
} from '../../constants';
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
    activitySidebarProps: ActivitySidebarProps,
    apiHost: string,
    cache?: APICache,
    className: string,
    clientName: string,
    currentUser?: User,
    defaultView?: SidebarView,
    detailsSidebarProps: DetailsSidebarProps,
    fileId?: string,
    getPreview: Function,
    getViewer: Function,
    hasActivityFeed: boolean,
    hasMetadata: boolean,
    hasSkills: boolean,
    isLarge?: boolean,
    language?: string,
    metadataSidebarProps: MetadataSidebarProps,
    messages?: StringMap,
    onVersionHistoryClick?: Function,
    requestInterceptor?: Function,
    responseInterceptor?: Function,
    sharedLink?: string,
    sharedLinkPassword?: string,
    token: Token,
} & ErrorContextProps;

type State = {
    file?: BoxItem,
    hasBeenManuallyToggled: boolean,
    isLoading: boolean,
    metadataEditors?: Array<MetadataEditor>,
    view?: SidebarView,
};

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

        this.state = { hasBeenManuallyToggled: false, isLoading: true };
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
    componentDidUpdate(prevProps: Props) {
        const { fileId, isLarge }: Props = this.props;
        const { fileId: prevFileId, isLarge: prevIsLarge }: Props = prevProps;
        const { file, metadataEditors }: State = this.state;

        if (fileId !== prevFileId) {
            this.fetchFile();
        } else if (isLarge !== prevIsLarge) {
            this.setState({
                view: this.getDefaultSidebarView(file, metadataEditors),
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
        const { view: stateView }: State = this.state;
        const isTogglingOff = view === stateView;
        this.setState({
            view: isTogglingOff ? SIDEBAR_VIEW_NONE : view,
            hasBeenManuallyToggled: true,
        });
    };

    /**
     * Network error callback
     *
     * @private
     * @param {Error} error - Error object
     * @return {void}
     */
    errorCallback = (error: ElementsXhrError): void => {
        /* eslint-disable no-console */
        console.error(error);
        /* eslint-enable no-console */

        /* eslint-disable react/prop-types */
        this.props.onError(error, ERROR_CODE_FETCH_FILE, {
            error,
        });
        /* eslint-enable react/prop-types */
    };

    /**
     * File fetch success callback that sets the file and view
     *
     * @private
     * @param {Object} props - component props
     * @param {Object} file - Box file
     * @return {string} Sidebar view to use
     */
    getDefaultSidebarView(file?: BoxItem, metadataEditors?: Array<MetadataEditor>): SidebarView {
        const { hasBeenManuallyToggled, view }: State = this.state;
        const { isLarge, defaultView }: Props = this.props;

        // If no file we don't have a view
        if (!file) {
            return SIDEBAR_VIEW_NONE;
        }

        // If there was a default view provided, force use that
        if (defaultView) {
            return defaultView;
        }

        if (!hasBeenManuallyToggled && !isLarge) {
            // Hide the sidebar when small viewport only if the user did
            // not manually show or hide a sidebar. That is unless the
            // user has intervened respect responsiveness.
            return SIDEBAR_VIEW_NONE;
        }

        let newView;
        const canDefaultToSkills = SidebarUtils.shouldRenderSkillsSidebar(this.props, file);
        const canDefaultToDetails = SidebarUtils.canHaveDetailsSidebar(this.props);
        const canDefaultToActivity = SidebarUtils.canHaveActivitySidebar(this.props);
        const canDefaultToMetadata = SidebarUtils.shouldRenderMetadataSidebar(this.props, metadataEditors);

        // Calculate the default view with latest props
        // This is the current order of importance for defaulting.
        if (canDefaultToSkills) {
            newView = SIDEBAR_VIEW_SKILLS;
        } else if (canDefaultToActivity) {
            newView = SIDEBAR_VIEW_ACTIVITY;
        } else if (canDefaultToDetails) {
            newView = SIDEBAR_VIEW_DETAILS;
        } else if (canDefaultToMetadata) {
            newView = SIDEBAR_VIEW_METADATA;
        }

        // Only reset the view if prior view is no longer applicable
        if (
            !view ||
            (view === SIDEBAR_VIEW_SKILLS && !canDefaultToSkills) ||
            (view === SIDEBAR_VIEW_ACTIVITY && !canDefaultToActivity) ||
            (view === SIDEBAR_VIEW_DETAILS && !canDefaultToDetails) ||
            (view === SIDEBAR_VIEW_METADATA && !canDefaultToMetadata)
        ) {
            return newView;
        }

        // If the user has manually toggled respect that prior view,
        // otherwise return the newly calculated view based on the above
        // order of importance. This is mostly for making skills tab
        // the priority always if skills are present.
        return hasBeenManuallyToggled ? view : newView;
    }

    /**
     * Success callback for fetching metadata editors
     *
     * @private
     * @param {Object} file - Box file
     * @return {void}
     */
    fetchMetadataSuccessCallback = ({ editors }: { editors: Array<MetadataEditor> }): void => {
        const { file }: State = this.state;
        this.setState({
            metadataEditors: editors,
            view: this.getDefaultSidebarView(file, editors),
        });
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
        const { getMetadata, isFeatureEnabled = true }: MetadataSidebarProps = metadataSidebarProps;

        // Only fetch metadata if we think that the file may have metadata on it
        // but currently the metadata feature is turned off. Use case of this would be a free
        // user who doesn't have the metadata feature but is collabed on a file from a user
        // who added metadata on the file. If the feature is enabled we always end up showing
        // the metadata sidebar irrespective of there being any existing metadata or not.
        const canHaveMetadataSidebar = !isFeatureEnabled && SidebarUtils.canHaveMetadataSidebar(this.props);

        if (canHaveMetadataSidebar) {
            this.api
                .getMetadataAPI(true)
                .getEditors(
                    ((file: any): BoxItem),
                    this.fetchMetadataSuccessCallback,
                    noop,
                    getMetadata,
                    isFeatureEnabled,
                );
        }
    }

    /**
     * File fetch success callback that sets the file and sidebar visibility.
     * Also makes an optional request to fetch metadata editors.
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
                view: this.getDefaultSidebarView(file),
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
        this.setState({
            isLoading: true,
        });
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
            detailsSidebarProps,
            getPreview,
            getViewer,
            hasActivityFeed,
            language,
            messages,
            metadataSidebarProps,
            onVersionHistoryClick,
        }: Props = this.props;
        const { file, isLoading, metadataEditors, view }: State = this.state;
        const hasSidebar = SidebarUtils.shouldRenderSidebar(this.props, file, metadataEditors);

        if (!hasSidebar) {
            return null;
        }

        const hasSkills = SidebarUtils.shouldRenderSkillsSidebar(this.props, file);
        const hasDetails = SidebarUtils.canHaveDetailsSidebar(this.props);
        const hasMetadata = SidebarUtils.shouldRenderMetadataSidebar(this.props, metadataEditors);
        const styleClassName = classNames(
            'be bcs',
            {
                [`bcs-${((view: any): string)}`]: !!view,
                'bcs-is-open': !!view && view !== SIDEBAR_VIEW_NONE,
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
                                <Sidebar
                                    file={((file: any): BoxItem)}
                                    view={view}
                                    detailsSidebarProps={detailsSidebarProps}
                                    activitySidebarProps={activitySidebarProps}
                                    metadataSidebarProps={metadataSidebarProps}
                                    getPreview={getPreview}
                                    getViewer={getViewer}
                                    hasSkills={hasSkills}
                                    hasDetails={hasDetails}
                                    hasMetadata={hasMetadata}
                                    hasActivityFeed={hasActivityFeed}
                                    onToggle={this.onToggle}
                                    onVersionHistoryClick={onVersionHistoryClick}
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
export default withErrorBoundary(ORIGIN_CONTENT_SIDEBAR)(ContentSidebar);
