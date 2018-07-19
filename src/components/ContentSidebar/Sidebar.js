/**
 * @flow
 * @file Preview sidebar component
 * @author Box
 */

import * as React from 'react';
import DetailsSidebar from './DetailsSidebar';
import SkillsSidebar from './SkillsSidebar';
import ActivitySidebar from './ActivitySidebar';
import SidebarNav from './SidebarNav';
import { SIDEBAR_VIEW_SKILLS, SIDEBAR_VIEW_ACTIVITY, SIDEBAR_VIEW_DETAILS } from '../../constants';
import type { DetailsSidebarProps } from './DetailsSidebar';
import type { ActivitySidebarProps } from './ActivitySidebar';
import './Sidebar.scss';

type Props = {
    view?: SidebarView,
    currentUser?: User,
    file: BoxItem,
    getPreviewer: Function,
    activitySidebarProps: ActivitySidebarProps,
    detailsSidebarProps: DetailsSidebarProps,
    hasSkills: boolean,
    hasMetadata: boolean,
    hasActivityFeed: boolean,
    hasSkills: boolean,
    hasDetails: boolean,
    onSkillChange: Function,
    translations?: Translations,
    onToggle: Function,
    onVersionHistoryClick?: Function
};

const Sidebar = ({
    view,
    currentUser,
    file,
    getPreviewer,
    hasMetadata,
    hasActivityFeed,
    hasSkills,
    hasDetails,
    activitySidebarProps,
    detailsSidebarProps,
    onSkillChange,
    onToggle,
    onVersionHistoryClick
}: Props) => (
    <React.Fragment>
        <SidebarNav
            onToggle={onToggle}
            selectedView={view}
            hasSkills={hasSkills}
            hasMetadata={hasMetadata}
            hasActivityFeed={hasActivityFeed}
            hasDetails={hasDetails}
        />
        {view === SIDEBAR_VIEW_DETAILS &&
            hasDetails && (
                <DetailsSidebar
                    file={file}
                    onVersionHistoryClick={onVersionHistoryClick}
                    {...detailsSidebarProps}
                />
            )}
        {view === SIDEBAR_VIEW_SKILLS &&
            hasSkills && <SkillsSidebar file={file} getPreviewer={getPreviewer} onSkillChange={onSkillChange} />}
        {view === SIDEBAR_VIEW_ACTIVITY &&
            hasActivityFeed && (
                <ActivitySidebar
                    currentUser={currentUser}
                    file={file}
                    onVersionHistoryClick={onVersionHistoryClick}
                    {...activitySidebarProps}
                />
            )}
    </React.Fragment>
);

export default Sidebar;
