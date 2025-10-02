import * as React from 'react';
import AccessibleSVG from '../accessible-svg';
import { bdlBoxBlue } from '../../styles/variables';
const UpdatesEmptyState = ({
  className = '',
  color = bdlBoxBlue,
  height = 150,
  title,
  width = 150
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: `updates-empty-state ${className}`,
  title: title,
  height: height,
  viewBox: "0 0 150 150",
  width: width
}, /*#__PURE__*/React.createElement("g", {
  transform: "translate(5 5)",
  fill: "none",
  fillRule: "evenodd"
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M112.44 26.83v-.4c0-.16.14-.3.3-.3.18 0 .32.13.32.3v.4c.1.05.17.13.23.22h.38c.17 0 .3.15.3.32s-.13.3-.3.3h-.4c-.05.1-.12.18-.22.23v.4c0 .16-.14.3-.3.3-.18 0-.32-.14-.32-.3v-.4c-.1-.05-.17-.13-.23-.22h-.38c-.17 0-.3-.15-.3-.3 0-.2.13-.33.3-.33h.4c.05-.1.12-.17.22-.22zM.94 90.94v-.4c0-.17.14-.3.3-.3.18 0 .32.13.32.3v.4c.1.05.17.13.23.22h.38c.17 0 .3.14.3.3 0 .18-.13.32-.3.32h-.4c-.05.1-.12.17-.22.23v.4c0 .17-.14.3-.3.3-.18 0-.32-.14-.32-.3V92c-.1-.05-.17-.12-.23-.22H.33c-.17 0-.3-.14-.3-.3 0-.18.13-.32.3-.32h.4c.05-.1.12-.17.22-.22zM21.44 21.44v-.4c0-.17.14-.3.3-.3.18 0 .32.13.32.3v.4c.1.05.17.13.23.22h.38c.17 0 .3.14.3.3 0 .18-.13.32-.3.32h-.4c-.05.1-.12.17-.22.23v.4c0 .17-.14.3-.3.3-.18 0-.32-.14-.32-.3v-.4c-.1-.05-.17-.12-.23-.22h-.38c-.17 0-.3-.14-.3-.3 0-.18.13-.32.3-.32h.4c.05-.1.12-.17.22-.22zM137.5 39.14v-.62c0-.28.23-.5.5-.5.28 0 .5.22.5.5v.62c.15.08.27.2.36.35h.6c.3 0 .5.23.5.5s-.2.5-.5.5h-.6c-.1.14-.2.26-.36.35v.62c0 .27-.23.5-.5.5-.28 0-.5-.23-.5-.5v-.62c-.15-.1-.27-.2-.36-.36h-.6c-.3 0-.5-.24-.5-.5 0-.28.2-.5.5-.5h.6c.1-.15.2-.28.36-.36zM102 19.4v-.63c0-.28.23-.5.5-.5.28 0 .5.22.5.5v.62c.15.07.27.2.36.34h.6c.3 0 .52.24.52.5 0 .28-.23.5-.5.5h-.62c-.1.15-.2.27-.36.36v.62c0 .27-.23.5-.5.5-.28 0-.5-.23-.5-.5v-.62c-.15-.1-.27-.2-.36-.36h-.6c-.3 0-.52-.23-.52-.5s.23-.5.5-.5h.62c.1-.14.2-.27.36-.35zM53 23.9v-.6c0-.3.23-.5.5-.5.28 0 .5.2.5.5v.6c.15.1.27.22.36.36h.6c.3 0 .52.23.52.5 0 .28-.23.5-.5.5h-.62c-.1.15-.2.27-.36.36v.62c0 .27-.23.5-.5.5-.28 0-.5-.23-.5-.5v-.62c-.15-.1-.27-.2-.36-.36h-.6c-.3 0-.52-.23-.52-.5s.23-.5.5-.5h.62c.1-.14.2-.27.36-.35zM127.5 102.68v-.62c0-.28.23-.5.5-.5.28 0 .5.22.5.5v.62c.15.08.27.2.36.35h.6c.3 0 .5.23.5.5 0 .28-.2.5-.5.5h-.6c-.1.15-.2.27-.36.36v.6c0 .28-.23.5-.5.5-.28 0-.5-.22-.5-.5v-.6c-.15-.1-.27-.22-.36-.37h-.6c-.3 0-.52-.23-.52-.5s.23-.5.5-.5h.62c.1-.15.2-.27.36-.35zM21 67.78v-.62c0-.28.23-.5.5-.5.28 0 .5.22.5.5v.62c.15.08.27.2.36.35h.6c.3 0 .52.23.52.5 0 .28-.23.5-.5.5h-.62c-.1.15-.2.27-.36.36v.6c0 .28-.23.5-.5.5-.28 0-.5-.22-.5-.5v-.6c-.15-.1-.27-.22-.36-.37h-.6c-.3 0-.52-.23-.52-.5s.23-.5.5-.5h.62c.1-.15.2-.27.36-.35zM80.5 1.12V.5c0-.28.23-.5.5-.5.28 0 .5.22.5.5v.62c.15.1.27.2.36.35h.6c.3 0 .52.24.52.5 0 .28-.23.5-.5.5h-.62c-.1.15-.2.27-.36.36v.62c0 .28-.23.5-.5.5-.28 0-.5-.23-.5-.5v-.62c-.15-.1-.27-.2-.36-.35h-.6c-.3 0-.52-.24-.52-.5 0-.28.23-.5.5-.5h.62c.1-.15.2-.27.36-.36z",
  fill: color
}), /*#__PURE__*/React.createElement("g", {
  className: "stroke-color",
  transform: "translate(27 80.5)",
  stroke: color,
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M75 16H5c-2.76 0-5-1.8-5-4s2.23-4 5-4h70M13 16h70c2.76 0 5 1.8 5 4s-2.23 4-5 4H13M48 0h45c2.76 0 5 1.8 5 4s-2.23 4-5 4H23M10.25 22.5h3.5M10.25 26.5h3.5"
}), /*#__PURE__*/React.createElement("rect", {
  fill: "#FFF",
  x: "13",
  y: "21",
  width: "9",
  height: "7",
  rx: "1.5"
})), /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M21.45 107.08c-.55.1-1.06-.26-1.16-.8-.1-.55.25-1.07.8-1.17l2.96-.5c.54-.1 1.06.26 1.15.8.1.55-.25 1.07-.8 1.16l-2.95.52zm5.33 5.45c-.28.48-.9.65-1.37.37-.47-.28-.63-.9-.36-1.37l1.5-2.6c.28-.47.9-.64 1.37-.36.5.27.66.88.38 1.36l-1.5 2.6zm-2.54-14.36c-.42-.35-1.05-.3-1.4.12-.36.42-.3 1.04.12 1.4l2.3 1.93c.42.36 1.05.3 1.4-.12.36-.42.3-1.04-.12-1.4l-2.3-1.93z",
  fill: color
}), /*#__PURE__*/React.createElement("g", {
  transform: "translate(38.5 29)"
}, /*#__PURE__*/React.createElement("g", {
  transform: "rotate(8 -123.332 267.286)"
}, /*#__PURE__*/React.createElement("path", {
  className: "stroke-color",
  d: "M10.78 34.54c.27-.27.44-.65.44-1.06V1.6c0-.83-.68-1.5-1.5-1.5H4.6C3.75.1 3.1.77 3.1 1.6v27.57H1.93c-.82 0-1.5.67-1.5 1.5v2.8c0 .84.67 1.5 1.5 1.5h7.8c.4 0 .78-.16 1.05-.43z",
  stroke: color,
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fill: "#FFF"
}), /*#__PURE__*/React.createElement("rect", {
  className: "fill-color",
  fillOpacity: ".1",
  fill: color,
  x: "2",
  y: "31.5",
  width: "7.5",
  height: "2",
  rx: ".5"
}), /*#__PURE__*/React.createElement("path", {
  className: "stroke-color",
  d: "M4.26 22.12h2.86M3.97 26.14h2.85",
  stroke: color,
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
})), /*#__PURE__*/React.createElement("rect", {
  className: "stroke-color",
  stroke: color,
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fill: "#FFF",
  x: "48.5",
  y: "18.5",
  width: "9.5",
  height: "6",
  rx: "1.5"
}), /*#__PURE__*/React.createElement("circle", {
  className: "stroke-color",
  stroke: color,
  strokeWidth: "2",
  fill: "#FFF",
  cx: "42.5",
  cy: "21.5",
  r: "12.5"
}), /*#__PURE__*/React.createElement("path", {
  className: "stroke-color",
  d: "M5.7 4.53s11 3.26 16.5 4.17c4.7.78 14.1.88 14.1.88 1.22.2 2.2 1 2.2 1.8v20.23c0 .8-.97 1.6-2.2 1.82 0 0-9.44.1-14.17.9-5.48.9-16.44 4.15-16.44 4.15-1.22.2-2.2-.6-2.2-1.8V6.33c0-1.2.97-2 2.2-1.8z",
  stroke: color,
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fill: "#FFF"
}), /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  d: "M1.5 25s6.34 2.5 10.55 2.5c4.2 0 4.53-2.5 8.4-2.5 3.9 0 2.63 1 7.77 1s10.28-1 10.28-1v6.78s-9.63-.82-19.05 1.22c-9.4 2.04-17.95 4.5-17.95 4.5V25z",
  fillOpacity: ".1",
  fill: color
}), /*#__PURE__*/React.createElement("rect", {
  className: "stroke-color",
  stroke: color,
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fill: "#FFF",
  width: "5",
  height: "43",
  rx: "1.5"
}), /*#__PURE__*/React.createElement("rect", {
  className: "stroke-color",
  stroke: color,
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  fill: "#FFF",
  x: "35.5",
  y: "8.5",
  width: "11.5",
  height: "26",
  rx: "1.5"
})), /*#__PURE__*/React.createElement("ellipse", {
  className: "fill-color",
  fillOpacity: ".1",
  fill: color,
  cx: "70",
  cy: "137",
  rx: "32.5",
  ry: "3"
})));
export default UpdatesEmptyState;
//# sourceMappingURL=UpdatesEmptyState.js.map