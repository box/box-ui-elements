import * as React from 'react';
import { History } from 'history';
import { injectIntl, IntlShape } from 'react-intl';
import { withRouterIfEnabled } from '../common/routing';

import AddTaskMenuV2 from './AddTaskMenuV2';
import TaskModal from './TaskModal';
import { TASK_TYPE_APPROVAL } from '../../constants';
import type { TaskFormProps } from './activity-feed/task-form/TaskForm';
import type { TaskType } from '../../common/types/tasks';
import type { ElementsXhrError } from '../../common/types/api';
import type { InternalSidebarNavigation, InternalSidebarNavigationHandler } from '../common/types/SidebarNavigation';

export type AddTaskButtonV2Props = {
    history?: History;
    internalSidebarNavigation?: InternalSidebarNavigation;
    internalSidebarNavigationHandler?: InternalSidebarNavigationHandler;
    isDisabled?: boolean;
    onTaskModalClose: () => void;
    routerDisabled?: boolean;
    taskFormProps: TaskFormProps;
    intl: IntlShape;
};

const AddTaskButtonV2: React.FC<AddTaskButtonV2Props> = ({
    history,
    internalSidebarNavigation,
    internalSidebarNavigationHandler,
    isDisabled = false,
    onTaskModalClose,
    routerDisabled,
    taskFormProps,
}) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const [error, setError] = React.useState<ElementsXhrError | null>(null);
    const [isTaskFormOpen, setIsTaskFormOpen] = React.useState(false);
    const [taskType, setTaskType] = React.useState<TaskType>(TASK_TYPE_APPROVAL);

    /*
    1. Pushing the open state into history keeps the sidebar open upon resize and refresh
    2. Preventing the sidebar from closing keeps the task modal open upon edit and resize
    */
    const handleClickMenuItem = React.useCallback(
        (newTaskType: TaskType) => {
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

            setIsTaskFormOpen(true);
            setTaskType(newTaskType);
        },
        [routerDisabled, internalSidebarNavigationHandler, internalSidebarNavigation, history],
    );

    const handleModalClose = React.useCallback(() => {
        setIsTaskFormOpen(false);
        setError(null);

        // Focus the button after state updates
        setTimeout(() => {
            if (buttonRef.current) {
                buttonRef.current.focus();
            }
        }, 0);

        onTaskModalClose();
    }, [onTaskModalClose]);

    const handleSubmitError = React.useCallback((e: ElementsXhrError) => {
        setError(e);
    }, []);

    const setAddTaskButtonRef = React.useCallback((element: HTMLButtonElement | null) => {
        if (element) {
            buttonRef.current = element;
        }
    }, []);

    return (
        <>
            <AddTaskMenuV2
                isDisabled={isDisabled}
                onMenuItemClick={handleClickMenuItem}
                setAddTaskButtonRef={setAddTaskButtonRef}
            />
            <TaskModal
                error={error}
                onSubmitError={handleSubmitError}
                onSubmitSuccess={handleModalClose}
                onModalClose={handleModalClose}
                isTaskFormOpen={isTaskFormOpen}
                taskFormProps={taskFormProps}
                taskType={taskType}
            />
        </>
    );
};

export { AddTaskButtonV2 as AddTaskButtonV2Component };
export default withRouterIfEnabled(injectIntl(AddTaskButtonV2));
