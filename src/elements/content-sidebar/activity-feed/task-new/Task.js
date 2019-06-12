// @flow
import * as React from 'react';
import noop from 'lodash/noop';
import flow from 'lodash/flow';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import messages from '../../../common/messages';
import CommentInlineError from '../comment/CommentInlineError';
import IconTaskApproval from '../../../../icons/two-toned/IconTaskApproval';
import IconTaskGeneral from '../../../../icons/two-toned/IconTaskGeneral';
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
import AvatarGroup from './AvatarGroup';
import TaskModal from '../../TaskModal';
import { withFeatureConsumer, getFeatureConfig } from '../../../common/feature-checking';

import './Task.scss';

type Props = {|
    ...TaskNew,
    currentUser: User,
    error?: ActionItemError,
    features?: FeatureConfig,
    getAvatarUrl: GetAvatarUrlCallback,
    getMentionWithQuery?: Function,
    getUserProfileUrl?: GetProfileUrlCallback,
    isDisabled?: boolean,
    isPending?: boolean,
    mentionSelectorContacts?: SelectorItems,
    onAssignmentUpdate: Function,
    onDelete?: Function,
    onEdit?: Function,
    translatedTaggedMessage?: string,
    translations?: Translations,
|};

type State = {
    isEditing: boolean,
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
        modalError: undefined,
        isEditing: false,
    };

    handleEditClick = (): void => {
        this.setState({ isEditing: true });
    };

    handleModalClose = () => {
        this.setState({ isEditing: false });
    };

    handleCreateSuccess = () => {
        this.setState({ isEditing: false });
    };

    handleCreateError = (error: ElementsXhrError) => {
        this.setState({ modalError: error });
    };

    getUsersFromTask = (): SelectorItems => {
        const { assigned_to } = this.props;

        return (
            assigned_to &&
            assigned_to.entries.map(taskCollab => {
                const newSelectorItem: SelectorItem = {
                    ...taskCollab.target,
                    item: {},
                    value: taskCollab.target.id,
                    text: taskCollab.target.name,
                };

                return newSelectorItem;
            })
        );
    };

    render() {
        const {
            assigned_to,
            created_at,
            created_by,
            currentUser,
            due_at,
            error,
            features,
            getAvatarUrl,
            getMentionWithQuery,
            getUserProfileUrl,
            id,
            isPending,
            mentionSelectorContacts,
            description,
            onAssignmentUpdate = noop,
            onDelete,
            onEdit,
            permissions,
            status,
            task_type,
            translatedTaggedMessage,
            translations,
        } = this.props;

        const { modalError, isEditing } = this.state;

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

        return (
            <div className="bcs-task-container">
                {error ? <CommentInlineError {...error} /> : null}
                <div
                    className={classNames('bcs-task', {
                        'bcs-is-pending': isPending || error,
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
                        <AvatarGroup getAvatarUrl={getAvatarUrl} maxAvatars={3} users={assigned_to} />
                    </div>
                    <div className="bcs-task-content">
                        {currentUserAssignment && shouldShowActions && (
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
                        )}
                    </div>
                </div>
                <TaskModal
                    editMode={TASK_EDIT_MODE_EDIT}
                    error={modalError}
                    feedbackUrl={getFeatureConfig(features, 'activityFeed.tasks').feedbackUrl || ''}
                    onCreateError={this.handleCreateError}
                    onCreateSuccess={this.handleCreateSuccess}
                    onModalClose={this.handleModalClose}
                    isTaskFormOpen={isEditing}
                    taskFormProps={{
                        approverSelectorContacts: this.getUsersFromTask(),
                        getAvatarUrl,
                        createTask: () => {},
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
export default flow([withFeatureConsumer])(Task);
