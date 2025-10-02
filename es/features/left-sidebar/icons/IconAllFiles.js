import * as React from 'react';
import classNames from 'classnames';
import AccessibleSVG from '../../../icons/accessible-svg';
const iconName = 'icon-all-files';
const IconAllFiles = ({
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
  d: "M1.4 1.4h4.2L7 2.8h5.6c.8 0 1.4.6 1.4 1.4v7c0 .8-.6 1.4-1.4 1.4H1.4C.6 12.6 0 12 0 11.2V2.8c0-.8.6-1.4 1.4-1.4zM2 4.5v1h10v-1H2z",
  fill: selected ? color : undefined
}));
export default IconAllFiles;
//# sourceMappingURL=IconAllFiles.js.map