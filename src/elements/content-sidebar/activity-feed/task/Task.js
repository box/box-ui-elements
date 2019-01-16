/**
 * @flow
 * @file Tasks component
 */

import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedTime, FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import messages from 'elements/common/messages';
import { fillUserPlaceholder } from 'utils/fields';
import Comment from '../comment';
import AssigneeStatus from './AssigneeStatus';
import PendingAssignment from './PendingAssignment';
import { TASK_APPROVED, TASK_REJECTED, TASK_INCOMPLETE } from '../../../../constants';
import './Task.scss';

type Props = {
    task_assignment_collection: TaskAssignments | SelectorItems,
    created_at: number | string,
    created_by: User,
    currentUser?: User,
    due_at: any,
    error?: ActionItemError,
    id: string,
    isPending?: boolean,
    onDelete?: Function,
    onEdit?: Function,
    onAssignmentUpdate: Function,
    permissions?: BoxItemPermission,
    translatedTaggedMessage?: string,
    translations?: Translations,
    isDisabled?: boolean,
    message: string,
    mentionSelectorContacts?: SelectorItems,
    getMentionWithQuery?: Function,
    getAvatarUrl: string => Promise<?string>,
    getUserProfileUrl?: string => Promise<string>,
};

const MAX_AVATARS = 3;

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
            id,
            isPending,
            onDelete,
            onEdit,
            onAssignmentUpdate = noop,
            message,
            translatedTaggedMessage,
            translations,
            getAvatarUrl,
            getUserProfileUrl,
            getMentionWithQuery,
            mentionSelectorContacts,
        } = this.props;

        const isCommentAuthor = currentUser && created_by && created_by.id === currentUser.id;

        const taskPermissions = {
            can_edit: isCommentAuthor,
            can_delete: isCommentAuthor,
        };

        // // find assignment for current user if permitted

        const currentUserAssignment =
            task_assignment_collection && task_assignment_collection.entries
                ? task_assignment_collection.entries
                      .map(fillUserPlaceholder)
                      .find(({ assigned_to }) => assigned_to.id === currentUser.id)
                : null;

        const assigneeCount = (task_assignment_collection && task_assignment_collection.entries.length) || 0;
        const hiddenAssigneeCount = assigneeCount - MAX_AVATARS;

        return (
            <div
                className={classNames('bcs-task', {
                    'bcs-is-pending': isPending || error,
                })}
                data-testid="task-card"
            >
                <Comment
                    created_at={created_at}
                    created_by={created_by}
                    currentUser={currentUser}
                    error={error}
                    id={id}
                    inlineDeleteMessage={messages.taskDeletePrompt}
                    isPending={isPending}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    permissions={taskPermissions}
                    tagged_message={message}
                    translatedTaggedMessage={translatedTaggedMessage}
                    translations={translations}
                    getAvatarUrl={getAvatarUrl}
                    getUserProfileUrl={getUserProfileUrl}
                    mentionSelectorContacts={mentionSelectorContacts}
                    getMentionWithQuery={getMentionWithQuery}
                />
                <div className="bcs-task-assignment-container">
                    {due_at ? (
                        <div className="bcs-task-due-date">
                            <FormattedMessage {...messages.taskDueDate} />
                            <FormattedTime value={due_at} day="numeric" month="short" year="numeric" />
                        </div>
                    ) : null}
                    <div className="bcs-task-assignments">
                        {task_assignment_collection && task_assignment_collection.entries
                            ? task_assignment_collection.entries
                                  .map(fillUserPlaceholder)
                                  .slice(0, MAX_AVATARS)
                                  .map(({ id: assignmentId, assigned_to, status }) => {
                                      return <AssigneeStatus key={assignmentId} status={status} user={assigned_to} />;
                                  })
                            : null}
                        {hiddenAssigneeCount > 0 ? (
                            <span className="bcs-task-assignment-avatar bcs-task-assignment-count">
                                +{hiddenAssigneeCount}
                            </span>
                        ) : null}
                    </div>
                    {currentUserAssignment && currentUserAssignment.status === TASK_INCOMPLETE ? (
                        <PendingAssignment
                            {...currentUserAssignment}
                            onTaskApproval={
                                isPending ? noop : () => onAssignmentUpdate(id, currentUserAssignment.id, TASK_APPROVED)
                            }
                            onTaskReject={
                                isPending ? noop : () => onAssignmentUpdate(id, currentUserAssignment.id, TASK_REJECTED)
                            }
                            shouldShowActions={onAssignmentUpdate !== noop}
                        />
                    ) : null}
                </div>
            </div>
        );
    }
}
export default Task;
