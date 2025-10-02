const _excluded = ["children", "className", "isDisabled", "onSelect"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';
import ActivityCard from './ActivityCard';
// @ts-ignore flow import
import { decode } from '../../../utils/keys';
import './SelectableActivityCard.scss';
const ALLOWABLE_NODENAMES = ['A', 'BUTTON'];
function isAllowableNode({
  target
}) {
  return target instanceof HTMLElement && ALLOWABLE_NODENAMES.includes(target.nodeName);
}
const SelectableActivityCard = _ref => {
  let {
      children,
      className,
      isDisabled = false,
      onSelect
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const ref = React.useRef(null);
  const handleClick = event => {
    if (isDisabled || isAllowableNode(event)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.focus(); // Buttons do not receive focus in Firefox and Safari on MacOS

    onSelect();
  };
  const handleKeyDown = event => {
    if (isDisabled || isAllowableNode(event)) {
      return;
    }
    const key = decode(event);
    if (key === 'Space' || key === 'Enter') {
      onSelect();
    }
  };
  return /*#__PURE__*/React.createElement(ActivityCard, _extends({
    ref: ref,
    "aria-disabled": isDisabled,
    className: classNames('bcs-SelectableActivityCard', className),
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    role: "button",
    tabIndex: 0
  }, rest), children);
};
export default SelectableActivityCard;
//# sourceMappingURL=SelectableActivityCard.js.map