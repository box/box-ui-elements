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
    items: FeedItems,
    onCommentDelete?: Function,
    onTaskAssignmentUpdate?: Function,
    onTaskDelete?: Function,
    onTaskEdit?: Function,
    onVersionInfo?: Function,
    translations?: Translations,
    mentionSelectorContacts?: SelectorItems,
    getMentionWithQuery?: Function,
    getAvatarUrl: (string) => Promise<?string>,
    getUserProfileUrl?: (string) => Promise<string>
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
    mentionSelectorContacts
}: Props): React.Node => (
    <ul className="bcs-activity-feed-active-state">
        {items.map((item: any) => {
            const { type, id, versions, permissions } = item;

            switch (type) {
                case 'comment':
                    return (
                        <li className="bcs-activity-feed-comment" key={type + id}>
                            <Comment
                                {...item}
                                currentUser={currentUser}
                                onDelete={onCommentDelete}
                                translations={translations}
                                getAvatarUrl={getAvatarUrl}
                                getUserProfileUrl={getUserProfileUrl}
                                permissions={{
                                    can_delete: getProp(permissions, 'can_delete', false),
                                    can_edit: getProp(permissions, 'can_edit', false)
                                }}
                            />
                        </li>
                    );
                case 'task':
                    return item.task_assignment_collection.total_count ? (
                        <li className="bcs-activity-feed-task" key={type + id}>
                            <Task
                                {...item}
                                currentUser={currentUser}
                                onDelete={onTaskDelete}
                                onEdit={onTaskEdit}
                                onAssignmentUpdate={onTaskAssignmentUpdate}
                                translations={translations}
                                getAvatarUrl={getAvatarUrl}
                                getUserProfileUrl={getUserProfileUrl}
                                mentionSelectorContacts={mentionSelectorContacts}
                                getMentionWithQuery={getMentionWithQuery}
                                // permissions are not part of task API so hard code to true
                                permissions={{
                                    can_delete: true,
                                    can_edit: true
                                }}
                            />
                        </li>
                    ) : null;
                case 'file_version':
                    return (
                        <li className="bcs-version-item" key={type + id}>
                            {versions ? (
                                <CollapsedVersion {...item} onInfo={onVersionInfo} />
                            ) : (
                                <Version {...item} onInfo={onVersionInfo} />
                            )}
                        </li>
                    );
                case 'keywords':
                    return (
                        <li className="bcs-keywords-item" key={type + id}>
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
