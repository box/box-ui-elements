const _excluded = ["children", "className", "isDisabled"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import debounce from 'lodash/debounce';
import './SubmenuItem.scss';
import Arrow16 from '../../icon/fill/Arrow16';
const SUBMENU_LEFT_ALIGNED_CLASS = 'is-left-aligned';
const SUBMENU_BOTTOM_ALIGNED_CLASS = 'is-bottom-aligned';
const SUBMENU_RIGHT_BOTTOM_ALIGNED_CLASS = 'is-right-bottom-aligned';
/**
 * A menu-item component which triggers open a submenu
 *
 * @NOTE: Nested submenus are NOT currently supported, switching
 * focus with arrow keys in the subsubmenu is not working properly.
 */
class SubmenuItem extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      isSubmenuOpen: false,
      submenuFocusIndex: null
    });
    _defineProperty(this, "getMenuAlignmentClasses", () => {
      if (!this.submenuTriggerEl || !this.submenuEl) {
        return {};
      }
      const {
        rightBoundaryElement,
        bottomBoundaryElement
      } = this.props;
      const submenuElBounding = this.submenuEl.getBoundingClientRect();
      const submenuTriggerElBounding = this.submenuTriggerEl.getBoundingClientRect();
      const rightBoundaryElementBounding = rightBoundaryElement ? rightBoundaryElement.getBoundingClientRect() : {
        right: window.innerWidth
      };
      const bottomBoundaryElementBounding = bottomBoundaryElement ? bottomBoundaryElement.getBoundingClientRect() : {
        bottom: window.innerHeight
      };
      const isLeftAligned = submenuTriggerElBounding.right + submenuElBounding.width > rightBoundaryElementBounding.right;
      const isBottomAligned = submenuTriggerElBounding.top + submenuElBounding.height > bottomBoundaryElementBounding.bottom;
      const isRightBottomAligned = submenuTriggerElBounding.bottom + submenuElBounding.height > bottomBoundaryElementBounding.bottom;
      return {
        [SUBMENU_LEFT_ALIGNED_CLASS]: isLeftAligned,
        [SUBMENU_BOTTOM_ALIGNED_CLASS]: isBottomAligned,
        [SUBMENU_RIGHT_BOTTOM_ALIGNED_CLASS]: isRightBottomAligned // Used only in medium-screen viewport sizes
      };
    });
    _defineProperty(this, "handleMenuItemClick", event => {
      const {
        isDisabled,
        onClick
      } = this.props;

      // If aria-disabled is passed as a prop, we should ignore clicks on this menu item
      if (isDisabled) {
        event.stopPropagation();
        event.preventDefault();
        return;
      }
      if (onClick) {
        onClick(event);
      }

      // If event target is triggering submenu element, do not propagate to close menu
      if (this.submenuEl && !this.submenuEl.contains(event.target)) {
        event.stopPropagation();
        event.preventDefault();
      }
    });
    _defineProperty(this, "handleKeyDown", event => {
      switch (event.key) {
        case ' ':
        case 'Enter':
        case 'ArrowRight':
          event.stopPropagation();
          event.preventDefault();
          this.openSubmenuAndFocus();
          break;
        default:
          break;
      }
    });
    _defineProperty(this, "closeSubmenu", debounce(() => {
      this.setState({
        isSubmenuOpen: false
      });
    }, 50));
    _defineProperty(this, "closeSubmenuAndFocusTrigger", isKeyboardEvent => {
      this.closeSubmenu();
      if (this.submenuTriggerEl && isKeyboardEvent) {
        this.submenuTriggerEl.focus();
      }
    });
    _defineProperty(this, "openSubmenu", () => {
      this.closeSubmenu.cancel();
      const {
        onOpen
      } = this.props;
      if (onOpen) {
        onOpen();
      }
      this.setState({
        isSubmenuOpen: true,
        submenuFocusIndex: null
      });
    });
    _defineProperty(this, "openSubmenuAndFocus", () => {
      const {
        onOpen
      } = this.props;
      if (onOpen) {
        onOpen();
      }
      this.setState({
        isSubmenuOpen: true,
        submenuFocusIndex: 0
      });
    });
  }
  render() {
    const _this$props = this.props,
      {
        children,
        className,
        isDisabled
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const {
      isSubmenuOpen,
      submenuFocusIndex
    } = this.state;
    const elements = React.Children.toArray(children);
    const submenuTriggerContent = elements[0];
    const submenu = elements[1];
    if (elements.length !== 2 || !submenuTriggerContent || !submenu) {
      throw new Error('SubmenuItem must have exactly two children, a trigger component and a <Menu>');
    }
    const chevron = /*#__PURE__*/React.createElement(Arrow16, {
      className: "menu-item-arrow",
      width: 12,
      height: 12
    });
    const menuItemProps = _objectSpread(_objectSpread({}, omit(rest, ['bottomBoundaryElement', 'onClick', 'onOpen', 'rightBoundaryElement', 'role', 'tabIndex'])), {}, {
      'aria-disabled': isDisabled ? 'true' : undefined,
      'aria-expanded': isSubmenuOpen ? 'true' : 'false',
      'aria-haspopup': 'true',
      className: classNames('menu-item', 'submenu-target', className),
      onClick: this.handleMenuItemClick,
      onMouseLeave: this.closeSubmenu,
      onMouseEnter: this.openSubmenu,
      onKeyDown: this.handleKeyDown,
      ref: ref => {
        this.submenuTriggerEl = ref;
      },
      role: 'menuitem',
      tabIndex: -1
    });
    const submenuProps = {
      className: classNames(submenu.props.className, 'submenu', this.getMenuAlignmentClasses()),
      initialFocusIndex: submenuFocusIndex,
      // Hide the menu instead of unmounting it. Otherwise onMouseLeave won't work.
      isHidden: !isSubmenuOpen,
      isSubmenu: true,
      onClose: this.closeSubmenuAndFocusTrigger,
      setRef: ref => {
        this.submenuEl = ref;
      }
    };
    return /*#__PURE__*/React.createElement("li", menuItemProps, submenuTriggerContent, chevron, /*#__PURE__*/React.cloneElement(submenu, submenuProps));
  }
}
export default SubmenuItem;
//# sourceMappingURL=SubmenuItem.js.map