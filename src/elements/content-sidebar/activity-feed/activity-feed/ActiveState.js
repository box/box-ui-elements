/**
 * @flow
 * @file Active state component for Activity Feed
 */
import * as React from 'react';
import getProp from 'lodash/get';
import Comment from '../comment';
import Task from '../task';
import Version, { CollapsedVersion } from '../version';
import Keywords from '../keywords';
import withErrorHandling from '../../withErrorHandling';

type Props = {
    currentUser?: User,
    getAvatarUrl: string => Promise<?string>,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: string => Promise<string>,
    items: FeedItems,
    mentionSelectorContacts?: SelectorItems,
    onCommentDelete?: Function,
    onTaskAssignmentUpdate?: Function,
    onTaskDelete?: Function,
    onTaskEdit?: Function,
    onVersionInfo?: Function,
    translations?: Translations,
};

const ActiveState = ({
    currentUser,
    items,
    onCommentDelete,
    onTaskDelete,
    onTaskEdit,
    onTaskAssignmentUpdate,
    onVersionInfo,
    translations,
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
                        <li key={type + id} className="bcs-activity-feed-comment">
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
                    return item.task_assignment_collection.total_count ? (
                        <li key={type + id} className="bcs-activity-feed-task">
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
                                permissions={{
                                    can_delete: true,
                                    can_edit: true,
                                }}
                                // permissions are not part of task API so hard code to true
                                translations={translations}
                            />
                        </li>
                    ) : null;
                case 'file_version':
                    return (
                        <li key={type + id} className="bcs-version-item">
                            {versions ? (
                                <CollapsedVersion {...item} onInfo={onVersionInfo} />
                            ) : (
                                <Version {...item} onInfo={onVersionInfo} />
                            )}
                        </li>
                    );
                case 'keywords':
                    return (
                        <li key={type + id} className="bcs-keywords-item">
                            <Keywords {...item} />
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
