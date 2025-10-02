function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import range from 'lodash/range';
import * as React from 'react';
import SlideButton from './SlideButton';
class SlideNavigator extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "buttonElements", []);
    _defineProperty(this, "focusOnButtonElement", index => {
      if (index + 1 > this.buttonElements.length || index < 0) {
        return;
      }
      this.buttonElements[index].focus();
    });
    _defineProperty(this, "handleKeyDown", event => {
      const {
        numOptions,
        selectedIndex
      } = this.props;
      let nextIndex = null;
      switch (event.key) {
        case 'ArrowRight':
          nextIndex = (selectedIndex + 1) % numOptions;
          break;
        case 'ArrowLeft':
          nextIndex = (selectedIndex - 1 + numOptions) % numOptions;
          break;
        default:
          return;
      }
      this.handleSelection(nextIndex);
      event.preventDefault();
      event.stopPropagation();
    });
    _defineProperty(this, "handleSelection", index => {
      this.focusOnButtonElement(index);
      this.props.onSelection(index);
    });
  }
  render() {
    const {
      getButtonIdFromValue,
      getPanelIdFromValue,
      numOptions,
      onSelection,
      selectedIndex
    } = this.props;
    return /*#__PURE__*/React.createElement("nav", {
      className: "slide-navigator"
      /* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */,
      onKeyDown: this.handleKeyDown,
      role: "tablist"
    }, range(numOptions).map((child, i) => /*#__PURE__*/React.createElement(SlideButton, {
      key: i,
      "aria-controls": getPanelIdFromValue(i),
      "aria-label": `slide${i}`,
      buttonRef: buttonEl => {
        this.buttonElements[i] = buttonEl;
      },
      id: getButtonIdFromValue(i),
      isSelected: i === selectedIndex,
      onClick: () => onSelection(i),
      tabIndex: i === selectedIndex ? '0' : '-1'
    })));
  }
}
export default SlideNavigator;
//# sourceMappingURL=SlideNavigator.js.map