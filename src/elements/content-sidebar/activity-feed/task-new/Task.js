// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { fillUserPlaceholder } from '../../../../utils/fields';
import messages from '../../../common/messages';
import {
    TASK_NEW_APPROVED,
    TASK_NEW_REJECTED,
    TASK_NEW_INCOMPLETE,
    TASK_NEW_COMPLETED,
    TASK_TYPE_APPROVAL,
} from '../../../../constants';
import Comment from '../comment';
import AssigneeStatus from './AssigneeStatus';
import TaskActions from './TaskActions';
import TaskDueDate from './TaskDueDate';
import Status from './TaskStatus';
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

// eslint-disable-next-line react/prefer-stateless-function
class Task extends React.Component<Props> {
    getMessageForTask(isCurrentUser: boolean, taskType: TaskType): Object {
        if (isCurrentUser) {
            if (taskType === TASK_TYPE_APPROVAL) {
                return messages.tasksFeedHeadlineApprovalCurrentUser;
            }
            return messages.tasksFeedHeadlineGeneralCurrentUser;
        }

        if (taskType === TASK_TYPE_APPROVAL) {
            return messages.tasksFeedHeadlineApproval;
        }
        return messages.tasksFeedHeadlineGeneral;
    }

    render(): React.Node {
        const {
            assigned_to,
            created_at,
            created_by,
            currentUser,
            due_at,
            error,
            getAvatarUrl,
            getMentionWithQuery,
            getUserProfileUrl,
            id,
            isPending,
            mentionSelectorContacts,
            name,
            onAssignmentUpdate = noop,
            onDelete,
            onEdit,
            permissions,
            status,
            task_type,
            translatedTaggedMessage,
            translations,
        } = this.props;

        const taskPermissions = {
            ...permissions,
            // can_edit: permissions.can_update,
            can_edit: false,
        };

        // // find assignment for current user if permitted

        const currentUserAssignment =
            assigned_to && assigned_to.entries
                ? assigned_to.entries.find(({ target }) => target.id === currentUser.id)
                : null;

        const assigneeCount = (assigned_to && assigned_to.entries.length) || 0;
        const hiddenAssigneeCount = assigneeCount - MAX_AVATARS;
        const shouldShowActions =
            currentUserAssignment &&
            currentUserAssignment.permissions &&
            currentUserAssignment.permissions.can_update &&
            currentUserAssignment.status === TASK_NEW_INCOMPLETE &&
            status === TASK_NEW_INCOMPLETE;

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
                    userHeadlineRenderer={userLinkInstance => {
                        return (
                            <FormattedMessage
                                {...this.getMessageForTask(!!currentUserAssignment, task_type)}
                                values={{ user: userLinkInstance }}
                            />
                        );
                    }}
                />
                <div className="bcs-task-assignment-container">
                    <TaskDueDate dueDate={due_at} status={status} />
                    <div className="bcs-task-assignments">
                        {assigned_to && assigned_to.entries
                            ? assigned_to.entries
                                  .map(fillUserPlaceholder)
                                  .slice(0, MAX_AVATARS)
                                  .map(({ id: assignmentId, target, status: assigneeStatus }) => {
                                      return (
                                          <AssigneeStatus
                                              key={assignmentId}
                                              status={assigneeStatus}
                                              user={target}
                                              getAvatarUrl={getAvatarUrl}
                                              data-testid="task-assignment-status"
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
                    {currentUserAssignment && shouldShowActions ? (
                        <TaskActions
                            taskType={task_type}
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
                    ) : (
                        <Status status={status} />
                    )}
                </div>
            </div>
        );
    }
}
export default Task;
