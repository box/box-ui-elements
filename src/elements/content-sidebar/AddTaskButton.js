// @flow
import * as React from 'react';
import { type RouterHistory } from 'react-router-dom';
import { withRouterIfEnabled } from '../common/routing';

import AddTaskMenu from './AddTaskMenu';
import TaskModal from './TaskModal';
import { TASK_TYPE_APPROVAL } from '../../constants';
import type { TaskFormProps } from './activity-feed/task-form/TaskForm';
import type { TaskType } from '../../common/types/tasks';
import type { ElementsXhrError } from '../../common/types/api';
import type { InternalSidebarNavigation, InternalSidebarNavigationHandler } from '../common/types/SidebarNavigation';

type Props = {|
    history?: RouterHistory,
    internalSidebarNavigation?: InternalSidebarNavigation,
    internalSidebarNavigationHandler?: InternalSidebarNavigationHandler,
    isDisabled: boolean,
    onTaskModalClose: () => void,
    routerDisabled?: boolean,
    taskFormProps: TaskFormProps,
|};

type State = {
    error: ?ElementsXhrError,
    isTaskFormOpen: boolean,
    taskType: TaskType,
};

class AddTaskButton extends React.Component<Props, State> {
    buttonRef = React.createRef<HTMLButtonElement>();

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
    handleClickMenuItem = (taskType: TaskType) => {
        const { history, internalSidebarNavigation, internalSidebarNavigationHandler, routerDisabled } = this.props;

        if (routerDisabled && internalSidebarNavigationHandler) {
            internalSidebarNavigationHandler(
                {
                    ...internalSidebarNavigation,
                    open: true,
                },
                true,
            );
        } else if (history) {
            history.replace({ state: { open: true } });
        }

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

    handleSubmitError = (e: ElementsXhrError) => this.setState({ error: e });

    setAddTaskButtonRef = (element: HTMLButtonElement) => {
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
export default withRouterIfEnabled(AddTaskButton);
