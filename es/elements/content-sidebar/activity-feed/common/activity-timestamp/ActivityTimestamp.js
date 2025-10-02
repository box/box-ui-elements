function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import ActivityDatestamp from '../activity-datestamp';
import Tooltip from '../../../../../components/tooltip';
import messages from './messages';
import './ActivityTimestamp.scss';
const ActivityTimestamp = ({
  date
}) => /*#__PURE__*/React.createElement(Tooltip, {
  text: /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.fullDateTime, {
    values: {
      time: date
    }
  }))
}, /*#__PURE__*/React.createElement("small", {
  className: "bcs-ActivityTimestamp"
}, /*#__PURE__*/React.createElement(ActivityDatestamp, {
  date: date
})));
export default ActivityTimestamp;
//# sourceMappingURL=ActivityTimestamp.js.map