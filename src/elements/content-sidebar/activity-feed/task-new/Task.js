// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import flow from 'lodash/flow';
import get from 'lodash/get';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import messages from '../../../common/messages';
import CommentInlineError from '../comment/CommentInlineError';
import IconTaskApproval from '../../../../icons/two-toned/IconTaskApproval';
import IconTaskGeneral from '../../../../icons/two-toned/IconTaskGeneral';
import { withAPIContext } from '../../../common/api-context';
import API from '../../../../api/APIFactory';
import {
    TASK_NEW_APPROVED,
    TASK_NEW_REJECTED,
    TASK_NEW_NOT_STARTED,
    TASK_NEW_IN_PROGRESS,
    TASK_NEW_COMPLETED,
    TASK_TYPE_APPROVAL,
    COMMENT_TYPE_TASK,
    TASK_EDIT_MODE_EDIT,
} from '../../../../constants';
import Comment from '../comment';
import TaskActions from './TaskActions';
import TaskDueDate from './TaskDueDate';
import TaskStatus from './TaskStatus';
import AssigneeList from './AssigneeList';
import TaskModal from '../../TaskModal';
import { withFeatureConsumer, getFeatureConfig } from '../../../common/feature-checking';
import type { TaskAssigneeCollection, TaskNew, TaskType } from '../../../../common/types/tasks';

import './Task.scss';

type Props = {|
    ...TaskNew,
    api: API,
    approverSelectorContacts: SelectorItems,
    currentUser: User,
    error?: ActionItemError,
    features?: FeatureConfig,
    getApproverWithQuery?: Function,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    isDisabled?: boolean,
    isPending?: boolean,
    mentionSelectorContacts?: SelectorItems,
    onAssignmentUpdate: Function,
    onDelete?: Function,
    onEdit?: Function,
    onModalClose?: Function,
    translatedTaggedMessage?: string,
    translations?: Translations,
|};

type State = {
    // the complete list of assignees (when task.assigned_to is truncated)
    assignedToFull: TaskAssigneeCollection,
    isAssigneeListOpen: boolean,
    isEditing: boolean,
    isLoading: boolean,
    loadCollabError: ?ActionItemError,
    modalError: ?ElementsXhrError,
};

const getMessageForTask = (isCurrentUser: boolean, taskType: TaskType) => {
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
};

class Task extends React.Component<Props, State> {
    state = {
        loadCollabError: undefined,
        assignedToFull: this.props.assigned_to,
        modalError: undefined,
        isEditing: false,
        isLoading: false,
        isAssigneeListOpen: false,
    };

    handleAssigneeListExpand = () => {
        this.getAllTaskCollaborators(() => {
            this.setState({ isAssigneeListOpen: true });
        });
    };

    handleAssigneeListCollapse = () => {
        this.setState({ isAssigneeListOpen: false });
    };

    handleEditClick = () => {
        this.getAllTaskCollaborators(() => {
            this.setState({ isEditing: true });
        });
    };

    handleModalClose = () => {
        const { onModalClose } = this.props;
        this.setState({ isEditing: false, modalError: undefined });

        if (onModalClose) {
            onModalClose();
        }
    };

    handleSubmitSuccess = () => {
        this.setState({ isEditing: false });
    };

    handleSubmitError = (error: ElementsXhrError) => {
        this.setState({ modalError: error });
    };

    getAllTaskCollaborators = (onSuccess: () => any) => {
        const { id, api, task_links, assigned_to } = this.props;
        const { errorOccured, taskCollaboratorLoadErrorMessage } = messages;

        // skip fetch when there are no additional collaborators
        if (!assigned_to.next_marker) {
            this.setState({ assignedToFull: assigned_to });
            onSuccess();
            return;
        }

        // fileid is required for api calls, check for presence
        const fileId = get(task_links, 'entries[0].target.id');
        if (!fileId) {
            return;
        }

        this.setState({ isLoading: true });
        api.getTaskCollaboratorsAPI(false).getTaskCollaborators({
            task: { id },
            file: { id: fileId },
            errorCallback: () => {
                this.setState({
                    isLoading: false,
                    loadCollabError: {
                        message: taskCollaboratorLoadErrorMessage,
                        title: errorOccured,
                    },
                });
            },
            successCallback: assignedToFull => {
                this.setState({ assignedToFull, isLoading: false });
                onSuccess();
            },
        });
    };

    handleTaskAction = (taskId: string, assignmentId: string, taskStatus: string) => {
        const { onAssignmentUpdate } = this.props;

        this.setState({ isAssigneeListOpen: false });

        onAssignmentUpdate(taskId, assignmentId, taskStatus);
    };

