import * as React from 'react';
import './ProgressBar.scss';
const ProgressBar = ({
  className = '',
  progress = 0
}) => {
  const style = {
    width: `${progress}%`
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "progress-bar-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: `progress-bar ${className}`,
    style: style
  }));
};
export default ProgressBar;
//# sourceMappingURL=ProgressBar.js.map