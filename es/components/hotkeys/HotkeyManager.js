function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
class HotkeyManager {
  constructor() {
    _defineProperty(this, "layerStack", []);
    _defineProperty(this, "setActiveLayer", layerID => {
      this.layerStack.push(layerID);
    });
    _defineProperty(this, "removeLayer", layerID => {
      // $FlowFixMe
      this.layerStack = this.layerStack.filter(thisLayerID => thisLayerID !== layerID);
    });
    _defineProperty(this, "getActiveLayerID", () => {
      if (this.layerStack.length === 0) {
        return null;
      }
      return this.layerStack[this.layerStack.length - 1];
    });
  }
}

// This is a singleton service to maintain the global hotkey layer stack
export default new HotkeyManager();
//# sourceMappingURL=HotkeyManager.js.map