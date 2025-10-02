import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import messages from './messages';
import Button from '../../../../components/button';
import PrimaryButton from '../../../../components/primary-button';
import { TASK_TYPE_APPROVAL, TASK_TYPE_GENERAL } from '../../../../constants';
import './TaskActions.scss';
const TaskActions = ({
  isMultiFile,
  onTaskApproval,
  onTaskReject,
  onTaskComplete,
  onTaskView,
  taskType
}) => {
  let action = null;
  if (isMultiFile) {
    action = onTaskView && /*#__PURE__*/React.createElement(PrimaryButton, {
      className: "bcs-TaskActions-button",
      "data-testid": "view-task",
      onClick: onTaskView,
      "data-resin-target": ACTIVITY_TARGETS.TASK_VIEW_DETAILS
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.tasksFeedViewDetailsAction));
  } else if (taskType === TASK_TYPE_APPROVAL) {
    action = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      className: "bcs-TaskActions-button",
      "data-testid": "reject-task",
      onClick: onTaskReject,
      "data-resin-target": ACTIVITY_TARGETS.TASK_REJECT
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.tasksFeedRejectAction)), /*#__PURE__*/React.createElement(PrimaryButton, {
      className: "bcs-TaskActions-button",
      "data-testid": "approve-task",
      onClick: onTaskApproval,
      "data-resin-target": ACTIVITY_TARGETS.TASK_APPROVE
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.tasksFeedApproveAction)));
  } else if (taskType === TASK_TYPE_GENERAL) {
    action = /*#__PURE__*/React.createElement(PrimaryButton, {
      className: "bcs-TaskActions-button",
      "data-testid": "complete-task",
      onClick: onTaskComplete,
      "data-resin-target": ACTIVITY_TARGETS.TASK_COMPLETE
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.tasksFeedCompleteAction));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "bcs-TaskActions"
  }, action);
};
export default TaskActions;
//# sourceMappingURL=TaskActions.js.map