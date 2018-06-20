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
import './Sidebar.scss';

type Props = {
    view?: SidebarView,
    currentUser?: User,
    file: BoxItem,
    getPreviewer: Function,
    hasSkills: boolean,
    hasProperties: boolean,
    hasMetadata: boolean,
    hasNotices: boolean,
    hasAccessStats: boolean,
    hasClassification: boolean,
    hasActivityFeed: boolean,
    hasVersions: boolean,
    hasSkills: boolean,
    hasDetails: boolean,
    onAccessStatsClick?: Function,
    onDescriptionChange: Function,
    onClassificationClick?: Function,
    onVersionHistoryClick?: Function,
    onSkillChange: Function,
    onCommentCreate?: Function,
    onCommentDelete?: Function,
    onTaskCreate?: Function,
    onTaskDelete?: Function,
    onTaskUpdate?: Function,
    onTaskAssignmentUpdate?: Function,
    getApproverWithQuery?: Function,
    getMentionWithQuery?: Function,
    translations?: Translations,
    versions?: FileVersions,
    comments?: Comments,
    tasks?: Tasks,
    approverSelectorContacts?: SelectorItems,
    mentionSelectorContacts?: SelectorItems,
    accessStats?: FileAccessStats,
    accessStatsError?: Errors,
    fileError?: Errors,
    commentsError?: Errors,
    tasksError?: Errors,
    currentUserError?: Errors,
    getAvatarUrl: (string) => Promise<?string>,
    getUserProfileUrl?: (string) => Promise<string>,
    onToggle: Function
};

const Sidebar = ({
    view,
    currentUser,
    file,
    getPreviewer,
    hasProperties,
    hasMetadata,
    hasNotices,
    hasAccessStats,
    hasClassification,
    hasActivityFeed,
    hasVersions,
    hasSkills,
    hasDetails,
    onAccessStatsClick,
    onDescriptionChange,
    onSkillChange,
    onClassificationClick,
    onVersionHistoryClick,
    onCommentCreate,
    onCommentDelete,
    onTaskCreate,
    onTaskDelete,
    onTaskUpdate,
    onTaskAssignmentUpdate,
    getApproverWithQuery,
    getMentionWithQuery,
    accessStats,
    accessStatsError,
    fileError,
    tasks,
    tasksError,
    comments,
    commentsError,
    versions,
    approverSelectorContacts,
    mentionSelectorContacts,
    getAvatarUrl,
    getUserProfileUrl,
    onToggle
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
                    hasProperties={hasProperties}
                    hasMetadata={hasMetadata}
                    hasNotices={hasNotices}
                    hasAccessStats={hasAccessStats}
                    hasClassification={hasClassification}
                    hasVersions={hasVersions}
                    onSkillChange={onSkillChange}
                    onAccessStatsClick={onAccessStatsClick}
                    onClassificationClick={onClassificationClick}
                    onDescriptionChange={onDescriptionChange}
                    onVersionHistoryClick={onVersionHistoryClick}
                    accessStats={accessStats}
                    accessStatsError={accessStatsError}
                    fileError={fileError}
                />
            )}
        {view === SIDEBAR_VIEW_SKILLS &&
            hasSkills && <SkillsSidebar file={file} getPreviewer={getPreviewer} onSkillChange={onSkillChange} />}
        {view === SIDEBAR_VIEW_ACTIVITY &&
            hasActivityFeed && (
                <ActivitySidebar
                    currentUser={currentUser}
                    file={file}
                    tasks={tasks}
                    tasksError={tasksError}
                    comments={comments}
                    approverSelectorContacts={approverSelectorContacts}
                    mentionSelectorContacts={mentionSelectorContacts}
                    commentsError={commentsError}
                    versions={versions}
                    onCommentCreate={onCommentCreate}
                    onCommentDelete={onCommentDelete}
                    onTaskCreate={onTaskCreate}
                    onTaskDelete={onTaskDelete}
                    onTaskUpdate={onTaskUpdate}
                    onTaskAssignmentUpdate={onTaskAssignmentUpdate}
                    getUserProfileUrl={getUserProfileUrl}
                    getApproverWithQuery={getApproverWithQuery}
                    getMentionWithQuery={getMentionWithQuery}
                    getAvatarUrl={getAvatarUrl}
                />
            )}
    </React.Fragment>
);

export default Sidebar;
