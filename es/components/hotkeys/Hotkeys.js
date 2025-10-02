function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import { Children, Component } from 'react';
import PropTypes from 'prop-types';
import { HotkeyPropType } from './HotkeyRecord';
class Hotkeys extends Component {
  componentDidMount() {
    const {
      configs
    } = this.props;
    if (!this.context.hotkeyLayer) {
      throw new Error('You must instantiate a HotkeyLayer before using Hotkeys');
    }
    this._addHotkeys(configs);
  }
  componentDidUpdate(prevProps) {
    const {
      configs: newConfigs
    } = this.props;
    const {
      configs: prevConfigs
    } = prevProps;
    const additions = newConfigs.filter(config => prevConfigs.indexOf(config) === -1);
    const removals = prevConfigs.filter(config => newConfigs.indexOf(config) === -1);
    this._removeHotkeys(removals);
    this._addHotkeys(additions);
  }
  componentWillUnmount() {
    const {
      configs
    } = this.props;
    this._removeHotkeys(configs);
  }
  _addHotkeys(hotkeyConfigs) {
    hotkeyConfigs.forEach(hotkeyConfig => this.context.hotkeyLayer.registerHotkey(hotkeyConfig));
  }
  _removeHotkeys(hotkeyConfigs) {
    hotkeyConfigs.forEach(hotkeyConfig => this.context.hotkeyLayer.deregisterHotkey(hotkeyConfig));
  }
  render() {
    if (!this.props.children) {
      return null;
    }
    return Children.only(this.props.children);
  }
}
/* eslint-disable no-underscore-dangle */
_defineProperty(Hotkeys, "propTypes", {
  children: PropTypes.node,
  /** Array of hotkey configs, either in the specified shape, or instances of HotkeyRecord */
  configs: PropTypes.arrayOf(HotkeyPropType).isRequired
});
_defineProperty(Hotkeys, "contextTypes", {
  hotkeyLayer: PropTypes.object
});
export default Hotkeys;
//# sourceMappingURL=Hotkeys.js.map