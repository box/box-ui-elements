function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { Component } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import DropdownMenu, { MenuToggle } from '../../components/dropdown-menu';
import LabelPill from '../../components/label-pill';
import PlainButton from '../../components/plain-button';
import { Menu, SelectMenuItem } from '../../components/menu';
import { VIEW_SIZE_TYPE } from '../../components/media-query/constants';
import withMediaQuery from '../../components/media-query/withMediaQuery';
import { CAN_EDIT, CAN_VIEW_DOWNLOAD, CAN_VIEW_ONLY } from './constants';
import messages from './messages';
import './SharedLinkPermissionMenu.scss';
class SharedLinkPermissionMenu extends Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "onChangePermissionLevel", newPermissionLevel => {
      const {
        changePermissionLevel,
        permissionLevel,
        trackingProps
      } = this.props;
      const {
        onChangeSharedLinkPermissionLevel
      } = trackingProps;
      if (permissionLevel !== newPermissionLevel) {
        changePermissionLevel(newPermissionLevel);
        if (onChangeSharedLinkPermissionLevel) {
          onChangeSharedLinkPermissionLevel(newPermissionLevel);
        }
      }
    });
  }
  render() {
    const {
      allowedPermissionLevels,
      isSharedLinkEditTooltipShown,
      permissionLevel,
      sharedLinkEditTagTargetingApi,
      sharedLinkEditTooltipTargetingApi,
      size,
      submitting,
      trackingProps
    } = this.props;
    const {
      sharedLinkPermissionsMenuButtonProps
    } = trackingProps;
    const canShowTag = sharedLinkEditTagTargetingApi ? sharedLinkEditTagTargetingApi.canShow : false;
    const canShowTooltip = sharedLinkEditTooltipTargetingApi ? sharedLinkEditTooltipTargetingApi.canShow : false;
    if (!permissionLevel) {
      return null;
    }
    const permissionLevels = {
      [CAN_EDIT]: {
        label: /*#__PURE__*/React.createElement(FormattedMessage, messages.sharedLinkPermissionsEdit)
      },
      [CAN_VIEW_DOWNLOAD]: {
        label: /*#__PURE__*/React.createElement(FormattedMessage, messages.sharedLinkPermissionsViewDownload)
      },
      [CAN_VIEW_ONLY]: {
        label: /*#__PURE__*/React.createElement(FormattedMessage, messages.sharedLinkPermissionsViewOnly)
      }
    };
    const isRightAligned = size === VIEW_SIZE_TYPE.small || size === VIEW_SIZE_TYPE.medium;
    return /*#__PURE__*/React.createElement(DropdownMenu, {
      constrainToWindow: true,
      isRightAligned: isRightAligned,
      onMenuClose: () => {
        if (allowedPermissionLevels.includes(CAN_EDIT) && canShowTag && sharedLinkEditTagTargetingApi) {
          sharedLinkEditTagTargetingApi.onComplete();
        }
      },
      onMenuOpen: () => {
        if (allowedPermissionLevels.includes(CAN_EDIT) && canShowTag && sharedLinkEditTagTargetingApi) {
          sharedLinkEditTagTargetingApi.onShow();
        }

        // complete tooltip FTUX on opening of dropdown menu
        if (isSharedLinkEditTooltipShown && canShowTooltip && sharedLinkEditTooltipTargetingApi) {
          sharedLinkEditTooltipTargetingApi.onComplete();
        }
      }
    }, /*#__PURE__*/React.createElement(PlainButton, _extends({
      className: classNames('lnk', {
        'is-disabled': submitting,
        'bdl-is-disabled': submitting
      }),
      "data-testid": "usm-share-permissions-toggle",
      disabled: submitting,
      type: "button"
    }, sharedLinkPermissionsMenuButtonProps), /*#__PURE__*/React.createElement(MenuToggle, null, permissionLevels[permissionLevel].label)), /*#__PURE__*/React.createElement(Menu, {
      className: "ums-share-permissions-menu",
      "data-testid": "usm-share-permissions-menu"
    }, allowedPermissionLevels.map(level => /*#__PURE__*/React.createElement(SelectMenuItem, {
      key: level,
      isSelected: level === permissionLevel,
      onClick: () => this.onChangePermissionLevel(level)
    }, /*#__PURE__*/React.createElement("div", {
      className: "ums-share-permissions-menu-item"
    }, /*#__PURE__*/React.createElement("span", null, permissionLevels[level].label), level === CAN_EDIT && canShowTag && /*#__PURE__*/React.createElement(LabelPill.Pill, {
      className: "ftux-editable-shared-link",
      type: "ftux"
    }, /*#__PURE__*/React.createElement(LabelPill.Text, null, /*#__PURE__*/React.createElement(FormattedMessage, messages.ftuxSharedLinkPermissionsEditTag))))))));
  }
}
_defineProperty(SharedLinkPermissionMenu, "defaultProps", {
  trackingProps: {}
});
const sharedLinkPermissionMenu = withMediaQuery(SharedLinkPermissionMenu);
sharedLinkPermissionMenu.displayName = 'SharedLinkPermissionMenu';
export { SharedLinkPermissionMenu as SharedLinkPermissionMenuBase };
export default sharedLinkPermissionMenu;
//# sourceMappingURL=SharedLinkPermissionMenu.js.map