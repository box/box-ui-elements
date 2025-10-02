import * as React from 'react';
import classNames from 'classnames';
import AccessibleSVG from '../accessible-svg';
import { bdlGray50 } from '../../styles/variables';
const IconClock = ({
  className = '',
  color = bdlGray50,
  height = 16,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: classNames('bdl-IconClock', className),
  height: height,
  title: title,
  viewBox: "0 0 16 16",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  fill: color,
  d: "M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"
}), /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  fill: color,
  d: "M8 2.5a.5.5 0 0 1 .5.5v4.486l3.208 1.687a.5.5 0 0 1 .244.592l-.034.083a.5.5 0 0 1-.676.21L7.767 8.23a.5.5 0 0 1-.267-.442V3a.5.5 0 0 1 .5-.5z"
}));
export default IconClock;
//# sourceMappingURL=IconClock.js.map