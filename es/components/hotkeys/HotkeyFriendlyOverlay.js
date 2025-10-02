function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectDestructuringEmpty(t) { if (null == t) throw new TypeError("Cannot destructure " + t); }
import * as React from 'react';
import { Overlay } from '../flyout';
import HotkeyLayer from './HotkeyLayer';

/*
 * Note that this is expected to be used within a Flyout component that only renders this
 * when it is actually to be put on screen.
 */
const HotkeyFriendlyOverlay = _ref => {
  let props = _extends({}, (_objectDestructuringEmpty(_ref), _ref));
  return /*#__PURE__*/React.createElement(HotkeyLayer, null, /*#__PURE__*/React.createElement(Overlay, props));
};
export default HotkeyFriendlyOverlay;
//# sourceMappingURL=HotkeyFriendlyOverlay.js.map