import * as React from 'react';
import noop from 'lodash/noop';
import { FormattedMessage } from 'react-intl';
import InfoBadge16 from '../../icon/fill/InfoBadge16';
// @ts-ignore flow import
import Toggle from '../../components/toggle';
import Tooltip from '../../components/tooltip';
import messages from './messages';
import './AdvancedContentInsightsToggle.scss';
const AdvancedContentInsightsToggle = ({
  hasDescription,
  hasTooltip = true,
  isChecked = false,
  isDisabled,
  onChange = noop
}) => {
  const description = /*#__PURE__*/React.createElement(FormattedMessage, messages.advancedContentInsightsDescription);
  const label = /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(FormattedMessage, isChecked ? messages.advancedContentInsightsTitleEnabled : messages.advancedContentInsightsTitleDisabled), hasTooltip && /*#__PURE__*/React.createElement(Tooltip, {
    text: description
  }, /*#__PURE__*/React.createElement("div", {
    className: "AdvancedContentInsightsToggle-icon"
  }, /*#__PURE__*/React.createElement(InfoBadge16, {
    height: 14,
    width: 14
  }))));
  return /*#__PURE__*/React.createElement(Toggle, {
    className: "AdvancedContentInsightsToggle",
    "data-testid": "insights-toggle",
    description: !hasTooltip && hasDescription && description,
    isDisabled: isDisabled,
    isOn: isChecked,
    label: label,
    onChange: () => onChange(!isChecked)
  });
};
export default AdvancedContentInsightsToggle;
//# sourceMappingURL=AdvancedContentInsightsToggle.js.map