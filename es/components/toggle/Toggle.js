const _excluded = ["className", "data-target-id", "description", "isDisabled", "isOn", "isToggleRightAligned", "label", "name", "onBlur", "onChange", "onFocus", "onMouseEnter", "onMouseLeave"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';
import './Toggle.scss';
const Toggle = /*#__PURE__*/React.forwardRef((_ref, ref) => {
  let {
      className = '',
      'data-target-id': dataTargetId,
      description,
      isDisabled,
      isOn,
      isToggleRightAligned = false,
      label,
      name,
      onBlur,
      onChange,
      onFocus,
      onMouseEnter,
      onMouseLeave
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const classes = classNames('toggle-container', className, {
    'is-toggle-right-aligned': isToggleRightAligned
  });
  const toggleElements = [/*#__PURE__*/React.createElement("div", {
    key: "toggle-simple-switch",
    className: "toggle-simple-switch"
  }), /*#__PURE__*/React.createElement("div", {
    key: "toggle-simple-label",
    className: "toggle-simple-label"
  }, label)];
  if (isToggleRightAligned) {
    toggleElements.reverse();
  }
  return /*#__PURE__*/React.createElement("div", {
    className: classes,
    onMouseEnter: onMouseEnter,
    onMouseLeave: onMouseLeave
  }, /*#__PURE__*/React.createElement("label", {
    className: "toggle-simple",
    "data-target-id": dataTargetId
  }, /*#__PURE__*/React.createElement("input", _extends({
    checked: isOn,
    className: "toggle-simple-input",
    disabled: isDisabled,
    name: name,
    onBlur: onBlur,
    onChange: onChange,
    onFocus: onFocus,
    ref: ref,
    role: "switch",
    type: "checkbox"
  }, rest)), toggleElements), description ? /*#__PURE__*/React.createElement("div", {
    className: "toggle-simple-description"
  }, description) : null);
});
Toggle.displayName = 'Toggle';
export default Toggle;
//# sourceMappingURL=Toggle.js.map