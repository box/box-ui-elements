const _excluded = ["className", "description", "fieldLabel", "hideLabel", "id", "inputClassName", "isChecked", "isDisabled", "label", "name", "onFocus", "onChange", "subsection", "tooltip"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import classNames from 'classnames';
import CheckboxTooltip from './CheckboxTooltip';
import './Checkbox.scss';
const Checkbox = _ref => {
  let {
      className = '',
      description,
      fieldLabel,
      hideLabel,
      id,
      inputClassName,
      isChecked,
      isDisabled,
      label,
      name,
      onFocus,
      onChange,
      subsection,
      tooltip
      // @TODO: eventually remove `rest` in favor of explicit props
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const generatedID = React.useRef(uniqueId('checkbox')).current;
  // use passed-in ID from props; otherwise generate one
  const inputID = id || generatedID;
  const checkboxAndLabel = /*#__PURE__*/React.createElement("span", {
    className: "checkbox-label"
  }, /*#__PURE__*/React.createElement("input", _extends({
    "aria-describedby": description ? `description_${inputID}` : '',
    checked: isChecked,
    className: inputClassName,
    disabled: isDisabled,
    id: inputID,
    name: name,
    onFocus: onFocus,
    onChange: onChange,
    type: "checkbox"
  }, rest)), /*#__PURE__*/React.createElement("span", {
    className: "checkbox-pointer-target"
  }), /*#__PURE__*/React.createElement("span", {
    className: classNames('bdl-Checkbox-labelTooltipWrapper', {
      'accessibility-hidden': hideLabel
    })
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputID
  }, label), tooltip && /*#__PURE__*/React.createElement(CheckboxTooltip, {
    tooltip: tooltip
  })));
  return /*#__PURE__*/React.createElement("div", {
    className: classNames('checkbox-container', className, {
      'is-disabled bdl-is-disabled': isDisabled
    })
  }, fieldLabel && /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, fieldLabel), checkboxAndLabel, description ? /*#__PURE__*/React.createElement("div", {
    id: `description_${inputID}`,
    className: "checkbox-description"
  }, description) : null, subsection ? /*#__PURE__*/React.createElement("div", {
    className: "checkbox-subsection"
  }, subsection) : null);
};
export default Checkbox;
//# sourceMappingURL=Checkbox.js.map