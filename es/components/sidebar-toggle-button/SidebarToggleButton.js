const _excluded = ["className", "direction", "intl", "isOpen", "onClick"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import IconHide from '../../icons/general/IconHide';
import IconShow from '../../icons/general/IconShow';
import PlainButton from '../plain-button';
import Tooltip from '../tooltip';
import messages from '../../elements/common/messages';
import './SidebarToggleButton.scss';
const DIRECTION_LEFT = 'left';
const DIRECTION_RIGHT = 'right';
const SidebarToggleButton = _ref => {
  let {
      className = '',
      direction = DIRECTION_RIGHT,
      intl,
      isOpen,
      onClick
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const isCollapsed = !isOpen ? 'collapsed' : '';
  const intlMessage = isOpen ? messages.sidebarHide : messages.sidebarShow;
  const intlText = intl.formatMessage(intlMessage);
  const classes = classNames(className, 'bdl-SidebarToggleButton', {
    'bdl-is-collapsed': isCollapsed
  });
  const tooltipPosition = direction === DIRECTION_LEFT ? 'middle-right' : 'middle-left';
  const renderButton = () => {
    if (direction === DIRECTION_LEFT) {
      return isOpen ? /*#__PURE__*/React.createElement(IconShow, {
        height: 16,
        width: 16
      }) : /*#__PURE__*/React.createElement(IconHide, {
        height: 16,
        width: 16
      });
    }
    return isOpen ? /*#__PURE__*/React.createElement(IconHide, {
      height: 16,
      width: 16
    }) : /*#__PURE__*/React.createElement(IconShow, {
      height: 16,
      width: 16
    });
  };
  return /*#__PURE__*/React.createElement(Tooltip, {
    position: tooltipPosition,
    text: intlText
  }, /*#__PURE__*/React.createElement(PlainButton, _extends({
    "aria-label": intlText,
    className: classes,
    onClick: onClick,
    type: "button"
  }, rest), renderButton()));
};
export default injectIntl(SidebarToggleButton);
//# sourceMappingURL=SidebarToggleButton.js.map