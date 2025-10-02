const _excluded = ["replies"],
  _excluded2 = ["replies"],
  _excluded3 = ["replies", "total_reply_count"],
  _excluded4 = ["replies", "total_reply_count"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
/**
 * 
 * @file Helper for activity feed API's
 * @author Box
 */
import noop from 'lodash/noop';
import uniqueId from 'lodash/uniqueId';
import { getBadItemError, getBadUserError, getMissingItemTextOrStatus, isUserCorrectableError } from '../utils/error';
import commonMessages from '../elements/common/messages';
import messages from './messages';
import { sortFeedItems } from '../utils/sorter';
import { FEED_FILE_VERSIONS_FIELDS_TO_FETCH } from '../utils/fields';
import Base from './Base';
import AnnotationsAPI from './Annotations';
import CommentsAPI from './Comments';
import ThreadedCommentsAPI from './ThreadedComments';
import FileActivitiesAPI from './FileActivities';
import VersionsAPI from './Versions';
import TasksNewAPI from './tasks/TasksNew';
import GroupsAPI from './Groups';
import TaskCollaboratorsAPI from './tasks/TaskCollaborators';
import TaskLinksAPI from './tasks/TaskLinks';
import AppActivityAPI from './AppActivity';
import { ACTION_TYPE_CREATED, ACTION_TYPE_RESTORED, ACTION_TYPE_PROMOTED, ACTION_TYPE_TRASHED, ERROR_CODE_CREATE_TASK, ERROR_CODE_UPDATE_TASK, ERROR_CODE_GROUP_EXCEEDS_LIMIT, FEED_ITEM_TYPE_ANNOTATION, FEED_ITEM_TYPE_COMMENT, FEED_ITEM_TYPE_TASK, FEED_ITEM_TYPE_VERSION, FILE_ACTIVITY_TYPE_ANNOTATION, FILE_ACTIVITY_TYPE_APP_ACTIVITY, FILE_ACTIVITY_TYPE_COMMENT, FILE_ACTIVITY_TYPE_TASK, FILE_ACTIVITY_TYPE_VERSION, HTTP_STATUS_CODE_CONFLICT, IS_ERROR_DISPLAYED, PERMISSION_CAN_VIEW_ANNOTATIONS, PERMISSION_CAN_COMMENT, TASK_NEW_APPROVED, TASK_NEW_COMPLETED, TASK_NEW_REJECTED, TASK_NEW_NOT_STARTED, TYPED_ID_FEED_PREFIX, TASK_MAX_GROUP_ASSIGNEES } from '../constants';
import { collapseFeedState } from '../elements/content-sidebar/activity-feed/activity-feed/activityFeedUtils';
const TASK_NEW_INITIAL_STATUS = TASK_NEW_NOT_STARTED;
const getItemWithFilteredReplies = (item, replyId) => {
  const {
      replies = []
    } = item,
    rest = _objectWithoutProperties(item, _excluded);
  return _objectSpread({
    replies: replies.filter(({
      id
    }) => id !== replyId)
  }, rest);
};
const getItemWithPendingReply = (item, reply) => {
  const {
      replies = []
    } = item,
    rest = _objectWithoutProperties(item, _excluded2);
  return _objectSpread({
    replies: [...replies, reply]
  }, rest);
};
const parseReplies = replies => {
  const parsedReplies = [...replies];
  return parsedReplies.map(reply => {
    return _objectSpread(_objectSpread({}, reply), {}, {
      tagged_message: reply.tagged_message || reply.message || ''
    });
  });
};
export const getParsedFileActivitiesResponse = (response, permissions = {}) => {
  if (!response || !response.entries || !response.entries.length) {
    return [];
  }
  const data = response.entries;
  const parsedData = data.map(item => {
    if (!item.source) {
      return null;
    }
    const source = _objectSpread({}, item.source);
    switch (item.activity_type) {
      case FILE_ACTIVITY_TYPE_TASK:
        {
          const taskItem = _objectSpread({}, source[FILE_ACTIVITY_TYPE_TASK]);
          // UAA follows a lowercased enum naming convention, convert to uppercase to align with task api
          if (taskItem.assigned_to?.entries) {
            const assignedToEntries = taskItem.assigned_to.entries.map(entry => {
              const assignedToEntry = _objectSpread({}, entry);
              assignedToEntry.role = entry.role.toUpperCase();
              assignedToEntry.status = entry.status.toUpperCase();
              return assignedToEntry;
            });
            // $FlowFixMe Using the toUpperCase method makes Flow assume role and status is a string type, which is incompatible with string literal
            taskItem.assigned_to.entries = assignedToEntries;
          }
          if (taskItem.completion_rule) {
            taskItem.completion_rule = taskItem.completion_rule.toUpperCase();
          }
          if (taskItem.status) {
            taskItem.status = taskItem.status.toUpperCase();
          }
          if (taskItem.task_type) {
            taskItem.task_type = taskItem.task_type.toUpperCase();
          }
          // $FlowFixMe File Activities only returns a created_by user, Flow type fix is needed
          taskItem.created_by = {
            target: taskItem.created_by
          };
          return taskItem;
        }
      case FILE_ACTIVITY_TYPE_COMMENT:
        {
          const commentItem = _objectSpread({}, source[FILE_ACTIVITY_TYPE_COMMENT]);
          if (commentItem.replies && commentItem.replies.length) {
            const replies = parseReplies(commentItem.replies);
            commentItem.replies = replies;
          }
          commentItem.tagged_message = commentItem.tagged_message || commentItem.message || '';
          return commentItem;
        }
      case FILE_ACTIVITY_TYPE_ANNOTATION:
        {
          const annotationItem = _objectSpread({}, source[FILE_ACTIVITY_TYPE_ANNOTATION]);
          if (annotationItem.replies && annotationItem.replies.length) {
            const replies = parseReplies(annotationItem.replies);
            annotationItem.replies = replies;
          }
          return annotationItem;
        }
      case FILE_ACTIVITY_TYPE_APP_ACTIVITY:
        {
          const appActivityItem = _objectSpread({}, source[FILE_ACTIVITY_TYPE_APP_ACTIVITY]);
          const {
            can_delete
          } = permissions;
          appActivityItem.created_at = appActivityItem.occurred_at;
          appActivityItem.permissions = {
            can_delete
          };
          return appActivityItem;
        }
      case FILE_ACTIVITY_TYPE_VERSION:
        {
          const versionsItem = _objectSpread({}, source[FILE_ACTIVITY_TYPE_VERSION]);
          versionsItem.type = FEED_ITEM_TYPE_VERSION;
          if (versionsItem.action_by) {
            const collaborators = {};
            versionsItem.action_by.map(collaborator => {
              collaborators[collaborator.id] = _objectSpread({}, collaborator);
              return collaborator;
            });
            versionsItem.collaborators = collaborators;
          }
          if (versionsItem.end?.number) {
            versionsItem.version_end = versionsItem.end.number;
            versionsItem.id = versionsItem.end.id;
          }
          if (versionsItem.start?.number) {
            versionsItem.version_start = versionsItem.start.number;
          }
          if (versionsItem.version_start === versionsItem.version_end) {
            versionsItem.version_number = versionsItem.version_start;
            versionsItem.uploader_display_name = versionsItem.start?.uploader_display_name;
            if (versionsItem.action_type === ACTION_TYPE_CREATED && versionsItem.start?.created_at && versionsItem.start?.created_by) {
              versionsItem.modified_at = versionsItem.start.created_at;
              versionsItem.modified_by = _objectSpread({}, versionsItem.start.created_by);
            }
            if (versionsItem.action_type === ACTION_TYPE_TRASHED && versionsItem.start?.trashed_at && versionsItem.start?.trashed_by) {
              versionsItem.trashed_at = versionsItem.start.trashed_at;
              versionsItem.trashed_by = _objectSpread({}, versionsItem.start.trashed_by);
            }
            if (versionsItem.action_type === ACTION_TYPE_RESTORED && versionsItem.start?.restored_at && versionsItem.start?.restored_by) {
              versionsItem.restored_at = versionsItem.start.restored_at;
              versionsItem.restored_by = _objectSpread({}, versionsItem.start.restored_by);
            }
            if (versionsItem.action_type === ACTION_TYPE_PROMOTED && versionsItem.start?.promoted_from && versionsItem.start?.promoted_by) {
              versionsItem.version_promoted = versionsItem.start?.promoted_from;
              versionsItem.promoted_by = _objectSpread({}, versionsItem.start?.promoted_by);
            }
          }
          return versionsItem;
        }
      default:
        {
          return null;
        }
    }
  }).filter(item => !!item).reverse();
  return parsedData;
};
class Feed extends Base {
  /**
   * @property {AnnotationsAPI}
   */

  /**
   * @property {VersionsAPI}
   */

  /**
   * @property {CommentsAPI}
   */

  /**
   * @property {AppActivityAPI}
   */

  /**
   * @property {TasksNewAPI}
   */

  /**
   * @property {TaskCollaboratorsAPI}
   */

  /**
   * @property {TaskLinksAPI}
   */

  /**
   * @property {ThreadedCommentsAPI}
   */

  /**
   * @property {FileActivitiesAPI}
   */

  /**
   * @property {BoxItem}
   */

  /**
   * @property {ElementsXhrError}
   */

  constructor(options) {
    super(options);
    _defineProperty(this, "updateAnnotation", (file, annotationId, text, status, permissions, successCallback, errorCallback) => {
      if (!file.id) {
        throw getBadItemError();
      }
      if (!text && !status) {
        throw getMissingItemTextOrStatus();
      }
      this.annotationsAPI = new AnnotationsAPI(this.options);
      this.file = file;
      this.errorCallback = errorCallback;
      const feedItemChanges = {};
      if (text) {
        feedItemChanges.message = text;
      }
      if (status) {
        feedItemChanges.status = status;
      }
      this.updateFeedItem(_objectSpread(_objectSpread({}, feedItemChanges), {}, {
        isPending: true
      }), annotationId);
      this.annotationsAPI.updateAnnotation(this.file.id, annotationId, permissions, feedItemChanges, annotation => {
        const {
            replies,
            total_reply_count
          } = annotation,
          annotationBase = _objectWithoutProperties(annotation, _excluded3);
        this.updateFeedItem(_objectSpread(_objectSpread({}, annotationBase), {}, {
          isPending: false
        }), annotationId);
        if (!this.isDestroyed()) {
          successCallback(annotation);
        }
      }, (e, code) => {
        this.updateCommentErrorCallback(e, code, annotationId);
      });
    });
    /**
     * Error callback for updating a comment
     *
     * @param {ElementsXhrError} e - the error returned by the API
     * @param {string} code - the error code
     * @param {string} id - the id of either an annotation or comment
     * @return {void}
     */
    _defineProperty(this, "updateCommentErrorCallback", (e, code, id) => {
      this.updateFeedItem(this.createFeedError(messages.commentUpdateErrorMessage), id);
      this.feedErrorCallback(true, e, code);
    });
    /**
     * Error callback for updating a reply
     *
     * @param {ElementsXhrError} error - the error returned by the API
     * @param {string} code - the error code
     * @param {string} id - the id of the reply (comment)
     * @param {string} parentId - the id of either the parent item (an annotation or comment)
     * @return {void}
     */
    _defineProperty(this, "updateReplyErrorCallback", (error, code, id, parentId) => {
      this.updateReplyItem(this.createFeedError(messages.commentUpdateErrorMessage), parentId, id);
      this.feedErrorCallback(true, error, code);
    });
    /**
     * Error callback for fetching replies
     *
     * @param {ElementsXhrError} error - the error returned by the API
     * @param {string} code - the error code
     * @param {string} id - the id of either an annotation or comment
     * @return {void}
     */
    _defineProperty(this, "fetchRepliesErrorCallback", (error, code, id) => {
      this.updateFeedItem(this.createFeedError(messages.repliesFetchErrorMessage), id);
      this.feedErrorCallback(true, error, code);
    });
    _defineProperty(this, "deleteAnnotation", (file, annotationId, permissions, successCallBack, errorCallback) => {
      this.annotationsAPI = new AnnotationsAPI(this.options);
      if (!file.id) {
        throw getBadItemError();
      }
      this.file = file;
      this.errorCallback = errorCallback;
      this.updateFeedItem({
        isPending: true
      }, annotationId);
      this.annotationsAPI.deleteAnnotation(this.file.id, annotationId, permissions, this.deleteFeedItem.bind(this, annotationId, successCallBack), (error, code) => {
        // Reusing comment error handler since annotations are treated as comments to user
        this.deleteCommentErrorCallback(error, code, annotationId);
      });
    });
    /**
     * Callback for successful fetch of a comment
     *
     * @param {Function} resolve - resolve function
     * @param {Function} successCallback - success callback
     * @param {Comment} comment - comment data
     * @return {void}
     */
    _defineProperty(this, "fetchThreadedCommentSuccessCallback", (resolve, successCallback, comment) => {
      successCallback(comment);
      resolve();
    });
    /**
     * Updates a task assignment
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {string} taskId - ID of task to be updated
     * @param {string} taskCollaboratorId - Task assignment ID
     * @param {TaskCollabStatus} taskCollaboratorStatus - New task assignment status
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    _defineProperty(this, "updateTaskCollaborator", (file, taskId, taskCollaboratorId, taskCollaboratorStatus, successCallback, errorCallback) => {
      if (!file.id) {
        throw getBadItemError();
      }
      this.file = file;
      this.errorCallback = errorCallback;
      this.updateFeedItem({
        isPending: true
      }, taskId);
      const collaboratorsApi = new TaskCollaboratorsAPI(this.options);
      this.taskCollaboratorsAPI.push(collaboratorsApi);
      const taskCollaboratorPayload = {
        id: taskCollaboratorId,
        status: taskCollaboratorStatus
      };
      const handleError = (e, code) => {
        let errorMessage;
        switch (taskCollaboratorStatus) {
          case TASK_NEW_APPROVED:
            errorMessage = messages.taskApproveErrorMessage;
            break;
          case TASK_NEW_COMPLETED:
            errorMessage = messages.taskCompleteErrorMessage;
            break;
          case TASK_NEW_REJECTED:
            errorMessage = messages.taskRejectErrorMessage;
            break;
          default:
            errorMessage = messages.taskCompleteErrorMessage;
        }
        this.updateFeedItem(this.createFeedError(errorMessage, messages.taskActionErrorTitle), taskId);
        this.feedErrorCallback(true, e, code);
      };
      collaboratorsApi.updateTaskCollaborator({
        file,
        taskCollaborator: taskCollaboratorPayload,
        successCallback: taskCollab => {
          this.updateTaskCollaboratorSuccessCallback(taskId, file, taskCollab, successCallback, handleError);
        },
        errorCallback: handleError
      });
    });
    /**
     * Updates the task assignment state of the updated task
     *
     * @param {string} taskId - Box task id
     * @param {TaskAssignment} updatedCollaborator - New task assignment from API
     * @param {Function} successCallback - the function which will be called on success
     * @return {void}
     */
    _defineProperty(this, "updateTaskCollaboratorSuccessCallback", (taskId, file, updatedCollaborator, successCallback, errorCallback) => {
      this.tasksNewAPI = new TasksNewAPI(this.options);
      this.tasksNewAPI.getTask({
        id: taskId,
        file,
        successCallback: task => {
          this.updateFeedItem(_objectSpread(_objectSpread({}, task), {}, {
            isPending: false
          }), taskId);
          successCallback(updatedCollaborator);
        },
        errorCallback
      });
    });
    /**
     * Updates a task in the new API
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {string} task - The update task payload object
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    _defineProperty(this, "updateTaskNew", async (file, task, successCallback = noop, errorCallback = noop) => {
      if (!file.id) {
        throw getBadItemError();
      }
      this.file = file;
      this.errorCallback = errorCallback;
      this.tasksNewAPI = new TasksNewAPI(this.options);
      this.updateFeedItem({
        isPending: true
      }, task.id);
      try {
        // create request for the size of each group by ID
        // TODO: use async/await for both creating and editing tasks
        const groupInfoPromises = task.addedAssignees.filter(assignee => assignee.item && assignee.item.type === 'group').map(assignee => assignee.id).map(groupId => {
          return new GroupsAPI(this.options).getGroupCount({
            file,
            group: {
              id: groupId
            }
          });
        });
        const groupCounts = await Promise.all(groupInfoPromises);
        const hasAnyGroupCountExceeded = groupCounts.some(groupInfo => groupInfo.total_count > TASK_MAX_GROUP_ASSIGNEES);
        const warning = {
          code: ERROR_CODE_GROUP_EXCEEDS_LIMIT,
          type: 'warning'
        };
        if (hasAnyGroupCountExceeded) {
          this.feedErrorCallback(false, warning, ERROR_CODE_GROUP_EXCEEDS_LIMIT);
          return;
        }
        await new Promise((resolve, reject) => {
          this.tasksNewAPI.updateTaskWithDeps({
            file,
            task,
            successCallback: resolve,
            errorCallback: reject
          });
        });
        await new Promise((resolve, reject) => {
          this.tasksNewAPI.getTask({
            file,
            id: task.id,
            successCallback: taskData => {
              this.updateFeedItem(_objectSpread(_objectSpread({}, taskData), {}, {
                isPending: false
              }), task.id);
              resolve();
            },
            errorCallback: e => {
              this.updateFeedItem({
                isPending: false
              }, task.id);
              this.feedErrorCallback(false, e, ERROR_CODE_UPDATE_TASK);
              reject();
            }
          });
        });

        // everything succeeded, so call the passed in success callback
        if (!this.isDestroyed()) {
          successCallback();
        }
      } catch (e) {
        this.updateFeedItem({
          isPending: false
        }, task.id);
        this.feedErrorCallback(false, e, ERROR_CODE_UPDATE_TASK);
      }
    });
    /**
     * Deletes a comment.
     *
     * @param {BoxItem} file - The file to which the comment belongs to
     * @param {string} commentId - Comment ID
     * @param {BoxCommentPermission} permissions - Permissions for the comment
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    _defineProperty(this, "deleteComment", (file, commentId, permissions, successCallback, errorCallback) => {
      this.commentsAPI = new CommentsAPI(this.options);
      if (!file.id) {
        throw getBadItemError();
      }
      this.file = file;
      this.errorCallback = errorCallback;
      this.updateFeedItem({
        isPending: true
      }, commentId);
      this.commentsAPI.deleteComment({
        file,
        commentId,
        permissions,
        successCallback: this.deleteFeedItem.bind(this, commentId, successCallback),
        errorCallback: (e, code) => {
          this.deleteCommentErrorCallback(e, code, commentId);
        }
      });
    });
    /**
     * Deletes a threaded comment (using ThreadedComments API).
     *
     * @param {BoxItem} file - The file to which the comment belongs to
     * @param {string} commentId - Comment ID
     * @param {BoxCommentPermission} permissions - Permissions for the comment
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    _defineProperty(this, "deleteThreadedComment", (file, commentId, permissions, successCallback, errorCallback) => {
      if (!file.id) {
        throw getBadItemError();
      }
      this.file = file;
      this.errorCallback = errorCallback;
      this.updateFeedItem({
        isPending: true
      }, commentId);
      this.threadedCommentsAPI = new ThreadedCommentsAPI(this.options);
      this.threadedCommentsAPI.deleteComment({
        fileId: file.id,
        commentId,
        permissions,
        successCallback: this.deleteFeedItem.bind(this, commentId, successCallback),
        errorCallback: (e, code) => {
          this.deleteCommentErrorCallback(e, code, commentId);
        }
      });
    });
    /**
     * Deletes a reply (using ThreadedComments API).
     *
     * @param {BoxItem} file - The file to which the comment belongs to
     * @param {string} id - id of the reply (comment)
     * @param {string} parentId - id of the parent feed item
     * @param {BoxCommentPermission} permissions - Permissions for the comment
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    _defineProperty(this, "deleteReply", (file, id, parentId, permissions, successCallback, errorCallback) => {
      if (!file.id) {
        throw getBadItemError();
      }
      this.file = file;
      this.errorCallback = errorCallback;
      this.updateReplyItem({
        isPending: true
      }, parentId, id);
      this.threadedCommentsAPI = new ThreadedCommentsAPI(this.options);
      this.threadedCommentsAPI.deleteComment({
        fileId: file.id,
        commentId: id,
        permissions,
        successCallback: this.deleteReplySuccessCallback.bind(this, id, parentId, successCallback),
        errorCallback: (e, code) => {
          this.deleteReplyErrorCallback(e, code, id, parentId);
        }
      });
    });
    /**
     * Callback for successful deletion of a reply.
     *
     * @param {string} id - ID of the reply
     * @param {string} parentId - ID of the parent feed item
     * @param {Function} successCallback - success callback
     * @return {void}
     */
    _defineProperty(this, "deleteReplySuccessCallback", (id, parentId, successCallback) => {
      this.modifyFeedItemRepliesCountBy(parentId, -1);
      this.deleteReplyItem(id, parentId, successCallback);
    });
    /**
     * Error callback for deleting a comment
     *
     * @param {ElementsXhrError} e - the error returned by the API
     * @param {string} code - the error code
     * @param {string} commentId - the comment id
     * @return {void}
     */
    _defineProperty(this, "deleteCommentErrorCallback", (e, code, commentId) => {
      this.updateFeedItem(this.createFeedError(messages.commentDeleteErrorMessage), commentId);
      this.feedErrorCallback(true, e, code);
    });
    /**
     * Error callback for deleting a reply
     *
     * @param {ElementsXhrError} error - the error returned by the API
     * @param {string} code - the error code
     * @param {string} id - the reply (comment) id
     * @param {string} parentId - the comment id of the parent feed item
     * @return {void}
     */
    _defineProperty(this, "deleteReplyErrorCallback", (error, code, id, parentId) => {
      this.updateReplyItem(this.createFeedError(messages.commentDeleteErrorMessage), parentId, id);
      this.feedErrorCallback(true, error, code);
    });
    /**
     * Creates a task.
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {Object} currentUser - the user who performed the action
     * @param {string} message - Task text
     * @param {Array} assignees - List of assignees
     * @param {number} dueAt - Task's due date
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    _defineProperty(this, "createTaskNew", (file, currentUser, message, assignees, taskType, dueAt, completionRule, successCallback, errorCallback) => {
      if (!file.id) {
        throw getBadItemError();
      }
      this.file = file;
      this.errorCallback = errorCallback;
      const uuid = uniqueId('task_');
      let dueAtString;
      if (dueAt) {
        const dueAtDate = new Date(dueAt);
        dueAtString = dueAtDate.toISOString();
      }

      // TODO: make pending task generator a function
      const pendingTask = {
        created_by: {
          type: 'task_collaborator',
          target: currentUser,
          id: uniqueId(),
          role: 'CREATOR',
          status: TASK_NEW_INITIAL_STATUS
        },
        completion_rule: completionRule,
        created_at: new Date().toISOString(),
        due_at: dueAtString,
        id: uuid,
        description: message,
        type: FEED_ITEM_TYPE_TASK,
        assigned_to: {
          entries: assignees.map(assignee => ({
            id: uniqueId(),
            target: _objectSpread(_objectSpread({}, assignee), {}, {
              avatar_url: '',
              type: 'user'
            }),
            status: TASK_NEW_INITIAL_STATUS,
            permissions: {
              can_delete: false,
              can_update: false
            },
            role: 'ASSIGNEE',
            type: 'task_collaborator'
          })),
          limit: 10,
          next_marker: null
        },
        permissions: {
          can_update: false,
          can_delete: false,
          can_create_task_collaborator: false,
          can_create_task_link: false
        },
        task_links: {
          entries: [{
            id: uniqueId(),
            type: 'task_link',
            target: _objectSpread({
              type: 'file'
            }, file),
            permissions: {
              can_delete: false,
              can_update: false
            }
          }],
          limit: 1,
          next_marker: null
        },
        task_type: taskType,
        status: TASK_NEW_NOT_STARTED
      };
      const taskPayload = {
        description: message,
        due_at: dueAtString,
        task_type: taskType,
        completion_rule: completionRule
      };

      // create request for the size of each group by ID
      const groupInfoPromises = assignees.filter(assignee => (assignee.item && assignee.item.type) === 'group').map(assignee => assignee.id).map(groupId => {
        return new GroupsAPI(this.options).getGroupCount({
          file,
          group: {
            id: groupId
          }
        });
      });

      // Fetch each group size in parallel --> return an array of group sizes
      Promise.all(groupInfoPromises).then(groupCounts => {
        const hasAnyGroupCountExceeded = groupCounts.some(groupInfo => groupInfo.total_count > TASK_MAX_GROUP_ASSIGNEES);
        const warning = {
          code: ERROR_CODE_GROUP_EXCEEDS_LIMIT,
          type: 'warning'
        };
        if (hasAnyGroupCountExceeded) {
          this.feedErrorCallback(false, warning, ERROR_CODE_GROUP_EXCEEDS_LIMIT);
          return;
        }
        this.tasksNewAPI = new TasksNewAPI(this.options);
        this.tasksNewAPI.createTaskWithDeps({
          file,
          task: taskPayload,
          assignees,
          successCallback: taskWithDepsData => {
            this.addPendingItem(this.file.id, currentUser, pendingTask);
            this.updateFeedItem(_objectSpread(_objectSpread({}, taskWithDepsData), {}, {
              task_links: {
                entries: taskWithDepsData.task_links,
                next_marker: null,
                limit: 1
              },
              assigned_to: {
                entries: taskWithDepsData.assigned_to,
                next_marker: null,
                limit: taskWithDepsData.assigned_to.length
              },
              isPending: false
            }), uuid);
            successCallback(taskWithDepsData);
          },
          errorCallback: (e, code) => {
            this.feedErrorCallback(false, e, code);
          }
        });
      }).catch(error => {
        this.feedErrorCallback(false, error, ERROR_CODE_CREATE_TASK);
      });
    });
    /**
     * Deletes a task in the new API
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {string} taskId - The task's id
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    _defineProperty(this, "deleteTaskNew", (file, task, successCallback = noop, errorCallback = noop) => {
      if (!file.id) {
        throw getBadItemError();
      }
      this.file = file;
      this.errorCallback = errorCallback;
      this.tasksNewAPI = new TasksNewAPI(this.options);
      this.updateFeedItem({
        isPending: true
      }, task.id);
      this.tasksNewAPI.deleteTask({
        file,
        task,
        successCallback: this.deleteFeedItem.bind(this, task.id, successCallback),
        errorCallback: (e, code) => {
          this.updateFeedItem(this.createFeedError(messages.taskDeleteErrorMessage), task.id);
          this.feedErrorCallback(true, e, code);
        }
      });
    });
    /**
     * Deletes a feed item from the cache
     *
     * @param {string} id - The id of the feed item to be deleted
     * @param {Function} successCallback - function to be called after the delete
     */
    _defineProperty(this, "deleteFeedItem", (id, successCallback = noop) => {
      const cachedItems = this.getCachedItems(this.file.id);
      if (cachedItems) {
        const feedItems = cachedItems.items.filter(feedItem => feedItem.id !== id);
        this.setCachedItems(this.file.id, feedItems);
        if (!this.isDestroyed()) {
          successCallback(id);
        }
      }
    });
    /**
     * Deletes a reply from the cache
     *
     * @param {string} id - The id of the feed item to be deleted
     * @param {string} parentId - The id of the parent feed item
     * @param {Function} successCallback - function to be called after the delete
     */
    _defineProperty(this, "deleteReplyItem", (id, parentId, successCallback = noop) => {
      const cachedItems = this.getCachedItems(this.file.id) || {
        items: [],
        errors: []
      };
      const feedItems = cachedItems.items.map(item => {
        if (item.id !== parentId) {
          return item;
        }
        if (item.type === FEED_ITEM_TYPE_ANNOTATION) {
          return getItemWithFilteredReplies(item, id);
        }
        if (item.type === FEED_ITEM_TYPE_COMMENT) {
          return getItemWithFilteredReplies(item, id);
        }
        return item;
      });
      this.setCachedItems(this.file.id, feedItems);
      if (!this.isDestroyed()) {
        successCallback(id, parentId);
      }
    });
    /**
     * Network error callback
     *
     * @param {boolean} hasError - true if the UI should display an error
     * @param {ElementsXhrError} e - the error returned by the API
     * @param {string} code - the error code for the error which occured
     * @return {void}
     */
    _defineProperty(this, "feedErrorCallback", (hasError = false, e, code) => {
      if (hasError) {
        this.errors.push(_objectSpread(_objectSpread({}, e), {}, {
          code
        }));
      }
      if (!this.isDestroyed() && this.errorCallback) {
        this.errorCallback(e, code, {
          error: e,
          [IS_ERROR_DISPLAYED]: hasError
        });
      }
      console.error(e); // eslint-disable-line no-console
    });
    /**
     * Add a placeholder pending feed item.
     *
     * @param {string} id - the file id
     * @param {Object} currentUser - the user who performed the action
     * @param {Object} itemBase - Base properties for item to be added to the feed as pending.
     * @return {void}
     */
    _defineProperty(this, "addPendingItem", (id, currentUser, itemBase) => {
      if (!currentUser) {
        throw getBadUserError();
      }
      const date = new Date().toISOString();
      const pendingFeedItem = _objectSpread({
        created_at: date,
        created_by: currentUser,
        modified_at: date,
        isPending: true
      }, itemBase);
      const cachedItems = this.getCachedItems(this.file.id);
      const feedItems = cachedItems ? cachedItems.items : [];
      const feedItemsWithPendingItem = [...feedItems, pendingFeedItem];
      this.setCachedItems(id, feedItemsWithPendingItem);
      return pendingFeedItem;
    });
    /**
     * Add a placeholder pending comment (reply).
     *
     * @param {string} parentId - id of parent comment or annotation
     * @param {Object} currentUser - the user who performed the action
     * @param {Object} commentBase - Base properties for reply (comment) to be added to the feed as pending.
     * @return {Comment} - newly created pending reply
     */
    _defineProperty(this, "addPendingReply", (parentId, currentUser, commentBase) => {
      if (!this.file.id) {
        throw getBadItemError();
      }
      if (!currentUser) {
        throw getBadUserError();
      }
      const date = new Date().toISOString();
      const pendingReply = _objectSpread({
        created_at: date,
        created_by: currentUser,
        modified_at: date,
        isPending: true
      }, commentBase);
      const cachedItems = this.getCachedItems(this.file.id);
      if (cachedItems) {
        const updatedFeedItems = cachedItems.items.map(item => {
          if (item.id === parentId && item.type === FEED_ITEM_TYPE_COMMENT) {
            return getItemWithPendingReply(item, pendingReply);
          }
          if (item.id === parentId && item.type === FEED_ITEM_TYPE_ANNOTATION) {
            return getItemWithPendingReply(item, pendingReply);
          }
          return item;
        });
        this.setCachedItems(this.file.id, updatedFeedItems);
      }
      return pendingReply;
    });
    /**
     * Callback for successful creation of a Comment.
     *
     * @param {Comment} commentData - API returned Comment
     * @param {string} id - ID of the feed item to update with the new comment data
     * @return {void}
     */
    _defineProperty(this, "createCommentSuccessCallback", (commentData, id, successCallback) => {
      const {
        message = '',
        tagged_message = ''
      } = commentData;
      // Comment component uses tagged_message only
      commentData.tagged_message = tagged_message || message;
      this.updateFeedItem(_objectSpread(_objectSpread({}, commentData), {}, {
        isPending: false
      }), id);
      if (!this.isDestroyed()) {
        successCallback(commentData);
      }
    });
    /**
     * Callback for failed creation of a Comment.
     *
     * @param {Object} e - The axios error
     * @param {string} code - the error code
     * @param {string} id - ID of the feed item to update
     * @return {void}
     */
    _defineProperty(this, "createCommentErrorCallback", (e, code, id) => {
      const errorMessage = e.status === HTTP_STATUS_CODE_CONFLICT ? messages.commentCreateConflictMessage : messages.commentCreateErrorMessage;
      this.updateFeedItem(this.createFeedError(errorMessage), id);
      this.feedErrorCallback(false, e, code);
    });
    /**
     * Callback for successful creation of a Comment.
     *
     * @param {Comment} commentData - API returned Comment
     * @param {string} parentId - ID of the parent feed item
     * @param {string} id - ID of the reply to update with the new comment data
     * @param {Function} successCallback - success callback
     * @return {void}
     */
    _defineProperty(this, "createReplySuccessCallback", (commentData, parentId, id, successCallback) => {
      this.updateReplyItem(_objectSpread(_objectSpread({}, commentData), {}, {
        isPending: false
      }), parentId, id);
      if (!this.isDestroyed()) {
        successCallback(commentData);
      }
    });
    /**
     * Callback for failed creation of a reply.
     *
     * @param {ElementsXhrError} error - The axios error
     * @param {string} code - the error code
     * @param {string} parentId - ID of the parent feed item
     * @param {string} id - ID of the feed item to update
     * @return {void}
     */
    _defineProperty(this, "createReplyErrorCallback", (error, code, parentId, id) => {
      const errorMessage = error.status === HTTP_STATUS_CODE_CONFLICT ? messages.commentCreateConflictMessage : messages.commentCreateErrorMessage;
      this.updateReplyItem(this.createFeedError(errorMessage), parentId, id);
      this.feedErrorCallback(false, error, code);
    });
    /**
     * Replace a feed item with new feed item data.
     *
     * @param {Object} updates - The new data to be applied to the feed item.
     * @param {string} id - ID of the feed item to replace.
     * @return {void}
     */
    _defineProperty(this, "updateFeedItem", (updates, id) => {
      if (!this.file.id) {
        throw getBadItemError();
      }
      const cachedItems = this.getCachedItems(this.file.id);
      if (cachedItems) {
        const updatedFeedItems = cachedItems.items.map(item => {
          if (item.id === id) {
            return _objectSpread(_objectSpread({}, item), updates);
          }
          return item;
        });
        this.setCachedItems(this.file.id, updatedFeedItems);
        return updatedFeedItems;
      }
      return null;
    });
    /**
     * Replace a reply of feed item with new comment data.
     *
     * @param {Object} replyUpdates - New data to be applied to the reply.
     * @param {string} parentId - ID of the parent feed item.
     * @param {string} id - ID of the reply to replace.
     * @return {void}
     */
    _defineProperty(this, "updateReplyItem", (replyUpdates, parentId, id) => {
      if (!this.file.id) {
        throw getBadItemError();
      }
      const getItemWithUpdatedReply = (item, replyId, updates) => {
        const updatedItem = _objectSpread({}, item);
        if (updatedItem.replies) {
          updatedItem.replies = updatedItem.replies.map(reply => {
            if (reply.id === replyId) {
              return _objectSpread(_objectSpread({}, reply), updates);
            }
            return reply;
          });
        }
        return updatedItem;
      };
      const cachedItems = this.getCachedItems(this.file.id);
      if (cachedItems) {
        const updatedFeedItems = cachedItems.items.map(item => {
          if (item.id === parentId && item.type === FEED_ITEM_TYPE_COMMENT) {
            return getItemWithUpdatedReply(item, id, replyUpdates);
          }
          if (item.id === parentId && item.type === FEED_ITEM_TYPE_ANNOTATION) {
            return getItemWithUpdatedReply(item, id, replyUpdates);
          }
          return item;
        });
        this.setCachedItems(this.file.id, updatedFeedItems);
      }
    });
    /**
     * Create a comment, and make a pending item to be replaced once the API is successful.
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {Object} currentUser - the user who performed the action
     * @param {string} text - the comment text
     * @param {boolean} hasMention - true if there is an @mention in the text
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @return {void}
     */
    _defineProperty(this, "createComment", (file, currentUser, text, hasMention, successCallback, errorCallback) => {
      const uuid = uniqueId('comment_');
      const commentData = {
        id: uuid,
        tagged_message: text,
        type: FEED_ITEM_TYPE_COMMENT
      };
      if (!file.id) {
        throw getBadItemError();
      }
      this.file = file;
      this.errorCallback = errorCallback;
      this.addPendingItem(this.file.id, currentUser, commentData);
      const message = {};
      if (hasMention) {
        message.taggedMessage = text;
      } else {
        message.message = text;
      }
      this.commentsAPI = new CommentsAPI(this.options);
      this.commentsAPI.createComment(_objectSpread(_objectSpread({
        file
      }, message), {}, {
        successCallback: comment => {
          this.createCommentSuccessCallback(comment, uuid, successCallback);
        },
        errorCallback: (e, code) => {
          this.createCommentErrorCallback(e, code, uuid);
        }
      }));
    });
    /**
     * Create a threaded comment (using ThreadedComments API),
     * and make a pending item to be replaced once the API is successful.
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {Object} currentUser - the user who performed the action
     * @param {string} text - the comment text
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @return {void}
     */
    _defineProperty(this, "createThreadedComment", (file, currentUser, text, successCallback, errorCallback) => {
      if (!file.id) {
        throw getBadItemError();
      }
      const uuid = uniqueId('comment_');
      const commentData = {
        id: uuid,
        tagged_message: text,
        type: FEED_ITEM_TYPE_COMMENT
      };
      this.file = file;
      this.errorCallback = errorCallback;
      this.addPendingItem(this.file.id, currentUser, commentData);
      this.threadedCommentsAPI = new ThreadedCommentsAPI(this.options);
      this.threadedCommentsAPI.createComment({
        file,
        message: text,
        successCallback: comment => {
          this.createCommentSuccessCallback(comment, uuid, successCallback);
        },
        errorCallback: (e, code) => {
          this.createCommentErrorCallback(e, code, uuid);
        }
      });
    });
    /**
     * Update a comment
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {string} commentId - Comment ID
     * @param {string} text - the comment text
     * @param {boolean} hasMention - true if there is an @mention in the text
     * @param {BoxCommentPermission} permissions - Permissions to attach to the app activity items
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @return {void}
     */
    _defineProperty(this, "updateComment", (file, commentId, text, hasMention, permissions, successCallback, errorCallback) => {
      const commentData = {
        tagged_message: text
      };
      if (!file.id) {
        throw getBadItemError();
      }
      this.file = file;
      this.errorCallback = errorCallback;
      this.updateFeedItem(_objectSpread(_objectSpread({}, commentData), {}, {
        isPending: true
      }), commentId);
      const message = {};
      if (hasMention) {
        message.tagged_message = text;
      } else {
        message.message = text;
      }
      this.commentsAPI = new CommentsAPI(this.options);
      this.commentsAPI.updateComment(_objectSpread(_objectSpread({
        file,
        commentId,
        permissions
      }, message), {}, {
        successCallback: comment => {
          // use the request payload instead of response in the
          // feed item update because response may not contain
          // the tagged version of the message
          this.updateFeedItem(_objectSpread(_objectSpread({}, message), {}, {
            isPending: false
          }), commentId);
          if (!this.isDestroyed()) {
            successCallback(comment);
          }
        },
        errorCallback: (e, code) => {
          this.updateCommentErrorCallback(e, code, commentId);
        }
      }));
    });
    /**
     * Update a threaded comment
     *
     * @param {BoxItem} file - The file to which the task is assigned
     * @param {string} commentId - Comment ID
     * @param {string} text - the comment text
     * @param {FeedItemStatus} status - status of the comment
     * @param {BoxCommentPermission} permissions - Permissions to attach to the app activity items
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @return {void}
     */
    _defineProperty(this, "updateThreadedComment", (file, commentId, text, status, permissions, successCallback, errorCallback) => {
      if (!file.id) {
        throw getBadItemError();
      }
      if (!text && !status) {
        throw getMissingItemTextOrStatus();
      }
      const commentData = {};
      if (text) {
        commentData.tagged_message = text;
      }
      if (status) {
        commentData.status = status;
      }
      this.file = file;
      this.errorCallback = errorCallback;
      this.updateFeedItem(_objectSpread(_objectSpread({}, commentData), {}, {
        isPending: true
      }), commentId);
      this.threadedCommentsAPI = new ThreadedCommentsAPI(this.options);
      this.threadedCommentsAPI.updateComment({
        fileId: file.id,
        commentId,
        permissions,
        message: text,
        status,
        successCallback: comment => {
          const {
              replies,
              total_reply_count
            } = comment,
            commentBase = _objectWithoutProperties(comment, _excluded4);
          this.updateFeedItem(_objectSpread(_objectSpread({}, commentBase), {}, {
            isPending: false
          }), commentId);
          if (!this.isDestroyed()) {
            successCallback(comment);
          }
        },
        errorCallback: (e, code) => {
          this.updateCommentErrorCallback(e, code, commentId);
        }
      });
    });
    /**
     * Update a reply
     *
     * @param {BoxItem} file - The file to which the reply with its parent is assigned
     * @param {string} id - id of the reply
     * @param {string} parentId - id of the parent item
     * @param {string} text - the updated text
     * @param {BoxCommentPermission} permissions - Permissions to attach to the app activity items
     * @param {Function} successCallback - the success callback
     * @param {Function} errorCallback - the error callback
     * @return {void}
     */
    _defineProperty(this, "updateReply", (file, id, parentId, text, permissions, successCallback, errorCallback) => {
      if (!file.id) {
        throw getBadItemError();
      }
      this.file = file;
      this.errorCallback = errorCallback;
      this.updateReplyItem({
        tagged_message: text,
        isPending: true
      }, parentId, id);
      this.threadedCommentsAPI = new ThreadedCommentsAPI(this.options);
      this.threadedCommentsAPI.updateComment({
        fileId: file.id,
        commentId: id,
        permissions,
        message: text,
        undefined,
        successCallback: comment => {
          this.updateReplyItem(_objectSpread(_objectSpread({}, comment), {}, {
            isPending: false
          }), parentId, id);
          if (!this.isDestroyed()) {
            successCallback(comment);
          }
        },
        errorCallback: (error, code) => {
          this.updateReplyErrorCallback(error, code, id, parentId);
        }
      });
    });
    /**
     * Modify feed item replies count
     *
     * @param {string} id - id of the item
     * @param {number} n - number to modify the count by
     * @return {void}
     */
    _defineProperty(this, "modifyFeedItemRepliesCountBy", (id, n) => {
      if (!this.file.id) {
        throw getBadItemError();
      }
      const {
        items: feedItems = []
      } = this.getCachedItems(this.file.id) || {};
      const feedItem = feedItems.find(({
        id: itemId
      }) => itemId === id);
      if (!feedItem || feedItem.type !== 'annotation' && feedItem.type !== 'comment') {
        return;
      }
      const newReplyCount = (feedItem.total_reply_count || 0) + n;
      if (newReplyCount >= 0) {
        this.updateFeedItem({
          total_reply_count: newReplyCount
        }, id);
      }
    });
    /**
     * Deletes an app activity item.
     *
     * @param {BoxItem} file - The file to which the app activity belongs to
     * @param {string} appActivityId - The app activity item id to delete
     * @param {Function} successCallback - the function which will be called on success
     * @param {Function} errorCallback - the function which will be called on error
     * @return {void}
     */
    _defineProperty(this, "deleteAppActivity", (file, appActivityId, successCallback, errorCallback) => {
      const {
        id
      } = file;
      if (!id) {
        throw getBadItemError();
      }
      this.appActivityAPI = new AppActivityAPI(this.options);
      this.file = file;
      this.errorCallback = errorCallback;
      this.updateFeedItem({
        isPending: true
      }, appActivityId);
      this.appActivityAPI.deleteAppActivity({
        id,
        appActivityId,
        successCallback: this.deleteFeedItem.bind(this, appActivityId, successCallback),
        errorCallback: (e, code) => {
          this.deleteAppActivityErrorCallback(e, code, appActivityId);
        }
      });
    });
    /**
     * Error callback for deleting an app activity item
     *
     * @param {ElementsXhrError} e - the error returned by the API
     * @param {string} code - the error code
     * @param {string} id - the app activity id
     * @return {void}
     */
    _defineProperty(this, "deleteAppActivityErrorCallback", (e, code, id) => {
      this.updateFeedItem(this.createFeedError(messages.appActivityDeleteErrorMessage), id);
      this.feedErrorCallback(true, e, code);
    });
    this.taskCollaboratorsAPI = [];
    this.taskLinksAPI = [];
    this.errors = [];
  }

  /**
   * Creates pending card on create_start action, then updates card on next call
   * @param {BoxItem} file - The file to which the annotation is assigned
   * @param {Object} currentUser - the user who performed the action
   * @param {Annotation} annotation - the current annotation to be created
   * @param {string} id - unique id for the incoming annotation
   * @param {boolean} isPending - indicates the current creation process of the annotation
   */
  addAnnotation(file, currentUser, annotation, id, isPending) {
    if (!file.id) {
      throw getBadItemError();
    }
    this.file = file;

    // Add the pending interstitial card
    if (isPending) {
      const newAnnotation = _objectSpread(_objectSpread({}, annotation), {}, {
        created_by: currentUser,
        id,
        type: FEED_ITEM_TYPE_ANNOTATION
      });
      this.addPendingItem(this.file.id, currentUser, newAnnotation);
      return;
    }
    // Create action has completed, so update the existing pending item
    this.updateFeedItem(_objectSpread(_objectSpread({}, annotation), {}, {
      isPending: false
    }), id);
  }
  /**
   * Creates a key for the cache
   *
   * @param {string} id folder id
   * @return {string} key
   */
  getCacheKey(id) {
    return `${TYPED_ID_FEED_PREFIX}${id}`;
  }

  /**
   * Gets the items from the cache
   *
   * @param {string} id the cache id
   */
  getCachedItems(id) {
    const cache = this.getCache();
    const cacheKey = this.getCacheKey(id);
    return cache.get(cacheKey);
  }

  /**
   * Sets the items in the cache
   *
   * @param {string} id - the cache id
   * @param {Array} items - the feed items to cache
   */
  setCachedItems(id, items) {
    const cache = this.getCache();
    const cacheKey = this.getCacheKey(id);
    cache.set(cacheKey, {
      errors: this.errors,
      items
    });
  }

  /**
   * Gets the feed items
   *
   * @param {BoxItem} file - The file to which the task is assigned
   * @param {boolean} shouldRefreshCache - Optionally updates the cache
   * @param {Function} successCallback - the success callback  which is called after data fetching is complete
   * @param {Function} errorCallback - the error callback which is called after data fetching is complete if there was an error
   * @param {Function} onError - the function to be called immediately after an error occurs
   * @param {Object} [options]- feature flips, etc
   * @param {Object} [options.shouldShowAppActivity] - feature flip the new app activity api
   */
  feedItems(file, shouldRefreshCache, successCallback, errorCallback, onError, {
    shouldShowAnnotations = false,
    shouldShowAppActivity = false,
    shouldShowReplies = false,
    shouldShowTasks = true,
    shouldShowVersions = true,
    shouldUseUAA = false
  } = {}, logAPIParity) {
    const {
      id,
      permissions = {}
    } = file;
    const cachedItems = this.getCachedItems(id);
    if (cachedItems) {
      const {
        errors,
        items
      } = cachedItems;
      if (errors.length) {
        errorCallback(items, errors);
      } else {
        successCallback(items);
      }
      if (!shouldRefreshCache) {
        return;
      }
    }
    this.file = file;
    this.errors = [];
    this.errorCallback = onError;

    // Using the UAA File Activities endpoint replaces the need for these calls
    const annotationsPromise = shouldShowAnnotations ? this.fetchAnnotations(permissions, shouldShowReplies) : Promise.resolve();
    const commentsPromise = () => {
      return shouldShowReplies ? this.fetchThreadedComments(permissions) : this.fetchComments(permissions);
    };
    const tasksPromise = shouldShowTasks ? this.fetchTasksNew() : Promise.resolve();
    const appActivityPromise = shouldShowAppActivity ? this.fetchAppActivity(permissions) : Promise.resolve();
    const versionsPromise = shouldShowVersions ? this.fetchVersions() : Promise.resolve();
    const currentVersionPromise = shouldShowVersions ? this.fetchCurrentVersion() : Promise.resolve();
    const annotationActivityType = shouldShowAnnotations && permissions[PERMISSION_CAN_VIEW_ANNOTATIONS] ? [FILE_ACTIVITY_TYPE_ANNOTATION] : [];
    const appActivityActivityType = shouldShowAppActivity ? [FILE_ACTIVITY_TYPE_APP_ACTIVITY] : [];
    const taskActivityType = shouldShowTasks ? [FILE_ACTIVITY_TYPE_TASK] : [];
    const versionsActivityType = shouldShowVersions ? [FILE_ACTIVITY_TYPE_VERSION] : [];
    const commentActivityType = permissions[PERMISSION_CAN_COMMENT] ? [FILE_ACTIVITY_TYPE_COMMENT] : [];
    const filteredActivityTypes = [...annotationActivityType, ...appActivityActivityType, ...commentActivityType, ...taskActivityType, ...versionsActivityType];
    const fileActivitiesPromise =
    // Only fetch when activity types are explicitly stated
    shouldUseUAA && filteredActivityTypes.length ? this.fetchFileActivities(permissions, filteredActivityTypes, shouldShowReplies) : Promise.resolve();
    const handleFeedItems = feedItems => {
      if (!this.isDestroyed()) {
        this.setCachedItems(id, feedItems);
        if (this.errors.length) {
          errorCallback(feedItems, this.errors);
        } else {
          successCallback(feedItems);
        }
      }
    };
    const v2Promises = [versionsPromise, currentVersionPromise, commentsPromise(), tasksPromise, appActivityPromise, annotationsPromise];
    const fetchV2FeedItems = async promises => {
      return Promise.all(promises).then(([versions, currentVersion, ...feedItems]) => {
        const versionsWithCurrent = currentVersion ? this.versionsAPI.addCurrentVersion(currentVersion, versions, this.file) : undefined;
        return sortFeedItems(versionsWithCurrent, ...feedItems);
      });
    };
    const compareV2AndUaaFeedItems = async (uaaFeedItems, uaaResponse) => {
      fetchV2FeedItems(v2Promises).then(v2FeedItems => {
        const transformedV2FeedItems = collapseFeedState(v2FeedItems);
        const transformedUAAFeedItems = collapseFeedState(uaaFeedItems);
        if (logAPIParity) {
          logAPIParity({
            uaaResponse,
            uaaFeedItems: transformedUAAFeedItems,
            v2FeedItems: transformedV2FeedItems
          });
        }
      });
    };
    if (shouldUseUAA) {
      fileActivitiesPromise.then(response => {
        const uaaFeedItems = getParsedFileActivitiesResponse(response, permissions);
        compareV2AndUaaFeedItems(uaaFeedItems, response);
        handleFeedItems(uaaFeedItems);
      });
    } else {
      fetchV2FeedItems(v2Promises).then(v2FeedItems => {
        handleFeedItems(v2FeedItems);
      });
    }
  }
  fetchAnnotations(permissions, shouldFetchReplies) {
    this.annotationsAPI = new AnnotationsAPI(this.options);
    return new Promise(resolve => {
      this.annotationsAPI.getAnnotations(this.file.id, undefined, permissions, resolve, this.fetchFeedItemErrorCallback.bind(this, resolve), undefined, undefined, shouldFetchReplies);
    });
  }

  /**
   * Fetches the comments for a file
   *
   * @param {Object} permissions - the file permissions
   * @return {Promise} - the file comments
   */
  fetchComments(permissions) {
    this.commentsAPI = new CommentsAPI(this.options);
    return new Promise(resolve => {
      this.commentsAPI.getComments(this.file.id, permissions, resolve, this.fetchFeedItemErrorCallback.bind(this, resolve));
    });
  }

  /**
   * Fetches a comment for a file
   *
   * @param {BoxItem} file - The file to which the comment belongs to
   * @param {string} commentId - comment id
   * @param {Function} successCallback
   * @param {ErrorCallback} errorCallback
   * @return {Promise} - the file comments
   */
  fetchThreadedComment(file, commentId, successCallback, errorCallback) {
    const {
      id,
      permissions
    } = file;
    if (!id || !permissions) {
      throw getBadItemError();
    }
    this.threadedCommentsAPI = new ThreadedCommentsAPI(this.options);
    return new Promise(resolve => {
      this.threadedCommentsAPI.getComment({
        commentId,
        errorCallback,
        fileId: id,
        permissions,
        successCallback: this.fetchThreadedCommentSuccessCallback.bind(this, resolve, successCallback)
      });
    });
  }
  /**
   * Fetches the comments with replies for a file
   *
   * @param {Object} permissions - the file permissions
   * @return {Promise} - the file comments
   */
  fetchThreadedComments(permissions) {
    this.threadedCommentsAPI = new ThreadedCommentsAPI(this.options);
    return new Promise(resolve => {
      this.threadedCommentsAPI.getComments({
        errorCallback: this.fetchFeedItemErrorCallback.bind(this, resolve),
        fileId: this.file.id,
        permissions,
        successCallback: resolve
      });
    });
  }

  /**
   * Fetches the file activities for a file
   *
   * @param {BoxItemPermission} permissions - the file permissions
   * @param {FileActivityTypes[]} activityTypes - the activity types to filter by
   * @param {boolean} shouldShowReplies - specify if replies should be included in the response
   * @return {Promise} - the file comments
   */
  fetchFileActivities(permissions, activityTypes, shouldShowReplies = false) {
    this.fileActivitiesAPI = new FileActivitiesAPI(this.options);
    return new Promise(resolve => {
      this.fileActivitiesAPI.getActivities({
        errorCallback: this.fetchFeedItemErrorCallback.bind(this, resolve),
        fileID: this.file.id,
        permissions,
        successCallback: resolve,
        activityTypes,
        shouldShowReplies
      });
    });
  }

  /**
   * Fetches replies (comments) of a comment or annotation
   *
   * @param {BoxItem} file - The file to which the comment or annotation belongs to
   * @param {string} commentFeedItemId - ID of the comment or annotation
   * @param {CommentFeedItemType} commentFeedItemType - Type of the comment or annotation
   * @param {Function} successCallback
   * @param {ErrorCallback} errorCallback
   * @return {void}
   */
  fetchReplies(file, commentFeedItemId, commentFeedItemType, successCallback, errorCallback) {
    const {
      id,
      permissions
    } = file;
    if (!id || !permissions) {
      throw getBadItemError();
    }
    this.file = file;
    this.errorCallback = errorCallback;
    this.updateFeedItem({
      isRepliesLoading: true
    }, commentFeedItemId);
    const successCallbackFn = ({
      entries
    }) => {
      this.updateFeedItem({
        isRepliesLoading: false,
        replies: entries,
        total_reply_count: entries.length
      }, commentFeedItemId);
      successCallback(entries);
    };
    const errorCallbackFn = (error, code) => {
      this.fetchRepliesErrorCallback(error, code, commentFeedItemId);
    };
    if (commentFeedItemType === FEED_ITEM_TYPE_ANNOTATION) {
      this.annotationsAPI = new AnnotationsAPI(this.options);
      this.annotationsAPI.getAnnotationReplies(file.id, commentFeedItemId, permissions, successCallbackFn, errorCallbackFn);
    } else if (commentFeedItemType === FEED_ITEM_TYPE_COMMENT) {
      this.threadedCommentsAPI = new ThreadedCommentsAPI(this.options);
      this.threadedCommentsAPI.getCommentReplies({
        fileId: file.id,
        commentId: commentFeedItemId,
        permissions,
        successCallback: successCallbackFn,
        errorCallback: errorCallbackFn
      });
    }
  }

  /**
   * Fetches the versions for a file
   *
   * @return {Promise} - the file versions
   */
  fetchVersions() {
    this.versionsAPI = new VersionsAPI(this.options);
    return new Promise(resolve => {
      this.versionsAPI.getVersions(this.file.id, resolve, this.fetchFeedItemErrorCallback.bind(this, resolve), undefined, undefined, FEED_FILE_VERSIONS_FIELDS_TO_FETCH);
    });
  }

  /**
   * Fetches the current version for a file
   *
   * @return {Promise} - the file versions
   */
  fetchCurrentVersion() {
    this.versionsAPI = new VersionsAPI(this.options);
    return new Promise(resolve => {
      const {
        file_version = {}
      } = this.file;
      this.versionsAPI.getVersion(this.file.id, file_version.id, resolve, this.fetchFeedItemErrorCallback.bind(this, resolve));
    });
  }

  /**
   * Fetches the tasks for a file
   *
   * @return {Promise} - the feed items
   */
  fetchTasksNew() {
    this.tasksNewAPI = new TasksNewAPI(this.options);
    return new Promise(resolve => {
      this.tasksNewAPI.getTasksForFile({
        file: {
          id: this.file.id
        },
        successCallback: resolve,
        errorCallback: (err, code) => this.fetchFeedItemErrorCallback(resolve, err, code)
      });
    });
  }

  /**
   * Error callback for fetching feed items.
   * Should only call the error callback if the response is a 401, 429 or >= 500
   *
   * @param {Function} resolve - the function which will be called on error
   * @param {Object} e - the axios error
   * @param {string} code - the error code
   * @return {void}
   */
  fetchFeedItemErrorCallback(resolve, e, code) {
    const {
      status
    } = e;
    const shouldDisplayError = isUserCorrectableError(status);
    this.feedErrorCallback(shouldDisplayError, e, code);
    resolve();
  }
  /**
   * Creates a task group via the API.
   *
   * @param {BoxItem} file - The file to which the task is assigned
   * @param {Task|TaskUpdatePayload} task - The newly created or existing task from the API
   * @param {SelectorItem} assignee - The user assigned to this task
   * @param {Function} errorCallback - Task create error callback
   * @return {Promise<TaskAssignment>}
   */
  createTaskCollaboratorsforGroup(file, task, assignee) {
    if (!file.id) {
      throw getBadItemError();
    }
    this.file = file;
    return new Promise((resolve, reject) => {
      const taskCollaboratorsAPI = new TaskCollaboratorsAPI(this.options);
      this.taskCollaboratorsAPI.push(taskCollaboratorsAPI);
      taskCollaboratorsAPI.createTaskCollaboratorsforGroup({
        file,
        task,
        group: assignee,
        successCallback: resolve,
        errorCallback: e => {
          reject(e);
        }
      });
    });
  }

  /**
   * Creates a task collaborator via the API.
   *
   * @param {BoxItem} file - The file to which the task is assigned
   * @param {Task|TaskUpdatePayload} task - The newly created or existing task from the API
   * @param {SelectorItem} assignee - The user assigned to this task
   * @param {Function} errorCallback - Task create error callback
   * @return {Promise<TaskAssignment>}
   */
  createTaskCollaborator(file, task, assignee) {
    if (!file.id) {
      throw getBadItemError();
    }
    this.file = file;
    return new Promise((resolve, reject) => {
      const taskCollaboratorsAPI = new TaskCollaboratorsAPI(this.options);
      this.taskCollaboratorsAPI.push(taskCollaboratorsAPI);
      taskCollaboratorsAPI.createTaskCollaborator({
        file,
        task,
        user: assignee,
        successCallback: resolve,
        errorCallback: e => {
          reject(e);
        }
      });
    });
  }

  /**
   * Deletes a task collaborator via the API.
   *
   * @param {BoxItem} file - The file to which the task is assigned
   * @param {Task|TaskUpdatePayload} task - The newly deleted or existing task from the API
   * @param {TaskCollabAssignee} assignee - The user assigned to this task
   * @param {Function} errorCallback - Task delete error callback
   * @return {Promise<TaskAssignment>}
   */
  deleteTaskCollaborator(file, task, assignee) {
    if (!file.id) {
      throw getBadItemError();
    }
    this.file.id = file.id;
    return new Promise((resolve, reject) => {
      const taskCollaboratorsAPI = new TaskCollaboratorsAPI(this.options);
      this.taskCollaboratorsAPI.push(taskCollaboratorsAPI);
      taskCollaboratorsAPI.deleteTaskCollaborator({
        file,
        task,
        taskCollaborator: {
          id: assignee.id
        },
        successCallback: resolve,
        errorCallback: e => {
          reject(e);
        }
      });
    });
  }

  /**
   * Creates a task link via the API.
   *
   * @param {BoxItem} file - The file to which the task is assigned
   * @param {Task} task - The newly created task from the API
   * @param {Function} errorCallback - Task create error callback
   * @return {Promise<TaskAssignment}
   */
  createTaskLink(file, task) {
    if (!file.id) {
      throw getBadItemError();
    }
    this.file = file;
    return new Promise((resolve, reject) => {
      const taskLinksAPI = new TaskLinksAPI(this.options);
      this.taskLinksAPI.push(taskLinksAPI);
      taskLinksAPI.createTaskLink({
        file,
        task,
        successCallback: resolve,
        errorCallback: reject
      });
    });
  }
  /**
   * Constructs an error object that renders to an inline feed error
   *
   * @param {string} message - The error message body.
   * @param {string} title - The error message title.
   * @return {Object} An error message object
   */
  createFeedError(message, title = commonMessages.errorOccured) {
    return {
      error: {
        message,
        title
      }
    };
  }
  /**
   * Create a reply to annotation or comment, and make a pending item to be replaced once the API is successful.
   *
   * @param {BoxItem} file - The file to which the task is assigned
   * @param {Object} currentUser - the user who performed the action
   * @param {string} parentId - id of the parent item
   * @param {CommentFeedItemType} parentType - type of the parent item
   * @param {string} text - the comment text
   * @param {Function} successCallback - the success callback
   * @param {Function} errorCallback - the error callback
   * @return {void}
   */
  createReply(file, currentUser, parentId, parentType, text, successCallback, errorCallback) {
    const {
      id,
      permissions
    } = file;
    if (!id || !permissions) {
      throw getBadItemError();
    }
    const uuid = uniqueId('comment_');
    const commentData = {
      id: uuid,
      tagged_message: text,
      type: FEED_ITEM_TYPE_COMMENT
    };
    this.file = file;
    this.errorCallback = errorCallback;
    this.addPendingReply(parentId, currentUser, commentData);
    this.modifyFeedItemRepliesCountBy(parentId, 1);
    const successCallbackFn = comment => {
      this.createReplySuccessCallback(comment, parentId, uuid, successCallback);
    };
    const errorCallbackFn = (error, code) => {
      this.createReplyErrorCallback(error, code, parentId, uuid);
    };
    if (parentType === FEED_ITEM_TYPE_ANNOTATION) {
      this.annotationsAPI = new AnnotationsAPI(this.options);
      this.annotationsAPI.createAnnotationReply(file.id, parentId, permissions, text, successCallbackFn, errorCallbackFn);
    } else if (parentType === FEED_ITEM_TYPE_COMMENT) {
      this.threadedCommentsAPI = new ThreadedCommentsAPI(this.options);
      this.threadedCommentsAPI.createCommentReply({
        fileId: file.id,
        commentId: parentId,
        permissions,
        message: text,
        successCallback: successCallbackFn,
        errorCallback: errorCallbackFn
      });
    }
  }
  destroyTaskCollaborators() {
    if (Array.isArray(this.taskCollaboratorsAPI)) {
      this.taskCollaboratorsAPI.forEach(api => api.destroy());
      this.taskCollaboratorsAPI = [];
    }
  }
  destroyTaskLinks() {
    if (Array.isArray(this.taskLinksAPI)) {
      this.taskLinksAPI.forEach(api => api.destroy());
      this.taskLinksAPI = [];
    }
  }

  /**
   * Fetches app activities for a file
   * @param {BoxItemPermission} permissions - Permissions to attach to the app activity items
   *
   * @return {Promise} - the feed items
   */
  fetchAppActivity(permissions) {
    this.appActivityAPI = new AppActivityAPI(this.options);
    return new Promise(resolve => {
      this.appActivityAPI.getAppActivity(this.file.id, permissions, resolve, this.fetchFeedItemErrorCallback.bind(this, resolve));
    });
  }
  /**
   * Destroys all the task feed API's
   *
   * @return {void}
   */
  destroy() {
    super.destroy();
    if (this.annotationsAPI) {
      this.annotationsAPI.destroy();
      delete this.annotationsAPI;
    }
    if (this.commentsAPI) {
      this.commentsAPI.destroy();
      delete this.commentsAPI;
    }
    if (this.threadedCommentsAPI) {
      this.threadedCommentsAPI.destroy();
      delete this.threadedCommentsAPI;
    }
    if (this.versionsAPI) {
      this.versionsAPI.destroy();
      delete this.versionsAPI;
    }
    if (this.appActivityAPI) {
      this.appActivityAPI.destroy();
      delete this.appActivityAPI;
    }
    if (this.tasksNewAPI) {
      this.tasksNewAPI.destroy();
      delete this.tasksNewAPI;
    }
    this.destroyTaskCollaborators();
    this.destroyTaskLinks();
  }
}
export default Feed;
//# sourceMappingURL=Feed.js.map