/**
 * @flow
 * @file Tasks component
 */

import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedDate, FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import messages from './messages';
import commentMessages from '../comment/messages';
import { fillUserPlaceholder } from '../../../../utils/fields';
import Comment from '../comment';
import CompletedAssignment from './CompletedAssignment';
import PendingAssignment from './PendingAssignment';
import RejectedAssignment from './RejectedAssignment';

import {
    COMMENT_TYPE_TASK,
    TASK_APPROVED,
    TASK_REJECTED,
    TASK_COMPLETED,
    TASK_INCOMPLETE,
} from '../../../../constants';
import './Task.scss';

type Props = {
    created_at: number | string,
    created_by: User,
    currentUser?: User,
    due_at: any,
    error?: ActionItemError,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    id: string,
    isDisabled?: boolean,
    isPending?: boolean,
    mentionSelectorContacts?: SelectorItems,
    message: string,
    onAssignmentUpdate: Function,
    onDelete?: Function,
    onEdit?: Function,
    permissions?: BoxItemPermission,
    task_assignment_collection: TaskAssignments | SelectorItems,
    translatedTaggedMessage?: string,
    translations?: Translations,
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
                    inlineDeleteMessage={commentMessages.taskDeletePrompt}
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
                    type={COMMENT_TYPE_TASK}
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
                                  .map(({ id: assignmentId, assigned_to, status }) => {
                                      switch (status) {
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
