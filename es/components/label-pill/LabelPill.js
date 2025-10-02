const _excluded = ["children", "type", "size", "className"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';
import startCase from 'lodash/startCase';
import LabelPillIcon from './LabelPillIcon';
import LabelPillText from './LabelPillText';
import './LabelPill.scss';
export let LabelPillStatus = /*#__PURE__*/function (LabelPillStatus) {
  LabelPillStatus["DEFAULT"] = "default";
  LabelPillStatus["INFO"] = "info";
  LabelPillStatus["FTUX"] = "ftux";
  LabelPillStatus["HIGHLIGHT"] = "highlight";
  LabelPillStatus["SUCCESS"] = "success";
  LabelPillStatus["WARNING"] = "warning";
  LabelPillStatus["ALERT"] = "alert";
  LabelPillStatus["ERROR"] = "error";
  return LabelPillStatus;
}({});
export let LabelPillSize = /*#__PURE__*/function (LabelPillSize) {
  LabelPillSize["REGULAR"] = "regular";
  LabelPillSize["LARGE"] = "large";
  return LabelPillSize;
}({});
const LabelPillContainer = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
      children,
      type = LabelPillStatus.DEFAULT,
      size = LabelPillSize.REGULAR,
      className
    } = props,
    rest = _objectWithoutProperties(props, _excluded);
  const labelPillClasses = classNames('bdl-LabelPill', `bdl-LabelPill--${type}`, `bdl-LabelPill--size${startCase(size)}`, className);
  return /*#__PURE__*/React.createElement("span", _extends({
    ref: ref,
    className: labelPillClasses
  }, rest), children);
});
LabelPillContainer.displayName = 'LabelPill';
const LabelPill = {
  Pill: LabelPillContainer,
  Text: LabelPillText,
  Icon: LabelPillIcon
};
export default LabelPill;
//# sourceMappingURL=LabelPill.js.map