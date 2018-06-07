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

type Props = {
    file: BoxItem,
    onCommentCreate?: Function,
    onCommentDelete?: Function,
    onTaskCreate?: Function,
    onTaskDelete?: Function,
    onTaskUpdate?: Function,
    onTaskAssignmentUpdate?: Function,
    getApproverWithQuery?: Function,
    getMentionWithQuery?: Function,
    onVersionHistoryClick?: Function,
    comments?: Comments,
    tasks?: Tasks,
    versions?: FileVersions,
    currentUser?: User,
    isDisabled?: boolean,
    approverSelectorContacts?: SelectorItems,
    mentionSelectorContacts?: SelectorItems,
    commentsError?: Errors,
    tasksError?: Errors,
    getAvatarUrl: (string) => Promise<?string>,
    getUserProfileUrl?: (string) => Promise<?string>
};

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
    getUserProfileUrl
}: Props) => (
    <SidebarContent title={<FormattedMessage {...messages.sidebarActivityTitle} />}>
        <ActivityFeed
            file={file}
            comments={comments}
            tasks={tasks}
            versions={versions}
            approverSelectorContacts={approverSelectorContacts}
            mentionSelectorContacts={mentionSelectorContacts}
            currentUser={currentUser}
            isDisabled={isDisabled}
            handlers={{
                comments: {
                    create: onCommentCreate,
                    delete: onCommentDelete
                },
                tasks: {
                    create: onTaskCreate,
                    delete: onTaskDelete,
                    edit: onTaskUpdate,
                    onTaskAssignmentUpdate
                },
                contacts: {
                    approver: getApproverWithQuery,
                    mention: getMentionWithQuery
                },
                versions: {
                    info: onVersionHistoryClick
                }
            }}
            getAvatarUrl={getAvatarUrl}
            getUserProfileUrl={getUserProfileUrl}
        />
    </SidebarContent>
);

export default ActivitySidebar;
