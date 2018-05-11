/**
 * @flow
 * @file Active state component for Activity Feed
 */
import * as React from 'react';
import type { Node } from 'react';

import Comment from '../comment';
import Task from '../task';
import Version, { CollapsedVersion, VersionError } from '../version';
import Keywords from '../keywords';
import type { User, SelectorItems } from '../../../../flowTypes';
import type {
    TaskHandlers,
    CommentHandlers,
    ContactHandlers,
    VersionHandlers,
    Item,
    Translations
} from '../activityFeedFlowTypes';

type Props = {
    currentUser?: User,
    handlers: {
        comments?: CommentHandlers,
        tasks?: TaskHandlers,
        contacts?: ContactHandlers,
        versions?: VersionHandlers
    },
    approverSelectorContacts?: SelectorItems,
    mentionSelectorContacts?: SelectorItems,
    items: Array<Item>,
    onCommentDelete?: Function,
    onTaskAssignmentUpdate?: Function,
    onTaskDelete?: Function,
    onTaskEdit?: Function,
    onVersionInfo?: Function,
    translations?: Translations
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
    handlers,
    approverSelectorContacts,
    mentionSelectorContacts
}: Props): Node => (
    <ul className='bcs-activity-feed-active-state'>
        {items.map((item: any) => {
            const { type, id, errorCode, versions } = item;

            switch (type) {
                case 'comment':
                    return (
                        <li className='bcs-activity-feed-comment' key={type + id}>
                            <Comment
                                id={id}
                                currentUser={currentUser}
                                onDelete={onCommentDelete}
                                {...item}
                                translations={translations}
                                handlers={handlers}
                                approverSelectorContacts={approverSelectorContacts}
                                mentionSelectorContacts={mentionSelectorContacts}
                            />
                        </li>
                    );
                case 'task':
                    return (
                        <li className='bcs-activity-feed-task' key={type + id}>
                            <Task
                                currentUser={currentUser}
                                {...item}
                                onDelete={onTaskDelete}
                                onEdit={onTaskEdit}
                                onTaskAssignmentUpdate={onTaskAssignmentUpdate}
                                translations={translations}
                                handlers={handlers}
                                approverSelectorContacts={approverSelectorContacts}
                                mentionSelectorContacts={mentionSelectorContacts}
                            />
                        </li>
                    );
                case 'file_version':
                    return (
                        <li className='bcs-version-item' key={type + id}>
                            {versions ? (
                                <CollapsedVersion {...item} onInfo={onVersionInfo} />
                            ) : (
                                <Version {...item} onInfo={onVersionInfo} />
                            )}
                        </li>
                    );
                case 'file_version_error':
                    // we currently only display this if errorCode is tooManyVersions
                    if (errorCode !== 'tooManyVersions') {
                        return null;
                    }
                    return (
                        <li className='bcs-version-item' key={type + errorCode}>
                            <VersionError {...item} />
                        </li>
                    );
                case 'keywords':
                    return (
                        <li className='bcs-keywords-item' key={type + id}>
                            <Keywords {...item} />
                        </li>
                    );
                default:
                    return null;
            }
        })}
    </ul>
);

export default ActiveState;
