import * as React from 'react';
import { useIntl } from 'react-intl';

import { DropdownMenu, TriggerButton } from '@box/blueprint-web';
import { ApprovalTask } from '@box/blueprint-web-assets/icons/Fill';
import { Tasks } from '@box/blueprint-web-assets/icons/MediumFilled';
import messages from './messages';
import { TASK_TYPE_APPROVAL, TASK_TYPE_GENERAL } from '../../constants';
import type { TaskType } from '../../common/types/tasks';

import './AddTaskMenuV2.scss';

export interface AddTaskMenuV2Props {
    isDisabled: boolean;
    onMenuItemClick: (taskType: TaskType) => void;
    setAddTaskButtonRef?: (element: HTMLButtonElement | null) => void;
}

const AddTaskMenuV2: React.FC<AddTaskMenuV2Props> = ({ isDisabled, onMenuItemClick, setAddTaskButtonRef }) => {
    const { formatMessage } = useIntl();

    const [isOpen, setIsOpen] = React.useState(false);

    const handleMenuItemClick = React.useCallback(
        (taskType: TaskType) => {
            // Open the modal first
            onMenuItemClick(taskType);
            // Then close the dropdown. We rely on onCloseAutoFocus to prevent focus restoration.
            setIsOpen(false);
        },
        [onMenuItemClick],
    );

    return (
        <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenu.Trigger>
                <TriggerButton
                    variant="secondary"
                    disabled={isDisabled}
                    ref={setAddTaskButtonRef}
                    caretDirection={isOpen ? 'up' : 'down'}
                    label={formatMessage(messages.tasksAddTask)}
                />
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
                align="end"
                className="bcs-AddTaskMenu-v-two"
                onCloseAutoFocus={(event: Event) => {
                    // Prevent focus from returning to the trigger button when the menu closes.
                    // This allows the Modal (which was just opened) to keep focus on its input field
                    // without having it stolen back, which would trigger a blur validation error.
                    event.preventDefault();
                }}
            >
                <DropdownMenu.Item onClick={() => handleMenuItemClick(TASK_TYPE_GENERAL)}>
                    <div className="bcs-AddTaskMenu-v-two-menuItem">
                        <div className="bcs-AddTaskMenu-v-two-icon">
                            <Tasks color="black" width={20} height={20} />
                        </div>
                        <div>
                            <div className="bcs-AddTaskMenu-v-two-title">
                                {formatMessage(messages.taskAddTaskGeneral)}
                            </div>
                            <div className="bcs-AddTaskMenu-v-two-description">
                                {formatMessage(messages.taskAddTaskGeneralDescription)}
                            </div>
                        </div>
                    </div>
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => handleMenuItemClick(TASK_TYPE_APPROVAL)}>
                    <div className="bcs-AddTaskMenu-v-two-menuItem">
                        <div className="bcs-AddTaskMenu-v-two-icon">
                            {/* Should be replaced by icons/MediumFilled/ApprovalTask after it will be availabel */}
                            <ApprovalTask color="black" width={20} height={20} />
                        </div>
                        <div>
                            <div className="bcs-AddTaskMenu-v-two-title">
                                {formatMessage(messages.taskAddTaskApproval)}
                            </div>
                            <div className="bcs-AddTaskMenu-v-two-description">
                                {formatMessage(messages.taskAddTaskApprovalDescription)}
                            </div>
                        </div>
                    </div>
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

export default AddTaskMenuV2;
