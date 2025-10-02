const _excluded = ["action", "message", "title", "className"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';
import InlineError from '../../../../../components/inline-error';
import PlainButton from '../../../../../components/plain-button';
import './ActivityError.scss';
const ActivityError = _ref => {
  let {
      action,
      message,
      title,
      className
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement(InlineError, {
    className: classnames('bcs-ActivityError', className),
    title: /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, title, rest))
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FormattedMessage, message)), action ? /*#__PURE__*/React.createElement(PlainButton, {
    className: "bcs-ActivityError-action lnk",
    onClick: action.onAction,
    type: "button"
  }, action.text) : null);
};
export default ActivityError;
//# sourceMappingURL=ActivityError.js.map