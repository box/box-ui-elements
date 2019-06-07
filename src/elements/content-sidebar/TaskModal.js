// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import BetaFeedbackBadge from '../../features/beta-feedback';
import Modal from '../../components/modal/Modal';
import TaskForm from './activity-feed/task-form';
import messages from '../common/messages';
import { TASK_TYPE_APPROVAL, TASK_TYPE_GENERAL } from '../../constants';

type TaskModalProps = {
    error: ?ElementsXhrError,
    feedbackUrl: string,
    handleCreateError: Function,
    handleCreateSuccess: Function,
    handleModalClose: Function,
    isTaskFormOpen: boolean,
    passThrough: Object,
    taskType: TaskType,
};

function getMessageForModalTitle(taskType: TaskType): Object {
    switch (taskType) {
        case TASK_TYPE_GENERAL:
            return messages.tasksCreateGeneralTaskFormTitle;
        case TASK_TYPE_APPROVAL:
        default:
            return messages.tasksCreateApprovalTaskFormTitle;
    }
}

const focusTargetSelector = '.task-modal input';

const TaskModal = (props: TaskModalProps) => {
    // CSS selector for first form element
    // Note: Modal throws an error if this fails to find an element!
    return (
        <Modal
            className="be-modal task-modal"
            data-testid="create-task-modal"
            focusElementSelector={focusTargetSelector}
            isOpen={props.isTaskFormOpen}
            onRequestClose={props.handleModalClose}
            title={
                <React.Fragment>
                    <FormattedMessage {...getMessageForModalTitle(props.taskType)} />
                    <BetaFeedbackBadge tooltip formUrl={props.feedbackUrl} />
                </React.Fragment>
            }
        >
            <div className="be">
                <TaskForm
                    {...props.passThrough}
                    error={props.error}
                    onCancel={props.handleModalClose}
                    onCreateSuccess={props.handleCreateSuccess}
                    onCreateError={props.handleCreateError}
                    taskType={props.taskType}
                />
            </div>
        </Modal>
    );
};

export default TaskModal;
