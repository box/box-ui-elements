const _excluded = ["className", "children", "isDisabled", "dropdownProps", "menuProps", "intl"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classnames from 'classnames';
import { injectIntl } from 'react-intl';
import messages from './messages';
import IconEllipsis from '../../icons/general/IconEllipsis';
import { ButtonType } from '../button';
import PlainButton from '../plain-button';
// @ts-ignore TODO: migrate DropdownMenu to typescript
import DropdownMenu from '../dropdown-menu';
import { Menu } from '../menu';
import { bdlGray50 } from '../../styles/variables';
import './Media.scss';
const MediaMenu = _ref => {
  let {
      className,
      children,
      isDisabled = false,
      dropdownProps = {},
      menuProps = {},
      intl
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement(DropdownMenu, _extends({
    constrainToScrollParent: true,
    isRightAligned: true,
    targetWrapperClassName: "bdl-Media-menu-target"
  }, dropdownProps), /*#__PURE__*/React.createElement(PlainButton, _extends({
    "aria-label": intl.formatMessage(messages.menuButtonArialLabel),
    className: classnames('bdl-Media-menu', className),
    isDisabled: isDisabled,
    type: ButtonType.BUTTON
  }, rest), /*#__PURE__*/React.createElement(IconEllipsis, {
    color: bdlGray50,
    height: 16,
    width: 16
  })), /*#__PURE__*/React.createElement(Menu, menuProps, children));
};
export default injectIntl(MediaMenu);
//# sourceMappingURL=MediaMenu.js.map