const _excluded = ["children", "className", "error", "errorTooltipPosition", "isDisabled", "tooltipTetherClassName"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import classNames from 'classnames';
import Tooltip from '../tooltip';
import './SelectButton.scss';
const SelectButton = /*#__PURE__*/React.forwardRef((_ref, ref) => {
  let {
      children,
      className = '',
      error,
      errorTooltipPosition = 'middle-right',
      isDisabled = false,
      tooltipTetherClassName
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement(Tooltip, {
    isShown: !!error,
    position: errorTooltipPosition,
    tetherElementClassName: tooltipTetherClassName,
    text: error,
    theme: "error"
  }, /*#__PURE__*/React.createElement("button", _extends({
    className: classNames(className, 'select-button', 'bdl-SelectButton', {
      'is-invalid': !!error
    }),
    disabled: isDisabled,
    ref: ref,
    type: "button"
  }, rest), children));
});
export default SelectButton;
//# sourceMappingURL=SelectButton.js.map