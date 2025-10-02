function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedDate, FormattedMessage } from 'react-intl';
import PlainButton from '../../components/plain-button';
import messages from './messages';
const datetimeOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric'
};
const RetentionPolicy = ({
  dispositionTime,
  openModal,
  policyType,
  retentionPolicyDescription
}) => {
  if (!retentionPolicyDescription) {
    return null;
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormattedMessage, _extends({
    tagName: "dt"
  }, messages.retentionPolicyDescription)), /*#__PURE__*/React.createElement("dd", null, retentionPolicyDescription), policyType !== 'indefinite' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormattedMessage, _extends({
    tagName: "dt"
  }, messages.retentionPolicyExpiration)), dispositionTime ? /*#__PURE__*/React.createElement("dd", null, /*#__PURE__*/React.createElement(FormattedDate, _extends({
    value: new Date(dispositionTime)
  }, datetimeOptions)), openModal ? /*#__PURE__*/React.createElement(PlainButton, {
    className: "lnk bdl-RetentionLink",
    onClick: openModal,
    "data-target-id": "PlainButton-retentionPolicyExtendButton"
  }, /*#__PURE__*/React.createElement(FormattedMessage, messages.retentionPolicyExtend)) : null) : null) : null);
};
export default RetentionPolicy;
//# sourceMappingURL=RetentionPolicy.js.map