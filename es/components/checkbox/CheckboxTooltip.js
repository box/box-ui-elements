import * as React from 'react';
import { defineMessages, FormattedMessage } from 'react-intl';
import IconInfo from '../../icons/general/IconInfo';
import Tooltip from '../tooltip';
const messages = defineMessages({
  checkboxTooltipIconInfoText: {
    "id": "boxui.checkboxTooltip.iconInfoText",
    "defaultMessage": "Info"
  }
});
const CheckboxTooltip = ({
  tooltip
}) => /*#__PURE__*/React.createElement("div", {
  className: "checkbox-tooltip-wrapper"
}, /*#__PURE__*/React.createElement(Tooltip, {
  text: tooltip
}, /*#__PURE__*/React.createElement("div", {
  className: "info-tooltip"
}, /*#__PURE__*/React.createElement(IconInfo, {
  height: 16,
  title: /*#__PURE__*/React.createElement(FormattedMessage, messages.checkboxTooltipIconInfoText),
  width: 16
}))));
export default CheckboxTooltip;
//# sourceMappingURL=CheckboxTooltip.js.map