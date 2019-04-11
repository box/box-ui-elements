// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../../components/button';
import DropdownMenu from '../../components/dropdown-menu';
import MenuToggle from '../../components/dropdown-menu/MenuToggle';
import { Menu, MenuItem } from '../../components/menu';
import IconTaskApproval from '../../icons/two-toned/IconTaskApproval';
import messages from '../common/messages';

import './AddTaskMenu.scss';

const TASK_TYPE_APPROVAL = 'approval';

type Props = {
    isDisabled: boolean,
    onMenuItemClick: (taskType: string) => void,
};

const AddTaskMenu = (props: Props) => (
    <DropdownMenu constrainToScrollParent isRightAligned>
        <Button isDisabled={props.isDisabled} type="button">
            <MenuToggle>
                <FormattedMessage {...messages.tasksAddTask} />
            </MenuToggle>
        </Button>
        <Menu className="bsc-AddTaskMenu">
            <MenuItem className="bsc-AddTaskMenu-menuItem" onClick={() => props.onMenuItemClick(TASK_TYPE_APPROVAL)}>
                <div className="bsc-AddTaskMenu-avatar">
                    <IconTaskApproval />
                </div>
                <div>
                    <div className="bsc-AddTaskMenu-title">
                        <FormattedMessage {...messages.taskAddTaskApproval} />
                    </div>
                    <div className="bsc-AddTaskMenu-description">
                        <FormattedMessage {...messages.taskAddTaskApprovalDescription} />
                    </div>
                </div>
            </MenuItem>
        </Menu>
    </DropdownMenu>
);

export default AddTaskMenu;
