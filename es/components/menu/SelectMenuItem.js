function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import MenuItem from './MenuItem';
const SelectMenuItem = props => /*#__PURE__*/React.createElement(MenuItem, _extends({
  isSelectItem: true
}, props));
export default SelectMenuItem;
//# sourceMappingURL=SelectMenuItem.js.map