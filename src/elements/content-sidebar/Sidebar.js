/**
 * @flow
 * @file Content Sidebar Component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import flow from 'lodash/flow';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import uniqueid from 'lodash/uniqueId';
import { withRouter } from 'react-router-dom';
import type { Location, RouterHistory } from 'react-router-dom';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import LocalStore from '../../utils/LocalStore';
import SidebarNav from './SidebarNav';
import SidebarPanels from './SidebarPanels';
import SidebarUtils from './SidebarUtils';
// $FlowFixMe TypeScript file
import ThemingStyles from '../common/theming';
import { withCurrentUser } from '../common/current-user';
import { isFeatureEnabled, withFeatureConsumer } from '../common/feature-checking';
import type { FeatureConfig } from '../common/feature-checking';
import type { ActivitySidebarProps } from './ActivitySidebar';
import type { DetailsSidebarProps } from './DetailsSidebar';
import type { DocGenSidebarProps } from './DocGenSidebar/DocGenSidebar';
import type { MetadataSidebarProps } from './MetadataSidebar';
import type { BoxAISidebarProps } from './BoxAISidebar';
import type { VersionsSidebarProps } from './versions';
import type { AdditionalSidebarTab, CustomSidebarPanel } from './flowTypes';
import type { MetadataEditor } from '../../common/types/metadata';
import type { BoxItem, User } from '../../common/types/core';
import type { SignSidebarProps } from './SidebarNavSign';
import type { Errors } from '../common/flowTypes';
// $FlowFixMe TypeScript file
import type { Theme } from '../common/theming';
import { SIDEBAR_VIEW_DOCGEN } from '../../constants';
import API from '../../api';

type Props = {
    activitySidebarProps: ActivitySidebarProps,
    additionalTabs?: Array<AdditionalSidebarTab>,
    api: API,
    boxAISidebarProps: BoxAISidebarProps,
    className: string,
    currentUser?: User,
    currentUserError?: Errors,
    customSidebarPanels?: Array<CustomSidebarPanel>,
    detailsSidebarProps: DetailsSidebarProps,
    docGenSidebarProps: DocGenSidebarProps,
    features: FeatureConfig,
    file: BoxItem,
    fileId: string,
    getPreview: Function,
    getViewer: Function,
    hasActivityFeed: boolean,
    hasAdditionalTabs: boolean,
    hasMetadata: boolean,
    hasNav: boolean,
    hasSkills: boolean,
    hasVersions: boolean,
    history: RouterHistory,
    isDefaultOpen?: boolean,
    isLoading?: boolean,
    location: Location,
    metadataEditors?: Array<MetadataEditor>,
    metadataSidebarProps: MetadataSidebarProps,
    onAnnotationSelect?: Function,
    onOpenChange?: (isOpen: boolean, isInitialState: boolean) => void,
    onPanelChange?: (name: string, isInitialState: boolean) => void,
    onVersionChange?: Function,
    onVersionHistoryClick?: Function,
    signSidebarProps: SignSidebarProps,
    theme?: Theme,
    versionsSidebarProps: VersionsSidebarProps,
};

type State = {
    isDirty: boolean,
};

export const SIDEBAR_FORCE_KEY: 'bcs.force' = 'bcs.force';
export const SIDEBAR_FORCE_VALUE_CLOSED: 'closed' = 'closed';
export const SIDEBAR_FORCE_VALUE_OPEN: 'open' = 'open';
export const SIDEBAR_SELECTED_PANEL_KEY: 'sidebar-selected-panel' = 'sidebar-selected-panel';

class Sidebar extends React.Component<Props, State> {
    static defaultProps = {
        annotatorState: {},
        isDefaultOpen: true,
        isLoading: false,
        getAnnotationsMatchPath: noop,
        getAnnotationsPath: noop,
    };

    id: string = uniqueid('bcs_');

    props: Props;

    sidebarPanels: { current: null | SidebarPanels } = React.createRef();

    state: State;

    store: LocalStore = new LocalStore();

    constructor(props: Props) {
        super(props);

        this.state = {
            isDirty: this.getLocationState('open') || false,
        };

        this.setForcedByLocation();
    }

    componentDidMount() {
        const { file, api, metadataSidebarProps, docGenSidebarProps, onOpenChange = noop }: Props = this.props;
        // if docgen feature is enabled, load metadata to check whether file is a docgen template
        if (docGenSidebarProps.enabled) {
            docGenSidebarProps.checkDocGenTemplate(api, file, metadataSidebarProps.isFeatureEnabled);
        }
        onOpenChange(this.isOpen(), true);
    }

    componentDidUpdate(prevProps: Props): void {
        const { fileId, history, location, onOpenChange = noop }: Props = this.props;
        const { fileId: prevFileId, location: prevLocation }: Props = prevProps;
        const { isDirty }: State = this.state;

        // User navigated to a different file without ever navigating the sidebar
        if (!isDirty && fileId !== prevFileId && location.pathname !== '/') {
            history.replace({ pathname: '/', state: { silent: true } });
        }

        // User navigated or toggled the sidebar intentionally, internally or externally
        if (location !== prevLocation && !this.getLocationState('silent')) {
            this.setForcedByLocation();
            this.setState({ isDirty: true });
            const openState = this.getLocationState('open');
            // Check if the sidebar was expanded / collapsed
            if (prevLocation.state?.open !== openState) {
                onOpenChange(openState, false);
            }
        }

        this.handleDocgenTemplateOnUpdate(prevProps);
    }

    handleDocgenTemplateOnUpdate = (prevProps: Props) => {
        const { history, location, file, api, metadataSidebarProps, docGenSidebarProps } = this.props;
        const { file: prevFile, docGenSidebarProps: prevDocGenSidebarProps }: Props = prevProps;
        // need to re-check if file is a docgen-template on file change
        if (file.id !== prevFile.id && docGenSidebarProps.enabled && docGenSidebarProps.checkDocGenTemplate) {
            docGenSidebarProps.checkDocGenTemplate(api, file, metadataSidebarProps.isFeatureEnabled);
        }
        // if file turns out to be a docgen template
        if (
            docGenSidebarProps.enabled &&
            prevDocGenSidebarProps.isDocGenTemplate !== docGenSidebarProps.isDocGenTemplate
        ) {
            if (docGenSidebarProps.isDocGenTemplate) {
                // navigate to docgen tab
                history.push(`/${SIDEBAR_VIEW_DOCGEN}`);
            } else if (location.pathname === `/${SIDEBAR_VIEW_DOCGEN}`) {
                history.push('/');
            }
        }
    };

    getUrlPrefix = (pathname: string) => {
        const basePath = pathname.substring(1).split('/')[0];
        return basePath;
    };

    /**
     * Handle version history click
     *
     * @param {SyntheticEvent} event - The event
     * @return {void}
     */
    handleVersionHistoryClick = (event: SyntheticEvent<>): void => {
        const { file, history } = this.props;
        const { file_version: currentVersion } = file;
        const fileVersionSlug = currentVersion ? `/${currentVersion.id}` : '';

        const urlPrefix = this.getUrlPrefix(history.location.pathname);

        if (event.preventDefault) {
            event.preventDefault();
        }

        history.push(`/${urlPrefix}/versions${fileVersionSlug}`);
    };

    /**
     * Getter for location state properties.
     *
     * NOTE: Each location on the history stack has its own optional state object that is wholly separate from
     * this component's internal state. Values on the location state object can persist even between refreshes
     * when using certain history contexts, such as BrowserHistory.
     *
     * @param key - Optionally get a specific key value from state
     * @returns {any} - The location state or state key value
     */
    getLocationState(key?: string): any {
        const { location } = this.props;
        const { state: locationState = {} } = location;
        return getProp(locationState, key);
    }

    /**
     * Getter/setter for sidebar forced state
     *
     * @param isOpen - Optionally set the sidebar to open/closed
     * @returns {string|null} - The sidebar open/closed state
     */
    isForced(isOpen?: boolean): ?(typeof SIDEBAR_FORCE_VALUE_CLOSED | typeof SIDEBAR_FORCE_VALUE_OPEN) {
        if (isOpen !== undefined) {
            this.store.setItem(SIDEBAR_FORCE_KEY, isOpen ? SIDEBAR_FORCE_VALUE_OPEN : SIDEBAR_FORCE_VALUE_CLOSED);
        }

        return this.store.getItem(SIDEBAR_FORCE_KEY);
    }

    /**
     * Getter for whether the sidebar has been forced open
     * @returns {boolean} - True if the sidebar has been forced open
     */
    isForcedOpen(): boolean {
        return this.isForced() === SIDEBAR_FORCE_VALUE_OPEN;
    }

    /**
     * Getter for whether the sidebar has been forced open/closed previously
     * @returns {boolean} - True if the sidebar has been forced open/closed previously
     */
    isForcedSet(): boolean {
        return this.isForced() !== null;
    }

    /**
     * Getter for sidebar current open state
     * @returns {boolean} - True if the sidebar is open
     */
    isOpen(): boolean {
        const { isDefaultOpen } = this.props;
        return this.isForcedSet() ? this.isForcedOpen() : !!isDefaultOpen;
    }

    /**
     * Refreshes the sidebar panel
     * @returns {void}
     */
    refresh(shouldRefreshCache: boolean = true): void {
        const { current: sidebarPanels } = this.sidebarPanels;

        if (sidebarPanels) {
            sidebarPanels.refresh(shouldRefreshCache);
        }
    }

    /**
     * Helper to set the local store open state based on the location open state, if defined
     */
    setForcedByLocation(): void {
        const isLocationOpen: ?boolean = this.getLocationState('open');

        if (isLocationOpen !== undefined && isLocationOpen !== null) {
            this.isForced(isLocationOpen);
        }
    }

    getDefaultPanel(): string | typeof undefined {
        const { features } = this.props;

        if (!isFeatureEnabled(features, 'panelSelectionPreservation')) {
            return undefined;
        }

        return this.store.getItem(SIDEBAR_SELECTED_PANEL_KEY) || undefined;
    }

    handlePanelChange = (name: string, isInitialState: boolean) => {
        const { features, onPanelChange = noop } = this.props;
        // We don't need to preserve panel if it's the initial state
        if (isFeatureEnabled(features, 'panelSelectionPreservation') && !isInitialState) {
            this.store.setItem(SIDEBAR_SELECTED_PANEL_KEY, name);
        }
        onPanelChange(name, isInitialState);
    };

    render() {
        const {
            activitySidebarProps,
            additionalTabs,
            boxAISidebarProps,
            className,
            currentUser,
            currentUserError,
            customSidebarPanels,
            detailsSidebarProps,
            docGenSidebarProps,
            file,
            fileId,
            getPreview,
            getViewer,
            hasAdditionalTabs,
            hasNav,
            hasVersions,
            isLoading,
            metadataEditors,
            metadataSidebarProps,
            onAnnotationSelect,
            onVersionChange,
            signSidebarProps,
            theme,
            versionsSidebarProps,
        }: Props = this.props;
        const isOpen = this.isOpen();
        const hasActivity = SidebarUtils.canHaveActivitySidebar(this.props);
        const hasDetails = SidebarUtils.canHaveDetailsSidebar(this.props);
        const hasMetadata = SidebarUtils.shouldRenderMetadataSidebar(this.props, metadataEditors);
        const hasSkills = SidebarUtils.shouldRenderSkillsSidebar(this.props, file);
        const onVersionHistoryClick = hasVersions ? this.handleVersionHistoryClick : this.props.onVersionHistoryClick;
        const styleClassName = classNames('be bcs', className, {
            'bcs-is-open': isOpen,
        });
        const defaultPanel = this.getDefaultPanel();

        return (
            <aside id={this.id} className={styleClassName} data-testid="preview-sidebar">
                <ThemingStyles theme={theme} />
                {isLoading ? (
                    <div className="bcs-loading">
                        <LoadingIndicator />
                    </div>
                ) : (
                    <>
                        {hasNav && (
                            <SidebarNav
                                additionalTabs={additionalTabs}
                                customTabs={customSidebarPanels}
                                elementId={this.id}
                                fileId={fileId}
                                hasActivity={hasActivity}
                                hasAdditionalTabs={hasAdditionalTabs}
                                hasDetails={hasDetails}
                                hasMetadata={hasMetadata}
                                hasSkills={hasSkills}
                                hasDocGen={docGenSidebarProps.isDocGenTemplate}
                                isOpen={isOpen}
                                onPanelChange={this.handlePanelChange}
                                signSidebarProps={signSidebarProps}
                            />
                        )}
                        <SidebarPanels
                            activitySidebarProps={activitySidebarProps}
                            boxAISidebarProps={boxAISidebarProps}
                            currentUser={currentUser}
                            currentUserError={currentUserError}
                            customPanels={customSidebarPanels}
                            elementId={this.id}
                            defaultPanel={defaultPanel}
                            detailsSidebarProps={detailsSidebarProps}
                            docGenSidebarProps={docGenSidebarProps}
                            file={file}
                            fileId={fileId}
                            getPreview={getPreview}
                            getViewer={getViewer}
                            hasActivity={hasActivity}
                            hasDetails={hasDetails}
                            hasDocGen={docGenSidebarProps.isDocGenTemplate}
                            hasMetadata={hasMetadata}
                            hasSkills={hasSkills}
                            hasVersions={hasVersions}
                            isOpen={isOpen}
                            key={file.id}
                            metadataSidebarProps={metadataSidebarProps}
                            onAnnotationSelect={onAnnotationSelect}
                            onPanelChange={this.handlePanelChange}
                            onVersionChange={onVersionChange}
                            onVersionHistoryClick={onVersionHistoryClick}
                            ref={this.sidebarPanels}
                            versionsSidebarProps={versionsSidebarProps}
                        />
                    </>
                )}
            </aside>
        );
    }
}

export { Sidebar as SidebarComponent };
export default flow([withCurrentUser, withFeatureConsumer, withRouter])(Sidebar);
