import * as React from 'react';
import { FormattedMessage } from 'react-intl';

// @ts-ignore Module is written in Flow
import { SIDEBAR_NAV_TARGETS } from '../common/interactionTargets';

// @ts-ignore Module is written in Flow
import DropdownMenu from '../../components/dropdown-menu';
import SidebarNavSignButton from './SidebarNavSignButton';
import SignMe32 from '../../icon/fill/SignMe32';
import SignMeOthers32 from '../../icon/fill/SignMeOthers32';
import { Menu, MenuItem } from '../../components/menu';

// @ts-ignore Module is written in Flow
import messages from './messages';
import './SidebarNavSign.scss';
// @ts-ignore Module is written in Flow

export function SidebarNavSign(signSidebarProps) {
  const {
    blockedReason: boxSignBlockedReason,
    onClick: onBoxClickRequestSignature,
    onClickSignMyself: onBoxClickSignMyself,
    targetingApi: boxSignTargetingApi
  } = signSidebarProps;
  return /*#__PURE__*/React.createElement(DropdownMenu, {
    isResponsive: true,
    constrainToWindow: true,
    isRightAligned: true
  }, /*#__PURE__*/React.createElement(SidebarNavSignButton, {
    blockedReason: boxSignBlockedReason,
    targetingApi: boxSignTargetingApi,
    "data-resin-target": SIDEBAR_NAV_TARGETS.SIGN
  }), /*#__PURE__*/React.createElement(Menu, null, /*#__PURE__*/React.createElement(MenuItem, {
    onClick: onBoxClickRequestSignature
  }, /*#__PURE__*/React.createElement(SignMeOthers32, {
    width: 16,
    height: 16,
    className: "bcs-SidebarNavSign-icon"
  }), /*#__PURE__*/React.createElement(FormattedMessage, messages.boxSignRequestSignature)), /*#__PURE__*/React.createElement(MenuItem, {
    onClick: onBoxClickSignMyself
  }, /*#__PURE__*/React.createElement(SignMe32, {
    width: 16,
    height: 16,
    className: "bcs-SidebarNavSign-icon"
  }), /*#__PURE__*/React.createElement(FormattedMessage, messages.boxSignSignMyself))));
}
export default SidebarNavSign;
//# sourceMappingURL=SidebarNavSign.js.map