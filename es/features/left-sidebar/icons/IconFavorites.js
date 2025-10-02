import * as React from 'react';
import classNames from 'classnames';
import AccessibleSVG from '../../../icons/accessible-svg';
const iconName = 'icon-favorites';
const IconFavorites = ({
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
  d: "M7 11.5l-4 2.1c-.2.1-.4 0-.5-.1v-.2l.8-4.4L.1 5.8c-.1-.1-.1-.4 0-.5.1-.1.1-.1.2-.1l4.4-.6 2-4c.1-.2.3-.2.5-.2.1 0 .1.1.2.2l2 4 4.4.6c.2 0 .3.2.3.4 0 .1 0 .1-.1.2l-3.2 3.1.8 4.4c0 .2-.1.4-.3.4h-.2L7 11.5z",
  fill: selected ? color : undefined
}));
export default IconFavorites;
//# sourceMappingURL=IconFavorites.js.map