function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Helper for the box Task Collaborators API
 * @author Box
 */
import omit from 'lodash/omit';
import TasksBase from './TasksBase';
import { ERROR_CODE_FETCH_TASK_COLLABORATOR, ERROR_CODE_CREATE_TASK_COLLABORATOR, ERROR_CODE_UPDATE_TASK_COLLABORATOR, ERROR_CODE_DELETE_TASK_COLLABORATOR, API_PAGE_LIMIT } from '../../constants';
class TaskCollaborators extends TasksBase {
  getUrlForTaskCollaborators(taskId) {
    return `${this.getBaseApiUrl()}/undoc/tasks/${taskId}/task_collaborators?role=ASSIGNEE&limit=${API_PAGE_LIMIT}`;
  }
  getUrlForTaskCollaboratorCreate() {
    return `${this.getBaseApiUrl()}/undoc/task_collaborators`;
  }
  getUrlForTaskCollaborator(id) {
    return `${this.getBaseApiUrl()}/undoc/task_collaborators/${id}`;
  }
  getUrlForTaskGroupCreate() {
    return `${this.getBaseApiUrl()}/undoc/task_collaborators/expand_group`;
  }
  createTaskCollaborator({
    errorCallback,
    file,
    successCallback,
    task,
    user
  }) {
    this.errorCode = ERROR_CODE_CREATE_TASK_COLLABORATOR;
    const requestData = {
      data: {
        task: {
          type: 'task',
          id: task.id
        },
        target: {
          type: 'user',
          id: user.id
        }
      }
    };
    this.post({
      id: file.id,
      url: this.getUrlForTaskCollaboratorCreate(),
      data: _objectSpread({}, requestData),
      successCallback,
      errorCallback
    });
  }
  createTaskCollaboratorsforGroup({
    errorCallback,
    file,
    successCallback,
    task,
    group
  }) {
    this.errorCode = ERROR_CODE_CREATE_TASK_COLLABORATOR;
    const requestData = {
      data: {
        task: {
          type: 'task',
          id: task.id
        },
        target: {
          type: 'group',
          id: group.id
        }
      }
    };
    this.post({
      id: file.id,
      url: this.getUrlForTaskGroupCreate(),
      data: _objectSpread({}, requestData),
      successCallback,
      errorCallback
    });
  }
  getTaskCollaborators({
    errorCallback,
    file,
    successCallback,
    task
  }) {
    this.errorCode = ERROR_CODE_FETCH_TASK_COLLABORATOR;
    const url = this.getUrlForTaskCollaborators(task.id);
    this.get({
      id: file.id,
      successCallback,
      errorCallback,
      url
    });
  }
  updateTaskCollaborator({
    errorCallback,
    file,
    successCallback,
    taskCollaborator
  }) {
    this.errorCode = ERROR_CODE_UPDATE_TASK_COLLABORATOR;
    const requestData = {
      data: omit(taskCollaborator, 'id')
    };
    this.put({
      id: file.id,
      url: this.getUrlForTaskCollaborator(taskCollaborator.id),
      data: _objectSpread({}, requestData),
      successCallback,
      errorCallback
    });
  }
  deleteTaskCollaborator({
    errorCallback,
    file,
    successCallback,
    taskCollaborator
  }) {
    this.errorCode = ERROR_CODE_DELETE_TASK_COLLABORATOR;
    this.delete({
      id: file.id,
      url: this.getUrlForTaskCollaborator(taskCollaborator.id),
      successCallback,
      errorCallback
    });
  }
}
export default TaskCollaborators;
//# sourceMappingURL=TaskCollaborators.js.map