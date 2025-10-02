import * as React from 'react';
import classNames from 'classnames';
import AccessibleSVG from '../../../icons/accessible-svg';
const iconName = 'icon-shared-with-me';
const IconSharedWithMe = ({
  className = '',
  color = '#c4c4c4',
  title,
  width = 14,
  selected = false
}) => /*#__PURE__*/React.createElement(AccessibleSVG, {
  className: classNames(iconName, className, {
    'is-selected': selected
  }),
  title: title,
  viewBox: "0 0 14 14",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  color: color,
  d: "M7,0C3.1,0,0,3.1,0,7s3.1,7,7,7s7-3.1,7-7S10.9,0,7,0z M9.7,4.7c1,0,1.8,0.8,1.8,1.8s-0.8,1.8-1.8,1.8 c-1,0-1.8-0.8-1.8-1.8S8.7,4.7,9.7,4.7z M4.7,3c1.2,0,2.2,1,2.2,2.2c0,1.2-1,2.2-2.2,2.2c-1.2,0-2.2-1-2.2-2.2C2.5,4,3.5,3,4.7,3z M7,12.5c-2.2,0-4.2-1.3-5-3.2c0.7-0.9,1.7-1.5,2.8-1.5c1.2,0,2.3,0.7,3,1.7c0.5-0.5,1.2-0.8,2-0.8c0.8,0,1.5,0.3,2.1,0.9 C10.9,11.3,9.1,12.5,7,12.5z",
  fill: selected ? color : undefined
}));
export default IconSharedWithMe;
//# sourceMappingURL=IconSharedWithMe.js.map