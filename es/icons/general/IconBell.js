import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
const IconBell = ({
  className = '',
  color = '#FFFFFF',
  height = 20,
  title,
  width = 20
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `icon-bell ${className}`,
  height: height,
  title: title,
  viewBox: "0 0 20 20",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  fill: "none",
  fillRule: "evenodd",
  transform: "matrix(1 0 0 -1 1 19)"
}, /*#__PURE__*/React.createElement("circle", {
  className: "stroke-color",
  cx: "9",
  cy: "9",
  r: "9",
  stroke: color
}), /*#__PURE__*/React.createElement("path", {
  className: "fill-color stroke-color",
  d: "M8.99870528,7.00322692 C7.99741056,6.95995299 7.30772192,7.34932799 7.11647844,7.80376162 C6.82121147,8.50537574 7.10298215,10.0005227 6.71043535,10.9763966 C6.58716695,11.2828427 6.06362295,11.9195122 5.65453844,12.1850724 C5.20038627,12.5026605 4.89677352,12.9073399 5.02828427,13.0110609 C5.72719221,13.5622817 7.28244474,13.9531171 8.99741056,13.959953 C10.7123764,13.9667889 13.4237984,13.4483355 12.9439635,12.7329733 C12.8273573,12.559131 12.3880586,12.2308909 12.1481974,12.0118607 C11.8280166,11.7194856 11.4102812,11.5124985 11.192734,10.8874732 C11.0694856,10.5333733 11.0505996,10.0375459 11.0505996,9.33473924 C11.0505996,8.17299224 10.7077261,7.53483599 10.2753173,7.32416568 C9.93812209,7.15988362 9.93912199,7.00322692 8.99870528,7.00322692 Z",
  fill: color,
  stroke: color,
  strokeWidth: "0.538649962",
  transform: "rotate(180 9 10.48)"
}), /*#__PURE__*/React.createElement("circle", {
  className: "stroke-color",
  cx: "9",
  cy: "5",
  r: "1",
  stroke: color
})));
export default IconBell;
//# sourceMappingURL=IconBell.js.map