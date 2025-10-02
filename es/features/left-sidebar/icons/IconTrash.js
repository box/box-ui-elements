import * as React from 'react';
import classNames from 'classnames';
import AccessibleSVG from '../../../icons/accessible-svg';
const iconName = 'icon-trash';
const IconTrash = ({
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
  d: "M13.1 0h.9l-2.1 12.8c-.1.7-.8 1.2-1.4 1.2h-7c-.7 0-1.3-.6-1.4-1.2L0 0h13.1zM9.9 2.3H4.1c-.3 0-.6.2-.6.6s.2.6.6.6h5.8c.3 0 .6-.2.6-.6s-.2-.6-.6-.6z",
  fill: selected ? color : undefined
}));
export default IconTrash;
//# sourceMappingURL=IconTrash.js.map