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
    detailsSidebarProps: Object,
    hasSkills: boolean,
    hasMetadata: boolean,
    hasActivityFeed: boolean,
    hasSkills: boolean,
    hasDetails: boolean,
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
    hasMetadata,
    hasActivityFeed,
    hasSkills,
    hasDetails,
    detailsSidebarProps,
    onSkillChange,
    onCommentCreate,
    onCommentDelete,
    onTaskCreate,
    onTaskDelete,
    onTaskUpdate,
    onTaskAssignmentUpdate,
    getApproverWithQuery,
    getMentionWithQuery,
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
            hasDetails && <DetailsSidebar file={file} versions={versions} {...detailsSidebarProps} />}
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
