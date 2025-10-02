function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import DropdownMenu, { MenuToggle } from '../../components/dropdown-menu';
import { Menu, SelectMenuItem } from '../../components/menu';
import PlainButton from '../../components/plain-button';
import Tooltip from '../../components/tooltip';
import SharedLinkAccessLabel from './SharedLinkAccessLabel';
import { ANYONE_WITH_LINK, ANYONE_IN_COMPANY, DISABLED_REASON_ACCESS_POLICY, DISABLED_REASON_MALICIOUS_CONTENT, PEOPLE_IN_ITEM } from './constants';
import messages from './messages';
const accessLevels = [ANYONE_WITH_LINK, ANYONE_IN_COMPANY, PEOPLE_IN_ITEM];
class SharedLinkAccessMenu extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "onChangeAccessLevel", newAccessLevel => {
      const {
        accessLevel,
        changeAccessLevel,
        trackingProps
      } = this.props;
      const {
        onChangeSharedLinkAccessLevel
      } = trackingProps;
      if (accessLevel !== newAccessLevel) {
        changeAccessLevel(newAccessLevel);
        if (onChangeSharedLinkAccessLevel) {
          onChangeSharedLinkAccessLevel(newAccessLevel);
        }
      }
    });
  }
  renderMenu() {
    const {
      accessLevel,
      accessLevelsDisabledReason,
      allowedAccessLevels,
      enterpriseName,
      itemType
    } = this.props;
    return /*#__PURE__*/React.createElement(Menu, {
      className: "usm-share-access-menu",
      "data-testid": "usm-share-access-menu"
    }, accessLevels.map(level => {
      const isDisabled = !allowedAccessLevels[level];
      const isDisabledByAccessPolicy = accessLevelsDisabledReason[level] === DISABLED_REASON_ACCESS_POLICY;
      const isDisabledByMaliciousContent = accessLevelsDisabledReason[level] === DISABLED_REASON_MALICIOUS_CONTENT;
      const isDisabledByPolicy = isDisabledByAccessPolicy || isDisabledByMaliciousContent;
      const tooltipMessage = isDisabledByMaliciousContent ? messages.disabledMaliciousContentShareLinkPermission : messages.disabledShareLinkPermission;

      // If an access level is disabled for reasons other than access policy enforcement
      // then we just don't show that menu item. If it is disabled because of an access policy
      // instead, then we show the menu item in a disabled state and with a tooltip.
      if (isDisabled && !isDisabledByPolicy) {
        return null;
      }
      return /*#__PURE__*/React.createElement(Tooltip, {
        isDisabled: !isDisabledByPolicy,
        key: `tooltip-${level}`,
        position: "top-center",
        text: /*#__PURE__*/React.createElement(FormattedMessage, tooltipMessage)
      }, /*#__PURE__*/React.createElement(SelectMenuItem, {
        key: level,
        isDisabled: isDisabled,
        isSelected: level === accessLevel,
        onClick: () => this.onChangeAccessLevel(level)
      }, /*#__PURE__*/React.createElement(SharedLinkAccessLabel, {
        accessLevel: level,
        enterpriseName: enterpriseName,
        hasDescription: true,
        itemType: itemType
      })));
    }));
  }
  render() {
    const {
      accessLevel,
      enterpriseName,
      itemType,
      onDismissTooltip,
      submitting,
      tooltipContent,
      trackingProps
    } = this.props;
    const {
      onSharedLinkAccessMenuOpen,
      sharedLinkAccessMenuButtonProps
    } = trackingProps;
    return /*#__PURE__*/React.createElement(Tooltip, {
      className: "usm-ftux-tooltip",
      isShown: !!tooltipContent,
      onDismiss: onDismissTooltip,
      position: "middle-left",
      showCloseButton: true,
      text: tooltipContent,
      theme: "callout"
    }, /*#__PURE__*/React.createElement(DropdownMenu, {
      onMenuOpen: onSharedLinkAccessMenuOpen,
      constrainToWindow: true
    }, /*#__PURE__*/React.createElement(PlainButton, _extends({
      className: classNames('lnk', {
        'is-disabled': submitting,
        'bdl-is-disabled': submitting
      }),
      "data-testid": "usm-share-access-toggle",
      disabled: submitting,
      type: "button"
    }, sharedLinkAccessMenuButtonProps), /*#__PURE__*/React.createElement(MenuToggle, null, /*#__PURE__*/React.createElement(SharedLinkAccessLabel, {
      accessLevel: accessLevel,
      enterpriseName: enterpriseName,
      hasDescription: false,
      itemType: itemType
    }))), this.renderMenu()));
  }
}
_defineProperty(SharedLinkAccessMenu, "defaultProps", {
  accessLevelsDisabledReason: {},
  allowedAccessLevels: {},
  trackingProps: {}
});
export default SharedLinkAccessMenu;
//# sourceMappingURL=SharedLinkAccessMenu.js.map