import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';

import PlainButton from '../../../components/plain-button';
import Tooltip from '../../../components/tooltip';
import IconCheck from '../../../icons/general/IconCheck';
import IconClose from '../../../icons/general/IconClose';
import { ActionItemErrorPropType, SelectorItemsPropType, UserPropType } from '../../../common/box-proptypes';

import Comment from '../comment';
import messages from '../messages';

import './Task.scss';

const TASK_APPROVED = 'approved';
const TASK_REJECTED = 'rejected';
const TASK_COMPLETED = 'completed';
const TASK_INCOMPLETE = 'incomplete';

const CompletedAssignment = ({ name }) => (
    <div className='box-ui-task-completed-assignment'>
        <div className='box-ui-task-assignment-name'>{name}</div>
        <div className='box-ui-task-assignment-actions'>
            <IconCheck
                className='box-ui-task-check-icon'
                height={18}
                title={<FormattedMessage {...messages.completedAssignment} />}
                width={18}
            />
        </div>
    </div>
);

CompletedAssignment.propTypes = {
    name: PropTypes.string
};

const RejectedAssignment = ({ name }) => (
    <div className='box-ui-task-rejected-assignment'>
        <div className='box-ui-task-assignment-name'>{name}</div>
        <div className='box-ui-task-assignment-actions'>
            <IconClose
                className='box-ui-task-x-icon'
                height={18}
                title={<FormattedMessage {...messages.rejectedAssignment} />}
                width={18}
            />
        </div>
    </div>
);

RejectedAssignment.propTypes = {
    name: PropTypes.string
};

const PendingAssignment = ({ name, onTaskApproval, onTaskReject, shouldShowActions }) => (
    <div className='box-ui-task-pending-assignment'>
        <div className='box-ui-task-assignment-name'>{name}</div>
        {shouldShowActions ? (
            <div className='box-ui-task-assignment-actions'>
                <Tooltip position='bottom-center' text={<FormattedMessage {...messages.taskApprove} />}>
                    <PlainButton className='box-ui-task-check-btn' onClick={onTaskApproval}>
                        <IconCheck className='box-ui-task-check-icon' height={18} width={18} />
                    </PlainButton>
                </Tooltip>
                <Tooltip position='bottom-center' text={<FormattedMessage {...messages.taskReject} />}>
                    <PlainButton className='box-ui-task-x-btn' onClick={onTaskReject}>
                        <IconClose className='box-ui-task-x-icon' height={18} width={18} />
                    </PlainButton>
                </Tooltip>
            </div>
        ) : null}
    </div>
);

PendingAssignment.displayName = 'PendingAssignment';

PendingAssignment.propTypes = {
    name: PropTypes.string,
    onTaskApproval: PropTypes.func,
    onTaskReject: PropTypes.func,
    shouldShowActions: PropTypes.bool
};

// eslint-disable-next-line
class Task extends Component {
    static propTypes = {
        assignees: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                user: UserPropType.isRequired,
                status: PropTypes.string.isRequired
            })
        ),
        createdAt: PropTypes.any,
        createdBy: UserPropType.isRequired,
        currentUser: UserPropType.isRequired,
        dueDate: PropTypes.any,
        error: ActionItemErrorPropType,
        handlers: PropTypes.shape({
            comments: PropTypes.shape({
                create: PropTypes.func,
                delete: PropTypes.func
            }),
            tasks: PropTypes.shape({
                create: PropTypes.func,
                delete: PropTypes.func,
                onTaskAssignmentUpdate: PropTypes.func
            }),
            contacts: PropTypes.shape({
                getApproverWithQuery: PropTypes.func.isRequired,
                getMentionWithQuery: PropTypes.func.isRequired
            }),
            versions: PropTypes.shape({
                info: PropTypes.func
            })
        }),
        id: PropTypes.string.isRequired,
        inputState: PropTypes.shape({
            approverSelectorContacts: SelectorItemsPropType,
            mentionSelectorContacts: SelectorItemsPropType,
            currentUser: UserPropType.isRequired,
            isDisabled: PropTypes.bool
        }),
        isPending: PropTypes.bool,
        onDelete: PropTypes.func,
        onEdit: PropTypes.func,
        onTaskAssignmentUpdate: PropTypes.func,
        permissions: PropTypes.shape({
            comment_delete: PropTypes.bool,
            comment_edit: PropTypes.bool
        }),
        translatedTaggedMessage: PropTypes.string,
        translations: PropTypes.shape({
            translationEnabled: PropTypes.bool,
            onTranslate: PropTypes.func
        }),
        taggedMessage: PropTypes.string.isRequired
    };

    render() {
        const {
            assignees,
            createdAt,
            createdBy,
            currentUser,
            dueDate,
            error,
            handlers,
            id,
            inputState,
            isPending,
            onDelete,
            onEdit,
            onTaskAssignmentUpdate,
            permissions,
            taggedMessage,
            translatedTaggedMessage,
            translations
        } = this.props;
        return (
            <div className={`box-ui-task ${isPending || error ? 'is-pending' : ''}`}>
                <Comment
                    createdAt={createdAt}
                    createdBy={createdBy}
                    currentUser={currentUser}
                    error={error}
                    handlers={handlers}
                    id={id}
                    inputState={inputState}
                    isPending={isPending}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    permissions={permissions}
                    taggedMessage={taggedMessage}
                    translatedTaggedMessage={translatedTaggedMessage}
                    translations={translations}
                />
                <div className='box-ui-task-approvers-container'>
                    <div className='box-ui-task-approvers-header'>
                        <strong>
                            <FormattedMessage {...messages.tasksForApproval} />
                        </strong>
                        {dueDate ? (
                            <span className='box-ui-task-due-date'>
                                <FormattedMessage {...messages.taskDueDate} />
                                <FormattedDate value={dueDate} day='numeric' month='long' year='numeric' />
                            </span>
                        ) : null}
                    </div>
                    <div className='box-ui-task-assignees'>
                        {assignees.map(({ id: taskAssignmentId, user: assigneeUser, status }) => {
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
