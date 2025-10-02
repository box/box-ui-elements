import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { TASK_NEW_APPROVED, TASK_NEW_REJECTED, TASK_NEW_COMPLETED, TASK_NEW_NOT_STARTED, TASK_NEW_IN_PROGRESS } from '../../../../constants';
import messages from './messages';
// $FlowFixMe LabelPill is in typescript
import LabelPill from '../../../../components/label-pill';
const statusMessageKeyMap = {
  [TASK_NEW_APPROVED]: messages.taskFeedApprovedUppercaseLabel,
  [TASK_NEW_COMPLETED]: messages.taskFeedCompletedUppercaseLabel,
  [TASK_NEW_REJECTED]: messages.taskFeedRejectedUppercaseLabel,
  [TASK_NEW_NOT_STARTED]: messages.taskFeedInProgressUppercaseLabel,
  [TASK_NEW_IN_PROGRESS]: messages.taskFeedInProgressUppercaseLabel
};
const typeKeyMap = {
  [TASK_NEW_APPROVED]: 'success',
  [TASK_NEW_COMPLETED]: 'success',
  [TASK_NEW_REJECTED]: 'error',
  [TASK_NEW_NOT_STARTED]: 'default',
  [TASK_NEW_IN_PROGRESS]: 'default'
};
const Status = /*#__PURE__*/React.memo(({
  status
}) => /*#__PURE__*/React.createElement(LabelPill.Pill, {
  type: typeKeyMap[status]
}, /*#__PURE__*/React.createElement(LabelPill.Text, null, /*#__PURE__*/React.createElement(FormattedMessage, statusMessageKeyMap[status]))));
export default Status;
//# sourceMappingURL=TaskStatus.js.map