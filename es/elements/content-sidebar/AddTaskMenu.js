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
import './AddTaskMenu.scss';
const AddTaskMenu = props => /*#__PURE__*/React.createElement(DropdownMenu, {
  constrainToScrollParent: true,
  isRightAligned: true
}, /*#__PURE__*/React.createElement(Button, {
  isDisabled: props.isDisabled,
  type: "button",
  setRef: props.setAddTaskButtonRef
}, /*#__PURE__*/React.createElement(MenuToggle, null, /*#__PURE__*/React.createElement(FormattedMessage, messages.tasksAddTask))), /*#__PURE__*/React.createElement(Menu, {
  className: "bcs-AddTaskMenu"
}, /*#__PURE__*/React.createElement(MenuItem, {
  className: "bcs-AddTaskMenu-menuItem",
  "data-target-id": "MenuItem-generalTask",
  onClick: () => props.onMenuItemClick(TASK_TYPE_GENERAL)
}, /*#__PURE__*/React.createElement("div", {
  className: "bcs-AddTaskMenu-icon"
}, /*#__PURE__*/React.createElement(IconTaskGeneral, {
  width: 30,
  height: 30
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "bcs-AddTaskMenu-title"
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.taskAddTaskGeneral)), /*#__PURE__*/React.createElement("div", {
  className: "bcs-AddTaskMenu-description"
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.taskAddTaskGeneralDescription)))), /*#__PURE__*/React.createElement(MenuItem, {
  className: "bcs-AddTaskMenu-menuItem",
  "data-target-id": "MenuItem-approvalTask",
  onClick: () => props.onMenuItemClick(TASK_TYPE_APPROVAL)
}, /*#__PURE__*/React.createElement("div", {
  className: "bcs-AddTaskMenu-icon"
}, /*#__PURE__*/React.createElement(IconTaskApproval, {
  width: 30,
  height: 30
})), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
  className: "bcs-AddTaskMenu-title"
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.taskAddTaskApproval)), /*#__PURE__*/React.createElement("div", {
  className: "bcs-AddTaskMenu-description"
}, /*#__PURE__*/React.createElement(FormattedMessage, messages.taskAddTaskApprovalDescription))))));
export default AddTaskMenu;
//# sourceMappingURL=AddTaskMenu.js.map