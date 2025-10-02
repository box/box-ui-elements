function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PlainButton from '../../../../components/plain-button';
import messages from './messages';
import AvatarGroupAvatar from './AvatarGroupAvatar';
import AssigneeDetails from './AssigneeDetails';
import './AssigneeList.scss';
const DEFAULT_ASSIGNEES_SHOWN = 3;
const TASKS_PAGE_SIZE = 20; // service does not return the page size to the client at the moment

function AssigneeList(props) {
  const {
    initialAssigneeCount = DEFAULT_ASSIGNEES_SHOWN,
    users = {},
    getAvatarUrl,
    isOpen,
    onCollapse,
    onExpand
  } = props;
  const {
    entries = [],
    next_marker
  } = users;
  const entryCount = entries.length;
  const numVisibleAssignees = isOpen ? entryCount : initialAssigneeCount;
  const visibleUsers = entries.slice(0, numVisibleAssignees).map(({
    id,
    target,
    status,
    completed_at: completedAt
  }) => {
    return /*#__PURE__*/React.createElement("li", {
      key: id,
      className: "bcs-AssigneeList-listItem",
      "data-testid": "assignee-list-item"
    }, /*#__PURE__*/React.createElement(AvatarGroupAvatar, {
      status: status,
      className: "bcs-AssigneeList-listItemAvatar",
      user: target,
      getAvatarUrl: getAvatarUrl
    }), /*#__PURE__*/React.createElement(AssigneeDetails, {
      user: target,
      status: status,
      completedAt: completedAt
    }));
  });
  const hiddenAssigneeCount = Math.max(0, entryCount - initialAssigneeCount);
  const maxAdditionalAssignees = TASKS_PAGE_SIZE - initialAssigneeCount;
  const hasMoreAssigneesThanPageSize = hiddenAssigneeCount > maxAdditionalAssignees || next_marker;
  const additionalAssigneeMessage = hasMoreAssigneesThanPageSize ? messages.taskShowMoreAssigneesOverflow : messages.taskShowMoreAssignees;
  return /*#__PURE__*/React.createElement("div", {
    className: "bcs-AssigneeList"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "bcs-AssigneeList-list",
    "data-testid": "task-assignee-list"
  }, visibleUsers), !isOpen && hiddenAssigneeCount > 0 && /*#__PURE__*/React.createElement("div", {
    className: "bcs-AssigneeList-toggleBtn"
  }, /*#__PURE__*/React.createElement(PlainButton, {
    "data-resin-target": "showmorebtn",
    "data-testid": "show-more-assignees",
    onClick: onExpand,
    className: "lnk"
  }, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, additionalAssigneeMessage, {
    values: {
      additionalAssigneeCount: hasMoreAssigneesThanPageSize ? maxAdditionalAssignees : hiddenAssigneeCount
    }
  })))), isOpen && /*#__PURE__*/React.createElement("div", {
    className: "bcs-AssigneeList-toggleBtn"
  }, /*#__PURE__*/React.createElement(PlainButton, {
    "data-resin-target": "showlessbtn",
    "data-testid": "show-less-assignees",
    onClick: onCollapse,
    className: "lnk"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.taskShowLessAssignees))));
}
export default AssigneeList;
//# sourceMappingURL=AssigneeList.js.map