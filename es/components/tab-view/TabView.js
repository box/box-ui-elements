function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import TabViewPrimitive, { TAB_KEY, TAB_PANEL_ROLE } from './TabViewPrimitive';
class TabView extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "getActiveDocElement", () => document.activeElement);
    _defineProperty(this, "resetActiveTab", () => {
      this.setState({
        focusedIndex: this.props.defaultSelectedIndex,
        selectedIndex: this.props.defaultSelectedIndex
      });
    });
    _defineProperty(this, "resetFocusedTab", () => {
      this.setState({
        focusedIndex: this.state.selectedIndex
      });
    });
    _defineProperty(this, "handleOnTabSelect", selectedIndex => this.setState({
      selectedIndex
    }, () => {
      const {
        onTabSelect
      } = this.props;
      if (onTabSelect) {
        onTabSelect(this.state.selectedIndex);
      }
    }));
    _defineProperty(this, "handleOnTabFocus", index => this.setState({
      focusedIndex: index
    }));
    // By default the outline is set to none when tabpanel is focused. This is so that
    // when clicking into it, it doesn't outline it.
    // However, for accessibility, when tabbing into and out of the tabpanel, the focus
    // is pretty important to show the user what is being focused. By adding this class,
    // we can specify an outline for the focus pseudo state.
    _defineProperty(this, "handleKeyUp", event => {
      const activeElement = this.getActiveDocElement();
      const isTabPanelFocused = activeElement && activeElement.getAttribute('role') === TAB_PANEL_ROLE;
      const isTabPanelFocusedWithTabKey = isTabPanelFocused && event.key === TAB_KEY;
      if (isTabPanelFocusedWithTabKey) {
        this.setState({
          showOutline: true
        });
      } else if (!isTabPanelFocused && this.state.showOutline) {
        this.setState({
          showOutline: false
        });
      }
    });
    this.state = {
      focusedIndex: props.defaultSelectedIndex,
      showOutline: false,
      selectedIndex: props.defaultSelectedIndex
    };
  }
  componentDidUpdate(prevProps) {
    const {
      defaultSelectedIndex
    } = this.props;
    if (prevProps.defaultSelectedIndex !== defaultSelectedIndex) {
      this.resetActiveTab();
    }
  }
  render() {
    const {
      children,
      className,
      isDynamic
    } = this.props;
    const {
      focusedIndex,
      selectedIndex,
      showOutline
    } = this.state;
    return /*#__PURE__*/React.createElement(TabViewPrimitive, {
      className: classNames(className, {
        'show-outline': showOutline
      }),
      focusedIndex: focusedIndex,
      isDynamic: isDynamic,
      onKeyUp: this.handleKeyUp,
      onTabFocus: this.handleOnTabFocus,
      onTabSelect: this.handleOnTabSelect,
      resetActiveTab: this.resetActiveTab,
      resetFocusedTab: this.resetFocusedTab,
      selectedIndex: selectedIndex
    }, children);
  }
}
_defineProperty(TabView, "defaultProps", {
  defaultSelectedIndex: 0,
  isDynamic: false
});
export default TabView;
//# sourceMappingURL=TabView.js.map