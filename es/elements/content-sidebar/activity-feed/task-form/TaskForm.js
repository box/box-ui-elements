function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Component for Approval comment form
 */

import * as React from 'react';
import noop from 'lodash/noop';
import getProp from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import commonMessages from '../../../../common/messages';
import messages from './messages';
import commentFormMessages from '../comment-form/messages';
import Form from '../../../../components/form-elements/form/Form';
import ModalActions from '../../../../components/modal/ModalActions';
import ContactDatalistItem from '../../../../components/contact-datalist-item/ContactDatalistItem';
import TextArea from '../../../../components/text-area';
import DatePicker from '../../../../components/date-picker/DatePicker';
import Checkbox from '../../../../components/checkbox';
import PillSelectorDropdown from '../../../../components/pill-selector-dropdown/PillSelectorDropdown';
import Button from '../../../../components/button/Button';
import { FeatureFlag } from '../../../common/feature-checking';
import PrimaryButton from '../../../../components/primary-button/PrimaryButton';
import { TASK_COMPLETION_RULE_ANY, TASK_COMPLETION_RULE_ALL, TASK_EDIT_MODE_CREATE, TASK_EDIT_MODE_EDIT } from '../../../../constants';
import { ACTIVITY_TARGETS, INTERACTION_TARGET } from '../../../common/interactionTargets';
import TaskError from './TaskError';
import './TaskForm.scss';
function convertAssigneesToSelectorItems(approvers) {
  return approvers.map(({
    target
  }) => {
    const newSelectorItem = {
      id: target.id,
      name: target.name,
      item: target,
      value: target.id,
      text: target.name // for PillSelectorDropdown SelectorOptions type
    };
    return newSelectorItem;
  });
}
class TaskForm extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", this.getInitialFormState());
    _defineProperty(this, "validateForm", (only, invalidSubmitValidityState) => {
      this.setState(state => {
        const {
          intl
        } = this.props;
        const {
          approvers,
          message,
          approverTextInput
        } = state;
        const assigneeFieldMissingError = {
          code: 'required',
          message: intl.formatMessage(commonMessages.requiredFieldError)
        };
        const assigneeFieldInvalidError = {
          code: 'invalid',
          message: intl.formatMessage(commonMessages.invalidUserError)
        };
        const messageFieldError = {
          code: 'required',
          message: intl.formatMessage(commonMessages.requiredFieldError)
        };
        const taskDueDateError = {
          code: 'invalid',
          message: intl.formatMessage(commonMessages.invalidDateError)
        };
        const formValidityState = {
          taskAssignees: (approverTextInput.length ? assigneeFieldInvalidError : null) || (approvers.length ? null : assigneeFieldMissingError),
          taskName: message ? null : messageFieldError,
          taskDueDate: getProp(invalidSubmitValidityState, 'taskDueDate.validityState.patternMismatch') ? taskDueDateError : null
        };
        const isValid = Object.values(formValidityState).every(val => val == null);
        return {
          isValid,
          formValidityState: only ? _objectSpread(_objectSpread({}, state.formValidityState), {}, {
            [only]: formValidityState[only]
          }) : formValidityState
        };
      });
    });
    _defineProperty(this, "getErrorByFieldname", fieldName => {
      const {
        formValidityState
      } = this.state;
      return formValidityState[fieldName] ? formValidityState[fieldName].message : null;
    });
    _defineProperty(this, "clearForm", () => this.setState(this.getInitialFormState()));
    _defineProperty(this, "handleInvalidSubmit", invalidSubmitValidityState => {
      if (!isEmpty(invalidSubmitValidityState)) {
        this.validateForm(undefined, invalidSubmitValidityState);
      } else {
        this.validateForm();
      }
    });
    _defineProperty(this, "handleSubmitSuccess", () => {
      const {
        onSubmitSuccess
      } = this.props;
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      this.clearForm();
      this.setState({
        isLoading: false
      });
    });
    _defineProperty(this, "handleSubmitError", e => {
      const {
        onSubmitError
      } = this.props;
      onSubmitError(e);
      this.setState({
        isLoading: false
      });
    });
    _defineProperty(this, "addResinInfo", () => {
      const {
        id,
        taskType,
        editMode
      } = this.props;
      const {
        dueDate
      } = this.state;
      const addedAssignees = this.getAddedAssignees();
      const removedAssignees = this.getRemovedAssignees();
      return {
        'data-resin-taskid': id,
        'data-resin-tasktype': taskType,
        'data-resin-isediting': editMode === TASK_EDIT_MODE_EDIT,
        'data-resin-numassigneesadded': addedAssignees.filter(assignee => assignee.target.type === 'user').length,
        'data-resin-numgroupssadded': addedAssignees.filter(assignee => assignee.target.type === 'group').length,
        'data-resin-numassigneesremoved': removedAssignees.length,
        'data-resin-assigneesadded': addedAssignees.map(assignee => assignee.target.id),
        'data-resin-assigneesremoved': removedAssignees.map(assignee => assignee.target.id),
        'data-resin-duedate': dueDate && dueDate.getTime()
      };
    });
    _defineProperty(this, "getAddedAssignees", () => {
      // Added assignees are the ones in state that weren't in the prop
      const {
        approvers
      } = this.props;
      const {
        approvers: currentApprovers
      } = this.state;
      const approverIds = approvers.map(approver => approver.id);
      return currentApprovers.filter(currentApprover => approverIds.indexOf(currentApprover.id) === -1);
    });
    _defineProperty(this, "getRemovedAssignees", () => {
      // Assignees to remove are the ones in the prop that cannot be found in state
      const {
        approvers
      } = this.props;
      const {
        approvers: currentApprovers
      } = this.state;
      const currentApproverIds = currentApprovers.map(currentApprover => currentApprover.id);
      return approvers.filter(approver => currentApproverIds.indexOf(approver.id) === -1);
    });
    _defineProperty(this, "handleValidSubmit", () => {
      const {
        id,
        createTask,
        editTask,
        editMode,
        taskType
      } = this.props;
      const {
        message,
        approvers: currentApprovers,
        dueDate,
        completionRule,
        isValid
      } = this.state;
      const dueDateString = dueDate && dueDate.toISOString();
      if (!isValid) return;
      this.setState({
        isLoading: true
      });
      if (editMode === TASK_EDIT_MODE_EDIT && editTask) {
        editTask({
          id,
          completion_rule: completionRule,
          description: message,
          due_at: dueDateString,
          addedAssignees: convertAssigneesToSelectorItems(this.getAddedAssignees()),
          removedAssignees: this.getRemovedAssignees()
        }, this.handleSubmitSuccess, this.handleSubmitError);
      } else {
        createTask(message, convertAssigneesToSelectorItems(currentApprovers), taskType, dueDateString, completionRule, this.handleSubmitSuccess, this.handleSubmitError);
      }
    });
    _defineProperty(this, "handleDueDateChange", date => {
      let dateValue = null;
      if (date) {
        dateValue = new Date(date);
        // The date given to us is midnight of the date selected.
        // Modify date to be the end of day (minus 1 millisecond) for the given due date
        dateValue.setHours(23, 59, 59, 999);
      }
      this.setState({
        dueDate: dateValue
      });
      this.validateForm('taskDueDate');
    });
    _defineProperty(this, "handleCompletionRuleChange", event => {
      this.setState({
        completionRule: event.target.checked ? TASK_COMPLETION_RULE_ANY : TASK_COMPLETION_RULE_ALL
      });
    });
    _defineProperty(this, "handleApproverSelectorInput", value => {
      const {
        getApproverWithQuery = noop
      } = this.props;
      this.setState({
        approverTextInput: value
      });
      getApproverWithQuery(value);
    });
    _defineProperty(this, "handleApproverSelectorSelect", pills => {
      this.setState({
        approvers: this.state.approvers.concat(pills.map(pill => {
          return {
            id: '',
            target: pill.item,
            role: 'ASSIGNEE',
            type: 'task_collaborator',
            status: 'NOT_STARTED',
            permissions: {
              can_delete: false,
              can_update: false
            }
          };
        })),
        approverTextInput: ''
      });
      this.validateForm('taskAssignees');
    });
    _defineProperty(this, "handleApproverSelectorRemove", (option, index) => {
      const approvers = [...this.state.approvers];
      approvers.splice(index, 1);
      this.setState({
        approvers
      });
      this.validateForm('taskAssignees');
    });
    _defineProperty(this, "handleChangeMessage", e => {
      e.persist();
      this.setState({
        message: e.currentTarget.value
      });
      this.validateForm('taskName');
    });
    _defineProperty(this, "handleCancelClick", () => {
      this.props.onCancel();
    });
  }
  getInitialFormState() {
    const {
      dueDate,
      id,
      message,
      approvers,
      completionRule
    } = this.props;
    return {
      id,
      completionRule: completionRule || TASK_COMPLETION_RULE_ALL,
      approvers,
      approverTextInput: '',
      dueDate: dueDate ? new Date(dueDate) : null,
      formValidityState: {},
      message,
      isLoading: false,
      isValid: null
    };
  }
  render() {
    const {
      approverSelectorContacts,
      className,
      error,
      isDisabled,
      intl,
      editMode,
      taskType
    } = this.props;
    const {
      dueDate,
      approvers,
      message,
      formValidityState,
      isLoading,
      completionRule
    } = this.state;
    const inputContainerClassNames = classNames('bcs-task-input-container', 'bcs-task-input-is-open', className);
    const isCreateEditMode = editMode === TASK_EDIT_MODE_CREATE;
    const selectedApprovers = convertAssigneesToSelectorItems(approvers);

    // filter out selected approvers
    // map to datalist item format
    const approverOptions = approverSelectorContacts.filter(({
      id
    }) => !selectedApprovers.find(({
      value
    }) => value === id));
    const pillSelectorOverlayClasses = classNames({
      scrollable: approverOptions.length > 4
    });
    const submitButtonMessage = isCreateEditMode ? messages.tasksAddTaskFormSubmitLabel : messages.tasksEditTaskFormSubmitLabel;
    const shouldShowCompletionRule = approvers.length > 0;

    // Enable checkbox when there is a group or multiple users being assigned
    // TODO: consider setting contants for assignee types to src/constants.js
    // - move from src/features/collaborator-avatars/constants.js
    const isCompletionRuleCheckboxDisabled = approvers.filter(approver => approver.target.type === 'group').length <= 0 && approvers.filter(approver => approver.target.type === 'user').length <= 1;
    const isCompletionRuleCheckboxChecked = completionRule === TASK_COMPLETION_RULE_ANY;
    const isForbiddenErrorOnEdit = isLoading || getProp(error, 'status') === 403 && !isCreateEditMode;
    return /*#__PURE__*/React.createElement("div", {
      className: inputContainerClassNames,
      "data-resin-component": "taskform"
    }, /*#__PURE__*/React.createElement("div", {
      className: "bcs-task-input-form-container"
    }, /*#__PURE__*/React.createElement(TaskError, {
      editMode: editMode,
      error: error,
      taskType: taskType
    }), /*#__PURE__*/React.createElement(Form, {
      formValidityState: formValidityState,
      onInvalidSubmit: this.handleInvalidSubmit,
      onValidSubmit: this.handleValidSubmit
    }, /*#__PURE__*/React.createElement(PillSelectorDropdown, {
      className: pillSelectorOverlayClasses,
      error: this.getErrorByFieldname('taskAssignees'),
      disabled: isForbiddenErrorOnEdit,
      inputProps: {
        'data-testid': 'task-form-assignee-input',
        'data-target-id': 'PillSelectorDropdown-selectAssigneesInput'
      },
      isRequired: true,
      label: /*#__PURE__*/React.createElement(FormattedMessage, messages.tasksAddTaskFormSelectAssigneesLabel),
      name: "taskAssignees",
      onBlur: () => this.validateForm('taskAssignees'),
      onInput: this.handleApproverSelectorInput,
      onRemove: this.handleApproverSelectorRemove,
      onSelect: this.handleApproverSelectorSelect,
      placeholder: intl.formatMessage(commentFormMessages.approvalAddAssignee),
      selectedOptions: selectedApprovers,
      selectorOptions: approverOptions,
      shouldSetActiveItemOnOpen: true,
      shouldClearUnmatchedInput: true,
      validateForError: () => this.validateForm('taskAssignees')
    }, approverOptions.map(({
      id,
      name,
      item = {}
    }) => /*#__PURE__*/React.createElement(ContactDatalistItem, {
      key: id,
      "data-testid": "task-assignee-option",
      name: name,
      subtitle: item.type === 'group' ? /*#__PURE__*/React.createElement(FormattedMessage, messages.taskCreateGroupLabel) : item.email
    }))), shouldShowCompletionRule && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FeatureFlag, {
      feature: "activityFeed.tasks.assignToGroup"
    }, /*#__PURE__*/React.createElement(Checkbox, {
      "data-testid": "task-form-completion-rule-checkbox-group",
      isChecked: isCompletionRuleCheckboxChecked,
      isDisabled: isCompletionRuleCheckboxDisabled || isForbiddenErrorOnEdit,
      label: /*#__PURE__*/React.createElement(FormattedMessage, messages.taskAnyCheckboxLabel),
      tooltip: intl.formatMessage(messages.taskAnyInfoGroupTooltip),
      name: "completionRule",
      onChange: this.handleCompletionRuleChange
    })), /*#__PURE__*/React.createElement(FeatureFlag, {
      not: true,
      feature: "activityFeed.tasks.assignToGroup"
    }, /*#__PURE__*/React.createElement(Checkbox, {
      "data-testid": "task-form-completion-rule-checkbox",
      isChecked: isCompletionRuleCheckboxChecked,
      isDisabled: isCompletionRuleCheckboxDisabled || isForbiddenErrorOnEdit,
      label: /*#__PURE__*/React.createElement(FormattedMessage, messages.taskAnyCheckboxLabel),
      tooltip: intl.formatMessage(messages.taskAnyInfoTooltip),
      name: "completionRule",
      onChange: this.handleCompletionRuleChange
    }))), /*#__PURE__*/React.createElement(TextArea, {
      className: "bcs-task-name-input",
      "data-testid": "task-form-name-input",
      "data-target-id": "TextArea-messageInput",
      disabled: isDisabled || isForbiddenErrorOnEdit,
      error: this.getErrorByFieldname('taskName'),
      isRequired: true,
      label: /*#__PURE__*/React.createElement(FormattedMessage, messages.tasksAddTaskFormMessageLabel),
      name: "taskName",
      onBlur: () => this.validateForm('taskName'),
      onChange: this.handleChangeMessage,
      placeholder: intl.formatMessage(commentFormMessages.commentWrite),
      value: message
    }), /*#__PURE__*/React.createElement(DatePicker, {
      className: "bcs-task-add-due-date-input",
      error: this.getErrorByFieldname('taskDueDate'),
      errorTooltipPosition: "bottom-right",
      inputProps: {
        [INTERACTION_TARGET]: ACTIVITY_TARGETS.TASK_DATE_PICKER,
        'data-testid': 'task-form-date-input',
        'data-target-id': 'DatePicker-dateInput'
      },
      isAccessible: true,
      isDisabled: isForbiddenErrorOnEdit,
      isKeyboardInputAllowed: true,
      isRequired: false,
      label: /*#__PURE__*/React.createElement(FormattedMessage, messages.tasksAddTaskFormDueDateLabel),
      minDate: new Date(),
      name: "taskDueDate",
      onChange: this.handleDueDateChange,
      placeholder: intl.formatMessage(commentFormMessages.approvalSelectDate),
      value: dueDate || undefined
    }), /*#__PURE__*/React.createElement(ModalActions, null, /*#__PURE__*/React.createElement(Button, _extends({
      className: "bcs-task-input-cancel-btn",
      "data-resin-target": ACTIVITY_TARGETS.APPROVAL_FORM_CANCEL,
      "data-testid": "task-form-cancel-button",
      "data-target-id": "Button-cancelButton",
      onClick: this.handleCancelClick,
      isDisabled: isLoading,
      type: "button"
    }, this.addResinInfo()), /*#__PURE__*/React.createElement(FormattedMessage, messages.tasksAddTaskFormCancelLabel)), /*#__PURE__*/React.createElement(PrimaryButton, _extends({
      className: "bcs-task-input-submit-btn",
      "data-resin-target": ACTIVITY_TARGETS.APPROVAL_FORM_POST,
      "data-testid": "task-form-submit-button",
      "data-target-id": "PrimaryButton-submitButton",
      isDisabled: isForbiddenErrorOnEdit,
      isLoading: isLoading
    }, this.addResinInfo()), /*#__PURE__*/React.createElement(FormattedMessage, submitButtonMessage))))));
  }
}

// For testing only
_defineProperty(TaskForm, "defaultProps", {
  approvers: [],
  approverSelectorContacts: [],
  editMode: TASK_EDIT_MODE_CREATE,
  id: '',
  message: ''
});
export { TaskForm as TaskFormUnwrapped };
export default injectIntl(TaskForm);
//# sourceMappingURL=TaskForm.js.map