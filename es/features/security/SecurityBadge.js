const _excluded = ["className", "color", "icon", "message"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';
import IconAlertDefault from '../../icons/general/IconAlertDefault';
import { bdlYellow50 } from '../../styles/variables';
import './SecurityBadge.scss';
const SecurityBadge = _ref => {
  let {
      className,
      color,
      icon,
      message
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement("h1", _extends({
    className: classNames('bdl-SecurityBadge', className),
    style: {
      backgroundColor: color
    }
  }, rest), icon, /*#__PURE__*/React.createElement("span", {
    className: "bdl-SecurityBadge-name"
  }, message));
};
SecurityBadge.defaultProps = {
  icon: /*#__PURE__*/React.createElement(IconAlertDefault, {
    color: bdlYellow50,
    height: 22,
    width: 22,
    strokeWidth: 3
  })
};
export default SecurityBadge;
//# sourceMappingURL=SecurityBadge.js.map