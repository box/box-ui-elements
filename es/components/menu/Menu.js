const _excluded = ["children", "className", "isHidden", "setRef", "shouldOutlineFocus"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import omit from 'lodash/omit';
import classNames from 'classnames';
import MenuContext from './MenuContext';
import './Menu.scss';

/**
 * The selectors are used to identify the menu item that is selected. We need to eventually
 * rewrite this logic as there seem to be strong coupling between the selector and MenuItem
 * that we want to decouple. The span is here to allow Menu to recognize MenuItem even if it is
 * wrapped by a span coming from a tooltip.
 */
const MENU_ITEM_SELECTOR = '.menu-item:not([aria-disabled])';
const TOP_LEVEL_MENU_ITEM_SELECTOR = `ul:not(.submenu) > ${MENU_ITEM_SELECTOR}, ul:not(.submenu) > li > ${MENU_ITEM_SELECTOR}, ul:not(.submenu) > span > ${MENU_ITEM_SELECTOR}`;
const SUBMENU_ITEM_SELECTOR = `ul.submenu > ${MENU_ITEM_SELECTOR}, ul.submenu > li > ${MENU_ITEM_SELECTOR}, ul.submenu > span > ${MENU_ITEM_SELECTOR}`;
function stopPropagationAndPreventDefault(event) {
  event.stopPropagation();
  event.preventDefault();
}
class Menu extends React.Component {
  constructor(_props) {
    super(_props);
    _defineProperty(this, "setInitialFocusIndex", (props = this.props) => {
      const {
        initialFocusIndex,
        isHidden
      } = props;
      if (isHidden || initialFocusIndex === undefined) {
        return;
      }

      // If an initialFocusIndex was specified, attempt to use it to focus
      if (typeof initialFocusIndex === 'number') {
        // We do this after a timeout so that the menu is properly mounted before we attempt to focus it
        setTimeout(() => {
          this.setFocus(initialFocusIndex);
        }, 0);
      } else if (initialFocusIndex === null) {
        // If no initial focus index is set, focus on the menu itself so that keyboard shortcut still works after a mouse click.
        setTimeout(() => {
          if (this.menuEl) {
            this.menuEl.focus();
          }
        }, 0);
      }
    });
    _defineProperty(this, "setMenuItemEls", () => {
      const {
        isSubmenu,
        menuItemSelector
      } = this.props;
      const selector = menuItemSelector || (isSubmenu ? SUBMENU_ITEM_SELECTOR : TOP_LEVEL_MENU_ITEM_SELECTOR);
      // Keep track of all the valid menu items that were rendered (querySelector since we don't want to pass ref functions to every single child)
      this.menuItemEls = this.menuEl ? [].slice.call(this.menuEl.querySelectorAll(selector)) : [];
    });
    _defineProperty(this, "getMenuItemElFromEventTarget", target => {
      let menuItemEl = null;
      let menuIndex = -1;
      for (let i = 0; i < this.menuItemEls.length; i += 1) {
        if (this.menuItemEls[i].contains(target)) {
          menuItemEl = this.menuItemEls[i];
          menuIndex = i;
          break;
        }
      }
      return {
        menuItemEl,
        menuIndex
      };
    });
    _defineProperty(this, "setFocus", index => {
      if (!this.menuItemEls.length) {
        return;
      }
      const numMenuItems = this.menuItemEls.length;
      if (index >= numMenuItems) {
        this.focusIndex = 0;
      } else if (index < 0) {
        this.focusIndex = numMenuItems - 1;
      } else {
        this.focusIndex = index;
      }
      this.menuItemEls[this.focusIndex].focus();
    });
    _defineProperty(this, "focusFirstItem", () => {
      this.setFocus(0);
    });
    _defineProperty(this, "focusLastItem", () => {
      this.setFocus(-1);
    });
    _defineProperty(this, "focusNextItem", () => {
      this.setFocus(this.focusIndex + 1);
    });
    _defineProperty(this, "focusPreviousItem", () => {
      this.setFocus(this.focusIndex - 1);
    });
    _defineProperty(this, "fireOnCloseHandler", (isKeyboardEvent, event) => {
      const {
        onClose
      } = this.props;
      if (onClose) {
        // We need to pass the event type so we know which item to focus.
        onClose(isKeyboardEvent, event);
      }
    });
    _defineProperty(this, "handleClick", event => {
      const {
        menuItemEl
      } = event.target instanceof Node ? this.getMenuItemElFromEventTarget(event.target) : {};
      if (!menuItemEl) {
        return;
      }
      this.fireOnCloseHandler(false, event);
    });
    _defineProperty(this, "handleKeyDown", event => {
      const {
        isSubmenu,
        initialFocusIndex
      } = this.props;
      switch (event.key) {
        case 'ArrowDown':
          stopPropagationAndPreventDefault(event); // If it's first keyboard event, focus on first item.

          if (initialFocusIndex === null && !this.keyboardPressed) {
            this.focusFirstItem();
          } else {
            this.focusNextItem();
          }
          break;
        case 'ArrowUp':
          stopPropagationAndPreventDefault(event);
          this.focusPreviousItem();
          break;
        case 'ArrowLeft':
          // Close submenu when arrow-left is clicked
          if (!isSubmenu) {
            return;
          }
          stopPropagationAndPreventDefault(event);
          this.fireOnCloseHandler(true, event);
          break;
        case 'Home':
        case 'PageUp':
          stopPropagationAndPreventDefault(event);
          this.focusFirstItem();
          break;
        case 'End':
        case 'PageDown':
          stopPropagationAndPreventDefault(event);
          this.focusLastItem();
          break;
        case 'Escape':
          stopPropagationAndPreventDefault(event);
          this.fireOnCloseHandler(true, event);
          break;
        case 'Tab':
          // DO NOT PREVENT DEFAULT OR STOP PROPAGATION - This should move focus natively
          this.fireOnCloseHandler(true, event);
          break;
        case ' ':
        case 'Enter':
          stopPropagationAndPreventDefault(event);
          if (event.target instanceof HTMLElement) {
            event.target.click();
          }
          break;
        default:
          break;
      }
      this.keyboardPressed = true;
    });
    this.focusIndex = 0;
    this.menuEl = null;
    this.menuItemEls = [];
  }
  componentDidMount() {
    this.setMenuItemEls();
    this.setInitialFocusIndex();
  }
  componentDidUpdate({
    isHidden: prevIsHidden,
    children: prevChildren
  }) {
    const {
      children,
      isHidden,
      isSubmenu
    } = this.props;
    if (isSubmenu && prevIsHidden && !isHidden) {
      // If updating submenu, use the current props instead of previous props.
      this.setMenuItemEls();
      this.setInitialFocusIndex(this.props);
    }

    // update focus index and menu item elements when the number of children changes
    if (React.Children.toArray(prevChildren).length !== React.Children.toArray(children).length) {
      const focusedMenuItemEl = this.menuItemEls[this.focusIndex];
      this.setMenuItemEls();
      const {
        menuIndex
      } = this.getMenuItemElFromEventTarget(focusedMenuItemEl);
      const isFocusedElementMissing = menuIndex === -1;
      const isFocusIndexOutOfBounds = this.focusIndex >= this.menuItemEls.length;
      this.setFocus(isFocusedElementMissing && !isFocusIndexOutOfBounds ? this.focusIndex : menuIndex);
    }
  }
  render() {
    const _this$props = this.props,
      {
        children,
        className,
        isHidden,
        setRef,
        shouldOutlineFocus
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const menuProps = omit(rest, ['onClose', 'initialFocusIndex', 'isSubmenu', 'menuItemSelector']);
    menuProps.className = classNames('aria-menu', className, {
      'is-hidden': isHidden,
      'should-outline-focus': shouldOutlineFocus
    });
    menuProps.ref = ref => {
      this.menuEl = ref;
      if (setRef) {
        setRef(ref);
      }
    };
    if (menuProps.role === undefined) {
      menuProps.role = 'menu';
    }
    menuProps.tabIndex = -1;
    menuProps.onClick = this.handleClick;
    menuProps.onKeyDown = this.handleKeyDown;
    return /*#__PURE__*/React.createElement("ul", menuProps, /*#__PURE__*/React.createElement(MenuContext.Provider, {
      value: {
        closeMenu: this.fireOnCloseHandler
      }
    }, children));
  }
}
_defineProperty(Menu, "defaultProps", {
  className: '',
  isSubmenu: false,
  isHidden: false
});
export default Menu;
//# sourceMappingURL=Menu.js.map