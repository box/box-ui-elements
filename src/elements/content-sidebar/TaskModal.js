// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import BetaFeedbackBadge from '../../features/beta-feedback';
import Modal from '../../components/modal/Modal';
import TaskForm from './activity-feed/task-form';
import messages from '../common/messages';
import { TASK_EDIT_MODE_CREATE, TASK_TYPE_APPROVAL, TASK_TYPE_GENERAL } from '../../constants';
import type { TaskFormProps } from './activity-feed/task-form/TaskForm';

type TaskModalProps = {
    editMode?: TaskEditMode,
    error: ?ElementsXhrError,
    feedbackUrl: string,
    handleCreateError: (e: ElementsXhrError) => void,
    handleCreateSuccess: () => void,
    handleModalClose: () => void,
    isTaskFormOpen: boolean,
    taskFormProps: TaskFormProps,
    taskType: TaskType,
};

function getMessageForModalTitle(taskType: TaskType, mode: TaskEditMode): MessageDescriptor {
    switch (taskType) {
        case TASK_TYPE_GENERAL:
            return mode === TASK_EDIT_MODE_CREATE
                ? messages.tasksCreateGeneralTaskFormTitle
                : messages.tasksEditGeneralTaskFormTitle;
        case TASK_TYPE_APPROVAL:
        default:
            return mode === TASK_EDIT_MODE_CREATE
                ? messages.tasksCreateApprovalTaskFormTitle
                : messages.tasksEditApprovalTaskFormTitle;
    }
}

const focusTargetSelector: string = '.task-modal input';

const TaskModal = (props: TaskModalProps) => {
    const {
        editMode = TASK_EDIT_MODE_CREATE,
        error,
        handleCreateError,
        handleCreateSuccess,
        handleModalClose,
        taskType,
        feedbackUrl,
        isTaskFormOpen,
        taskFormProps,
    } = props;
    // CSS selector for first form element
    // Note: Modal throws an error if this fails to find an element!
    return (
        <Modal
            className="be-modal task-modal"
            data-testid="create-task-modal"
            focusElementSelector={focusTargetSelector}
            isOpen={isTaskFormOpen}
            onRequestClose={handleModalClose}
            title={
                <React.Fragment>
                    <FormattedMessage {...getMessageForModalTitle(taskType, editMode)} />
                    <BetaFeedbackBadge tooltip formUrl={feedbackUrl} />
                </React.Fragment>
            }
        >
            <div className="be">
                <TaskForm
                    error={error}
                    onCancel={handleModalClose}
                    onCreateSuccess={handleCreateSuccess}
                    onCreateError={handleCreateError}
                    taskType={taskType}
                    {...taskFormProps}
                />
            </div>
        </Modal>
    );
};

export default TaskModal;
