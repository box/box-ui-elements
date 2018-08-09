/**
 * @flow
 * @file Preview sidebar component
 * @author Box
 */

import * as React from 'react';
import DetailsSidebar from './DetailsSidebar';
import SkillsSidebar from './SkillsSidebar';
import ActivitySidebar from './ActivitySidebar';
import MetadataSidebar from './MetadataSidebar';
import SidebarNav from './SidebarNav';
import {
    SIDEBAR_VIEW_SKILLS,
    SIDEBAR_VIEW_ACTIVITY,
    SIDEBAR_VIEW_DETAILS,
    SIDEBAR_VIEW_METADATA
} from '../../constants';
import type { DetailsSidebarProps } from './DetailsSidebar';
import type { ActivitySidebarProps } from './ActivitySidebar';
import type { MetadataSidebarProps } from './MetadataSidebar';
import './Sidebar.scss';

type Props = {
    view?: SidebarView,
    currentUser?: User,
    file: BoxItem,
    getPreview: Function,
    getViewer: Function,
    activitySidebarProps: ActivitySidebarProps,
    detailsSidebarProps: DetailsSidebarProps,
    metadataSidebarProps: MetadataSidebarProps,
    hasSkills: boolean,
    hasMetadata: boolean,
    hasActivityFeed: boolean,
    hasSkills: boolean,
    hasDetails: boolean,
    getApproverWithQuery?: Function,
    getMentionWithQuery?: Function,
    translations?: Translations,
    versions?: FileVersions,
    comments?: Comments,
    tasks?: Tasks,
    approverSelectorContacts?: SelectorItems,
    mentionSelectorContacts?: SelectorItems,
    activityFeedError: ?Errors,
    currentUserError?: Errors,
    getAvatarUrl: (string) => Promise<?string>,
    onToggle: Function,
    onVersionHistoryClick?: Function
};

const Sidebar = ({
    view,
    currentUser,
    file,
    getPreview,
    getViewer,
    hasMetadata,
    hasActivityFeed,
    hasSkills,
    hasDetails,
    activitySidebarProps,
    detailsSidebarProps,
    metadataSidebarProps,
    getApproverWithQuery,
    getMentionWithQuery,
    tasks,
    comments,
    versions,
    activityFeedError,
    approverSelectorContacts,
    mentionSelectorContacts,
    getAvatarUrl,
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
                    key={file.id}
                    file={file}
                    versions={versions}
                    onVersionHistoryClick={onVersionHistoryClick}
                    {...detailsSidebarProps}
                />
            )}
        {view === SIDEBAR_VIEW_SKILLS &&
            hasSkills && <SkillsSidebar key={file.id} file={file} getPreview={getPreview} getViewer={getViewer} />}
        {view === SIDEBAR_VIEW_ACTIVITY &&
            hasActivityFeed && (
                <ActivitySidebar
                    key={file.id}
                    currentUser={currentUser}
                    file={file}
                    tasks={tasks}
                    comments={comments}
                    versions={versions}
                    activityFeedError={activityFeedError}
                    approverSelectorContacts={approverSelectorContacts}
                    mentionSelectorContacts={mentionSelectorContacts}
                    getApproverWithQuery={getApproverWithQuery}
                    getMentionWithQuery={getMentionWithQuery}
                    getAvatarUrl={getAvatarUrl}
                    onVersionHistoryClick={onVersionHistoryClick}
                    {...activitySidebarProps}
                />
            )}
        {view === SIDEBAR_VIEW_METADATA &&
            hasMetadata && <MetadataSidebar key={file.id} file={file} {...metadataSidebarProps} />}
    </React.Fragment>
);

export default Sidebar;
