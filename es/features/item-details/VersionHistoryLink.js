const _excluded = ["className", "versionCount", "onClick"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import PlainButton from '../../components/plain-button';
import messages from './messages';
const VersionHistoryLink = _ref => {
  let {
      className,
      versionCount,
      onClick
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const formattedMessageComponent = /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.savedVersions, {
    values: {
      versionCount
    }
  }));

  // Only render it as a link if there is an onClick
  if (onClick) {
    return /*#__PURE__*/React.createElement(PlainButton, _extends({
      className: classNames('lnk', className),
      onClick: onClick
    }, rest), formattedMessageComponent);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: className
  }, formattedMessageComponent);
};
VersionHistoryLink.defaultProps = {
  className: ''
};
export default VersionHistoryLink;
//# sourceMappingURL=VersionHistoryLink.js.map