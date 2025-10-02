import * as React from 'react';
import InfoBadge16 from '../../icon/fill/InfoBadge16';
import Tooltip, { TooltipPosition } from '../tooltip';
const InfoIconWithTooltip = ({
  className = '',
  iconProps,
  tooltipText
}) => /*#__PURE__*/React.createElement("span", {
  key: "infoIcon",
  className: `${className} tooltip-icon-container`
}, /*#__PURE__*/React.createElement(Tooltip, {
  position: TooltipPosition.TOP_CENTER,
  text: tooltipText
}, /*#__PURE__*/React.createElement("span", {
  className: "info-icon-container"
}, /*#__PURE__*/React.createElement(InfoBadge16, iconProps))));
export default InfoIconWithTooltip;
//# sourceMappingURL=InfoIconWithTooltip.js.map