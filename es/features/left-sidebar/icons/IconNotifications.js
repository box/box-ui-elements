import * as React from 'react';
import classNames from 'classnames';
import AccessibleSVG from '../../../icons/accessible-svg';
const iconName = 'icon-notifications';
const IconNotifications = ({
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
  viewBox: "0 0 14 16.1",
  width: width
}, /*#__PURE__*/React.createElement("path", {
  className: "fill-color",
  color: color,
  d: "M5.5 14.6h3.1c0 .8-.7 1.5-1.5 1.5s-1.6-.7-1.6-1.5zm6.9-7.7v4.5L14 13v.8H0V13l1.6-1.6V6.9c0-2.5 1.8-4.6 4.1-5.1v-.6C5.7.5 6.3 0 6.9 0c.7 0 1.2.5 1.2 1.2v.6c2.5.5 4.3 2.6 4.3 5.1z",
  fill: selected ? color : undefined
}));
export default IconNotifications;
//# sourceMappingURL=IconNotifications.js.map