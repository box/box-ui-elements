import * as React from 'react';
import withRouter from '../common/routing/withRouter';
import AddTaskMenu from './AddTaskMenu';
import TaskModal from './TaskModal';
import { TASK_TYPE_APPROVAL } from '../../constants';

/**
 * @typedef {Object} Props
 * @property {import('../common/routing/flowTypes').RouterHistory} history
 * @property {boolean} isDisabled
 * @property {() => void} onTaskModalClose
 * @property {import('./activity-feed/task-form/TaskForm').TaskFormProps} taskFormProps
 */

/**
 * @typedef {Object} State
 * @property {import('../../common/types/api').ElementsXhrError | null} error
 * @property {boolean} isTaskFormOpen
 * @property {import('../../common/types/tasks').TaskType} taskType
 */

/** @extends {React.Component<Props, State>} */
class AddTaskButton extends React.Component {
    /** @type {React.RefObject<HTMLButtonElement>} */
    buttonRef = React.createRef();

    state = {
        error: null,
        isTaskFormOpen: false,
        taskType: TASK_TYPE_APPROVAL,
    };

    static defaultProps = {
        isDisabled: false,
    };

    /*
    1. Pushing the open state into history keeps the sidebar open upon resize and refresh
    2. Preventing the sidebar from closing keeps the task modal open upon edit and resize
    */
    /** @param {import('../../common/types/tasks').TaskType} taskType */
    handleClickMenuItem = taskType => {
        this.props.history.replace({ state: { open: true } });
        this.setState({ isTaskFormOpen: true, taskType });
    };

    handleModalClose = () => {
        const { onTaskModalClose } = this.props;
        this.setState({ isTaskFormOpen: false, error: null }, () => {
            if (this.buttonRef.current) {
                this.buttonRef.current.focus();
            }
        });
        onTaskModalClose();
    };

    /** @param {import('../../common/types/api').ElementsXhrError} e */
    handleSubmitError = e => this.setState({ error: e });

    /** @param {HTMLButtonElement} element */
    setAddTaskButtonRef = element => {
        this.buttonRef.current = element;
    };

    render() {
        const { isDisabled, taskFormProps } = this.props;
        const { isTaskFormOpen, taskType, error } = this.state;

        return (
            <>
                <AddTaskMenu
                    isDisabled={isDisabled}
                    onMenuItemClick={this.handleClickMenuItem}
                    setAddTaskButtonRef={this.setAddTaskButtonRef}
                />
                <TaskModal
                    error={error}
                    onSubmitError={this.handleSubmitError}
                    onSubmitSuccess={this.handleModalClose}
                    onModalClose={this.handleModalClose}
                    isTaskFormOpen={isTaskFormOpen}
                    taskFormProps={taskFormProps}
                    taskType={taskType}
                />
            </>
        );
    }
}

export { AddTaskButton as AddTaskButtonComponent };
export default withRouter(AddTaskButton);
