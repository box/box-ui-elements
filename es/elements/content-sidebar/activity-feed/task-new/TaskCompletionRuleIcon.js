import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { TASK_COMPLETION_RULE_ANY } from '../../../../constants';
import messages from './messages';
// $FlowFixMe LabelPill is in typescript
import LabelPill from '../../../../components/label-pill';
import Tooltip from '../../../../components/tooltip';
import Avatar16 from '../../../../icon/line/Avatar16';
import './TaskCompletionRuleIcon.scss';
const TaskCompletionRuleIcon = ({
  completionRule
}) => completionRule === TASK_COMPLETION_RULE_ANY && /*#__PURE__*/React.createElement("span", {
  className: "bcs-TaskCompletionRuleIcon"
}, /*#__PURE__*/React.createElement(Tooltip, {
  position: "top-center",
  text: /*#__PURE__*/React.createElement(FormattedMessage, messages.taskAnyAffordanceTooltip)
}, /*#__PURE__*/React.createElement(LabelPill.Pill, null, /*#__PURE__*/React.createElement(LabelPill.Icon, {
  Component: Avatar16
}), /*#__PURE__*/React.createElement(LabelPill.Text, {
  className: "bcs-TaskCompletionRuleIcon-oneSize"
}, "1"))));
export default TaskCompletionRuleIcon;
//# sourceMappingURL=TaskCompletionRuleIcon.js.map