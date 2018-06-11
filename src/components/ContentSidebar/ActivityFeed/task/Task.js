/**
 * @flow
 * @file Tasks component
 */

import * as React from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Comment from '../comment';
import CompletedAssignment from './CompletedAssignment';
import messages from '../../../messages';
import PendingAssignment from './PendingAssignment';
import RejectedAssignment from './RejectedAssignment';

import type {
    CommentHandlers,
    ContactHandlers,
    TaskHandlers,
    Translations,
    VersionHandlers
} from '../activityFeedFlowTypes';

import './Task.scss';

const TASK_APPROVED = 'approved';
const TASK_REJECTED = 'rejected';
const TASK_COMPLETED = 'completed';
const TASK_INCOMPLETE = 'incomplete';

type Props = {
    task_assignment_collection: Array<{
        id: number,
        user: User,
        status: string
    }>,
    created_at: number | string,
    created_by: User,
    currentUser: User,
    due_at: any,
    error: ActionItemError,
    handlers: {
        comments?: CommentHandlers,
        tasks?: TaskHandlers,
        contacts?: ContactHandlers,
        versions?: VersionHandlers
    },
    id: string,
    isPending: boolean,
    onDelete: Function,
    onEdit: Function,
    onTaskAssignmentUpdate: Function,
    permissions?: BoxItemPermission,
    translatedTaggedMessage: string,
    translations: Translations,
    currentUser: User,
    isDisabled?: boolean,
    approverSelectorContacts?: SelectorItems,
    mentionSelectorContacts?: SelectorItems,
    message: string,
    getAvatarUrl: (string) => Promise<?string>,
    getUserProfileUrl?: (string) => Promise<string>
};

// eslint-disable-next-line
class Task extends React.Component<Props> {
    render(): React.Node {
        const {
            task_assignment_collection,
            created_at,
            created_by,
            currentUser,
            due_at,
            error,
            handlers,
            id,
            isPending,
            onDelete,
            onEdit,
            onTaskAssignmentUpdate,
            permissions,
            message,
            translatedTaggedMessage,
            translations,
            approverSelectorContacts,
            mentionSelectorContacts,
            getAvatarUrl,
            getUserProfileUrl
        } = this.props;
        return (
            <div className={classNames('bcs-task', { 'bcs-is-pending': isPending || error })}>
                <Comment
                    created_at={created_at}
                    created_by={created_by}
                    currentUser={currentUser}
                    error={error}
                    handlers={handlers}
                    id={id}
                    inlineDeleteMessage={messages.taskDeletePrompt}
                    isPending={isPending}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    permissions={permissions}
                    tagged_message={message}
                    translatedTaggedMessage={translatedTaggedMessage}
                    translations={translations}
                    approverSelectorContacts={approverSelectorContacts}
                    mentionSelectorContacts={mentionSelectorContacts}
                    getAvatarUrl={getAvatarUrl}
                    getUserProfileUrl={getUserProfileUrl}
                />
                <div className='bcs-task-approvers-container'>
                    <div className='bcs-task-approvers-header'>
                        <strong>
                            <FormattedMessage {...messages.tasksForApproval} />
                        </strong>
                        {due_at ? (
                            <span className='bcs-task-due-date'>
                                <FormattedMessage {...messages.taskDueDate} />
                                <FormattedDate value={due_at} day='numeric' month='long' year='numeric' />
                            </span>
                        ) : null}
                    </div>
                    <div className='bcs-task-assignees'>
                        {task_assignment_collection.map(({ id: taskAssignmentId, user: assigneeUser, status }) => {
                            switch (status) {
                                case TASK_INCOMPLETE:
                                    return (
                                        <PendingAssignment
                                            {...assigneeUser}
                                            key={assigneeUser.id}
                                            onTaskApproval={() =>
                                                onTaskAssignmentUpdate(id, taskAssignmentId, TASK_APPROVED)
                                            }
                                            onTaskReject={() =>
                                                onTaskAssignmentUpdate(id, taskAssignmentId, TASK_REJECTED)
                                            }
                                            shouldShowActions={
                                                onTaskAssignmentUpdate && assigneeUser.id === currentUser.id
                                            }
                                        />
                                    );
                                case TASK_COMPLETED:
                                case TASK_APPROVED:
                                    return <CompletedAssignment {...assigneeUser} key={assigneeUser.id} />;
                                case TASK_REJECTED:
                                    return <RejectedAssignment {...assigneeUser} key={assigneeUser.id} />;
                                default:
                                    return null;
                            }
                        })}
                    </div>
                </div>
            </div>
        );
    }
}
export default Task;
