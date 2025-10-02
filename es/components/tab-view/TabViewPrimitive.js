function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import uniqueId from 'lodash/uniqueId';
import IconPageBack from '../../icons/general/IconPageBack';
import IconPageForward from '../../icons/general/IconPageForward';
import LinkButton from '../link/LinkButton';
import './Tabs.scss';
export const TAB_KEY = 'Tab';
export const TAB_PANEL_ROLE = 'tabpanel';
class TabViewPrimitive extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "onClickTab", tabIndex => {
      const {
        onTabFocus,
        onTabSelect
      } = this.props;
      if (onTabSelect) {
        onTabSelect(tabIndex);
      }
      onTabFocus(tabIndex);
    });
    _defineProperty(this, "getLastElementsAnchorPoint", () => {
      if (this.tabsElements.length === 0) {
        return 0;
      }
      const lastTabElement = this.tabsElements[this.tabsElements.length - 1];
      return lastTabElement.offsetLeft + lastTabElement.offsetWidth;
    });
    _defineProperty(this, "getTabsContainerOffsetLeft", () => {
      if (!this.tabsContainer) {
        return 0;
      }
      const {
        tabsContainerOffsetLeft
      } = this.state;
      let viewportOffset = parseInt(tabsContainerOffsetLeft, 10) * -1;
      viewportOffset = viewportOffset || 0;
      return viewportOffset;
    });
    _defineProperty(this, "getTabsContainerWidth", () => this.tabsContainer ? parseInt(this.tabsContainer.offsetWidth, 10) : 0);
    _defineProperty(this, "scrollToTab", tabIndex => {
      if (!this.props.isDynamic || this.tabsContainer === null || this.tabsElements.length === 0 || tabIndex < 0 || tabIndex > this.tabsElements.length - 1) {
        return;
      }
      const tabElementOfInterest = this.tabsElements[tabIndex];
      const lastElementsAnchorPoint = this.getLastElementsAnchorPoint();

      // if tabs don't overflow at all, no need to scroll
      const tabsContainerWidth = this.getTabsContainerWidth();
      if (lastElementsAnchorPoint <= tabsContainerWidth) {
        this.setState({
          tabsContainerOffsetLeft: 0
        });
        return;
      }

      // do not scroll any more if we will go past the rightmost anchor
      const newOffset = Math.min(lastElementsAnchorPoint - tabsContainerWidth, tabElementOfInterest.offsetLeft);

      // move the viewport
      const newViewportOffset = -1 * newOffset;
      this.setState({
        tabsContainerOffsetLeft: newViewportOffset
      });
    });
    _defineProperty(this, "isRightArrowVisible", () => {
      if (!this.tabsContainer) {
        return false;
      }
      const tabsContainerOffsetLeft = this.getTabsContainerOffsetLeft();
      const lastElementsAnchorPoint = this.getLastElementsAnchorPoint();
      const tabsContainerWidth = this.getTabsContainerWidth();
      return tabsContainerOffsetLeft + tabsContainerWidth < lastElementsAnchorPoint;
    });
    _defineProperty(this, "isLeftArrowVisible", () => {
      const {
        focusedIndex,
        selectedIndex
      } = this.props;
      const tabsContainerOffsetLeft = this.getTabsContainerOffsetLeft();
      return tabsContainerOffsetLeft !== 0 && (selectedIndex !== 0 || focusedIndex !== 0);
    });
    _defineProperty(this, "focusOnTabElement", focusedIndex => {
      if (focusedIndex + 1 > this.tabsElements.length || focusedIndex < 0) {
        return;
      }
      this.tabsElements[focusedIndex].focus();
    });
    _defineProperty(this, "tabsElements", []);
    _defineProperty(this, "tabsContainer", null);
    _defineProperty(this, "handleKeyDown", event => {
      const {
        children,
        focusedIndex,
        onTabFocus,
        resetFocusedTab,
        resetActiveTab
      } = this.props;
      const childrenCount = React.Children.count(children);
      switch (event.key) {
        case 'ArrowRight':
          onTabFocus(this.calculateNextIndex(focusedIndex, childrenCount));
          event.preventDefault();
          event.stopPropagation();
          break;
        case 'ArrowLeft':
          onTabFocus(this.calculatePrevIndex(focusedIndex, childrenCount));
          event.preventDefault();
          event.stopPropagation();
          break;
        case 'Escape':
          resetActiveTab();
          break;
        case TAB_KEY:
          resetFocusedTab();
          break;
        default:
          break;
      }
    });
    _defineProperty(this, "calculateNextIndex", (currentIndex, childrenCount) => (currentIndex + 1) % childrenCount);
    _defineProperty(this, "calculatePrevIndex", (currentIndex, childrenCount) => (currentIndex - 1 + childrenCount) % childrenCount);
    this.tabviewID = uniqueId('tabview');
    this.state = {
      tabsContainerOffsetLeft: 0
    };
  }
  componentDidMount() {
    const {
      isDynamic,
      focusedIndex
    } = this.props;
    if (isDynamic) {
      // set initial tabsContainerOffsetLeft state after first mounting
      this.scrollToTab(focusedIndex);
    }
  }
  componentDidUpdate(prevProps) {
    const {
      focusedIndex: prevFocusedIndex,
      selectedIndex: prevSelectedIndex
    } = prevProps;
    const {
      focusedIndex,
      selectedIndex
    } = this.props;
    if (this.props.isDynamic) {
      if (prevFocusedIndex !== focusedIndex) {
        this.scrollToTab(focusedIndex);
      }

      // update tabsContainerOffsetLeft state when receiving a new prop
      if (prevSelectedIndex !== selectedIndex) {
        this.scrollToTab(selectedIndex);
      }
    }
    if (prevFocusedIndex !== focusedIndex) {
      // have to focus after render otherwise, the focus will be lost
      this.focusOnTabElement(focusedIndex);
    }
  }
  /* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
  renderTabs() {
    const {
      children,
      selectedIndex,
      isDynamic
    } = this.props;
    const {
      tabsContainerOffsetLeft
    } = this.state;
    const style = isDynamic ? {
      left: `${tabsContainerOffsetLeft}px`
    } : {};
    return /*#__PURE__*/React.createElement("div", {
      className: "tabs",
      role: "tablist",
      tabIndex: "0",
      ref: ref => {
        this.tabsContainer = ref;
      },
      style: style,
      onKeyDown: !isDynamic ? this.handleKeyDown : null
    }, React.Children.map(children, (tab, i) => {
      const buttonProps = omit(tab.props, ['className', 'children', 'title']);
      const classes = classNames('btn-plain', 'tab', i === selectedIndex ? 'is-selected' : '');
      const ariaControls = `${this.tabviewID}-panel-${i + 1}`;
      const ariaSelected = i === selectedIndex;
      const id = `${this.tabviewID}-tab-${i + 1}`;
      const {
        href,
        component,
        refProp
      } = tab.props;
      const tabIndex = i === selectedIndex ? '0' : '-1';
      if (href) {
        return /*#__PURE__*/React.createElement(LinkButton, {
          className: classes,
          "aria-controls": ariaControls,
          "aria-selected": ariaSelected,
          id: id,
          role: "tab",
          href: href,
          linkRef: ref => {
            this.tabsElements[i] = ref;
          },
          refProp: refProp,
          tabIndex: tabIndex,
          to: href,
          component: component
        }, /*#__PURE__*/React.createElement("div", {
          className: "tab-title"
        }, tab.props.title), /*#__PURE__*/React.createElement("div", {
          className: "tab-underline"
        }));
      }
      return /*#__PURE__*/React.createElement("button", _extends({
        className: classes,
        "aria-controls": ariaControls,
        "aria-selected": ariaSelected,
        onClick: () => this.onClickTab(i),
        role: "tab",
        type: "button",
        id: id,
        ref: ref => {
          this.tabsElements[i] = ref;
        },
        tabIndex: tabIndex
      }, buttonProps), /*#__PURE__*/React.createElement("div", {
        className: "tab-title"
      }, tab.props.title), /*#__PURE__*/React.createElement("div", {
        className: "tab-underline"
      }));
    }));
  }

  /* eslint-enable jsx-a11y/no-noninteractive-element-to-interactive-role */
  renderDynamicTabs() {
    const {
      onTabFocus,
      focusedIndex
    } = this.props;
    return (
      /*#__PURE__*/
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      React.createElement("div", {
        className: "dynamic-tabs-bar",
        onKeyDown: this.handleKeyDown
      }, /*#__PURE__*/React.createElement("button", {
        className: classNames('btn-plain svg-container left-arrow', {
          hidden: !this.isLeftArrowVisible()
        }),
        onClick: () => onTabFocus(focusedIndex - 1),
        type: "button",
        tabIndex: "-1"
      }, /*#__PURE__*/React.createElement(IconPageBack, null)), /*#__PURE__*/React.createElement("div", {
        className: "dynamic-tabs-wrapper"
      }, this.renderTabs()), /*#__PURE__*/React.createElement("button", {
        className: classNames('btn-plain svg-container right-arrow', {
          hidden: !this.isRightArrowVisible()
        }),
        onClick: () => onTabFocus(focusedIndex + 1),
        type: "button",
        tabIndex: "-1"
      }, /*#__PURE__*/React.createElement(IconPageForward, null)))
    );
  }
  render() {
    const {
      children,
      className = '',
      isDynamic = false,
      onKeyUp,
      selectedIndex
    } = this.props;
    return (
      /*#__PURE__*/
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      React.createElement("div", {
        className: `tab-view ${classNames(className, {
          'dynamic-tabs': isDynamic
        })}`,
        onKeyUp: onKeyUp
      }, !isDynamic ? this.renderTabs() : this.renderDynamicTabs(), /*#__PURE__*/React.createElement("div", {
        className: "tab-panels"
      }, React.Children.toArray(children).map((child, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        id: `${this.tabviewID}-panel-${i}`,
        "aria-labelledby": `${this.tabviewID}-tab-${i + 1}`,
        "aria-hidden": selectedIndex !== i,
        className: `tab-panel ${i === selectedIndex ? 'is-selected' : ''}`,
        role: TAB_PANEL_ROLE
      }, child.props.children))))
    );
  }
}
export default TabViewPrimitive;
//# sourceMappingURL=TabViewPrimitive.js.map