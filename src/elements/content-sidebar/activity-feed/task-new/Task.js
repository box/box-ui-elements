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
import { TASK_NEW_APPROVED, TASK_NEW_REJECTED, TASK_NEW_INCOMPLETE, TASK_NEW_COMPLETED } from '../../../../constants';
import Comment from '../comment';
import AssigneeStatus from './AssigneeStatus';
import PendingAssignment from './PendingAssignment';
import './Task.scss';

type Props = {
    ...TaskNew,
    currentUser: User,
    error?: ActionItemError,
    getAvatarUrl: string => Promise<?string>,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: string => Promise<string>,
    isDisabled?: boolean,
    isPending?: boolean,
    mentionSelectorContacts?: SelectorItems,
    onAssignmentUpdate: Function,
    onDelete?: Function,
    onEdit?: Function,
    translatedTaggedMessage?: string,
    translations?: Translations,
};

const MAX_AVATARS = 3;

// eslint-disable-next-line
class Task extends React.Component<Props> {
    render(): React.Node {
        const {
            assigned_to,
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
            name,
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
            assigned_to && assigned_to.entries
                ? assigned_to.entries.find(({ target }) => target.id === currentUser.id)
                : null;

        const assigneeCount = (assigned_to && assigned_to.entries.length) || 0;
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
                    created_by={created_by.target}
                    currentUser={currentUser}
                    error={error}
                    id={id}
                    inlineDeleteMessage={messages.taskDeletePrompt}
                    isPending={isPending}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    permissions={taskPermissions}
                    tagged_message={name}
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
                        {assigned_to && assigned_to.entries
                            ? assigned_to.entries
                                  .map(fillUserPlaceholder)
                                  .slice(0, MAX_AVATARS)
                                  .map(({ id: assignmentId, target, status }) => {
                                      return (
                                          <AssigneeStatus
                                              key={assignmentId}
                                              status={status}
                                              user={target}
                                              getAvatarUrl={getAvatarUrl}
                                          />
                                      );
                                  })
                            : null}
                        {hiddenAssigneeCount > 0 ? (
                            <span className="bcs-task-assignment-avatar bcs-task-assignment-count">
                                +{hiddenAssigneeCount}
                            </span>
                        ) : null}
                    </div>
                    {currentUserAssignment && currentUserAssignment.status === TASK_NEW_INCOMPLETE ? (
                        <PendingAssignment
                            {...currentUserAssignment}
                            onTaskApproval={
                                isPending
                                    ? noop
                                    : () => onAssignmentUpdate(id, currentUserAssignment.id, TASK_NEW_APPROVED)
                            }
                            onTaskReject={
                                isPending
                                    ? noop
                                    : () => onAssignmentUpdate(id, currentUserAssignment.id, TASK_NEW_REJECTED)
                            }
                            onTaskComplete={
                                isPending
                                    ? noop
                                    : () => onAssignmentUpdate(id, currentUserAssignment.id, TASK_NEW_COMPLETED)
                            }
                        />
                    ) : null}
                </div>
            </div>
        );
    }
}
export default Task;
