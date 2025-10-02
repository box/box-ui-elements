import * as React from 'react';
import PlainButton from '../../components/plain-button';
import Tooltip from '../../components/tooltip';
import IconSecurityClassification from '../../icons/general/IconSecurityClassification';
import SecurityBadge from '../security';
import { bdlYellow50 } from '../../styles/variables';
import './ClassifiedBadge.scss';
const ICON_SIZE = 12;
const ClassifiedBadge = ({
  color,
  name,
  onClick,
  tooltipPosition = 'bottom-center',
  tooltipText
}) => {
  const isClickable = typeof onClick === 'function';
  const isTooltipDisabled = !tooltipText;
  const badge = /*#__PURE__*/React.createElement(SecurityBadge, {
    className: "bdl-ClassifiedBadge",
    color: color,
    icon: /*#__PURE__*/React.createElement(IconSecurityClassification, {
      height: ICON_SIZE,
      width: ICON_SIZE
    }),
    message: name
  });
  return /*#__PURE__*/React.createElement(Tooltip, {
    isDisabled: isTooltipDisabled,
    isTabbable: false,
    position: tooltipPosition,
    text: tooltipText
  }, isClickable ? /*#__PURE__*/React.createElement(PlainButton, {
    className: "bdl-ClassifiedBadge-editButton",
    "data-resin-target": "editclassification",
    onClick: onClick,
    type: "button"
  }, badge) : badge);
};
ClassifiedBadge.defaultProps = {
  color: bdlYellow50
};
export default ClassifiedBadge;
//# sourceMappingURL=ClassifiedBadge.js.map