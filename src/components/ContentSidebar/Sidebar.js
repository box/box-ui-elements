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
    getApproverWithQuery?: Function,
    getMentionWithQuery?: Function,
    translations?: Translations,
    approverSelectorContacts?: SelectorItems,
    mentionSelectorContacts?: SelectorItems,
    activityFeedError?: Errors,
    currentUserError?: Errors,
    getAvatarUrl: (string) => Promise<?string>,
    onToggle: Function,
    onVersionHistoryClick?: Function,
    feedItems?: FeedItems
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
    getApproverWithQuery,
    getMentionWithQuery,
    activityFeedError,
    approverSelectorContacts,
    mentionSelectorContacts,
    getAvatarUrl,
    onToggle,
    onVersionHistoryClick,
    feedItems
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
                    activityFeedError={activityFeedError}
                    approverSelectorContacts={approverSelectorContacts}
                    mentionSelectorContacts={mentionSelectorContacts}
                    getApproverWithQuery={getApproverWithQuery}
                    getMentionWithQuery={getMentionWithQuery}
                    getAvatarUrl={getAvatarUrl}
                    onVersionHistoryClick={onVersionHistoryClick}
                    feedItems={feedItems}
                    {...activitySidebarProps}
                />
            )}
    </React.Fragment>
);

export default Sidebar;
