import * as React from 'react';
import ActivityError from '../common/activity-error';
import ActivityThread from '../activity-feed/ActivityThread';
import AnnotationActivity from '../annotations';
import LoadingIndicator from '../../../../components/loading-indicator/LoadingIndicator';
import './AnnotationThreadContent.scss';
const AnnotationThreadContent = ({
  annotation,
  currentUser,
  error,
  getAvatarUrl,
  getMentionWithQuery,
  getUserProfileUrl,
  isLoading,
  mentionSelectorContacts,
  onAnnotationDelete,
  onAnnotationEdit,
  onAnnotationStatusChange,
  onReplyCreate,
  onReplyDelete,
  onReplyEdit,
  replies = []
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, error && /*#__PURE__*/React.createElement(ActivityError, error), isLoading && /*#__PURE__*/React.createElement("div", {
    className: "AnnotationThreadContent-loading",
    "data-testid": "annotation-loading"
  }, /*#__PURE__*/React.createElement(LoadingIndicator, null)), annotation && /*#__PURE__*/React.createElement(ActivityThread, {
    getAvatarUrl: getAvatarUrl,
    getMentionWithQuery: getMentionWithQuery,
    getUserProfileUrl: getUserProfileUrl,
    hasReplies: true,
    isAlwaysExpanded: true,
    isRepliesLoading: isLoading,
    mentionSelectorContacts: mentionSelectorContacts,
    onReplyCreate: onReplyCreate,
    onReplyDelete: onReplyDelete,
    onReplyEdit: onReplyEdit,
    replies: replies,
    repliesTotalCount: replies.length
  }, /*#__PURE__*/React.createElement(AnnotationActivity, {
    currentUser: currentUser,
    getAvatarUrl: getAvatarUrl,
    getMentionWithQuery: getMentionWithQuery,
    getUserProfileUrl: getUserProfileUrl,
    isCurrentVersion: true,
    item: annotation,
    mentionSelectorContacts: mentionSelectorContacts,
    onDelete: onAnnotationDelete,
    onEdit: onAnnotationEdit,
    onStatusChange: onAnnotationStatusChange
  })));
};
export default AnnotationThreadContent;
//# sourceMappingURL=AnnotationThreadContent.js.map