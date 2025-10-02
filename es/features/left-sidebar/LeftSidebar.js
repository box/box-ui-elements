function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';
import { NavSidebar, NavList, NavListCollapseHeader } from '../../components/nav-sidebar';
import FooterIndicator from '../../components/footer-indicator/FooterIndicator';
import LoadingIndicatorWrapper from '../../components/loading-indicator/LoadingIndicatorWrapper';
import { bdlBoxBlue } from '../../styles/variables';
import CopyrightFooter from './CopyrightFooter';
import InstantLogin from './InstantLogin';
import LeftSidebarDropWrapper from './LeftSidebarDropWrapper';
import LeftSidebarIconWrapper from './LeftSidebarIconWrapper';
import NewItemsIndicator from './NewItemsIndicator';
import defaultNavLinkRenderer from './defaultNavLinkRenderer';
import './styles/LeftSidebar.scss';
class LeftSidebar extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "onListScroll", () => {
      this.changeIsScrollingState();
      this.throttledCheckAndChangeScrollShadows();
    });
    _defineProperty(this, "checkAndChangeScrollShadows", () => {
      if (this.elScrollableList) {
        this.setState(this.calculateOverflow(this.elScrollableList));
      }
    });
    _defineProperty(this, "changeIsScrollingState", () => {
      if (!this.state.isScrolling) {
        this.setState({
          isScrolling: true
        });
      }
      this.debouncedTurnOffScrollingState();
    });
    _defineProperty(this, "turnOffScrollingState", () => {
      this.setState({
        isScrolling: false
      });
    });
    _defineProperty(this, "debouncedTurnOffScrollingState", debounce(this.turnOffScrollingState, 100));
    _defineProperty(this, "throttledCheckAndChangeScrollShadows", throttle(this.checkAndChangeScrollShadows, 50));
    this.state = {
      isScrollableAbove: false,
      isScrollableBelow: false,
      isScrolling: false
    };
  }
  componentDidUpdate() {
    if (!this.elScrollableList) {
      return;
    }
    const overflow = this.calculateOverflow(this.elScrollableList);

    /**
     * recalculate overflow when dropdown is visible and new collabs are added
     * This will not go into an infinite loop because we check for changes in local component state
     */
    if (overflow.isScrollableAbove !== this.state.isScrollableAbove || overflow.isScrollableBelow !== this.state.isScrollableBelow) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(overflow);
    }
  }
  getIcon(iconElement, IconComponent,
  // eslint-disable-line
  customTheme = {}, selected, scaleIcon) {
    const wrapperClass = scaleIcon ? 'scaled-icon' : '';
    if (iconElement) {
      return /*#__PURE__*/React.createElement(LeftSidebarIconWrapper, {
        className: wrapperClass
      }, iconElement);
    }
    if (IconComponent) {
      return /*#__PURE__*/React.createElement(LeftSidebarIconWrapper, {
        className: wrapperClass
      }, /*#__PURE__*/React.createElement(IconComponent, {
        color: selected && customTheme.secondaryColor ? customTheme.secondaryColor : bdlBoxBlue,
        selected: selected
      }));
    }
    return null;
  }
  getNewItemBadge(newItemBadge, customTheme = {}) {
    const {
      secondaryColor
    } = customTheme;
    return newItemBadge ? /*#__PURE__*/React.createElement(NewItemsIndicator, {
      customColor: secondaryColor
    }) : null;
  }
  getNavList(headerLinkProps, leftSidebarProps, showLoadingIndicator, onToggleCollapse) {
    const {
      canReceiveDrop = false,
      className = '',
      collapsed,
      dropTargetRef,
      id,
      menuItems,
      placeholder,
      showDropZoneOnHover
    } = headerLinkProps;
    const heading = onToggleCollapse ? /*#__PURE__*/React.createElement(NavListCollapseHeader, {
      onToggleCollapse: onToggleCollapse
    }, this.getNavLink(headerLinkProps, leftSidebarProps)) : this.getNavLink(headerLinkProps, leftSidebarProps);
    const placeholderEl = menuItems && menuItems.length || showLoadingIndicator ? null : /*#__PURE__*/React.createElement("div", {
      className: "placeholder"
    }, placeholder);
    const classes = classNames('left-sidebar-list', className, {
      'is-loading-empty': showLoadingIndicator && menuItems && menuItems.length === 0,
      'is-loading': showLoadingIndicator && menuItems && menuItems.length > 0,
      'lsb-scrollable-shadow-top': this.state.isScrollableAbove,
      'lsb-scrollable-shadow-bottom': this.state.isScrollableBelow
    });
    const ulProps = onToggleCollapse ? {
      onScroll: this.onListScroll,
      ref: elScrollableList => {
        this.elScrollableList = elScrollableList;
      }
    } : {};
    const builtNavList = /*#__PURE__*/React.createElement(NavList, {
      className: classes,
      collapsed: collapsed,
      heading: heading,
      placeholder: placeholderEl,
      key: `list-${id}`,
      ulProps: ulProps
    }, menuItems && menuItems.map(props => this.getNavLink(props, leftSidebarProps)) || null);
    return canReceiveDrop ? /*#__PURE__*/React.createElement(LeftSidebarDropWrapper, {
      isDragging: leftSidebarProps.isDragging,
      dropTargetRef: dropTargetRef,
      showDropZoneOnHover: showDropZoneOnHover
    }, builtNavList) : builtNavList;
  }
  getNavLink(props, leftSidebarProps) {
    const {
      callout,
      canReceiveDrop = false,
      className = '',
      dropTargetRef,
      htmlAttributes,
      iconComponent,
      iconElement,
      id,
      message,
      navLinkRenderer,
      newItemBadge,
      onClickRemove,
      removeButtonHtmlAttributes,
      routerLink,
      routerProps,
      scaleIcon,
      selected = false,
      showTooltip,
      showDropZoneOnHover
    } = props;
    const linkClassNames = classNames('left-sidebar-link', className, {
      'is-selected': selected
    });
    const linkProps = {
      callout,
      className: linkClassNames,
      customTheme: leftSidebarProps.customTheme,
      onClickRemove,
      htmlAttributes,
      icon: this.getIcon(iconElement, iconComponent, leftSidebarProps.customTheme, selected, scaleIcon),
      isScrolling: this.state.isScrolling,
      message,
      newItemBadge: this.getNewItemBadge(newItemBadge, leftSidebarProps.customTheme),
      removeButtonHtmlAttributes,
      routerLink,
      routerProps,
      selected,
      showTooltip
    };
    const builtLink = navLinkRenderer ? navLinkRenderer(linkProps) : defaultNavLinkRenderer(linkProps);

    // Check for menu items on links so we don't double-highlight groups
    return canReceiveDrop && !props.menuItems ? /*#__PURE__*/React.createElement(LeftSidebarDropWrapper, {
      isDragging: leftSidebarProps.isDragging,
      dropTargetRef: dropTargetRef,
      key: `link-${id}`,
      showDropZoneOnHover: showDropZoneOnHover
    }, builtLink) : /*#__PURE__*/React.createElement(React.Fragment, {
      key: `link-${id}`
    }, builtLink);
  }
  calculateOverflow(elem) {
    const isScrollableAbove = elem.scrollTop > 0;
    const isScrollableBelow = elem.scrollTop < elem.scrollHeight - elem.clientHeight;
    return {
      isScrollableAbove,
      isScrollableBelow
    };
  }
  render() {
    const {
      leftSidebarProps,
      menuItems
    } = this.props;
    const className = leftSidebarProps.className || '';
    const navSidebarProps = leftSidebarProps.htmlAttributes || {};
    const instantLoginProps = leftSidebarProps.instantLoginProps || {};
    const preparedMenu = menuItems.map((props, key) => {
      if (props.menuItems) {
        if (props.onToggleCollapse) {
          const {
            collapsed,
            showLoadingIndicator
          } = props;
          return /*#__PURE__*/React.createElement(LoadingIndicatorWrapper, {
            className: "favorites-loading-wrapper",
            crawlerPosition: "top",
            isLoading: showLoadingIndicator && !collapsed,
            key: `loading-indicator-${key}`
          }, this.getNavList(props, leftSidebarProps, showLoadingIndicator, props.onToggleCollapse));
        }
        return this.getNavList(props, leftSidebarProps);
      }
      return this.getNavLink(props, leftSidebarProps);
    });
    return /*#__PURE__*/React.createElement(NavSidebar, _extends({
      className: `left-sidebar ${className}`
    }, navSidebarProps), leftSidebarProps.isInstantLoggedIn ? /*#__PURE__*/React.createElement(InstantLogin, instantLoginProps) : null, /*#__PURE__*/React.createElement("div", {
      className: "left-sidebar-container"
    }, preparedMenu), /*#__PURE__*/React.createElement(CopyrightFooter, {
      linkProps: leftSidebarProps.copyrightFooterProps
    }), leftSidebarProps.indicatorText ? /*#__PURE__*/React.createElement(FooterIndicator, {
      indicatorText: leftSidebarProps.indicatorText
    }) : null);
  }
}
_defineProperty(LeftSidebar, "defaultProps", {
  leftSidebarProps: {},
  menuItems: []
});
export default LeftSidebar;
//# sourceMappingURL=LeftSidebar.js.map