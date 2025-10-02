/**
 * 
 * @file Sidebar Additional Tab FTUX tooltip
 * @author Box
 */

import * as React from 'react';
import Tooltip from '../../common/Tooltip';
import TargetedClickThroughGuideTooltip from '../../../features/targeting/TargetedClickThroughGuideTooltip';
import './AdditionalTabTooltip.scss';
const AdditionalTabTooltip = ({
  children,
  defaultTooltipText,
  isFtuxVisible,
  ftuxTooltipData
}) => {
  if (!isFtuxVisible || !ftuxTooltipData || !ftuxTooltipData.targetingApi().canShow) {
    return /*#__PURE__*/React.createElement(Tooltip, {
      position: "middle-left",
      text: defaultTooltipText
    }, children);
  }
  const {
    targetingApi,
    text
  } = ftuxTooltipData;
  return /*#__PURE__*/React.createElement(TargetedClickThroughGuideTooltip, {
    className: "bdl-AdditionalTabTooltip",
    body: text,
    position: "middle-right",
    shouldTarget: true,
    useTargetingApi: targetingApi
  }, children);
};
export default AdditionalTabTooltip;
//# sourceMappingURL=AdditionalTabTooltip.js.map