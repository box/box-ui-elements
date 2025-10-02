function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import ActivityDatestamp from '../common/activity-datestamp';
import commonMessages from '../../../common/messages';
import messages from './messages';
import { TASK_NEW_APPROVED, TASK_NEW_REJECTED, TASK_NEW_COMPLETED, TASK_NEW_NOT_STARTED } from '../../../../constants';
import './AssigneeDetails.scss';
const statusMessages = {
  [TASK_NEW_APPROVED]: messages.tasksFeedStatusApproved,
  [TASK_NEW_REJECTED]: messages.tasksFeedStatusRejected,
  [TASK_NEW_COMPLETED]: messages.tasksFeedStatusCompleted,
  [TASK_NEW_NOT_STARTED]: null
};
const AssigneeDetails = /*#__PURE__*/React.memo(({
  user,
  status,
  completedAt,
  className
}) => {
  const statusMessage = statusMessages[status] || null;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames(className, 'bcs-AssigneeDetails')
  }, /*#__PURE__*/React.createElement("div", {
    className: "bcs-AssigneeDetails-name"
  }, user.name ? user.name : /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.priorCollaborator)), statusMessage && completedAt && /*#__PURE__*/React.createElement("div", {
    className: "bcs-AssigneeDetails-status"
  }, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, statusMessage, {
    values: {
      dateTime: /*#__PURE__*/React.createElement(ActivityDatestamp, {
        date: completedAt
      })
    }
  }))));
});
export default AssigneeDetails;
//# sourceMappingURL=AssigneeDetails.js.map