// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../components/button';
import DropdownMenu from '../../components/dropdown-menu';
import MenuToggle from '../../components/dropdown-menu/MenuToggle';
import { Menu, MenuItem } from '../../components/menu';
import IconTaskApproval from '../../icons/two-toned/IconTaskApproval';
import messages from '../common/messages';
import { TASK_TYPE_APPROVAL } from '../../constants';

import './AddTaskMenu.scss';

type Props = {
    isDisabled: boolean,
    onMenuItemClick: (taskType: TaskType) => void,
};

const AddTaskMenu = (props: Props) => (
    <DropdownMenu constrainToScrollParent isRightAligned>
        <Button isDisabled={props.isDisabled} type="button">
            <MenuToggle>
                <FormattedMessage {...messages.tasksAddTask} />
            </MenuToggle>
        </Button>
        <Menu className="bcs-AddTaskMenu">
            <MenuItem className="bcs-AddTaskMenu-menuItem" onClick={() => props.onMenuItemClick(TASK_TYPE_APPROVAL)}>
                <div className="bcs-AddTaskMenu-avatar">
                    <IconTaskApproval />
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
