const _excluded = ["id", "addedAssignees", "removedAssignees"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * 
 * @file Helper for the box Tasks API
 * @author Box
 */

import TasksBase from './TasksBase';
import { ERROR_CODE_CREATE_TASK, ERROR_CODE_UPDATE_TASK, ERROR_CODE_DELETE_TASK, ERROR_CODE_FETCH_TASKS, API_PAGE_LIMIT } from '../../constants';
class TasksNew extends TasksBase {
  getUrlForFileTasks(id) {
    return `${this.getBaseApiUrl()}/undoc/files/${id}/linked_tasks?limit=${API_PAGE_LIMIT}`;
  }
  getUrlForTaskCreateWithDeps() {
    return `${this.getBaseApiUrl()}/undoc/tasks/with_dependencies`;
  }
  getUrlForTask(id) {
    return `${this.getBaseApiUrl()}/undoc/tasks/${id}`;
  }
  getUrlForTaskWithDeps(id) {
    return `${this.getBaseApiUrl()}/undoc/tasks/${id}/with_dependencies`;
  }
  updateTaskWithDeps({
    errorCallback,
    file,
    successCallback,
    task
  }) {
    this.errorCode = ERROR_CODE_UPDATE_TASK;
    const createTaskCollabsPayload = task.addedAssignees.map(assignee => {
      return {
        op: assignee.item && assignee.item.type === 'group' ? 'add_task_collaborators_expand_group' : 'add_task_collaborator',
        payload: {
          target: {
            type: assignee.item && assignee.item.type === 'group' ? 'group' : 'user',
            id: assignee.id
          }
        }
      };
    });
    const deleteTaskCollabsPayload = task.removedAssignees.map(assignee => {
      return {
        op: 'delete_task_collaborator',
        id: assignee.id
      };
    });
    const {
        id,
        addedAssignees,
        removedAssignees
      } = task,
      updateTaskPayload = _objectWithoutProperties(task, _excluded);
    this.put({
      id: file.id,
      url: this.getUrlForTaskWithDeps(task.id),
      data: {
        data: [{
          op: 'update_task',
          payload: _objectSpread({}, updateTaskPayload)
        }, ...createTaskCollabsPayload, ...deleteTaskCollabsPayload]
      },
      successCallback,
      errorCallback
    });
  }
  deleteTask({
    errorCallback,
    file,
    successCallback,
    task
  }) {
    this.errorCode = ERROR_CODE_DELETE_TASK;
    this.delete({
      id: file.id,
      url: this.getUrlForTask(task.id),
      successCallback,
      errorCallback
    });
  }
  getTasksForFile({
    errorCallback,
    file,
    successCallback
  }) {
    this.errorCode = ERROR_CODE_FETCH_TASKS;
    this.get({
      id: file.id,
      url: this.getUrlForFileTasks(file.id),
      successCallback,
      errorCallback
    });
  }
  getTask({
    errorCallback,
    file,
    id,
    successCallback
  }) {
    this.errorCode = ERROR_CODE_FETCH_TASKS;
    this.get({
      id: file.id,
      url: this.getUrlForTask(id),
      successCallback,
      errorCallback
    });
  }
  createTaskWithDeps({
    errorCallback,
    file,
    successCallback,
    task,
    assignees
  }) {
    this.errorCode = ERROR_CODE_CREATE_TASK;
    const createTaskCollabsPayload = assignees.map(assignee => {
      return {
        target: {
          type: assignee.item && assignee.item.type === 'group' ? 'group' : 'user',
          id: assignee.id
        }
      };
    });
    const createTaskLinksPayload = [{
      target: {
        id: file.id,
        type: 'file'
      }
    }];
    const createTaskWithDepsPayload = {
      task: _objectSpread({}, task),
      assigned_to: createTaskCollabsPayload,
      task_links: createTaskLinksPayload
    };
    this.post({
      id: file.id,
      url: this.getUrlForTaskCreateWithDeps(),
      data: {
        data: _objectSpread({}, createTaskWithDepsPayload)
      },
      successCallback,
      errorCallback
    });
  }
}
export default TasksNew;
//# sourceMappingURL=TasksNew.js.map