const _excluded = ["children", "className", "isDisabled", "isSelectItem", "isSelected", "showRadar"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import RadarAnimation from '../radar';
import './MenuItem.scss';
class MenuItem extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "onClickHandler", event => {
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
    });
  }
  render() {
    const _this$props = this.props,
      {
        children,
        className,
        isDisabled,
        isSelectItem,
        isSelected,
        showRadar
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const menuItemProps = omit(rest, ['role', 'tabIndex', 'onClick']);
    menuItemProps.className = classNames('menu-item', className, {
      'is-select-item': isSelectItem,
      'is-selected': isSelected
    });
    menuItemProps.role = isSelectItem ? 'menuitemradio' : 'menuitem';
    menuItemProps.tabIndex = -1;
    menuItemProps.onClick = this.onClickHandler;
    if (isSelectItem) {
      menuItemProps['aria-checked'] = isSelected;
    }
    if (isDisabled) {
      menuItemProps['aria-disabled'] = 'true';
    }
    let menuItem = /*#__PURE__*/React.createElement("li", menuItemProps, children);
    if (showRadar) {
      menuItem = /*#__PURE__*/React.createElement(RadarAnimation, {
        targetWrapperClassName: "bdl-MenuItem-radarTarget"
      }, menuItem);
    }
    return menuItem;
  }
}
export default MenuItem;
//# sourceMappingURL=MenuItem.js.map