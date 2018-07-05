/**
 * @flow
 * @file Activity feed sidebar component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import ActivityFeed from './ActivityFeed/activity-feed/ActivityFeed';
import SidebarContent from './SidebarContent';
import messages from '../messages';

type ExternalProps = {
    onCommentCreate?: Function,
    onCommentDelete?: Function,
    onTaskCreate?: Function,
    onTaskDelete?: Function,
    onTaskUpdate?: Function,
    onTaskAssignmentUpdate?: Function,
    onVersionHistoryClick?: Function,
    getUserProfileUrl?: (string) => Promise<string>
};

type Props = {
    file: BoxItem,
    getApproverWithQuery?: Function,
    getMentionWithQuery?: Function,
    translations?: Translations,
    comments?: Comments,
    tasks?: Tasks,
    versions?: FileVersions,
    activityFeedError?: InlineError,
    currentUser?: User,
    isDisabled?: boolean,
    approverSelectorContacts?: SelectorItems,
    mentionSelectorContacts?: SelectorItems,
    getAvatarUrl: (string) => Promise<?string>
} & ExternalProps;

const ActivitySidebar = ({
    file,
    comments,
    tasks,
    versions,
    currentUser,
    isDisabled = false,
    approverSelectorContacts,
    mentionSelectorContacts,
    onCommentCreate,
    onCommentDelete,
    onTaskCreate,
    onTaskDelete,
    onTaskUpdate,
    onTaskAssignmentUpdate,
    getApproverWithQuery,
    getMentionWithQuery,
    onVersionHistoryClick,
    getAvatarUrl,
    getUserProfileUrl,
    activityFeedError
}: Props) => (
    <SidebarContent title={<FormattedMessage {...messages.sidebarActivityTitle} />}>
        <ActivityFeed
            file={file}
            comments={comments}
            tasks={tasks}
            versions={versions}
            activityFeedError={activityFeedError}
            approverSelectorContacts={approverSelectorContacts}
            mentionSelectorContacts={mentionSelectorContacts}
            currentUser={currentUser}
            isDisabled={isDisabled}
            onCommentCreate={onCommentCreate}
            onCommentDelete={onCommentDelete}
            onTaskCreate={onTaskCreate}
            onTaskDelete={onTaskDelete}
            onTaskUpdate={onTaskUpdate}
            onTaskAssignmentUpdate={onTaskAssignmentUpdate}
            getApproverWithQuery={getApproverWithQuery}
            getMentionWithQuery={getMentionWithQuery}
            onVersionHistoryClick={onVersionHistoryClick}
            getAvatarUrl={getAvatarUrl}
            getUserProfileUrl={getUserProfileUrl}
        />
    </SidebarContent>
);

export type ActivitySidebarProps = ExternalProps;
export default ActivitySidebar;
