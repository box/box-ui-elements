import * as React from 'react';
import classNames from 'classnames';
import './PreviewLoadingRing.scss';
export default function PreviewLoadingRing({
  children,
  className,
  color,
  theme = 'light'
}) {
  const borderStyles = color ? {
    backgroundColor: color
  } : undefined;
  return /*#__PURE__*/React.createElement("div", {
    className: classNames('bdl-PreviewLoadingRing', `bdl-PreviewLoadingRing--${theme}`, className)
  }, /*#__PURE__*/React.createElement("div", {
    className: "bdl-PreviewLoadingRing-border",
    style: borderStyles
  }), /*#__PURE__*/React.createElement("div", {
    className: "bdl-PreviewLoadingRing-content"
  }, children));
}
//# sourceMappingURL=PreviewLoadingRing.js.map