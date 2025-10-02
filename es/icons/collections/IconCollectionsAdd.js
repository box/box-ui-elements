import * as React from 'react';
import classNames from 'classnames';
import AccessibleSVG from '../accessible-svg';
import { bdlGray80 } from '../../styles/variables';
const IconCollectionsAdd = ({
  className = '',
  color = bdlGray80,
  height = 16,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: classNames('bdl-IconCollectionsAdd', className),
  height: height,
  title: title,
  viewBox: "0 0 16 16",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M1.5 7c.25 0 .5.135.5.5v5.103C2 13.504 2.5 14 3.397 14H8.5c.358.01.5.25.5.5s-.142.49-.5.5H3.154A2.154 2.154 0 0 1 1 12.847V7.5c0-.364.25-.5.5-.5zm12.388-6C14.502 1 15 1.498 15 2.112v9.776c0 .614-.498 1.112-1.112 1.112H4.112A1.112 1.112 0 0 1 3 11.888V2.112C3 1.498 3.498 1 4.112 1h9.776zM14 2H4v10h10V2zM9.5 4v2.5H12v1H9.5V10h-1V7.5H6v-1h2.5V4h1z",
  fill: color,
  fillRule: "nonzero"
}));
export default IconCollectionsAdd;
//# sourceMappingURL=IconCollectionsAdd.js.map