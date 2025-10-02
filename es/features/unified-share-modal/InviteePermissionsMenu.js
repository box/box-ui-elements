function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import PlainButton from '../../components/plain-button';
import DropdownMenu, { MenuToggle } from '../../components/dropdown-menu';
import { Menu, SelectMenuItem } from '../../components/menu';
import Tooltip from '../../components/tooltip';
import { ITEM_TYPE_WEBLINK } from '../../common/constants';
import getDefaultPermissionLevel from './utils/defaultPermissionLevel';
import InviteePermissionsLabel from './InviteePermissionsLabel';
import messages from './messages';
class InviteePermissionsMenu extends Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "onChangeInviteePermissionsLevel", newInviteePermissionLevel => {
      const {
        inviteePermissionLevel,
        changeInviteePermissionLevel
      } = this.props;
      if (inviteePermissionLevel !== newInviteePermissionLevel) {
        changeInviteePermissionLevel(newInviteePermissionLevel);
      }
    });
  }
  renderMenu() {
    const {
      inviteePermissionLevel,
      inviteePermissions,
      itemType
    } = this.props;
    const defaultPermissionLevel = getDefaultPermissionLevel(inviteePermissions);
    const selectedPermissionLevel = inviteePermissionLevel || defaultPermissionLevel;
    return /*#__PURE__*/React.createElement(Menu, {
      className: "usm-share-access-menu"
    }, inviteePermissions.map(level => level.value ? /*#__PURE__*/React.createElement(SelectMenuItem, {
      key: level.value,
      isDisabled: level.disabled,
      isSelected: level.value === selectedPermissionLevel,
      onClick: () => this.onChangeInviteePermissionsLevel(level.value)
    }, /*#__PURE__*/React.createElement(InviteePermissionsLabel, {
      hasDescription: true,
      inviteePermissionDescription: level.description,
      inviteePermissionLevel: level.value,
      inviteePermissions: true,
      itemType: itemType
    })) : null));
  }
  render() {
    const {
      inviteePermissions,
      inviteePermissionsButtonProps,
      inviteePermissionLevel,
      disabled,
      itemType
    } = this.props;
    const defaultPermissionLevel = getDefaultPermissionLevel(inviteePermissions);
    const selectedPermissionLevel = inviteePermissionLevel || defaultPermissionLevel;
    const disabledTooltip = itemType === ITEM_TYPE_WEBLINK ? /*#__PURE__*/React.createElement(FormattedMessage, messages.inviteDisabledWeblinkTooltip) : /*#__PURE__*/React.createElement(FormattedMessage, messages.inviteDisabledTooltip);
    const plainButton = /*#__PURE__*/React.createElement(PlainButton, _extends({
      className: classNames('lnk', {
        'is-disabled': disabled,
        'bdl-is-disabled': disabled
      }),
      "data-target-id": "PlainButton-InviteePermissionsMenuToggle",
      disabled: disabled,
      type: "button"
    }, inviteePermissionsButtonProps), /*#__PURE__*/React.createElement(MenuToggle, null, selectedPermissionLevel && /*#__PURE__*/React.createElement(InviteePermissionsLabel, {
      hasDescription: false,
      inviteePermissionLevel: selectedPermissionLevel,
      itemType: itemType
    })));
    const plainButtonWrap = disabled ? /*#__PURE__*/React.createElement(Tooltip, {
      position: "bottom-center",
      text: disabledTooltip
    }, /*#__PURE__*/React.createElement("div", {
      className: "tooltip-target"
    }, plainButton)) : plainButton;

    // TODO: `DropdownMenu` doesn't currently handle a scenario where the menu is taller than
    // the available vertical space. cannot use the constraint props here in short windows.
    return /*#__PURE__*/React.createElement("div", {
      className: "be invitee-menu-wrap"
    }, /*#__PURE__*/React.createElement(DropdownMenu, null, plainButtonWrap, this.renderMenu()));
  }
}
_defineProperty(InviteePermissionsMenu, "defaultProps", {
  disabled: false,
  inviteePermissions: [],
  inviteePermissionsButtonProps: {}
});
export default InviteePermissionsMenu;
//# sourceMappingURL=InviteePermissionsMenu.js.map