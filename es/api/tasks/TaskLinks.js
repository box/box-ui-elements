function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Helper for the box TaskLinks API
 * @author Box
 */

import TasksBase from './TasksBase';
import { ERROR_CODE_CREATE_TASK_LINK } from '../../constants';
class TaskLinks extends TasksBase {
  getUrlForTaskLinkCreate() {
    return `${this.getBaseApiUrl()}/undoc/task_links`;
  }
  createTaskLink({
    errorCallback,
    file,
    successCallback,
    task
  }) {
    this.errorCode = ERROR_CODE_CREATE_TASK_LINK;
    const requestData = {
      data: {
        target: {
          id: file.id,
          type: 'file'
        },
        task: {
          id: task.id,
          type: 'task'
        }
      }
    };
    this.post({
      id: file.id,
      url: this.getUrlForTaskLinkCreate(),
      data: _objectSpread({}, requestData),
      successCallback,
      errorCallback
    });
  }
}
export default TaskLinks;
//# sourceMappingURL=TaskLinks.js.map