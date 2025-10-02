function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { Component } from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';
import PlainButton from '../../components/plain-button';
import DropdownMenu, { MenuToggle } from '../../components/dropdown-menu';
import { Menu, MenuSeparator, MenuSectionHeader, SelectMenuItem } from '../../components/menu';
import messages from './messages';
import { PEOPLE_WITH_LINK, PEOPLE_IN_COMPANY, PEOPLE_IN_ITEM } from './constants';
import { accessLevelPropType, allowedAccessLevelsPropType } from './propTypes';
import AccessLabel from './AccessLabel';
import RemoveLinkConfirmModal from './RemoveLinkConfirmModal';
const accessLevels = [PEOPLE_WITH_LINK, PEOPLE_IN_COMPANY, PEOPLE_IN_ITEM];
class AccessMenu extends Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      isConfirmModalOpen: false
    });
    _defineProperty(this, "openConfirmModal", () => {
      this.setState({
        isConfirmModalOpen: true
      });
    });
    _defineProperty(this, "closeConfirmModal", () => {
      this.setState({
        isConfirmModalOpen: false
      });
    });
  }
  renderMenu() {
    const {
      accessLevel,
      allowedAccessLevels,
      canRemoveLink,
      changeAccessLevel,
      enterpriseName,
      itemType,
      removeLinkButtonProps
    } = this.props;
    return /*#__PURE__*/React.createElement(Menu, {
      className: "share-access-menu"
    }, /*#__PURE__*/React.createElement(MenuSectionHeader, null, /*#__PURE__*/React.createElement(FormattedMessage, messages.accessTypeTitle)), accessLevels.map(level => allowedAccessLevels[level] ? /*#__PURE__*/React.createElement(SelectMenuItem, {
      key: level,
      isSelected: level === accessLevel,
      onClick: () => changeAccessLevel(level)
    }, /*#__PURE__*/React.createElement(AccessLabel, {
      accessLevel: level,
      enterpriseName: enterpriseName,
      itemType: itemType
    })) : null), canRemoveLink && /*#__PURE__*/React.createElement(MenuSeparator, null), canRemoveLink && /*#__PURE__*/React.createElement(SelectMenuItem, _extends({
      onClick: this.openConfirmModal
    }, removeLinkButtonProps), /*#__PURE__*/React.createElement(FormattedMessage, messages.removeLink)));
  }
  render() {
    const {
      accessDropdownMenuProps,
      accessLevel,
      accessMenuButtonProps,
      enterpriseName,
      itemType,
      removeLink,
      submitting
    } = this.props;
    const {
      isConfirmModalOpen
    } = this.state;
    return /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(DropdownMenu, accessDropdownMenuProps, /*#__PURE__*/React.createElement(PlainButton, _extends({
      className: classNames('lnk', {
        'is-disabled bdl-is-disabled': submitting
      }),
      disabled: submitting
    }, accessMenuButtonProps), /*#__PURE__*/React.createElement(MenuToggle, null, /*#__PURE__*/React.createElement(AccessLabel, {
      accessLevel: accessLevel,
      enterpriseName: enterpriseName,
      itemType: itemType
    }))), this.renderMenu()), /*#__PURE__*/React.createElement(RemoveLinkConfirmModal, {
      isOpen: isConfirmModalOpen,
      onRequestClose: this.closeConfirmModal,
      removeLink: removeLink,
      submitting: submitting
    }));
  }
}
_defineProperty(AccessMenu, "defaultProps", {
  accessDropdownMenuProps: {},
  accessMenuButtonProps: {},
  removeLinkButtonProps: {}
});
export default AccessMenu;
//# sourceMappingURL=AccessMenu.js.map