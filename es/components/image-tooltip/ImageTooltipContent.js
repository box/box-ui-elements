import * as React from 'react';
import classNames from 'classnames';
import './ImageTooltipContent.scss';
function cloneTooltipChildWithNewProps(child, onImageLoad) {
  const {
    props: {
      className: existingClasses
    }
  } = child;
  const className = classNames(existingClasses, 'bdl-ImageTooltipContent-imageChild');
  return /*#__PURE__*/React.cloneElement(child, {
    className,
    onLoad: onImageLoad
  });
}
const ImageTooltipContent = ({
  children,
  content,
  onImageLoad,
  title
}) => /*#__PURE__*/React.createElement("div", {
  className: "bdl-ImageTooltipContent"
}, /*#__PURE__*/React.createElement("div", {
  className: "bdl-ImageTooltipContent-image"
}, cloneTooltipChildWithNewProps(children, onImageLoad)), /*#__PURE__*/React.createElement("div", {
  className: "bdl-ImageTooltipContent-contentWrapper"
}, /*#__PURE__*/React.createElement("h4", {
  className: "bdl-ImageTooltipContent-title"
}, title), /*#__PURE__*/React.createElement("p", {
  className: "bdl-ImageTooltipContent-content"
}, content)));
export default ImageTooltipContent;
//# sourceMappingURL=ImageTooltipContent.js.map