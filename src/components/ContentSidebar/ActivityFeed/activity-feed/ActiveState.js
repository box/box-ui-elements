/**
 * @flow
 * @file Active state component for Activity Feed
 */
import React from 'react';

import Comment from '../comment';
import Task from '../task';
import Version, { CollapsedVersion, VersionError } from '../version';
import Keywords from '../keywords';
import type { User } from '../../../../flowTypes';
import type { Tasks, Comments, Contacts, Versions, InputState, Item } from '../activityFeedFlowTypes';

type Props = {
    currentUser: User,
    handlers: {
        comments: Comments,
        tasks: Tasks,
        contacts: Contacts,
        versions: Versions
    },
    inputState: InputState,
    items: Array<Item>,
    onCommentDelete?: Function,
    onTaskAssignmentUpdate?: Function,
    onTaskDelete?: Function,
    onTaskEdit?: Function,
    onVersionInfo?: Function,
    translations: Translations
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
    inputState,
    handlers
}: Props) => (
    <ul className='box-ui-activity-feed-active-state'>
        {items.map((item) => {
            switch (item.type) {
                case 'comment':
                    return (
                        <li className='box-ui-activity-feed-comment' key={item.type + item.id}>
                            <Comment
                                id={item.id}
                                currentUser={currentUser}
                                onDelete={onCommentDelete}
                                {...item}
                                translations={translations}
                                inputState={inputState}
                                handlers={handlers}
                            />
                        </li>
                    );
                case 'task':
                    return (
                        <li className='box-ui-activity-feed-task' key={item.type + item.id}>
                            <Task
                                currentUser={currentUser}
                                {...item}
                                onDelete={onTaskDelete}
                                onEdit={onTaskEdit}
                                onTaskAssignmentUpdate={onTaskAssignmentUpdate}
                                translations={translations}
                                inputState={inputState}
                                handlers={handlers}
                            />
                        </li>
                    );
                case 'file_version':
                    return (
                        <li className='box-ui-version-item' key={item.type + item.id}>
                            {item.versions ? (
                                <CollapsedVersion {...item} onInfo={onVersionInfo} />
                            ) : (
                                <Version {...item} onInfo={onVersionInfo} />
                            )}
                        </li>
                    );
                case 'file_version_error':
                    // we currently only display this if errorCode is tooManyVersions
                    if (item.errorCode !== 'tooManyVersions') {
                        return null;
                    }
                    return (
                        <li className='box-ui-version-item' key={item.type + item.errorCode}>
                            {<VersionError {...item} />}
                        </li>
                    );
                case 'keywords':
                    return (
                        <li className='box-ui-keywords-item' key={item.type + item.id}>
                            {<Keywords {...item} />}
                        </li>
                    );
                default:
                    return null;
            }
        })}
    </ul>
);

export default ActiveState;
