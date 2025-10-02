function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
// @ts-ignore flow import
import messages from './messages';
// @ts-ignore flow import
import { determineInteractionMessage } from './utils/presenceUtils';
import './PresenceAvatarTooltipContent.scss';
// @ts-ignore flow import
import timeFromNow from '../../utils/relativeTime';
function PresenceAvatarTooltipContent({
  name,
  interactedAt,
  interactionType,
  intl,
  isActive
}) {
  const lastActionMessage = determineInteractionMessage(interactionType);
  const {
    value,
    unit
  } = timeFromNow(interactedAt);
  const timeAgo = intl.formatRelativeTime(value, unit);
  return /*#__PURE__*/React.createElement("div", {
    className: "bdl-PresenceAvatarTooltipContent"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bdl-PresenceAvatarTooltipContent-name"
  }, name), lastActionMessage && /*#__PURE__*/React.createElement("span", {
    className: "bdl-PresenceAvatarTooltipContent-event"
  }, isActive ? /*#__PURE__*/React.createElement(FormattedMessage, messages.activeNowText) : /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, lastActionMessage, {
    values: {
      timeAgo
    }
  }))));
}
export { PresenceAvatarTooltipContent as PresenceAvatarTooltipContentComponent };
export default injectIntl(PresenceAvatarTooltipContent);
//# sourceMappingURL=PresenceAvatarTooltipContent.js.map