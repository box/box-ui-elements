const _excluded = ["children", "className", "content", "image", "title"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';

// @ts-ignore flow import
import Tooltip, { TooltipTheme } from '../tooltip';
import ImageTooltipContent from './ImageTooltipContent';
import './ImageTooltip.scss';

// We manually set "text" with our specific visual tooltip content.

const ImageTooltip = _ref => {
  let {
      children,
      className,
      content,
      image,
      title
    } = _ref,
    otherTooltipProps = _objectWithoutProperties(_ref, _excluded);
  // State to track if the image has been loaded before displaying the tooltip
  const [isImageLoaded, setIsImageLoaded] = React.useState(false);
  const tooltipContent = /*#__PURE__*/React.createElement(ImageTooltipContent, {
    content: content,
    onImageLoad: () => setIsImageLoaded(true),
    title: title
  }, React.Children.only(image));
  const imageTooltipClasses = classNames('bdl-ImageTooltip', className, {
    'bdl-is-image-loaded': isImageLoaded
  });
  return /*#__PURE__*/React.createElement(Tooltip, _extends({
    className: imageTooltipClasses,
    showCloseButton: true,
    theme: TooltipTheme.CALLOUT
  }, otherTooltipProps, {
    text: tooltipContent
  }), children);
};
export default ImageTooltip;
//# sourceMappingURL=ImageTooltip.js.map