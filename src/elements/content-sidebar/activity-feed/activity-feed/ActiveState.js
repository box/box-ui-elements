/**
 * @flow
 * @file Active state component for Activity Feed
 */
import * as React from 'react';
import getProp from 'lodash/get';
import { FeatureFlag } from '../../../common/feature-checking';
import AppActivity from '../app-activity';
import Comment from '../comment';
import Task from '../task';
import TaskNew from '../task-new';
import Version, { CollapsedVersion } from '../version';
import Keywords from '../keywords';
import withErrorHandling from '../../withErrorHandling';

type Props = {
    approverSelectorContacts?: SelectorItems,
    currentUser?: User,
    getApproverWithQuery?: Function,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    items: FeedItems,
    mentionSelectorContacts?: SelectorItems,
    onAppActivityDelete?: Function,
    onCommentDelete?: Function,
    onTaskAssignmentUpdate?: Function,
    onTaskDelete?: Function,
    onTaskEdit?: Function,
    onTaskModalClose?: Function,
    onVersionInfo?: Function,
    translations?: Translations,
};

const ActiveState = ({
    approverSelectorContacts,
    currentUser,
    items,
    onAppActivityDelete,
    onCommentDelete,
    onTaskDelete,
    onTaskEdit,
    onTaskAssignmentUpdate,
    onTaskModalClose,
    onVersionInfo,
    translations,
    getApproverWithQuery,
    getAvatarUrl,
    getUserProfileUrl,
    getMentionWithQuery,
    mentionSelectorContacts,
}: Props): React.Node => (
    <ul className="bcs-activity-feed-active-state">
        {items.map((item: any) => {
            const { type, id, versions, permissions } = item;

            switch (type) {
                case 'comment':
                    return (
                        <li key={type + id} className="bcs-activity-feed-comment" data-testid="comment">
                            <Comment
                                {...item}
                                currentUser={currentUser}
                                getAvatarUrl={getAvatarUrl}
                                getUserProfileUrl={getUserProfileUrl}
                                onDelete={onCommentDelete}
                                permissions={{
                                    can_delete: getProp(permissions, 'can_delete', false),
                                    can_edit: getProp(permissions, 'can_edit', false),
                                }}
                                translations={translations}
                            />
                        </li>
                    );
                case 'task':
                    return (
                        <FeatureFlag
                            key={type + id}
                            feature="activityFeed.tasks.newCards"
                            disabled={() => {
                                const hasAssignments =
                                    item.task_assignment_collection && item.task_assignment_collection.total_count;
                                return (
                                    hasAssignments && (
                                        <li className="bcs-activity-feed-task" data-testid="task">
                                            <Task
                                                {...item}
                                                currentUser={currentUser}
                                                getAvatarUrl={getAvatarUrl}
                                                getMentionWithQuery={getMentionWithQuery}
                                                getUserProfileUrl={getUserProfileUrl}
                                                mentionSelectorContacts={mentionSelectorContacts}
                                                onAssignmentUpdate={onTaskAssignmentUpdate}
                                                onDelete={onTaskDelete}
                                                onEdit={onTaskEdit}
                                                // permissions are not part of task API so hard code to true
                                                permissions={{
                                                    can_delete: true,
                                                    can_edit: true,
                                                }}
                                                translations={translations}
                                            />
                                        </li>
                                    )
                                );
                            }}
                            enabled={() => (
                                <li className="bcs-activity-feed-task-new" data-testid="task">
                                    <TaskNew
                                        {...item}
                                        approverSelectorContacts={approverSelectorContacts}
                                        currentUser={currentUser}
                                        getApproverWithQuery={getApproverWithQuery}
                                        getAvatarUrl={getAvatarUrl}
                                        getMentionWithQuery={getMentionWithQuery}
                                        getUserProfileUrl={getUserProfileUrl}
                                        mentionSelectorContacts={mentionSelectorContacts}
                                        onAssignmentUpdate={onTaskAssignmentUpdate}
                                        onDelete={onTaskDelete}
                                        onEdit={onTaskEdit}
                                        onModalClose={onTaskModalClose}
                                        translations={translations}
                                    />
                                </li>
                            )}
                        />
                    );
                case 'file_version':
                    return (
                        <li key={type + id} className="bcs-version-item" data-testid="version">
                            {versions ? (
                                <CollapsedVersion {...item} onInfo={onVersionInfo} />
                            ) : (
                                <Version {...item} onInfo={onVersionInfo} />
                            )}
                        </li>
                    );
                case 'keywords':
                    return (
                        <li key={type + id} className="bcs-keywords-item" data-testid="keyword">
                            <Keywords {...item} />
                        </li>
                    );
                case 'app_activity':
                    return (
                        <li key={type + id} className="bcs-activity-feed-app-activity" data-testid="app-activity">
                            <AppActivity currentUser={currentUser} onDelete={onAppActivityDelete} {...item} />
                        </li>
                    );
                default:
                    return null;
            }
        })}
    </ul>
);

export { ActiveState as ActiveStateComponent };
export default withErrorHandling(ActiveState);
