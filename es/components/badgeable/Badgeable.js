import * as React from 'react';
import classnames from 'classnames';
import './Badgeable.scss';
const Badgeable = props => {
  const {
    children,
    className = '',
    topLeft = null,
    topRight = null,
    bottomLeft = null,
    bottomRight = null
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    className: classnames('badgeable-container', className)
  }, children, /*#__PURE__*/React.createElement("div", {
    className: "badges"
  }, topLeft && /*#__PURE__*/React.createElement("div", {
    className: "top-left-badge"
  }, topLeft), topRight && /*#__PURE__*/React.createElement("div", {
    className: "top-right-badge"
  }, topRight), bottomLeft && /*#__PURE__*/React.createElement("div", {
    className: "bottom-left-badge"
  }, bottomLeft), bottomRight && /*#__PURE__*/React.createElement("div", {
    className: "bottom-right-badge"
  }, bottomRight)));
};
export default Badgeable;
//# sourceMappingURL=Badgeable.js.map