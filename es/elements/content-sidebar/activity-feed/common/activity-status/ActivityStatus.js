import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import LabelPill from '../../../../../components/label-pill';
import { COMMENT_STATUS_RESOLVED } from '../../../../../constants';
import messages from './messages';
import './ActivityStatus.scss';
const ActivityStatus = ({
  status
}) => {
  if (status !== COMMENT_STATUS_RESOLVED) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "bcs-ActivityStatus",
    "data-testid": "bcs-ActivityStatus"
  }, /*#__PURE__*/React.createElement(LabelPill.Pill, {
    type: "success"
  }, /*#__PURE__*/React.createElement(LabelPill.Text, null, /*#__PURE__*/React.createElement(FormattedMessage, messages.activityStatusResolved))));
};
export default ActivityStatus;
//# sourceMappingURL=ActivityStatus.js.map