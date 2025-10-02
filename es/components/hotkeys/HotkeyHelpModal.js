function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import commonMessages from '../../common/messages';
import { ModalActions } from '../modal';
import Button from '../button';
import PlainButton from '../plain-button';
import DropdownMenu, { MenuToggle } from '../dropdown-menu';
import { Menu, MenuItem } from '../menu';
import HotkeyFriendlyModal from './HotkeyFriendlyModal'; // eslint-disable-line import/no-cycle
import messages from './messages';
import './HotkeyHelpModal.scss';
const specialCharacters = {
  backspace: '\u232b',
  down: '\u2193',
  left: '\u2190',
  meta: '\u2318',
  right: '\u2192',
  up: '\u2191',
  enter: /*#__PURE__*/React.createElement(FormattedMessage, messages.enterKey),
  spacebar: /*#__PURE__*/React.createElement(FormattedMessage, messages.spacebarKey),
  shift: '\u21e7',
  ctrl: /*#__PURE__*/React.createElement(FormattedMessage, messages.ctrlKey),
  alt: /*#__PURE__*/React.createElement(FormattedMessage, messages.altKey),
  esc: /*#__PURE__*/React.createElement(FormattedMessage, messages.escKey)
};
class HotkeyHelpModal extends Component {
  constructor(props, context) {
    super(props);
    /**
     * Converts a "raw" hotkey to translated JSX version
     */
    _defineProperty(this, "prettyPrintHotkey", hotkeyConfig => {
      const hotkeys = Array.isArray(hotkeyConfig.key) ? hotkeyConfig.key : [hotkeyConfig.key];
      return hotkeys.map(hotkey => hotkey.split(' ').reduce((prettyHotkey, combo, i) => {
        // Convert a "raw" combo to a "pretty" combo:
        // e.g. "shift+g" => [ <kbd>Shift</kbd>, '+', <kbd>G</kbd> ]
        const prettyCombo = combo.split('+').map(key => {
          // Convert special key characters into their respective icons or translated components:
          // e.g. "shift" => "Shift", "meta" => "⌘"
          if (key in specialCharacters) {
            return specialCharacters[key];
          }
          // If it's not a special character, just return the uppercased key:
          // e.g. "g" => "G"
          return key.length === 1 ? key.toUpperCase() : key;
        }).map((key, j) => /*#__PURE__*/React.createElement("kbd", {
          key: j
        }, key));
        // If this hotkey is a sequence of keys, return a translated message to combine them:
        // e.g. "Shift+G Shift+A" => "Shift+G then Shift+A"
        return i === 0 ? prettyCombo : /*#__PURE__*/React.createElement(FormattedMessage, _extends({
          values: {
            key1: /*#__PURE__*/React.createElement("span", null, prettyHotkey),
            key2: /*#__PURE__*/React.createElement("span", null, prettyCombo)
          }
        }, messages.hotkeySequence));
      }, [])).reduce((finalHotkey, hotkey, i) =>
      // For shortcuts with multiple hotkeys, separate each hotkey with a "/" joiner:
      // e.g. "Cmd+S Ctrl+S" => "Cmd+S / Ctrl+S"
      i === 0 ? [hotkey] : [...finalHotkey, ' / ', hotkey], []).map((element, i) => /*#__PURE__*/React.createElement("span", {
        key: i
      }, element));
    });
    _defineProperty(this, "renderHotkey", (hotkey, i) => /*#__PURE__*/React.createElement("li", {
      key: i,
      className: "hotkey-item"
    }, /*#__PURE__*/React.createElement("div", {
      className: "hotkey-description"
    }, hotkey.description), /*#__PURE__*/React.createElement("div", {
      className: "hotkey-key"
    }, this.prettyPrintHotkey(hotkey))));
    this.hotkeys = context.hotkeyLayer.getActiveHotkeys();
    this.types = context.hotkeyLayer.getActiveTypes();
    this.state = {
      currentType: this.types.length ? this.types[0] : null
    };
  }
  componentDidUpdate({
    isOpen: prevIsOpen
  }, {
    currentType: prevType
  }) {
    const {
      isOpen
    } = this.props;
    if (!isOpen) {
      return;
    }

    // modal is being opened; refresh hotkeys
    if (!prevIsOpen && isOpen) {
      this.hotkeys = this.context.hotkeyLayer.getActiveHotkeys();
      this.types = this.context.hotkeyLayer.getActiveTypes();
    }
    if (!prevType) {
      this.setState({
        currentType: this.types.length ? this.types[0] : null
      });
    }
  }
  renderDropdownMenu() {
    const {
      currentType
    } = this.state;
    if (!currentType) {
      return null;
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "hotkey-dropdown"
    }, /*#__PURE__*/React.createElement(DropdownMenu, null, /*#__PURE__*/React.createElement(PlainButton, {
      className: "lnk",
      type: "button"
    }, /*#__PURE__*/React.createElement(MenuToggle, null, currentType)), /*#__PURE__*/React.createElement(Menu, null, this.types.map((hotkeyType, i) => /*#__PURE__*/React.createElement(MenuItem, {
      key: i,
      onClick: () => this.setState({
        currentType: hotkeyType
      })
    }, hotkeyType)))));
  }
  renderHotkeyList() {
    const {
      currentType
    } = this.state;
    if (!currentType) {
      return null;
    }
    const hotkeys = this.hotkeys[currentType];
    return /*#__PURE__*/React.createElement("ul", {
      className: "hotkey-list"
    }, hotkeys.map(this.renderHotkey));
  }
  render() {
    const {
      isOpen,
      onRequestClose
    } = this.props;
    const {
      currentType
    } = this.state;
    if (!currentType) {
      return null;
    }
    return /*#__PURE__*/React.createElement(HotkeyFriendlyModal, {
      className: "hotkey-modal",
      isOpen: isOpen,
      onRequestClose: onRequestClose,
      title: /*#__PURE__*/React.createElement(FormattedMessage, messages.hotkeyModalTitle)
    }, this.renderDropdownMenu(), this.renderHotkeyList(), /*#__PURE__*/React.createElement(ModalActions, null, /*#__PURE__*/React.createElement(Button, {
      onClick: onRequestClose
    }, /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.cancel))));
  }
}
_defineProperty(HotkeyHelpModal, "propTypes", {
  isOpen: PropTypes.bool,
  onRequestClose: PropTypes.func.isRequired
});
_defineProperty(HotkeyHelpModal, "contextTypes", {
  hotkeyLayer: PropTypes.object
});
export default HotkeyHelpModal;
//# sourceMappingURL=HotkeyHelpModal.js.map