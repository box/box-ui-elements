function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import * as vars from '../../styles/variables';
import AccessibleSVG from './AccessibleSVG';
export const IconExample = props => /*#__PURE__*/React.createElement(AccessibleSVG, _extends({
  width: 32,
  height: 32,
  viewBox: "0 0 32 32"
}, props), /*#__PURE__*/React.createElement("path", {
  fill: vars.bdlGray50,
  d: "M9 3h9.172a2 2 0 011.414.586l5.83 5.828A2 2 0 0126 10.83V26a3 3 0 01-3 3H9a3 3 0 01-3-3V6a3 3 0 013-3z"
}));
export default {
  title: 'Components/AccessibleSVG',
  component: AccessibleSVG
};
//# sourceMappingURL=AccessibleSVG.stories.js.map