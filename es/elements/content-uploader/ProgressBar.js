import * as React from 'react';
import './ProgressBar.scss';
const ProgressBar = ({
  percent = 0
}) => {
  const clampedPercentage = Math.max(0, Math.min(100, percent));
  const containerStyle = {
    transitionDelay: clampedPercentage > 0 && clampedPercentage < 100 ? '0' : '0.4s'
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "bcu-progress-container",
    style: containerStyle
  }, /*#__PURE__*/React.createElement("div", {
    className: "bcu-progress",
    role: "progressbar",
    style: {
      width: `${clampedPercentage}%`
    }
  }));
};
export default ProgressBar;
//# sourceMappingURL=ProgressBar.js.map