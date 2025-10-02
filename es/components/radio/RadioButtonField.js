const _excluded = ["field", "value"],
  _excluded2 = ["value"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import RadioButton from './RadioButton';
const RadioButtonField = _ref => {
  let {
      field,
      value
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  if (!field) {
    return /*#__PURE__*/React.createElement(RadioButton, _extends({
      value: value
    }, rest));
  }
  const {
      value: fieldValue
    } = field,
    fieldRest = _objectWithoutProperties(field, _excluded2);
  return /*#__PURE__*/React.createElement(RadioButton, _extends({}, fieldRest, rest, {
    value: value,
    isSelected: value === fieldValue
  }));
};
export default RadioButtonField;
//# sourceMappingURL=RadioButtonField.js.map