function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * 
 * @file Versions Item Badge component
 * @author Box
 */
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import messages from './messages';
import './VersionsItemBadge.scss';
const VersionsItemBadge = ({
  intl,
  versionNumber
}) => {
  const intlValues = {
    versionNumber
  };
  return /*#__PURE__*/React.createElement("div", {
    "aria-label": intl.formatMessage(messages.versionNumberLabel, intlValues),
    className: "bcs-VersionsItemBadge"
  }, /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.versionNumberBadge, {
    values: intlValues
  })));
};
export default injectIntl(VersionsItemBadge);
//# sourceMappingURL=VersionsItemBadge.js.map