function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import Pikaday from 'pikaday';
// An extended version of Pikaday to work when `isAccessible` prop is `true`
class AccessiblePikaday extends Pikaday {
  constructor(options) {
    super(options);
    _defineProperty(this, "handleBlur", () => {
      this.hide();
    });
    _defineProperty(this, "handleClickOutside", event => {
      if (this.isVisible() && this.datePickerButtonEl && this.datePickerButtonEl.contains(event.target)) {
        return;
      }
      if (this.isVisible() && !this.el.contains(event.target)) {
        this.hide();
        const currentFocusEl = document.activeElement;
        if (this.accessibleFieldEl && currentFocusEl && currentFocusEl.tabIndex < 0) {
          this.accessibleFieldEl.focus();
        }
      }
    });
    this.accessibleFieldEl = options.accessibleFieldEl;
    this.datePickerButtonEl = options.datePickerButtonEl;

    // Override behavior as if `options.field` and `options.bound` were set.
    // See https://github.com/Pikaday/Pikaday/blob/master/pikaday.js#L671
    //     https://github.com/Pikaday/Pikaday/blob/master/pikaday.js#L695-L703
    if (this.accessibleFieldEl) {
      this.el.classList.add('is-bound');
      document.body.appendChild(this.el);
      this.accessibleFieldEl.addEventListener('blur', this.handleBlur);
      this.hide();
    }
  }
  show() {
    super.show();
    if (this.accessibleFieldEl) {
      document.addEventListener('click', this.handleClickOutside, true);
      this.adjustPosition();
    }
  }
  hide() {
    super.hide();
    if (this.accessibleFieldEl) {
      document.removeEventListener('click', this.handleClickOutside);
    }
  }
  destroy() {
    super.destroy();
    if (this.accessibleFieldEl) {
      this.accessibleFieldEl.removeEventListener('blur', this.handleBlur);
      document.removeEventListener('click', this.handleClickOutside);
    }
  }
}
export default AccessiblePikaday;
//# sourceMappingURL=AccessiblePikaday.js.map