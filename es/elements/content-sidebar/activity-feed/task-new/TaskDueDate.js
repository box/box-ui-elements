function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import ActivityDatestamp from '../common/activity-datestamp';
import messages from './messages';
// $FlowFixMe LabelPill is in typescript
import LabelPill from '../../../../components/label-pill';
import { TASK_NEW_NOT_STARTED } from '../../../../constants';
const TaskDueDate = ({
  dueDate,
  status
}) => {
  const isOverdue = dueDate ? status === TASK_NEW_NOT_STARTED && new Date(dueDate) < Date.now() : false;
  const fullDueDate = new Date(dueDate);
  const pillProps = isOverdue ? {
    'data-testid': 'task-overdue-date',
    type: 'error'
  } : {
    type: 'default'
  };
  return /*#__PURE__*/React.createElement("div", {
    "data-testid": "task-due-date"
  }, /*#__PURE__*/React.createElement(LabelPill.Pill, pillProps, /*#__PURE__*/React.createElement(LabelPill.Text, null, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.taskFeedStatusDue, {
    values: {
      dateTime: /*#__PURE__*/React.createElement(ActivityDatestamp, {
        date: fullDueDate.getTime(),
        uppercase: true
      })
    }
  })))));
};
export default TaskDueDate;
//# sourceMappingURL=TaskDueDate.js.map