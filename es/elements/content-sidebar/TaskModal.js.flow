// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';
import Modal from '../../components/modal/Modal';
import TaskForm from './activity-feed/task-form';
import messages from './messages';
import { TASK_EDIT_MODE_CREATE, TASK_TYPE_APPROVAL, TASK_TYPE_GENERAL } from '../../constants';
import type { TaskFormProps } from './activity-feed/task-form/TaskForm';
import type { TaskType, TaskEditMode } from '../../common/types/tasks';
import type { ElementsXhrError } from '../../common/types/api';

type TaskModalProps = {
    editMode?: TaskEditMode,
    error: ?ElementsXhrError,
    isTaskFormOpen: boolean,
    onModalClose: () => void,
    onSubmitError: (e: ElementsXhrError) => void,
    onSubmitSuccess: () => any,
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

const focusTargetSelector: string = '.task-modal textarea, .task-modal input';

const TaskModal = (props: TaskModalProps) => {
    const {
        editMode = TASK_EDIT_MODE_CREATE,
        error,
        onSubmitError,
        onSubmitSuccess,
        onModalClose,
        taskType,
        isTaskFormOpen,
        taskFormProps,
    } = props;
    // Note: Modal throws an error if this fails to find an element!
    return (
        <Modal
            className="be-modal task-modal"
            data-testid="create-task-modal"
            focusElementSelector={focusTargetSelector}
            isOpen={isTaskFormOpen}
            onRequestClose={onModalClose}
            title={<FormattedMessage {...getMessageForModalTitle(taskType, editMode)} />}
        >
            <div className="be">
                <TaskForm
                    editMode={editMode}
                    // $FlowFixMe
                    error={error}
                    onCancel={onModalClose}
                    onSubmitError={onSubmitError}
                    onSubmitSuccess={onSubmitSuccess}
                    taskType={taskType}
                    {...taskFormProps}
                />
            </div>
        </Modal>
    );
};

export default TaskModal;
