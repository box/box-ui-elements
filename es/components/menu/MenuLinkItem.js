const _excluded = ["children", "isSelected", "isSelectItem"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
const MenuLinkItem = _ref => {
  let {
      children,
      isSelected = false,
      isSelectItem = false
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const linkEl = React.Children.only(children);
  const listItemProps = omit(rest, ['role', 'tabIndex']);
  listItemProps.role = 'none';
  const linkProps = {
    className: classNames('menu-item', linkEl ? linkEl.props.className : '', {
      'is-select-item': isSelectItem,
      'is-selected': isSelected
    }),
    role: isSelectItem ? 'menuitemradio' : 'menuitem',
    tabIndex: -1
  };
  if (isSelectItem) {
    linkProps['aria-checked'] = isSelected;
  }
  return /*#__PURE__*/React.createElement("li", listItemProps, /*#__PURE__*/React.cloneElement(linkEl, linkProps));
};
export default MenuLinkItem;
//# sourceMappingURL=MenuLinkItem.js.map