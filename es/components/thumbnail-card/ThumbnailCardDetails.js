import * as React from 'react';
import Tooltip from '../tooltip';
import { useIsContentOverflowed } from '../../utils/dom';
const Title = ({
  title,
  onKeyDown
}) => {
  const textRef = React.useRef(null);
  const isTextOverflowed = useIsContentOverflowed(textRef);
  return /*#__PURE__*/React.createElement(Tooltip, {
    isDisabled: !isTextOverflowed,
    text: title
  }, /*#__PURE__*/React.createElement("div", {
    ref: textRef,
    role: "link",
    className: "thumbnail-card-title",
    tabIndex: 0,
    onKeyDown: onKeyDown
  }, title));
};
const ThumbnailCardDetails = ({
  actionItem,
  icon,
  subtitle,
  title,
  onKeyDown
}) => /*#__PURE__*/React.createElement("div", {
  className: "thumbnail-card-details"
}, icon, /*#__PURE__*/React.createElement("div", {
  className: "thumbnail-card-details-content"
}, /*#__PURE__*/React.createElement("div", {
  className: "ThumbnailCardDetails-bodyText"
}, /*#__PURE__*/React.createElement(Title, {
  title: title,
  onKeyDown: onKeyDown
}), subtitle && /*#__PURE__*/React.createElement("div", {
  className: "thumbnail-card-subtitle"
}, subtitle)), actionItem));
export default ThumbnailCardDetails;
//# sourceMappingURL=ThumbnailCardDetails.js.map