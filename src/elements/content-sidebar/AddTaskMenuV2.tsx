import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';

import { DropdownMenu, TriggerButton } from '@box/blueprint-web';
import ApprovalTask from '@box/blueprint-web-assets/icons/Fill/ApprovalTask';
import Tasks from '@box/blueprint-web-assets/icons/MediumFilled/Tasks';
import messages from './messages';
import { TASK_TYPE_APPROVAL, TASK_TYPE_GENERAL } from '../../constants';
import type { TaskType } from '../../common/types/tasks';

import './AddTaskMenuV2.scss';

type Props = {
    isDisabled: boolean;
    onMenuItemClick: (taskType: TaskType) => void;
    setAddTaskButtonRef?: (element: HTMLButtonElement | null) => void;
    intl: IntlShape;
};

const AddTaskMenuV2: React.FC<Props> = ({ isDisabled, onMenuItemClick, setAddTaskButtonRef, intl }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleMenuItemClick = React.useCallback(
        (taskType: TaskType) => {
            setIsOpen(false);
            onMenuItemClick(taskType);
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
                    label={intl.formatMessage(messages.tasksAddTask)}
                />
            </DropdownMenu.Trigger>

            <DropdownMenu.Content align="end" className="bcs-AddTaskMenu-v-two">
                <DropdownMenu.Item onClick={() => handleMenuItemClick(TASK_TYPE_GENERAL)}>
                    <div className="bcs-AddTaskMenu-v-two-menuItem">
                        <div className="bcs-AddTaskMenu-v-two-icon">
                            <Tasks color="black" width={20} height={20} />
                        </div>
                        <div>
                            <div className="bcs-AddTaskMenu-v-two-title">
                                {intl.formatMessage(messages.taskAddTaskGeneral)}
                            </div>
                            <div className="bcs-AddTaskMenu-v-two-description">
                                {intl.formatMessage(messages.taskAddTaskGeneralDescription)}
                            </div>
                        </div>
                    </div>
                </DropdownMenu.Item>
                <DropdownMenu.Item onClick={() => handleMenuItemClick(TASK_TYPE_APPROVAL)}>
                    <div className="bcs-AddTaskMenu-v-two-menuItem">
                        <div className="bcs-AddTaskMenu-v-two-icon">
                            <ApprovalTask color="black" width={20} height={20} />
                        </div>
                        <div>
                            <div className="bcs-AddTaskMenu-v-two-title">
                                {intl.formatMessage(messages.taskAddTaskApproval)}
                            </div>
                            <div className="bcs-AddTaskMenu-v-two-description">
                                {intl.formatMessage(messages.taskAddTaskApprovalDescription)}
                            </div>
                        </div>
                    </div>
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
};

export default injectIntl(AddTaskMenuV2);
