import * as React from 'react';
import './Crawler.scss';
export let LoadingIndicatorSize = /*#__PURE__*/function (LoadingIndicatorSize) {
  LoadingIndicatorSize["SMALL"] = "small";
  LoadingIndicatorSize["MEDIUM"] = "medium";
  LoadingIndicatorSize["LARGE"] = "large";
  LoadingIndicatorSize["DEFAULT"] = "default";
  return LoadingIndicatorSize;
}({});
const LoadingIndicator = ({
  className = '',
  size = LoadingIndicatorSize.DEFAULT
}) => /*#__PURE__*/React.createElement("div", {
  className: `crawler ${className} is-${size}`
}, /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null), /*#__PURE__*/React.createElement("div", null));
export default LoadingIndicator;
//# sourceMappingURL=LoadingIndicator.js.map