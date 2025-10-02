import * as React from 'react';
import classNames from 'classnames';
import AccessibleSVG from '../../../icons/accessible-svg';
const iconName = 'icon-recents';
const IconRecents = ({
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
  d: "M7 7V2.5c0-.3-.2-.5-.5-.5s-.5.2-.5.5v5c0 .3.2.5.5.5h3c.3 0 .5-.2.5-.5S9.8 7 9.5 7H7zm0 7c-3.9 0-7-3.1-7-7s3.1-7 7-7 7 3.1 7 7-3.1 7-7 7z",
  fill: selected ? color : undefined
}));
export default IconRecents;
//# sourceMappingURL=IconRecents.js.map