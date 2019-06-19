/**
 * @flow
 * @file Content Sidebar Component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import flow from 'lodash/flow';
import getProp from 'lodash/get';
import uniqueid from 'lodash/uniqueId';
import { withRouter } from 'react-router-dom';
import type { Location, RouterHistory } from 'react-router-dom';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import LocalStore from '../../utils/LocalStore';
import SidebarNav from './SidebarNav';
import SidebarPanels from './SidebarPanels';
import SidebarUtils from './SidebarUtils';
import { isFeatureEnabled, withFeatureConsumer } from '../common/feature-checking';
import type { ActivitySidebarProps } from './ActivitySidebar';
import type { DetailsSidebarProps } from './DetailsSidebar';
import type { MetadataSidebarProps } from './MetadataSidebar';
import type { FeatureConfig } from '../common/feature-checking';

type Props = {
    activitySidebarProps: ActivitySidebarProps,
    additionalTabs?: Array<AdditionalSidebarTab>,
    className: string,
    currentUser?: User,
    detailsSidebarProps: DetailsSidebarProps,
    features: FeatureConfig,
    file: BoxItem,
    fileId: string,
    getPreview: Function,
    getViewer: Function,
    hasActivityFeed: boolean,
    hasAdditionalTabs: boolean,
    hasMetadata: boolean,
    hasSkills: boolean,
    history: RouterHistory,
    isLarge?: boolean,
    isLoading?: boolean,
    location: Location,
    metadataEditors?: Array<MetadataEditor>,
    metadataSidebarProps: MetadataSidebarProps,
    onVersionChange?: Function,
    onVersionHistoryClick?: Function,
};

type State = {
    isDirty: boolean,
};

export const SIDEBAR_FORCE_KEY: 'bcs.force' = 'bcs.force';
export const SIDEBAR_FORCE_VALUE_CLOSED: 'closed' = 'closed';
export const SIDEBAR_FORCE_VALUE_OPEN: 'open' = 'open';

class Sidebar extends React.Component<Props, State> {
    static defaultProps = {
        isLarge: true,
        isLoading: false,
    };

    id: string = uniqueid('bcs_');

    props: Props;

    state: State = {
        isDirty: false,
    };

    store: LocalStore = new LocalStore();

    constructor(props: Props) {
        super(props);

        this.setForcedByLocation();
    }

    componentDidUpdate(prevProps: Props): void {
        const { fileId, history, location }: Props = this.props;
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
        }
    }

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

        if (event.preventDefault) {
            event.preventDefault();
        }

        history.push(`${history.location.pathname}/versions${fileVersionSlug}`);
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
     * Helper to set the local store open state based on the location open state, if defined
     */
    setForcedByLocation(): void {
        const isLocationOpen: ?boolean = this.getLocationState('open');

        if (isLocationOpen !== undefined && isLocationOpen !== null) {
            this.isForced(isLocationOpen);
        }
    }

    render() {
        const {
            activitySidebarProps,
            additionalTabs,
            className,
            currentUser,
            detailsSidebarProps,
            features,
            file,
            fileId,
            getPreview,
            getViewer,
            hasAdditionalTabs,
            isLarge,
            isLoading,
            metadataEditors,
            metadataSidebarProps,
            onVersionChange,
        }: Props = this.props;

        const isOpen = this.isForcedSet() ? this.isForcedOpen() : !!isLarge;
        const hasActivity = SidebarUtils.canHaveActivitySidebar(this.props);
        const hasDetails = SidebarUtils.canHaveDetailsSidebar(this.props);
        const hasMetadata = SidebarUtils.shouldRenderMetadataSidebar(this.props, metadataEditors);
        const hasSkills = SidebarUtils.shouldRenderSkillsSidebar(this.props, file);
        const hasVersions = isFeatureEnabled(features, 'versions');
        const onVersionHistoryClick = hasVersions ? this.handleVersionHistoryClick : this.props.onVersionHistoryClick;
        const styleClassName = classNames('be bcs', className, {
            'bcs-is-open': isOpen,
        });

        return (
            <aside id={this.id} className={styleClassName}>
                {isLoading ? (
                    <div className="bcs-loading">
                        <LoadingIndicator />
                    </div>
                ) : (
                    <React.Fragment>
                        <SidebarNav
                            additionalTabs={additionalTabs}
                            fileId={fileId}
                            hasActivity={hasActivity}
                            hasAdditionalTabs={hasAdditionalTabs}
                            hasDetails={hasDetails}
                            hasMetadata={hasMetadata}
                            hasSkills={hasSkills}
                            isOpen={isOpen}
                        />
                        <SidebarPanels
                            activitySidebarProps={activitySidebarProps}
                            currentUser={currentUser}
                            detailsSidebarProps={detailsSidebarProps}
                            file={file}
                            fileId={fileId}
                            getPreview={getPreview}
                            getViewer={getViewer}
                            hasActivity={hasActivity}
                            hasDetails={hasDetails}
                            hasMetadata={hasMetadata}
                            hasSkills={hasSkills}
                            hasVersions={hasVersions}
                            isOpen={isOpen}
                            key={file.id}
                            metadataSidebarProps={metadataSidebarProps}
                            onVersionChange={onVersionChange}
                            onVersionHistoryClick={onVersionHistoryClick}
                        />
                    </React.Fragment>
                )}
            </aside>
        );
    }
}

export { Sidebar as SidebarComponent };
export default flow([withFeatureConsumer, withRouter])(Sidebar);
