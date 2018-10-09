/**
 * @flow
 * @file Content Sidebar Component
 * @author Box
 */

import 'regenerator-runtime/runtime';
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import uniqueid from 'lodash/uniqueId';
import noop from 'lodash/noop';
import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator/LoadingIndicator';
import Sidebar from './Sidebar';
import API from '../../api';
import APIContext from '../APIContext';
import Internationalize from '../Internationalize';
import { SIDEBAR_FIELDS_TO_FETCH } from '../../util/fields';
import {
    DEFAULT_HOSTNAME_API,
    CLIENT_NAME_CONTENT_SIDEBAR,
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_METADATA,
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
    fileId?: string,
    isLarge?: boolean,
    clientName: string,
    apiHost: string,
    token: Token,
    className: string,
    defaultView?: SidebarView,
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
    onVersionHistoryClick?: Function,
};

type State = {
    view?: SidebarView,
    file?: BoxItem,
    isVisible?: boolean,
    hasBeenToggled?: boolean,
};

class ContentSidebar extends PureComponent<Props, State> {
    id: string;
    props: Props;
    state: State;
    api: API;

    static defaultProps = {
        className: '',
        clientName: CLIENT_NAME_CONTENT_SIDEBAR,
        apiHost: DEFAULT_HOSTNAME_API,
        getPreview: noop,
        getViewer: noop,
        isLarge: true,
        hasSkills: false,
        hasMetadata: false,
        hasActivityFeed: false,
        activitySidebarProps: {},
        detailsSidebarProps: {},
        metadataSidebarProps: {},
    };

    initialState: State = {
        file: undefined,
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
            responseInterceptor,
        });

        // Clone initial state to allow for state reset on new files
        this.state = { ...this.initialState };
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
     * Fetches the root folder on load
     *
     * @private
     * @inheritdoc
     * @return {void}
     */
    componentDidMount() {
        this.fetchData(this.props);
    }

    /**
     * Called when sidebar gets new properties
     *
     * @private
     * @return {void}
     */
    componentWillReceiveProps(nextProps: Props): void {
        const { fileId, isLarge }: Props = this.props;
        const { file, hasBeenToggled }: State = this.state;
        const hasVisibilityChanged = nextProps.isLarge !== isLarge;
        const hasFileIdChanged = nextProps.fileId !== fileId;

        if (hasFileIdChanged) {
            // Clear out existing state
            this.setState({ ...this.initialState });
            this.fetchData(nextProps);
        } else if (!hasBeenToggled && hasVisibilityChanged) {
            this.setState({
                view: this.getDefaultSidebarView(file, nextProps),
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
        const isTogglingOn = !stateView && !!view;
        const isToggling = isTogglingOff || isTogglingOn;
        this.setState({
            view: isTogglingOff ? undefined : view,
            hasBeenToggled: isToggling,
        });
    };

    /**
     * Fetches the file data for the sidebar
     *
     * @param {Object} Props the component props
     * @return {void}
     */
    fetchData(props: Props): void {
        const { fileId }: Props = props;
        if (fileId && SidebarUtils.canHaveSidebar(props)) {
            // Fetch the new file
            this.fetchFile(fileId);
        }
    }

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
     * @param {Object} props - component props
     * @param {Object} file - Box file
     * @return {string} Sidebar view to use
     */
    getDefaultSidebarView(file?: BoxItem, props: Props): SidebarView {
        const { view, hasBeenToggled }: State = this.state;
        const { isLarge, defaultView }: Props = props;

        // If no file we don't have a view
        if (!file) {
            return undefined;
        }

        // If there was a default view provided, force use that
        if (defaultView) {
            return defaultView;
        }

        // If the user manually toggled the sidebar, respect that.
        // Otherwise use responsiveness to determine default view.
        if (!hasBeenToggled && !isLarge) {
            return undefined;
        }

        let newView;
        const canDefaultToSkills = SidebarUtils.shouldRenderSkillsSidebar(
            this.props,
            file,
        );
        const canDefaultToDetails = SidebarUtils.canHaveDetailsSidebar(
            this.props,
        );
        const canDefaultToActivity = SidebarUtils.canHaveActivitySidebar(
            this.props,
        );
        const canDefaultToMetadata = SidebarUtils.canHaveMetadataSidebar(
            this.props,
        );

        // Calculate the default view with latest props
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

        return view;
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
    fetchFileSuccessCallback = (file: BoxItem): void => {
        if (SidebarUtils.shouldRenderSidebar(this.props, file)) {
            this.setState({
                file,
                isVisible: true,
                view: this.getDefaultSidebarView(file, this.props),
            });
        } else {
            this.setState({ isVisible: false });
        }
    };

    /**
     * Fetches a file
     *
     * @private
     * @param {string} id - File id
     * @param {Object|void} [fetchOptions] - Fetch options
     * @return {void}
     */
    fetchFile(id: string, fetchOptions: FetchOptions = {}): void {
        if (SidebarUtils.canHaveSidebar(this.props)) {
            this.api
                .getFileAPI()
                .getFile(
                    id,
                    this.fetchFileSuccessCallback,
                    this.errorCallback,
                    {
                        ...fetchOptions,
                        fields: SIDEBAR_FIELDS_TO_FETCH,
                    },
                );
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
            language,
            messages,
            getPreview,
            getViewer,
            hasActivityFeed,
            className,
            activitySidebarProps,
            detailsSidebarProps,
            metadataSidebarProps,
            onVersionHistoryClick,
        }: Props = this.props;
        const { file, view, isVisible }: State = this.state;

        // By default sidebar is always visible if there is something configured
        // to show via props. At least one of the sidebars is needed for visibility.
        // However we may turn the visibility off if there is no data to show
        // in the sidebar. This can only happen if skills sidebar was showing
        // however there is no skills data to show. For all other sidebars
        // we show them by default even if there is no data in them.
        if (!isVisible || !SidebarUtils.canHaveSidebar(this.props)) {
            return null;
        }

        const styleClassName = classNames(
            'be bcs',
            {
                [`bcs-${((view: any): string)}`]: !!view,
                'bcs-is-open': !!view,
            },
            className,
        );

        const hasSkills = SidebarUtils.shouldRenderSkillsSidebar(
            this.props,
            file,
        );
        const hasDetails = SidebarUtils.canHaveDetailsSidebar(this.props);
        const hasMetadata = SidebarUtils.canHaveMetadataSidebar(this.props);
        const hasSidebar = SidebarUtils.shouldRenderSidebar(this.props, file);

        return (
            <Internationalize language={language} messages={messages}>
                <aside id={this.id} className={styleClassName}>
                    <div className="be-app-element">
                        {hasSidebar ? (
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
                                    onVersionHistoryClick={
                                        onVersionHistoryClick
                                    }
                                />
                            </APIContext.Provider>
                        ) : (
                            <div className="bcs-loading">
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
