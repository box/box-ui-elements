import * as React from 'react';
import classNames from 'classnames';
import AccessibleSVG from '../../../icons/accessible-svg';
const iconName = 'icon-feed';
const IconFeed = ({
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
  d: "M.8 0h12.4c.4 0 .8.3.8.8v6.8c0 .4-.3.8-.8.8H.8c-.4 0-.8-.3-.8-.8V.8C0 .3.3 0 .8 0zM.7 9.8h12.6c.4 0 .7.3.7.7s-.3.7-.7.7H.7c-.4 0-.7-.3-.7-.7s.3-.7.7-.7zm0 2.8h12.6c.4 0 .7.3.7.7 0 .4-.3.7-.7.7H.7c-.4 0-.7-.3-.7-.7 0-.4.3-.7.7-.7z",
  fill: selected ? color : undefined
}));
export default IconFeed;
//# sourceMappingURL=IconFeed.js.map