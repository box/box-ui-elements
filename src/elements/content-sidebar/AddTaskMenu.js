// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../components/button';
import DropdownMenu from '../../components/dropdown-menu';
import MenuToggle from '../../components/dropdown-menu/MenuToggle';
import { Menu, MenuItem } from '../../components/menu';
import IconTaskApproval from '../../icons/two-toned/IconTaskApproval';
import IconTaskGeneral from '../../icons/two-toned/IconTaskGeneral';
import messages from './messages';
import { TASK_TYPE_APPROVAL, TASK_TYPE_GENERAL } from '../../constants';
import type { TaskType } from '../../common/types/tasks';

import './AddTaskMenu.scss';

type Props = {
    isDisabled: boolean,
    onMenuItemClick: (taskType: TaskType) => void,
    setAddTaskButtonRef?: (element: HTMLButtonElement) => void,
};

const AddTaskMenu = (props: Props) => (
    <DropdownMenu constrainToScrollParent isRightAligned>
        <Button isDisabled={props.isDisabled} type="button" setRef={props.setAddTaskButtonRef}>
            <MenuToggle>
                <FormattedMessage {...messages.tasksAddTask} />
            </MenuToggle>
        </Button>
        <Menu className="bcs-AddTaskMenu">
            <MenuItem
                className="bcs-AddTaskMenu-menuItem"
                data-target-id="MenuItem-generalTask"
                onClick={() => props.onMenuItemClick(TASK_TYPE_GENERAL)}
            >
                <div className="bcs-AddTaskMenu-icon">
                    <IconTaskGeneral width={30} height={30} />
                </div>
                <div>
                    <div className="bcs-AddTaskMenu-title">
                        <FormattedMessage {...messages.taskAddTaskGeneral} />
                    </div>
                    <div className="bcs-AddTaskMenu-description">
                        <FormattedMessage {...messages.taskAddTaskGeneralDescription} />
                    </div>
                </div>
            </MenuItem>
            <MenuItem
                className="bcs-AddTaskMenu-menuItem"
                data-target-id="MenuItem-approvalTask"
                onClick={() => props.onMenuItemClick(TASK_TYPE_APPROVAL)}
            >
                <div className="bcs-AddTaskMenu-icon">
                    <IconTaskApproval width={30} height={30} />
                </div>
                <div>
                    <div className="bcs-AddTaskMenu-title">
                        <FormattedMessage {...messages.taskAddTaskApproval} />
                    </div>
                    <div className="bcs-AddTaskMenu-description">
                        <FormattedMessage {...messages.taskAddTaskApprovalDescription} />
                    </div>
                </div>
            </MenuItem>
        </Menu>
    </DropdownMenu>
);

export default AddTaskMenu;
