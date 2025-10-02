function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import HotkeyRecord, { HotkeyPropType } from './HotkeyRecord';
import HotkeyService from './HotkeyService';
import Hotkeys from './Hotkeys';
import HotkeyHelpModal from './HotkeyHelpModal'; // eslint-disable-line import/no-cycle

import './HotkeyLayer.scss';
class HotkeyLayer extends Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "state", {
      isHelpModalOpen: false
    });
    _defineProperty(this, "openHelpModal", () => {
      this.setState({
        isHelpModalOpen: true
      });
    });
    _defineProperty(this, "closeHelpModal", () => {
      this.setState({
        isHelpModalOpen: false
      });
    });
    this.hotkeyService = new HotkeyService();
  }
  getChildContext() {
    return {
      hotkeyLayer: this.hotkeyService
    };
  }
  componentWillUnmount() {
    this.hotkeyService.destroyLayer();
  }
  getHotkeyConfigs() {
    const {
      configs = [],
      helpModalShortcut,
      enableHelpModal
    } = this.props;
    if (!enableHelpModal) {
      return configs;
    }
    return [new HotkeyRecord({
      key: helpModalShortcut,
      handler: () => this.openHelpModal()
    }), ...configs];
  }
  render() {
    const {
      children,
      className = '',
      enableHelpModal
    } = this.props;
    return /*#__PURE__*/React.createElement(Hotkeys, {
      configs: this.getHotkeyConfigs()
    }, enableHelpModal ? /*#__PURE__*/React.createElement("span", {
      className: `hotkey-layer ${className}`
    }, /*#__PURE__*/React.createElement(HotkeyHelpModal, {
      isOpen: this.state.isHelpModalOpen,
      onRequestClose: this.closeHelpModal
    }), children) : children);
  }
}
_defineProperty(HotkeyLayer, "propTypes", {
  children: PropTypes.node,
  className: PropTypes.string,
  /** Array of hotkey configs, either in the specified shape, or instances of HotkeyRecord */
  configs: PropTypes.arrayOf(HotkeyPropType),
  /** Shortcut to trigger the help modal, if it's enabled */
  helpModalShortcut: PropTypes.string,
  enableHelpModal: PropTypes.bool
});
_defineProperty(HotkeyLayer, "defaultProps", {
  helpModalShortcut: '?',
  enableHelpModal: false
});
_defineProperty(HotkeyLayer, "contextTypes", {
  hotkeyLayer: PropTypes.object
});
_defineProperty(HotkeyLayer, "childContextTypes", {
  hotkeyLayer: PropTypes.object
});
export default HotkeyLayer;
//# sourceMappingURL=HotkeyLayer.js.map