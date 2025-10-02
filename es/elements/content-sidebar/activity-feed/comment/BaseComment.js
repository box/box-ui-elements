function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import classNames from 'classnames';
import noop from 'lodash/noop';
import { BaseCommentMenuWrapper } from './components/BaseCommentMenuWrapper';
import { BaseCommentInfo } from './components/BaseCommentInfo';
import { COMMENT_STATUS_RESOLVED } from '../../../../constants';
import ActivityError from '../common/activity-error';
import ActivityMessage from '../common/activity-message';
import CommentForm from '../comment-form';
import CreateReply from './CreateReply';
import LoadingIndicator from '../../../../components/loading-indicator';
import RepliesToggle from './RepliesToggle';
import './BaseComment.scss';
import './Replies.scss';
import './Comment.scss';
import ActivityStatus from '../common/activity-status';
export const BaseComment = ({
  annotationActivityLink,
  created_at,
  created_by,
  currentUser,
  error,
  file,
  getAvatarUrl,
  getMentionWithQuery,
  getUserProfileUrl,
  hasReplies = false,
  id,
  isDisabled,
  isPending = false,
  isRepliesLoading = false,
  mentionSelectorContacts,
  modified_at,
  onAnnotationEdit,
  onCommentEdit,
  onDelete,
  onHideReplies,
  onReplyCreate,
  onReplyDelete,
  onSelect,
  onShowReplies,
  onStatusChange,
  permissions = {},
  replies = [],
  repliesTotalCount = 0,
  status,
  tagged_message = '',
  translatedTaggedMessage,
  translations
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isInputOpen, setIsInputOpen] = React.useState(false);
  const commentFormFocusHandler = () => {
    setIsInputOpen(true);
    onSelect(true);
  };
  const commentFormCancelHandler = () => {
    setIsInputOpen(false);
    setIsEditing(false);
    onSelect(false);
  };
  const commentFormSubmitHandler = () => {
    setIsInputOpen(false);
    setIsEditing(false);
    onSelect(false);
  };
  const handleMessageUpdate = ({
    id: messageID,
    text,
    hasMention
  }) => {
    // Since we have to pass onCommentEdit through annotations (to Replies), onAnnotationEdit essentially overrides onCommentEdit
    if (onAnnotationEdit) {
      onAnnotationEdit({
        id: messageID,
        text,
        permissions
      });
    } else if (onCommentEdit) {
      onCommentEdit({
        id: messageID,
        text,
        hasMention,
        permissions
      });
    }
    commentFormSubmitHandler();
  };

  // Since we have to pass onCommentEdit through annotations (to Replies), onAnnotationEdit essentially overrides onCommentEdit
  const onEdit = onAnnotationEdit ?? onCommentEdit;
  const canDelete = !!permissions.can_delete;
  const canEdit = onEdit !== noop && !!permissions.can_edit;
  const canResolve = onEdit !== noop && !!permissions.can_resolve;
  const isEdited = modified_at !== undefined && modified_at !== created_at;
  const isMenuVisible = (canDelete || canEdit || canResolve) && !isPending;
  const isResolved = status === COMMENT_STATUS_RESOLVED;
  const commentProps = {
    currentUser,
    getUserProfileUrl,
    getAvatarUrl,
    getMentionWithQuery,
    mentionSelectorContacts,
    translations
  };
  return (
    /*#__PURE__*/
    // TODO: Change className to bcs-Comment once FF is removed
    React.createElement("div", {
      className: "bcs-BaseComment"
    }, /*#__PURE__*/React.createElement("div", {
      className: classNames('bcs-Comment-media', {
        'bcs-is-pending': isPending || error
      })
    }, /*#__PURE__*/React.createElement("div", {
      className: "bcs-BaseComment-header"
    }, /*#__PURE__*/React.createElement(BaseCommentInfo, {
      annotationActivityLink: annotationActivityLink,
      created_at: created_at,
      created_by: created_by,
      getAvatarUrl: getAvatarUrl,
      getUserProfileUrl: getUserProfileUrl,
      status: status
    }), isMenuVisible && /*#__PURE__*/React.createElement(BaseCommentMenuWrapper, {
      canDelete: canDelete,
      canEdit: canEdit,
      canResolve: canResolve,
      id: id,
      isEditing: isEditing,
      isInputOpen: isInputOpen,
      isResolved: isResolved,
      onDelete: onDelete,
      onSelect: onSelect,
      onStatusChange: onStatusChange,
      permissions: permissions,
      setIsEditing: setIsEditing,
      setIsInputOpen: setIsInputOpen
    })), /*#__PURE__*/React.createElement(ActivityStatus, {
      status: status
    }), /*#__PURE__*/React.createElement("div", {
      className: "bcs-BaseComment-content"
    }, isEditing ? /*#__PURE__*/React.createElement(CommentForm, {
      className: classNames('bcs-Comment-editor', {
        'bcs-is-disabled': isDisabled
      }),
      entityId: id,
      file: file,
      getAvatarUrl: getAvatarUrl,
      getMentionWithQuery: getMentionWithQuery,
      isDisabled: isDisabled,
      isEditing: isEditing,
      isOpen: isInputOpen,
      mentionSelectorContacts: mentionSelectorContacts,
      onCancel: commentFormCancelHandler,
      onFocus: commentFormFocusHandler,
      shouldFocusOnOpen: true,
      tagged_message: tagged_message,
      updateComment: handleMessageUpdate
      // $FlowFixMe
      ,
      user: currentUser
    }) : /*#__PURE__*/React.createElement(ActivityMessage, _extends({
      id: id,
      isEdited: isEdited && !isResolved,
      tagged_message: tagged_message,
      translatedTaggedMessage: translatedTaggedMessage
    }, translations, {
      translationFailed: error ? true : null,
      getUserProfileUrl: getUserProfileUrl
    })))), error ? /*#__PURE__*/React.createElement(ActivityError, error) : null, hasReplies && /*#__PURE__*/React.createElement(Replies, _extends({}, commentProps, {
      isParentPending: isPending,
      isRepliesLoading: isRepliesLoading,
      onCommentEdit: onCommentEdit,
      onHideReplies: onHideReplies,
      onReplyCreate: onReplyCreate,
      onReplyDelete: onReplyDelete,
      onReplySelect: onSelect,
      onShowReplies: onShowReplies,
      replies: replies,
      repliesTotalCount: repliesTotalCount
    })))
  );
};

