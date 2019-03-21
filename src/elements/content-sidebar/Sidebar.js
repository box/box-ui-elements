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
    isOpen: boolean,
};

class Sidebar extends React.Component<Props, State> {
    id: string = uniqueid('bcs_');

    props: Props;

    state: State;

    static defaultProps = {
        isLarge: true,
        isLoading: false,
    };

    constructor(props: Props) {
        super(props);

        const { isLarge } = this.props;

        this.state = {
            isDirty: false,
            isOpen: !!isLarge,
        };
    }

    componentDidUpdate(prevProps: Props): void {
        const { fileId, history, isLarge, location }: Props = this.props;
        const { fileId: prevFileId, isLarge: prevIsLarge }: Props = prevProps;
        const { isDirty, isOpen }: State = this.state;

        // User navigated to a different file without ever navigating to a tab
        if (!isDirty && fileId !== prevFileId && location.pathname !== '/') {
            history.replace({ pathname: '/' });
        }

        // User resized their viewport without ever navigating to a tab
        if (!isDirty && isLarge !== prevIsLarge && isLarge !== isOpen) {
            this.setState({ isOpen: isLarge });
        }
    }

    /**
     * Toggle the sidebar open state
     *
     * @return {void}
     */
    handleNavigation = (event: SyntheticEvent<>, { isToggle }: NavigateOptions): void => {
        const { isOpen }: State = this.state;

        // User navigated to a tab or toggled an existing tab
        this.setState({ isDirty: true, isOpen: isToggle ? !isOpen : true });
    };

    /**
     * Handle version history click
     *
     * @param {SyntheticEvent} event - The event
     * @return {void}
     */
    handleVersionHistoryClick = (event: SyntheticEvent<>) => {
        const { history } = this.props;

        if (event.preventDefault) {
            event.preventDefault();
        }

        history.push(`${history.location.pathname}/versions`);
    };

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
            onVersionHistoryClick,
        }: Props = this.props;

        const { isOpen } = this.state;
        const hasDetails = SidebarUtils.canHaveDetailsSidebar(this.props);
        const hasMetadata = SidebarUtils.shouldRenderMetadataSidebar(this.props, metadataEditors);
        const hasSkills = SidebarUtils.shouldRenderSkillsSidebar(this.props, file);
        const hasVersions = isFeatureEnabled(features, 'versions');
        const handleVersionHistoryClick = hasVersions && this.handleVersionHistoryClick;
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
                            onVersionHistoryClick={onVersionHistoryClick || handleVersionHistoryClick}
                        />
                    </React.Fragment>
                )}
            </aside>
        );
    }
}

export { Sidebar as SidebarComponent };
export default flow([withFeatureConsumer, withRouter])(Sidebar);
