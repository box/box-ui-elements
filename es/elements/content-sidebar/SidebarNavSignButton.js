const _excluded = ["blockedReason", "intl", "targetingApi"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classnames from 'classnames';
import { injectIntl } from 'react-intl';
import BoxSign28 from '../../icon/logo/BoxSign28';
import Sign16 from '../../icon/fill/Sign16';
import PlainButton from '../../components/plain-button';
// @ts-ignore Module is written in Flow
import TargetedClickThroughGuideTooltip from '../../features/targeting/TargetedClickThroughGuideTooltip';
import Tooltip, { TooltipPosition } from '../../components/tooltip';
// @ts-ignore Module is written in Flow
import messages from './messages';
import './SidebarNavSignButton.scss';
export const PlaceholderTooltip = ({
  children
}) => children;
export function SidebarNavSignButton(_ref) {
  let {
      blockedReason,
      intl,
      targetingApi
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const isSignDisabled = !!blockedReason;
  const isTargeted = targetingApi?.canShow;
  const FtuxTooltip = !isSignDisabled && isTargeted ? TargetedClickThroughGuideTooltip : PlaceholderTooltip;
  const label = intl.formatMessage(messages.boxSignRequest);
  const buttonClassName = classnames('bcs-SidebarNavSignButton', {
    'bdl-is-disabled': isSignDisabled
  });
  let tooltipMessage = label;
  switch (blockedReason) {
    case 'shield-download':
    case 'shared-link':
    case 'shield-sign':
      tooltipMessage = intl.formatMessage(messages.boxSignSecurityBlockedTooltip);
      break;
    case 'watermark':
      tooltipMessage = intl.formatMessage(messages.boxSignWatermarkBlockedTooltip);
      break;
    default:
  }
  return /*#__PURE__*/React.createElement(FtuxTooltip, {
    body: intl.formatMessage(messages.boxSignFtuxBody),
    position: TooltipPosition.MIDDLE_LEFT,
    shouldTarget: isTargeted,
    title: intl.formatMessage(messages.boxSignFtuxTitle),
    useTargetingApi: () => targetingApi
  }, /*#__PURE__*/React.createElement(Tooltip, {
    isDisabled: isTargeted,
    position: TooltipPosition.MIDDLE_LEFT,
    text: tooltipMessage
  }, /*#__PURE__*/React.createElement(PlainButton, _extends({
    "aria-label": label,
    className: buttonClassName,
    "data-testid": "sign-button",
    isDisabled: isSignDisabled
  }, rest), /*#__PURE__*/React.createElement(BoxSign28, {
    className: "bcs-SidebarNavSignButton-icon"
  }), /*#__PURE__*/React.createElement(Sign16, {
    width: 20,
    height: 20,
    className: "bcs-SidebarNavSignButton-icon--grayscale"
  }))));
}
export default injectIntl(SidebarNavSignButton);
//# sourceMappingURL=SidebarNavSignButton.js.map