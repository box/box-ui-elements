import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconBarGraph = ({
  className = '',
  color = '#979797',
  height = 16,
  title,
  width = 16
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-bar-graph ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 13 13",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  className: "fill-color",
  fill: color
}, /*#__PURE__*/React.createElement("path", {
  d: "M1 9h1V6H1v3zm0-4h1c.6 0 1 .4 1 1v3c0 .6-.4 1-1 1H1c-.6 0-1-.4-1-1V6c0-.6.4-1 1-1zM6 9h1V3H6v6zm0-7h1c.6 0 1 .5 1 1v6c0 .6-.4 1-1 1H6c-.6 0-1-.5-1-1V3c0-.6.4-1 1-1zM11 9h1V1h-1v8zm0-9h1c.6 0 1 .5 1 1v8c0 .5-.4 1-1 1h-1c-.6 0-1-.5-1-1V1c0-.6.4-1 1-1zM.5 12h12c.3 0 .5.2.5.5s-.2.5-.5.5H.5c-.3 0-.5-.2-.5-.5s.2-.5.5-.5z"
})));
export default IconBarGraph;
//# sourceMappingURL=IconBarGraph.js.map