function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { withRouterIfEnabled } from '../common/routing';
import AddTaskMenu from './AddTaskMenu';
import TaskModal from './TaskModal';
import { TASK_TYPE_APPROVAL } from '../../constants';
class AddTaskButton extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "buttonRef", /*#__PURE__*/React.createRef());
    _defineProperty(this, "state", {
      error: null,
      isTaskFormOpen: false,
      taskType: TASK_TYPE_APPROVAL
    });
    /*
    1. Pushing the open state into history keeps the sidebar open upon resize and refresh
    2. Preventing the sidebar from closing keeps the task modal open upon edit and resize
    */
    _defineProperty(this, "handleClickMenuItem", taskType => {
      const {
        history,
        internalSidebarNavigation,
        internalSidebarNavigationHandler,
        routerDisabled
      } = this.props;
      if (routerDisabled && internalSidebarNavigationHandler) {
        internalSidebarNavigationHandler(_objectSpread(_objectSpread({}, internalSidebarNavigation), {}, {
          open: true
        }), true);
      } else if (history) {
        history.replace({
          state: {
            open: true
          }
        });
      }
      this.setState({
        isTaskFormOpen: true,
        taskType
      });
    });
    _defineProperty(this, "handleModalClose", () => {
      const {
        onTaskModalClose
      } = this.props;
      this.setState({
        isTaskFormOpen: false,
        error: null
      }, () => {
        if (this.buttonRef.current) {
          this.buttonRef.current.focus();
        }
      });
      onTaskModalClose();
    });
    _defineProperty(this, "handleSubmitError", e => this.setState({
      error: e
    }));
    _defineProperty(this, "setAddTaskButtonRef", element => {
      this.buttonRef.current = element;
    });
  }
  render() {
    const {
      isDisabled,
      taskFormProps
    } = this.props;
    const {
      isTaskFormOpen,
      taskType,
      error
    } = this.state;
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(AddTaskMenu, {
      isDisabled: isDisabled,
      onMenuItemClick: this.handleClickMenuItem,
      setAddTaskButtonRef: this.setAddTaskButtonRef
    }), /*#__PURE__*/React.createElement(TaskModal, {
      error: error,
      onSubmitError: this.handleSubmitError,
      onSubmitSuccess: this.handleModalClose,
      onModalClose: this.handleModalClose,
      isTaskFormOpen: isTaskFormOpen,
      taskFormProps: taskFormProps,
      taskType: taskType
    }));
  }
}
_defineProperty(AddTaskButton, "defaultProps", {
  isDisabled: false
});
export { AddTaskButton as AddTaskButtonComponent };
export default withRouterIfEnabled(AddTaskButton);
//# sourceMappingURL=AddTaskButton.js.map