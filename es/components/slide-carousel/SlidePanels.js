function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
class SlidePanels extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "focusOnContainerElement", () => {
      if (this.containerEl) {
        this.containerEl.focus();
      }
    });
    _defineProperty(this, "handleKeyDown", event => {
      const {
        children,
        selectedIndex
      } = this.props;
      const numOptions = React.Children.count(children);
      let nextIndex = null;
      switch (event.key) {
        case 'ArrowRight':
          nextIndex = (selectedIndex + 1) % numOptions;
          break;
        case 'ArrowLeft':
          nextIndex = (selectedIndex - 1 + numOptions) % numOptions;
          break;
        default:
          break;
      }
      if (nextIndex !== null) {
        this.handleSelection(nextIndex);
        event.preventDefault();
        event.stopPropagation();
      }
    });
    _defineProperty(this, "handleSelection", index => {
      const {
        onSelection
      } = this.props;
      this.focusOnContainerElement();
      if (onSelection) {
        onSelection(index);
      }
    });
  }
  render() {
    const {
      getPanelIdFromValue,
      children,
      selectedIndex,
      style
    } = this.props;
    return (
      /*#__PURE__*/
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      React.createElement("div", {
        ref: containerEl => {
          this.containerEl = containerEl;
        },
        className: "slide-panels",
        onKeyDown: this.handleKeyDown,
        style: style
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        ,
        tabIndex: "0"
      }, React.Children.map(children, (child, i) => {
        const isSelected = i === selectedIndex;
        return /*#__PURE__*/React.createElement("div", {
          key: i,
          "aria-hidden": !isSelected,
          className: "slide-panel",
          id: getPanelIdFromValue(i),
          role: "tabpanel"
        }, child);
      }))
    );
  }
}
SlidePanels.displayName = 'SlidePanels';
export default SlidePanels;
//# sourceMappingURL=SlidePanels.js.map