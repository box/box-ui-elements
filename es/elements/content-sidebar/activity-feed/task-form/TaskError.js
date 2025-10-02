function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file Component for in-modal error messages for tasks
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import getProp from 'lodash/get';
import messages from './messages';
import apiMessages from '../../../../api/messages';
import { TASK_EDIT_MODE_EDIT, TASK_MAX_GROUP_ASSIGNEES, ERROR_CODE_GROUP_EXCEEDS_LIMIT } from '../../../../constants';
import InlineNotice from '../../../../components/inline-notice/InlineNotice';
const TaskError = ({
  editMode,
  error,
  taskType
}) => {
  const isEditMode = editMode === TASK_EDIT_MODE_EDIT;
  const isForbiddenErrorOnEdit = getProp(error, 'status') === 403 && isEditMode;
  const taskGroupExceedsError = getProp(error, 'code') === ERROR_CODE_GROUP_EXCEEDS_LIMIT;
  const errorTitle = isForbiddenErrorOnEdit ? messages.taskEditWarningTitle : messages.taskCreateErrorTitle;
  let errorMessage = isEditMode ? messages.taskUpdateErrorMessage : apiMessages.taskCreateErrorMessage;
  if (!error) {
    return null;
  }

  // error message changes when a forbidden operation occurs while editing a task
  if (isForbiddenErrorOnEdit) {
    switch (taskType) {
      case 'GENERAL':
        errorMessage = messages.taskGeneralAssigneeRemovalWarningMessage;
        break;
      case 'APPROVAL':
        errorMessage = messages.taskApprovalAssigneeRemovalWarningMessage;
        break;
      default:
        return null;
    }
  }
  return taskGroupExceedsError ? /*#__PURE__*/React.createElement(InlineNotice, {
    type: "warning",
    title: /*#__PURE__*/React.createElement(FormattedMessage, messages.taskGroupExceedsLimitWarningTitle)
  }, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, apiMessages.taskGroupExceedsLimitWarningMessage, {
    values: {
      max: TASK_MAX_GROUP_ASSIGNEES
    }
  }))) : /*#__PURE__*/React.createElement(InlineNotice, {
    type: "error",
    title: /*#__PURE__*/React.createElement(FormattedMessage, errorTitle)
  }, /*#__PURE__*/React.createElement(FormattedMessage, errorMessage));
};
export default TaskError;
//# sourceMappingURL=TaskError.js.map