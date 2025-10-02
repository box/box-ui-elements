function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Modal from '../../components/modal/Modal';
import TaskForm from './activity-feed/task-form';
import messages from './messages';
import { TASK_EDIT_MODE_CREATE, TASK_TYPE_APPROVAL, TASK_TYPE_GENERAL } from '../../constants';
function getMessageForModalTitle(taskType, mode) {
  switch (taskType) {
    case TASK_TYPE_GENERAL:
      return mode === TASK_EDIT_MODE_CREATE ? messages.tasksCreateGeneralTaskFormTitle : messages.tasksEditGeneralTaskFormTitle;
    case TASK_TYPE_APPROVAL:
    default:
      return mode === TASK_EDIT_MODE_CREATE ? messages.tasksCreateApprovalTaskFormTitle : messages.tasksEditApprovalTaskFormTitle;
  }
}
const focusTargetSelector = '.task-modal textarea, .task-modal input';
const TaskModal = props => {
  const {
    editMode = TASK_EDIT_MODE_CREATE,
    error,
    onSubmitError,
    onSubmitSuccess,
    onModalClose,
    taskType,
    isTaskFormOpen,
    taskFormProps
  } = props;
  // Note: Modal throws an error if this fails to find an element!
  return /*#__PURE__*/React.createElement(Modal, {
    className: "be-modal task-modal",
    "data-testid": "create-task-modal",
    focusElementSelector: focusTargetSelector,
    isOpen: isTaskFormOpen,
    onRequestClose: onModalClose,
    title: /*#__PURE__*/React.createElement(FormattedMessage, getMessageForModalTitle(taskType, editMode))
  }, /*#__PURE__*/React.createElement("div", {
    className: "be"
  }, /*#__PURE__*/React.createElement(TaskForm, _extends({
    editMode: editMode
    // $FlowFixMe
    ,
    error: error,
    onCancel: onModalClose,
    onSubmitError: onSubmitError,
    onSubmitSuccess: onSubmitSuccess,
    taskType: taskType
  }, taskFormProps))));
};
export default TaskModal;
//# sourceMappingURL=TaskModal.js.map