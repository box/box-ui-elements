import * as React from 'react';
import classNames from 'classnames';
import AccessibleSVG from '../accessible-svg';
import { bdlBoxBlue } from '../../styles/variables';
const IconPuzzlePieceCircle = ({
  className = '',
  color = bdlBoxBlue,
  height = 32,
  title,
  width = 32
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: classNames('bdl-IconPuzzlePieceCircle', className),
  height: height,
  viewBox: "0 0 28 28",
  title: title,
  width: width
}, /*#__PURE__*/React.createElement("rect", {
  fill: "none",
  height: "27",
  rx: "13.5",
  stroke: color,
  width: "27",
  x: ".5",
  y: ".5"
}), /*#__PURE__*/React.createElement("path", {
  fill: "none",
  stroke: color,
  d: "M8.4 10.695v3.028c.17.85.646.933 1.153.804.312-.375.78-.615 1.306-.615a1.703 1.703 0 0 1 0 3.405c-.525 0-.994-.24-1.306-.615-.507-.129-.983-.046-1.153.804v3.027h9.838v-3.027c.17-.85.646-.933 1.153-.804.312.375.78.615 1.306.615a1.703 1.703 0 0 0 0-3.405c-.526 0-.994.24-1.306.615-.507.129-.983.046-1.153-.804v-3.028H15.21c-.851-.17-.933-.645-.804-1.152a1.703 1.703 0 1 0-2.79-1.307c0 .526.24.994.614 1.307.13.507.047.982-.804 1.152H8.4z"
}));
export default IconPuzzlePieceCircle;
//# sourceMappingURL=IconPuzzlePieceCircle.js.map