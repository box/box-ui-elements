function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { Manager, Reference, Popper } from 'react-popper';
import { PLACEMENT_AUTO } from './constants';
const PopperComponent = props => {
  const {
    children,
    isPositionDynamic = true,
    isOpen,
    modifiers,
    placement: popperPlacement
  } = props;
  const elements = React.Children.toArray(children);
  if (elements.length !== 2) {
    throw new Error('PopperComponent must have exactly two children: A reference component and the Popper content');
  }
  const [reference, popperContent] = elements;
  return /*#__PURE__*/React.createElement(Manager, null, /*#__PURE__*/React.createElement(Reference, null, ({
    ref
  }) => /*#__PURE__*/React.cloneElement(reference, {
    ref
  })), isOpen && /*#__PURE__*/React.createElement(Popper, {
    placement: popperPlacement,
    modifiers: modifiers
  }, ({
    ref,
    style,
    placement,
    scheduleUpdate
  }) => {
    const {
      style: contentStyles
    } = popperContent.props;
    return /*#__PURE__*/React.cloneElement(popperContent, {
      ref,
      style: _objectSpread(_objectSpread({}, contentStyles), isPositionDynamic && style),
      placement,
      scheduleUpdate
    });
  }));
};
PopperComponent.defaultProps = {
  placement: PLACEMENT_AUTO
};
export default PopperComponent;
//# sourceMappingURL=PopperComponent.js.map