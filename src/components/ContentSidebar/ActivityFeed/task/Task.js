/**
 * @flow
 * @file Tasks component
 */

import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedDate, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import Comment from '../comment';
import CompletedAssignment from './CompletedAssignment';
import messages from '../../../messages';
import PendingAssignment from './PendingAssignment';
import RejectedAssignment from './RejectedAssignment';

import './Task.scss';
import { fillUserPlaceholder } from '../../../../util/fields';

const TASK_APPROVED = 'approved';
const TASK_REJECTED = 'rejected';
const TASK_COMPLETED = 'completed';
const TASK_INCOMPLETE = 'incomplete';

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
            permissions,
            message,
            translatedTaggedMessage,
            translations,
            getAvatarUrl,
            getUserProfileUrl,
            getMentionWithQuery,
            mentionSelectorContacts,
        } = this.props;
        return (
            <div
                className={classNames('bcs-task', {
                    'bcs-is-pending': isPending || error,
                })}
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
                    permissions={permissions}
                    tagged_message={message}
                    translatedTaggedMessage={translatedTaggedMessage}
                    translations={translations}
                    getAvatarUrl={getAvatarUrl}
                    getUserProfileUrl={getUserProfileUrl}
                    mentionSelectorContacts={mentionSelectorContacts}
                    getMentionWithQuery={getMentionWithQuery}
                />
                <div className="bcs-task-approvers-container">
                    <div className="bcs-task-approvers-header">
                        <strong>
                            <FormattedMessage {...messages.tasksForApproval} />
                        </strong>
                        {due_at ? (
                            <span className="bcs-task-due-date">
                                <FormattedMessage {...messages.taskDueDate} />
                                <FormattedDate value={due_at} day="numeric" month="long" year="numeric" />
                            </span>
                        ) : null}
                    </div>
                    <div className="bcs-task-assignees">
                        {task_assignment_collection && task_assignment_collection.entries
                            ? task_assignment_collection.entries
                                  .map(fillUserPlaceholder)
                                  .map(({ id: assignmentId, assigned_to, resolution_state }) => {
                                      switch (resolution_state) {
                                          case TASK_COMPLETED:
                                          case TASK_APPROVED:
                                              return <CompletedAssignment {...assigned_to} key={assigned_to.id} />;
                                          case TASK_REJECTED:
                                              return <RejectedAssignment {...assigned_to} key={assigned_to.id} />;
                                          case TASK_INCOMPLETE:
                                              return (
                                                  <PendingAssignment
                                                      {...assigned_to}
                                                      key={assigned_to.id}
                                                      onTaskApproval={
                                                          isPending
                                                              ? noop
                                                              : () =>
                                                                    onAssignmentUpdate(id, assignmentId, TASK_APPROVED)
                                                      }
                                                      onTaskReject={
                                                          isPending
                                                              ? noop
                                                              : () =>
                                                                    onAssignmentUpdate(id, assignmentId, TASK_REJECTED)
                                                      }
                                                      shouldShowActions={
                                                          onAssignmentUpdate !== noop &&
                                                          currentUser &&
                                                          assigned_to.id === currentUser.id
                                                      }
                                                  />
                                              );
                                          default:
                                              return null;
                                      }
                                  })
                            : null}
                    </div>
                </div>
            </div>
        );
    }
}
export default Task;
