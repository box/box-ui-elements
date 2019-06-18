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
import AvatarGroup from './AvatarGroup';
import TaskModal from '../../TaskModal';
import { withFeatureConsumer, getFeatureConfig } from '../../../common/feature-checking';

import './Task.scss';

type Props = {|
    ...TaskNew,
    api: API,
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
    assigned_to: TaskAssigneeCollection,
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
        assigned_to: this.props.assigned_to,
        modalError: undefined,
        isEditing: false,
        isLoading: false,
    };

    handleEditClick = async () => {
        const { assigned_to } = this.state;

        if (assigned_to.next_marker) {
            this.fetchTaskCollaborators().then(() => {
                this.setState({ isEditing: true });
            });
        } else {
            this.setState({ isEditing: true });
        }
    };

    handleModalClose = () => {
        this.setState({ isEditing: false });
    };

    handleSubmitSuccess = () => {
        this.setState({ isEditing: false });
    };

    handleSubmitError = (error: ElementsXhrError) => {
        this.setState({ modalError: error });
    };

    getUsersFromTask = (): SelectorItems => {
        const { assigned_to } = this.state;

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

    fetchTaskCollaborators = (): Promise<any> => {
        const { id, api, task_links } = this.props;
        const { entries } = task_links;
        let fileId = '';

        if (entries[0] && entries[0].target) {
            fileId = entries[0].target.id;
        }

        if (!fileId) {
            return Promise.reject();
        }

        this.setState({ isLoading: true });

        return new Promise((resolve, reject) => {
            api.getTaskCollaboratorsAPI(false).getTaskCollaborators({
                task: { id },
                file: { id: fileId },
                errorCallback: () => {
                    const { errorOccured, taskCollaboratorLoadErrorMessage } = messages;

                    this.setState(
                        {
                            isLoading: false,
                            loadCollabError: {
                                message: taskCollaboratorLoadErrorMessage,
                                title: errorOccured,
                            },
                        },
                        reject,
                    );
                },
                successCallback: assigned_to => {
                    this.setState({ assigned_to, isLoading: false }, resolve);
                },
            });
        });
    };

    render() {
        const {
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

        const { assigned_to, modalError, isEditing, isLoading, loadCollabError } = this.state;

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
                    onSubmitError={this.handleSubmitError}
                    onSubmitSuccess={this.handleSubmitSuccess}
                    onModalClose={this.handleModalClose}
                    isTaskFormOpen={isEditing}
                    taskFormProps={{
                        id,
                        approverSelectorContacts: this.getUsersFromTask() || [],
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
