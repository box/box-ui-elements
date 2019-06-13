// @flow
import * as React from 'react';
import AddTaskMenu from './AddTaskMenu';
import TaskModal from './TaskModal';
import { TASK_TYPE_APPROVAL } from '../../constants';
import type { TaskFormProps } from './activity-feed/task-form/TaskForm';

type Props = {|
    feedbackUrl: string,
    isDisabled: boolean,
    onTaskModalClose: () => void,
    taskFormProps: TaskFormProps,
|};

type State = {
    error: ?ElementsXhrError,
    isTaskFormOpen: boolean,
    taskType: TaskType,
};

class AddTaskButton extends React.Component<Props, State> {
    state = {
        error: null,
        isTaskFormOpen: false,
        taskType: TASK_TYPE_APPROVAL,
    };

    static defaultProps = {
        isDisabled: false,
    };

    handleClickMenuItem = (taskType: TaskType) => this.setState({ isTaskFormOpen: true, taskType });

    handleModalClose = () => {
        this.props.onTaskModalClose();
        this.setState({ isTaskFormOpen: false, error: null });
    };

    handleSubmitSuccess = () => this.setState({ isTaskFormOpen: false, error: null });

    handleSubmitError = (e: ElementsXhrError) => this.setState({ error: e });

    render() {
        const { isDisabled, feedbackUrl, taskFormProps } = this.props;
        const { isTaskFormOpen, taskType, error } = this.state;

        return (
            <React.Fragment>
                <AddTaskMenu isDisabled={isDisabled} onMenuItemClick={this.handleClickMenuItem} />
                <TaskModal
                    error={error}
                    feedbackUrl={feedbackUrl}
                    onSubmitError={this.handleSubmitError}
                    onSubmitSuccess={this.handleSubmitSuccess}
                    onModalClose={this.handleModalClose}
                    isTaskFormOpen={isTaskFormOpen}
                    taskFormProps={taskFormProps}
                    taskType={taskType}
                />
            </React.Fragment>
        );
    }
}

export default AddTaskButton;
