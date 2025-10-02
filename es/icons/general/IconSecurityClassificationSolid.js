import * as React from 'react';
import classNames from 'classnames';
import AccessibleSVG from '../accessible-svg';
import { bdlGray, bdlGray20 } from '../../styles/variables';
const IconSecurityClassificationSolid = ({
  className = '',
  fillColor = bdlGray20,
  height = 16,
  title,
  width = 16
}) => {
  const classes = classNames('bdl-IconSecurityClassificationSolid', className);
  return /*#__PURE__*/React.createElement(AccessibleSVG, {
    className: classes,
    height: height,
    title: title,
    viewBox: "0 0 16 16",
    width: width
  }, /*#__PURE__*/React.createElement("g", {
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    fill: fillColor,
    d: "M8 0C3.582 0 0 3.582 0 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: bdlGray,
    d: "M8 2.441l-4.5 2.25v2.924c0 1.283.384 2.523 1.093 3.518.851 1.193 2.007 2.086 3.305 2.356l.114.024.112-.029c1.144-.293 2.54-1.31 3.283-2.35.71-.995 1.093-2.236 1.093-3.519V4.691L8 2.441zm0 1.118l3.5 1.75v2.306c0 1.078-.32 2.116-.907 2.938l-.13.171c-.594.742-1.587 1.464-2.402 1.737l-.075.021.116.029c-1.02-.213-1.978-.953-2.695-1.958l-.141-.21C4.77 9.557 4.5 8.603 4.5 7.615V5.309L8 3.559z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: bdlGray,
    d: "M10 5.5c.245 0 .45.177.492.41L10.5 6v3c0 .276-.224.5-.5.5-.245 0-.45-.177-.492-.41L9.5 9V6c0-.276.224-.5.5-.5z"
  })));
};
export default IconSecurityClassificationSolid;
//# sourceMappingURL=IconSecurityClassificationSolid.js.map