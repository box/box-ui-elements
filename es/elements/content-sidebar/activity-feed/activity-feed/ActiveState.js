function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Active state component for Activity Feed
 */
import * as React from 'react';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import ActivityThread from './ActivityThread';
import ActivityItem from './ActivityItem';
import AppActivity from '../app-activity';
import AnnotationActivity from '../annotations';
import Comment from '../comment';
import TaskNew from '../task-new';
import Version, { CollapsedVersion } from '../version';
import withErrorHandling from '../../withErrorHandling';
import { BaseComment } from '../comment/BaseComment';
import { FEED_ITEM_TYPE_ANNOTATION, FEED_ITEM_TYPE_APP_ACTIVITY, FEED_ITEM_TYPE_COMMENT, FEED_ITEM_TYPE_TASK, FEED_ITEM_TYPE_VERSION } from '../../../../constants';
import AnnotationActivityLinkProvider from './AnnotationActivityLinkProvider';
const ActiveState = ({
  activeFeedItem,
  activeFeedItemRef,
  approverSelectorContacts,
  currentFileVersionId,
  currentUser,
  file,
  getApproverWithQuery,
  getAvatarUrl,
  getMentionWithQuery,
  getUserProfileUrl,
  hasNewThreadedReplies = false,
  hasReplies = false,
  hasVersions,
  items,
  mentionSelectorContacts,
  onAnnotationDelete,
  onAnnotationEdit,
  onAnnotationSelect,
  onAnnotationStatusChange,
  onAppActivityDelete,
  onCommentDelete,
  onCommentEdit,
  onCommentSelect = noop,
  onHideReplies = noop,
  onReplyCreate = noop,
  onReplyDelete = noop,
  onReplyUpdate = noop,
  onShowReplies = noop,
  onTaskAssignmentUpdate,
  onTaskDelete,
  onTaskEdit,
  onTaskModalClose,
  onTaskView,
  onVersionInfo,
  shouldUseUAA,
  translations
}) => {
  const onCommentSelectHandler = itemId => isSelected => {
    onCommentSelect(isSelected ? itemId : null);
  };
  const onHideRepliesHandler = parentId => lastReply => {
    onHideReplies(parentId, [lastReply]);
  };
  const onReplyCreateHandler = (parentId, parentType) => text => {
    onReplyCreate(parentId, parentType, text);
  };
  const onReplyDeleteHandler = parentId => options => {
    onReplyDelete(_objectSpread(_objectSpread({}, options), {}, {
      parentId
    }));
  };
  const onReplyUpdateHandler = parentId => (id, text, status, hasMention, permissions, onSuccess, onError) => {
    onReplyUpdate(id, parentId, text, permissions, onSuccess, onError);
  };
  const onShowRepliesHandler = (id, type) => () => {
    onShowReplies(id, type);
  };
  const onCommentStatusChangeHandler = props => {
    if (onCommentEdit) {
      onCommentEdit(_objectSpread({
        hasMention: false
      }, props));
    }
  };
  const hasMultipleVersions = item => item.versions || shouldUseUAA && item.version_start !== item.version_end;
  return /*#__PURE__*/React.createElement("ul", {
    className: "bcs-activity-feed-active-state"
  }, items.map(item => {
    const isFocused = item === activeFeedItem;
    const refValue = isFocused ? activeFeedItemRef : undefined;
    const itemFileVersionId = getProp(item, 'file_version.id');
    const replyProps = {
      hasReplies,
      onReplySelect: onCommentSelectHandler(item.id)
    };
    const commentAndAnnotationCommonProps = _objectSpread(_objectSpread(_objectSpread({}, item), replyProps), {}, {
      currentUser,
      file,
      getAvatarUrl,
      getMentionWithQuery,
      getUserProfileUrl,
      mentionSelectorContacts,
      onHideReplies: shownReplies => onHideReplies(item.id, shownReplies),
      onSelect: onCommentSelectHandler(item.id),
      permissions: {
        can_delete: getProp(item.permissions, 'can_delete', false),
        can_edit: getProp(item.permissions, 'can_edit', false),
        can_reply: getProp(item.permissions, 'can_reply', false),
        can_resolve: getProp(item.permissions, 'can_resolve', false)
      },
      // TODO: legitimate, pre-existing typing issue that was previously undetected
      // $FlowFixMe
      repliesTotalCount: item.total_reply_count,
      translations
    });
    switch (item.type) {
      case FEED_ITEM_TYPE_COMMENT:
        return /*#__PURE__*/React.createElement(ActivityItem, {
          key: item.type + item.id,
          "data-testid": "comment",
          isFocused: isFocused,
          isHoverable: true,
          hasNewThreadedReplies: hasNewThreadedReplies,
          ref: refValue
        }, hasNewThreadedReplies ?
        /*#__PURE__*/
        // TODO: legitimate, pre-existing typing issue that was previously undetected
        // Conflict between BoxCommentPermissions and BoxTaskPermissions
        // $FlowFixMe
        React.createElement(BaseComment, _extends({}, commentAndAnnotationCommonProps, {
          file: file,
          onDelete: onCommentDelete,
          onCommentEdit: onCommentEdit,
          onReplyCreate: reply => onReplyCreate(item.id, FEED_ITEM_TYPE_COMMENT, reply),
          onReplyDelete: onReplyDeleteHandler(item.id),
          onShowReplies: () => onShowReplies(item.id, FEED_ITEM_TYPE_COMMENT),
          onStatusChange: onCommentStatusChangeHandler
        })) : /*#__PURE__*/React.createElement(ActivityThread, {
          "data-testid": "activity-thread",
          currentUser: currentUser,
          getAvatarUrl: getAvatarUrl,
          getMentionWithQuery: getMentionWithQuery,
          getUserProfileUrl: getUserProfileUrl,
          hasNewThreadedReplies: hasNewThreadedReplies,
          hasReplies: hasReplies,
          isPending: item.isPending,
          isRepliesLoading: item.isRepliesLoading,
          mentionSelectorContacts: mentionSelectorContacts,
          onHideReplies: onHideRepliesHandler(item.id),
          onReplyCreate: onReplyCreateHandler(item.id, item.type),
          onReplyDelete: onReplyDeleteHandler(item.id),
          onReplyEdit: onReplyUpdateHandler(item.id),
          onReplySelect: onCommentSelectHandler(item.id),
          onShowReplies: onShowRepliesHandler(item.id, item.type),
          repliesTotalCount: item.total_reply_count,
          replies: item.replies,
          translations: translations
        }, /*#__PURE__*/React.createElement(Comment, _extends({}, item, {
          currentUser: currentUser,
          getAvatarUrl: getAvatarUrl,
          getMentionWithQuery: getMentionWithQuery,
          getUserProfileUrl: getUserProfileUrl,
          file: file,
          mentionSelectorContacts: mentionSelectorContacts,
          onDelete: onCommentDelete,
          onEdit: onCommentEdit,
          onSelect: onCommentSelectHandler(item.id),
          permissions: {
            can_delete: getProp(item.permissions, 'can_delete', false),
            can_edit: getProp(item.permissions, 'can_edit', false),
            can_reply: getProp(item.permissions, 'can_reply', false),
            can_resolve: getProp(item.permissions, 'can_resolve', false)
          },
          translations: translations
        }))));
      case FEED_ITEM_TYPE_TASK:
        return /*#__PURE__*/React.createElement(ActivityItem, {
          key: item.type + item.id,
          className: "bcs-activity-feed-task-new",
          "data-testid": "task",
          isFocused: isFocused,
          ref: refValue
        }, /*#__PURE__*/React.createElement(TaskNew, _extends({}, item, {
          approverSelectorContacts: approverSelectorContacts,
          currentUser: currentUser,
          getApproverWithQuery: getApproverWithQuery,
          getAvatarUrl: getAvatarUrl,
          getUserProfileUrl: getUserProfileUrl,
          onAssignmentUpdate: onTaskAssignmentUpdate,
          onDelete: onTaskDelete,
          onEdit: onTaskEdit,
          onView: onTaskView,
          onModalClose: onTaskModalClose,
          shouldUseUAA: shouldUseUAA,
          translations: translations
        })));
      case FEED_ITEM_TYPE_VERSION:
        return /*#__PURE__*/React.createElement(ActivityItem, {
          key: item.type + item.id,
          className: "bcs-version-item",
          "data-testid": "version"
        }, hasMultipleVersions(item) ?
        /*#__PURE__*/
        // $FlowFixMe
        React.createElement(CollapsedVersion, _extends({}, item, {
          onInfo: onVersionInfo,
          shouldUseUAA: shouldUseUAA
        })) :
        /*#__PURE__*/
        // $FlowFixMe
        React.createElement(Version, _extends({}, item, {
          onInfo: onVersionInfo,
          shouldUseUAA: shouldUseUAA
        })));
      case FEED_ITEM_TYPE_APP_ACTIVITY:
        return /*#__PURE__*/React.createElement(ActivityItem, {
          key: item.type + item.id,
          className: "bcs-activity-feed-app-activity",
          "data-testid": "app-activity"
        }, /*#__PURE__*/React.createElement(AppActivity, _extends({
          currentUser: currentUser,
          onDelete: onAppActivityDelete
        }, item)));
      case FEED_ITEM_TYPE_ANNOTATION:
        return /*#__PURE__*/React.createElement(ActivityItem, {
          key: item.type + item.id,
          className: "bcs-activity-feed-annotation-activity",
          "data-testid": "annotation-activity",
          isHoverable: true,
          hasNewThreadedReplies: hasNewThreadedReplies,
          isFocused: isFocused,
          ref: refValue
        }, hasNewThreadedReplies && onAnnotationSelect ?
        /*#__PURE__*/
        // TODO: legitimate, pre-existing typing issue that was previously undetected
        // Conflict between BoxCommentPermissions and BoxTaskPermissions
        // $FlowFixMe
        React.createElement(BaseComment, _extends({}, commentAndAnnotationCommonProps, {
          annotationActivityLink: /*#__PURE__*/React.createElement(AnnotationActivityLinkProvider, {
            item: item,
            onSelect: onAnnotationSelect,
            isCurrentVersion: currentFileVersionId === itemFileVersionId
          }),
          onAnnotationEdit: onAnnotationEdit,
          onCommentEdit: onCommentEdit,
          onDelete: onAnnotationDelete,
          onStatusChange: onAnnotationStatusChange,
          onReplyCreate: reply => onReplyCreate(item.id, FEED_ITEM_TYPE_ANNOTATION, reply),
          onShowReplies: () => onShowReplies(item.id, FEED_ITEM_TYPE_ANNOTATION),
          tagged_message: item.description?.message ?? ''
        })) : /*#__PURE__*/React.createElement(ActivityThread, {
          "data-testid": "activity-thread",
          currentUser: currentUser,
          getAvatarUrl: getAvatarUrl,
          getMentionWithQuery: getMentionWithQuery,
          getUserProfileUrl: getUserProfileUrl,
          hasNewThreadedReplies: hasNewThreadedReplies,
          hasReplies: hasReplies,
          isPending: item.isPending,
          isRepliesLoading: item.isRepliesLoading,
          mentionSelectorContacts: mentionSelectorContacts,
          onHideReplies: onHideRepliesHandler(item.id),
          onReplyCreate: onReplyCreateHandler(item.id, item.type),
          onReplyDelete: onReplyDeleteHandler(item.id),
          onReplyEdit: onReplyUpdateHandler(item.id),
          onReplySelect: onCommentSelectHandler(item.id),
          onShowReplies: onShowRepliesHandler(item.id, item.type),
          repliesTotalCount: item.total_reply_count,
          replies: item.replies,
          translations: translations
        }, /*#__PURE__*/React.createElement(AnnotationActivity, {
          currentUser: currentUser,
          getAvatarUrl: getAvatarUrl,
          getUserProfileUrl: getUserProfileUrl,
          getMentionWithQuery: getMentionWithQuery,
          hasVersions: hasVersions,
          isCurrentVersion: currentFileVersionId === itemFileVersionId,
          item: item,
          mentionSelectorContacts: mentionSelectorContacts,
          onEdit: onAnnotationEdit,
          onDelete: onAnnotationDelete,
          onSelect: onAnnotationSelect,
          onStatusChange: onAnnotationStatusChange
        })));
      default:
        return null;
    }
  }));
};
export { ActiveState as ActiveStateComponent };
export default withErrorHandling(ActiveState);
//# sourceMappingURL=ActiveState.js.map