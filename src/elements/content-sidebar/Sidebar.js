/**
 * @flow
 * @file Content Sidebar Component
 * @author Box
 */

import * as React from 'react';
import classNames from 'classnames';
import flow from 'lodash/flow';
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
    isOpen: boolean, // Local isOpen state consists of stored forced state (if any) and responsive adjustments
};

export const SIDEBAR_FORCE_KEY: 'bcs.force' = 'bcs.force';
export const SIDEBAR_FORCE_VALUE_CLOSED: 'closed' = 'closed';
export const SIDEBAR_FORCE_VALUE_OPEN: 'open' = 'open';

class Sidebar extends React.Component<Props, State> {
    id: string = uniqueid('bcs_');

    props: Props;

    state: State;

    store: LocalStore = new LocalStore();

    static defaultProps = {
        isLarge: true,
        isLoading: false,
    };

    constructor(props: Props) {
        super(props);

        const { isLarge } = this.props;

        this.state = {
            isDirty: false,
            isOpen: this.isForcedSet() ? this.isForcedOpen() : !!isLarge,
        };
    }

    componentDidUpdate(prevProps: Props): void {
        const { fileId, history, isLarge, location }: Props = this.props;
        const { fileId: prevFileId, isLarge: prevIsLarge }: Props = prevProps;
        const { isDirty, isOpen }: State = this.state;
        const isForcedSet = this.isForcedSet();

        // User navigated to a different file without ever navigating to a tab
        if (!isDirty && fileId !== prevFileId && location.pathname !== '/') {
            history.replace({ pathname: '/' });
        }

        // User resized their viewport without ever toggling the sidebar open/closed
        if (!isForcedSet && isLarge !== prevIsLarge && isLarge !== isOpen) {
            this.setState({ isOpen: isLarge });
        }
    }

    /**
     * Handle sidebar navigation events
     *
     * @param {SyntheticEvent} event - The event
     * @param {NavigateOptions} options - The navigation options
     * @return {void}
     */
    handleNavigation = (event: SyntheticEvent<>, { isToggle }: NavigateOptions): void => {
        const { isOpen }: State = this.state;

        // Persist user preference for all future sessions in this browser
        this.isForced(isToggle ? !isOpen : true);

        this.setState({
            isDirty: true, // Set dirty state if user has ever clicked on a tab
            isOpen: this.isForcedOpen(),
        });
    };

    /**
     * Handle version history click
     *
     * @param {SyntheticEvent} event - The event
     * @return {void}
     */
    handleVersionHistoryClick = (event: SyntheticEvent<>): void => {
        const { history } = this.props;

        if (event.preventDefault) {
            event.preventDefault();
        }

        history.push(`${history.location.pathname}/versions`);
    };

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
        return this.isForced() !== SIDEBAR_FORCE_VALUE_CLOSED;
    }

    /**
     * Getter for whether the sidebar has been forced open/closed previously
     * @returns {boolean} - True if the sidebar has been forced open/closed previously
     */
    isForcedSet(): boolean {
        return this.isForced() !== null;
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
            hasActivityFeed,
            hasAdditionalTabs,
            isLoading,
            metadataEditors,
            metadataSidebarProps,
            onVersionChange,
        }: Props = this.props;

        const { isOpen } = this.state;
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
                            hasAdditionalTabs={hasAdditionalTabs}
                            hasSkills={hasSkills}
                            hasMetadata={hasMetadata}
                            hasActivityFeed={hasActivityFeed}
                            hasDetails={hasDetails}
                            isOpen={isOpen}
                            onNavigate={this.handleNavigation}
                        />
                        <SidebarPanels
                            activitySidebarProps={activitySidebarProps}
                            currentUser={currentUser}
                            detailsSidebarProps={detailsSidebarProps}
                            file={file}
                            fileId={fileId}
                            getPreview={getPreview}
                            getViewer={getViewer}
                            hasActivityFeed={hasActivityFeed}
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
