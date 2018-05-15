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
import type { Errors, Comments, Tasks, FileVersions, BoxItem } from '../../flowTypes';

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
    commentsError?: Errors,
    tasksError?: Errors,
    getAvatarUrl: (string) => Promise<?string>
};

const ActivitySidebar = ({
    file,
    comments,
    tasks,
    versions,
    onCommentCreate,
    onCommentDelete,
    onTaskCreate,
    onTaskDelete,
    onTaskUpdate,
    onTaskAssignmentUpdate,
    getApproverWithQuery,
    getMentionWithQuery,
    onVersionHistoryClick,
    getAvatarUrl
}: Props) => (
    <SidebarContent title={<FormattedMessage {...messages.sidebarActivityTitle} />}>
        <ActivityFeed
            file={file}
            comments={comments}
            tasks={tasks}
            versions={versions}
            inputState={{
                // $FlowFixMe
                currentUser: {},
                approverSelectorContacts: [],
                mentionSelectorContacts: []
            }}
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
                    getApproverWithQuery,
                    getMentionWithQuery
                },
                versions: {
                    info: onVersionHistoryClick
                }
            }}
            getAvatarUrl={getAvatarUrl}
        />
    </SidebarContent>
);

export default ActivitySidebar;
