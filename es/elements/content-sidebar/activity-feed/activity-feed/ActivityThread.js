function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';
import PlainButton from '../../../../components/plain-button';
import ActivityThreadReplies from './ActivityThreadReplies';
import ActivityThreadReplyForm from './ActivityThreadReplyForm';
import messages from './messages';
import './ActivityThread.scss';
const ActivityThread = ({
  children,
  currentUser,
  getAvatarUrl,
  getMentionWithQuery,
  getUserProfileUrl,
  hasNewThreadedReplies = false,
  hasReplies,
  isAlwaysExpanded = false,
  isPending,
  isRepliesLoading,
  mentionSelectorContacts,
  onHideReplies = noop,
  onReplyCreate,
  onReplyDelete = noop,
  onReplyEdit = noop,
  onReplySelect = noop,
  onShowReplies = noop,
  replies = [],
  repliesTotalCount = 0,
  translations
}) => {
  const {
    length: repliesLength
  } = replies;
  const repliesToLoadCount = Math.max(repliesTotalCount - repliesLength, 0);
  const onHideRepliesHandler = () => {
    if (repliesLength) {
      onHideReplies(replies[repliesLength - 1]);
    }
  };
  const handleFormFocusOrShow = () => {
    onReplySelect(true);
  };
  const handleFormHide = () => {
    onReplySelect(false);
  };
  const renderButton = () => {
    if (isAlwaysExpanded || isRepliesLoading) {
      return null;
    }
    if (repliesTotalCount > repliesLength) {
      return /*#__PURE__*/React.createElement(PlainButton, {
        className: "bcs-ActivityThread-toggle",
        onClick: onShowReplies,
        type: "button",
        "data-testid": "activity-thread-button"
      }, /*#__PURE__*/React.createElement(FormattedMessage, _extends({
        values: {
          repliesToLoadCount
        }
      }, messages.showReplies)));
    }
    if (repliesTotalCount > 1 && repliesTotalCount === repliesLength) {
      return /*#__PURE__*/React.createElement(PlainButton, {
        className: "bcs-ActivityThread-toggle",
        onClick: onHideRepliesHandler,
        type: "button",
        "data-testid": "activity-thread-button"
      }, /*#__PURE__*/React.createElement(FormattedMessage, messages.hideReplies));
    }
    return null;
  };
  if (!hasReplies) {
    return children;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "bcs-ActivityThread",
    "data-testid": "activity-thread"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bcs-ActivityThread-selectWrapper"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bcs-ActivityThread-content"
  }, children, renderButton(), repliesTotalCount > 0 && repliesLength > 0 && /*#__PURE__*/React.createElement(ActivityThreadReplies, {
    currentUser: currentUser,
    getAvatarUrl: getAvatarUrl,
    getMentionWithQuery: getMentionWithQuery,
    getUserProfileUrl: getUserProfileUrl,
    hasNewThreadedReplies: hasNewThreadedReplies,
    isRepliesLoading: isRepliesLoading,
    mentionSelectorContacts: mentionSelectorContacts,
    onDelete: onReplyDelete,
    onEdit: onReplyEdit,
    onSelect: onReplySelect,
    replies: replies,
    translations: translations
  })), onReplyCreate && /*#__PURE__*/React.createElement(ActivityThreadReplyForm, {
    getMentionWithQuery: getMentionWithQuery,
    isDisabled: isPending,
    mentionSelectorContacts: mentionSelectorContacts,
    onFocus: handleFormFocusOrShow,
    onHide: handleFormHide,
    onShow: handleFormFocusOrShow,
    onReplyCreate: onReplyCreate
  })));
};
export default ActivityThread;
//# sourceMappingURL=ActivityThread.js.map