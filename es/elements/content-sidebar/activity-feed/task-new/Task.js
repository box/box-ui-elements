function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import noop from 'lodash/noop';
import flow from 'lodash/flow';
import get from 'lodash/get';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import TetherComponent from 'react-tether';
import { withFeatureConsumer, getFeatureConfig } from '../../../common/feature-checking';
import { withAPIContext } from '../../../common/api-context';
import Avatar from '../Avatar';
import Media from '../../../../components/media';
import { MenuItem } from '../../../../components/menu';
import ActivityCard from '../ActivityCard';
import ActivityError from '../common/activity-error';
import ActivityMessage from '../common/activity-message';
import ActivityTimestamp from '../common/activity-timestamp';
import DeleteConfirmation from '../common/delete-confirmation';
import IconTaskApproval from '../../../../icons/two-toned/IconTaskApproval';
import IconTaskGeneral from '../../../../icons/two-toned/IconTaskGeneral';
import IconTrash from '../../../../icons/general/IconTrash';
import IconPencil from '../../../../icons/general/IconPencil';
import UserLink from '../common/user-link';
import API from '../../../../api/APIFactory';
import { TASK_COMPLETION_RULE_ALL, TASK_NEW_APPROVED, TASK_NEW_REJECTED, TASK_NEW_NOT_STARTED, TASK_NEW_IN_PROGRESS, TASK_NEW_COMPLETED, TASK_TYPE_APPROVAL, PLACEHOLDER_USER, TASK_EDIT_MODE_EDIT } from '../../../../constants';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import { bdlGray80 } from '../../../../styles/variables';
import TaskActions from './TaskActions';
import TaskCompletionRuleIcon from './TaskCompletionRuleIcon';
import TaskDueDate from './TaskDueDate';
import TaskStatus from './TaskStatus';
import AssigneeList from './AssigneeList';
import TaskModal from '../../TaskModal';
import TaskMultiFileIcon from './TaskMultiFileIcon';
import commonMessages from '../../../common/messages';
import messages from './messages';
import './Task.scss';
class Task extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      loadCollabError: undefined,
      assignedToFull: this.props.assigned_to,
      modalError: undefined,
      isEditing: false,
      isLoading: false,
      isAssigneeListOpen: false,
      isConfirmingDelete: false
    });
    _defineProperty(this, "handleAssigneeListExpand", () => {
      this.getAllTaskCollaborators(() => {
        this.setState({
          isAssigneeListOpen: true
        });
      });
    });
    _defineProperty(this, "handleAssigneeListCollapse", () => {
      this.setState({
        isAssigneeListOpen: false
      });
    });
    _defineProperty(this, "handleEditClick", () => {
      this.getAllTaskCollaborators(() => {
        this.setState({
          isEditing: true
        });
      });
    });
    _defineProperty(this, "handleDeleteClick", () => {
      this.setState({
        isConfirmingDelete: true
      });
    });
    _defineProperty(this, "handleDeleteConfirm", () => {
      const {
        id,
        onDelete,
        permissions
      } = this.props;
      if (onDelete) {
        onDelete({
          id,
          permissions
        });
      }
    });
    _defineProperty(this, "handleDeleteCancel", () => {
      this.setState({
        isConfirmingDelete: false
      });
    });
    _defineProperty(this, "handleEditModalClose", () => {
      const {
        onModalClose
      } = this.props;
      this.setState({
        isEditing: false,
        modalError: undefined
      });
      if (onModalClose) {
        onModalClose();
      }
    });
    _defineProperty(this, "handleEditSubmitError", error => {
      this.setState({
        modalError: error
      });
    });
    _defineProperty(this, "getAllTaskCollaborators", onSuccess => {
      const {
        id,
        api,
        task_links,
        assigned_to
      } = this.props;
      const {
        errorOccured
      } = commonMessages;
      const {
        taskCollaboratorLoadErrorMessage
      } = messages;

      // skip fetch when there are no additional collaborators
      if (!assigned_to.next_marker) {
        this.setState({
          assignedToFull: assigned_to
        });
        onSuccess();
        return;
      }

      // fileid is required for api calls, check for presence
      const fileId = get(task_links, 'entries[0].target.id');
      if (!fileId) {
        return;
      }
      this.setState({
        isLoading: true
      });
      api.getTaskCollaboratorsAPI(false).getTaskCollaborators({
        task: {
          id
        },
        file: {
          id: fileId
        },
        errorCallback: () => {
          this.setState({
            isLoading: false,
            loadCollabError: {
              message: taskCollaboratorLoadErrorMessage,
              title: errorOccured
            }
          });
        },
        successCallback: assignedToFull => {
          this.setState({
            assignedToFull,
            isLoading: false
          });
          onSuccess();
        }
      });
    });
    _defineProperty(this, "handleTaskAction", (taskId, assignmentId, taskStatus) => {
      const {
        onAssignmentUpdate
      } = this.props;
      this.setState({
        isAssigneeListOpen: false
      });
      onAssignmentUpdate(taskId, assignmentId, taskStatus);
    });
  }
  render() {
    const {
      approverSelectorContacts,
      assigned_to,
      completion_rule,
      created_at,
      created_by,
      currentUser,
      due_at,
      error,
      features,
      getApproverWithQuery,
      getAvatarUrl,
      getUserProfileUrl,
      id,
      isPending,
      description,
      onEdit,
      onView,
      permissions,
      status,
      task_links,
      task_type,
      translatedTaggedMessage,
      translations
    } = this.props;
    const {
      assignedToFull,
      modalError,
      isEditing,
      isLoading,
      loadCollabError,
      isAssigneeListOpen,
      isConfirmingDelete
    } = this.state;
    const inlineError = loadCollabError || error;
    const assignments = assigned_to && assigned_to.entries;
    const currentUserAssignment = assignments && assignments.find(({
      target
    }) => target.id === currentUser.id);
    const createdByUser = created_by.target || PLACEHOLDER_USER;
    const createdAtTimestamp = new Date(created_at).getTime();
    const isTaskCompleted = !(status === TASK_NEW_NOT_STARTED || status === TASK_NEW_IN_PROGRESS);
    const isCreator = created_by.target?.id === currentUser.id;
    const isMultiFile = task_links.entries.length > 1;
    let shouldShowActions;
    if (isTaskCompleted) {
      shouldShowActions = false;
    } else if (isMultiFile && isCreator) {
      shouldShowActions = true;
    } else {
      shouldShowActions = currentUserAssignment && currentUserAssignment.permissions && currentUserAssignment.permissions.can_update && currentUserAssignment.status === TASK_NEW_NOT_STARTED;
    }
    const TaskTypeIcon = task_type === TASK_TYPE_APPROVAL ? /*#__PURE__*/React.createElement(IconTaskApproval, {
      title: /*#__PURE__*/React.createElement(FormattedMessage, messages.approvalTaskAnnotationIconTitle)
    }) : /*#__PURE__*/React.createElement(IconTaskGeneral, {
      title: /*#__PURE__*/React.createElement(FormattedMessage, messages.generalTaskAnnotationIconTitle)
    });
    const isMenuVisible = (permissions.can_delete || permissions.can_update) && !isPending;
    return /*#__PURE__*/React.createElement(ActivityCard, {
      className: "bcs-Task",
      "data-resin-feature": "tasks",
      "data-resin-taskid": id,
      "data-resin-tasktype": task_type,
      "data-resin-numassignees": assignments && assignments.length
    }, inlineError ? /*#__PURE__*/React.createElement(ActivityError, inlineError) : null, /*#__PURE__*/React.createElement(Media, {
      className: classNames('bcs-Task-media', {
        'bcs-is-pending': isPending || isLoading
      }),
      "data-testid": "task-card"
    }, /*#__PURE__*/React.createElement(Media.Figure, {
      className: "bcs-Task-avatar"
    }, /*#__PURE__*/React.createElement(Avatar, {
      badgeIcon: TaskTypeIcon,
      getAvatarUrl: getAvatarUrl,
      user: createdByUser
    })), /*#__PURE__*/React.createElement(Media.Body, null, isMenuVisible && /*#__PURE__*/React.createElement(TetherComponent, {
      attachment: "top right",
      className: "bcs-Task-deleteConfirmationModal",
      constraints: [{
        to: 'scrollParent',
        attachment: 'together'
      }],
      targetAttachment: "bottom right",
      renderTarget: ref => /*#__PURE__*/React.createElement("div", {
        ref: ref,
        style: {
          display: 'inline-block'
        }
      }, /*#__PURE__*/React.createElement(Media.Menu, {
        isDisabled: isConfirmingDelete,
        "data-testid": "task-actions-menu",
        menuProps: {
          'data-resin-component': ACTIVITY_TARGETS.TASK_OPTIONS
        }
      }, permissions.can_update && /*#__PURE__*/React.createElement(MenuItem, {
        "data-resin-target": ACTIVITY_TARGETS.TASK_OPTIONS_EDIT,
        "data-testid": "edit-task",
        onClick: this.handleEditClick
      }, /*#__PURE__*/React.createElement(IconPencil, {
        color: bdlGray80
      }), /*#__PURE__*/React.createElement(FormattedMessage, messages.taskEditMenuItem)), permissions.can_delete && /*#__PURE__*/React.createElement(MenuItem, {
        "data-resin-target": ACTIVITY_TARGETS.TASK_OPTIONS_DELETE,
        "data-testid": "delete-task",
        onClick: this.handleDeleteClick
      }, /*#__PURE__*/React.createElement(IconTrash, {
        color: bdlGray80
      }), /*#__PURE__*/React.createElement(FormattedMessage, messages.taskDeleteMenuItem)))),
      renderElement: ref => {
        return isConfirmingDelete ? /*#__PURE__*/React.createElement("div", {
          ref: ref
        }, /*#__PURE__*/React.createElement(DeleteConfirmation, {
          "data-resin-component": ACTIVITY_TARGETS.TASK_OPTIONS,
          isOpen: isConfirmingDelete,
          message: messages.taskDeletePrompt,
          onDeleteCancel: this.handleDeleteCancel,
          onDeleteConfirm: this.handleDeleteConfirm
        })) : null;
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "bcs-Task-headline"
    }, createdByUser.name ? /*#__PURE__*/React.createElement(UserLink, _extends({}, createdByUser, {
      "data-resin-target": ACTIVITY_TARGETS.PROFILE,
      getUserProfileUrl: getUserProfileUrl
    })) : /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.priorCollaborator)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ActivityTimestamp, {
      date: createdAtTimestamp
    })), /*#__PURE__*/React.createElement("div", {
      className: "bcs-Task-status"
    }, /*#__PURE__*/React.createElement(TaskStatus, {
      status: status
    }), /*#__PURE__*/React.createElement(TaskMultiFileIcon, {
      isMultiFile: isMultiFile
    }), /*#__PURE__*/React.createElement(TaskCompletionRuleIcon, {
      completionRule: completion_rule
    })), /*#__PURE__*/React.createElement("div", {
      className: "bcs-Task-dueDate"
    }, !!due_at && /*#__PURE__*/React.createElement(TaskDueDate, {
      dueDate: due_at,
      status: status
    })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(ActivityMessage, _extends({
      id: id,
      tagged_message: description,
      translatedTaggedMessage: translatedTaggedMessage
    }, translations, {
      translationFailed: error ? true : null,
      getUserProfileUrl: getUserProfileUrl
    }))), /*#__PURE__*/React.createElement("div", {
      className: "bcs-Task-assigneeListContainer"
    }, /*#__PURE__*/React.createElement(AssigneeList, {
      isOpen: isAssigneeListOpen,
      onCollapse: this.handleAssigneeListCollapse,
      onExpand: this.handleAssigneeListExpand,
      getAvatarUrl: getAvatarUrl,
      initialAssigneeCount: 3,
      users: isAssigneeListOpen ? assignedToFull : assigned_to
    })), shouldShowActions && /*#__PURE__*/React.createElement("div", {
      className: "bcs-Task-actionsContainer",
      "data-testid": "action-container"
    }, /*#__PURE__*/React.createElement(TaskActions, {
      isMultiFile: isMultiFile,
      taskType: task_type,
      onTaskApproval: isPending ? noop : () =>
      // $FlowFixMe checked by shouldShowActions
      this.handleTaskAction(id, currentUserAssignment.id, TASK_NEW_APPROVED),
      onTaskReject: isPending ? noop : () =>
      // $FlowFixMe checked by shouldShowActions
      this.handleTaskAction(id, currentUserAssignment.id, TASK_NEW_REJECTED),
      onTaskComplete: isPending ? noop : () => this.handleTaskAction(id,
      // $FlowFixMe checked by shouldShowActions
      currentUserAssignment.id, TASK_NEW_COMPLETED),
      onTaskView: onView && (() => onView(id, isCreator))
    })))), /*#__PURE__*/React.createElement(TaskModal, {
      editMode: TASK_EDIT_MODE_EDIT,
      error: modalError,
      feedbackUrl: getFeatureConfig(features, 'activityFeed.tasks').feedbackUrl || '',
      onSubmitError: this.handleEditSubmitError,
      onSubmitSuccess: this.handleEditModalClose,
      onModalClose: this.handleEditModalClose,
      isTaskFormOpen: isEditing,
      taskFormProps: {
        id,
        approvers: assignedToFull.entries,
        approverSelectorContacts,
        completionRule: completion_rule,
        getApproverWithQuery,
        getAvatarUrl,
        createTask: () => {},
        editTask: onEdit,
        dueDate: due_at,
        message: description
      },
      taskType: task_type
    }));
  }
}
_defineProperty(Task, "defaultProps", {
  completion_rule: TASK_COMPLETION_RULE_ALL
});
export { Task as TaskComponent };
export default flow([withFeatureConsumer, withAPIContext])(Task);
//# sourceMappingURL=Task.js.map