// Added Replies to Comment file to avoid circular dependency warning

export const Replies = ({
  currentUser,
  getAvatarUrl,
  getMentionWithQuery,
  getUserProfileUrl,
  isParentPending = false,
  isRepliesLoading = false,
  mentionSelectorContacts,
  onCommentEdit,
  onReplyCreate,
  onReplyDelete,
  onReplySelect = noop,
  onShowReplies,
  onHideReplies,
  replies,
  repliesTotalCount = 0,
  translations
}) => {
  const [showReplyForm, setShowReplyForm] = React.useState(false);
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
  const handleNewReplyButton = () => {
    setShowReplyForm(true);
    onReplySelect(true);
  };
  const handleCancelNewReply = () => {
    setShowReplyForm(false);
    onReplySelect(false);
  };
  const handleSubmitNewReply = (reply, replyCreate) => {
    setShowReplyForm(false);
    replyCreate(reply);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "bcs-Replies"
  }, !!onShowReplies && !!onHideReplies && /*#__PURE__*/React.createElement(RepliesToggle, {
    onHideReplies: index => onHideReplies([replies[index]]),
    onShowReplies: onShowReplies,
    repliesShownCount: replies.length,
    repliesTotalCount: repliesTotalCount
  }), /*#__PURE__*/React.createElement("div", {
    className: "bcs-Replies-content"
  }, isRepliesLoading && /*#__PURE__*/React.createElement("div", {
    className: "bcs-Replies-loading",
    "data-testid": "replies-loading"
  }, /*#__PURE__*/React.createElement(LoadingIndicator, null)), /*#__PURE__*/React.createElement("ol", {
    className: "bcs-Replies-list"
  }, replies.map(reply => {
    const {
      id,
      type
    } = reply;
    return /*#__PURE__*/React.createElement("li", {
      key: `${type}${id}`
    }, /*#__PURE__*/React.createElement(BaseComment, _extends({}, reply, {
      currentUser: currentUser,
      getAvatarUrl: getAvatarUrl,
      getMentionWithQuery: getMentionWithQuery,
      getUserProfileUrl: getUserProfileUrl,
      isPending: isParentPending || reply.isPending,
      mentionSelectorContacts: mentionSelectorContacts,
      onCommentEdit: onCommentEdit,
      onSelect: onReplySelect,
      onDelete: onReplyDelete,
      permissions: getReplyPermissions(reply),
      translations: translations
    })));
  }))), !!onReplyCreate && /*#__PURE__*/React.createElement(CreateReply, {
    getMentionWithQuery: getMentionWithQuery,
    isDisabled: isParentPending,
    mentionSelectorContacts: mentionSelectorContacts,
    onCancel: handleCancelNewReply,
    onClick: handleNewReplyButton,
    onFocus: () => onReplySelect(true),
    onSubmit: reply => handleSubmitNewReply(reply, onReplyCreate),
    showReplyForm: showReplyForm
  }));
};
//# sourceMappingURL=BaseComment.js.map