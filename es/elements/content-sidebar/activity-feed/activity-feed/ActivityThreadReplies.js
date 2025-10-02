function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import Comment from '../comment';
import LoadingIndicator from '../../../../components/loading-indicator';
import { BaseComment } from '../comment/BaseComment';
import './ActivityThreadReplies.scss';
const ActivityThreadReplies = ({
  currentUser,
  getAvatarUrl,
  getMentionWithQuery,
  getUserProfileUrl,
  hasNewThreadedReplies = false,
  isRepliesLoading,
  mentionSelectorContacts,
  onDelete,
  onEdit,
  onSelect,
  replies,
  translations
}) => {
  const getReplyPermissions = reply => {
    const {
      permissions: {
        can_delete = false,
        can_edit = false,
        can_resolve = false
      } = {}
    } = reply;
    return {
      can_delete,
      can_edit,
      can_resolve
    };
  };
  const handleOnEdit = ({
    hasMention,
    id,
    onError,
    onSuccess,
    permissions,
    status,
    text
  }) => {
    if (onEdit) {
      onEdit(id, text, status, hasMention, permissions, onSuccess, onError);
    }
  };
  const renderComment = reply => {
    if (hasNewThreadedReplies) {
      return /*#__PURE__*/React.createElement(BaseComment, _extends({
        key: `${reply.type}${reply.id}`
      }, reply, {
        currentUser: currentUser,
        getAvatarUrl: getAvatarUrl,
        getMentionWithQuery: getMentionWithQuery,
        getUserProfileUrl: getUserProfileUrl,
        mentionSelectorContacts: mentionSelectorContacts,
        onDelete: onDelete,
        onCommentEdit: handleOnEdit,
        onSelect: onSelect,
        permissions: getReplyPermissions(reply),
        translations: translations
      }));
    }
    return /*#__PURE__*/React.createElement(Comment, _extends({
      key: `${reply.type}${reply.id}`
    }, reply, {
      currentUser: currentUser,
      getAvatarUrl: getAvatarUrl,
      getMentionWithQuery: getMentionWithQuery,
      getUserProfileUrl: getUserProfileUrl,
      mentionSelectorContacts: mentionSelectorContacts,
      onDelete: onDelete,
      onEdit: handleOnEdit,
      onSelect: onSelect,
      permissions: getReplyPermissions(reply),
      translations: translations
    }));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "bcs-ActivityThreadReplies",
    "data-testid": "activity-thread-replies"
  }, isRepliesLoading && /*#__PURE__*/React.createElement("div", {
    className: "bcs-ActivityThreadReplies-loading",
    "data-testid": "activity-thread-replies-loading"
  }, /*#__PURE__*/React.createElement(LoadingIndicator, null)), replies.map(reply => renderComment(reply)));
};
export default ActivityThreadReplies;
//# sourceMappingURL=ActivityThreadReplies.js.map