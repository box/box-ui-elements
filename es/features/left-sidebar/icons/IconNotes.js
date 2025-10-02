import * as React from 'react';
import classNames from 'classnames';
import AccessibleSVG from '../../../icons/accessible-svg';
const iconName = 'icon-notes';
const IconNotes = ({
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
  d: "M9.7 1.3H1c-.6 0-1 .4-1 1s.4 1 1 1h7.3l1.4-2zm-2.6 4H1c-.6 0-1 .4-1 1s.4 1 1 1h4.8l1.3-2zm-2.6 4H1c-.6 0-1 .4-1 1s.4 1 1 1h2.5l.1-.3c.1-.2.1-.5.2-.7l.7-1zm6.4-6.1c.2.3.5.5.7.7.3.2.6.3.9.4l-4.9 7.4-.3.3-1.7 1.3c-.1.1-.2 0-.2-.1l.5-2.2c.1-.2.1-.3.2-.5l4.8-7.3zm1.3-2.1c.6-.2 1.3.1 1.5.7v.3c-.2.4-.3.7-.5 1l-.9-.3c-.3-.2-.6-.4-.8-.8l.7-.9z",
  fill: selected ? color : undefined
}));
export default IconNotes;
//# sourceMappingURL=IconNotes.js.map