    render() {
        const {
            approverSelectorContacts,
            assigned_to,
            created_at,
            created_by,
            currentUser,
            due_at,
            error,
            features,
            getApproverWithQuery,
            getAvatarUrl,
            getMentionWithQuery,
            getUserProfileUrl,
            id,
            isPending,
            mentionSelectorContacts,
            description,
            onDelete,
            onEdit,
            permissions,
            status,
            task_type,
            translatedTaggedMessage,
            translations,
        } = this.props;

        const { assignedToFull, modalError, isEditing, isLoading, loadCollabError, isAssigneeListOpen } = this.state;

        const taskPermissions = {
            ...permissions,
            can_edit: permissions.can_update,
        };

        const currentUserAssignment =
            assigned_to && assigned_to.entries
                ? assigned_to.entries.find(({ target }) => target.id === currentUser.id)
                : null;

        const shouldShowActions =
            currentUserAssignment &&
            currentUserAssignment.permissions &&
            currentUserAssignment.permissions.can_update &&
            currentUserAssignment.status === TASK_NEW_NOT_STARTED &&
            (status === TASK_NEW_NOT_STARTED || status === TASK_NEW_IN_PROGRESS);

        const TaskTypeIcon = task_type === TASK_TYPE_APPROVAL ? IconTaskApproval : IconTaskGeneral;
        const inlineError = loadCollabError || error;

        return (
            <div className="bcs-task-container">
                {inlineError ? <CommentInlineError {...inlineError} /> : null}
                <div
                    className={classNames('bcs-task', {
                        'bcs-is-pending': isPending || isLoading,
                    })}
                    data-testid="task-card"
                >
                    <Comment
                        avatarRenderer={avatar => (
                            <div className="bcs-task-avatar">
                                {avatar}
                                <TaskTypeIcon width={20} height={20} className="bcs-task-avatar-badge" />
                            </div>
                        )}
                        created_at={created_at}
                        created_by={created_by.target}
                        currentUser={currentUser}
                        id={id}
                        isPending={isPending}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onEditClick={this.handleEditClick}
                        permissions={taskPermissions}
                        tagged_message={description}
                        translatedTaggedMessage={translatedTaggedMessage}
                        translations={translations}
                        type={COMMENT_TYPE_TASK}
                        getAvatarUrl={getAvatarUrl}
                        getUserProfileUrl={getUserProfileUrl}
                        mentionSelectorContacts={mentionSelectorContacts}
                        getMentionWithQuery={getMentionWithQuery}
                        userHeadlineRenderer={userLinkInstance => {
                            return (
                                <FormattedMessage
                                    {...getMessageForTask(!!currentUserAssignment, task_type)}
                                    values={{ user: userLinkInstance }}
                                />
                            );
                        }}
                    />
                    <div className="bcs-task-content bcs-task-status-container">
                        {!!due_at && <TaskDueDate dueDate={due_at} status={status} />}
                        <TaskStatus status={status} />
                    </div>
                    <div className="bcs-task-content">
                        <AssigneeList
                            isOpen={isAssigneeListOpen}
                            onCollapse={this.handleAssigneeListCollapse}
                            onExpand={this.handleAssigneeListExpand}
                            getAvatarUrl={getAvatarUrl}
                            initialAssigneeCount={3}
                            users={isAssigneeListOpen ? assignedToFull : assigned_to}
                        />
                    </div>
                    <div className="bcs-task-content">
                        {currentUserAssignment && shouldShowActions && (
                            <TaskActions
                                taskType={task_type}
                                onTaskApproval={
                                    isPending
                                        ? noop
                                        : () => {
                                              this.handleTaskAction(id, currentUserAssignment.id, TASK_NEW_APPROVED);
                                          }
                                }
                                onTaskReject={
                                    isPending
                                        ? noop
                                        : () => this.handleTaskAction(id, currentUserAssignment.id, TASK_NEW_REJECTED)
                                }
                                onTaskComplete={
                                    isPending
                                        ? noop
                                        : () => this.handleTaskAction(id, currentUserAssignment.id, TASK_NEW_COMPLETED)
                                }
                            />
                        )}
                    </div>
                </div>
                <TaskModal
                    editMode={TASK_EDIT_MODE_EDIT}
                    error={modalError}
                    feedbackUrl={getFeatureConfig(features, 'activityFeed.tasks').feedbackUrl || ''}
                    onSubmitError={this.handleSubmitError}
                    onSubmitSuccess={this.handleSubmitSuccess}
                    onModalClose={this.handleModalClose}
                    isTaskFormOpen={isEditing}
                    taskFormProps={{
                        id,
                        approvers: assignedToFull.entries,
                        approverSelectorContacts,
                        getApproverWithQuery,
                        getAvatarUrl,
                        createTask: () => {},
                        editTask: onEdit,
                        dueDate: due_at,
                        message: description,
                    }}
                    taskType={task_type}
                />
            </div>
        );
    }
}

export { Task as TaskComponent };
export default flow([withFeatureConsumer, withAPIContext])(Task);
