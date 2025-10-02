const _excluded = ["field", "form", "multiple"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import getProp from 'lodash/get';
import SingleSelectPrimitive from './SingleSelectField';
import MultiSelectPrimitive from './MultiSelectField';
function createFakeSyntheticEvent(name, value) {
  return {
    currentTarget: {
      name,
      value
    },
    target: {
      name,
      value
    }
  };
}
function onSelect(name, onChange, options) {
  const value = Array.isArray(options) ? options.map(option => option.value) : options.value;
  onChange(createFakeSyntheticEvent(name, value));
}
const SelectField = _ref => {
  let {
      field,
      form,
      multiple
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  const {
    onChange,
    name,
    value
  } = field;
  const {
    errors,
    touched
  } = form;
  const isTouched = getProp(touched, name);
  const error = isTouched ? getProp(errors, name) : null;
  if (multiple) {
    return /*#__PURE__*/React.createElement(MultiSelectPrimitive, _extends({}, field, rest, {
      error: error,
      onChange: options => onSelect(name, onChange, options),
      options: rest.options,
      selectedValues: value || []
    }));
  }
  return /*#__PURE__*/React.createElement(SingleSelectPrimitive, _extends({}, field, rest, {
    error: error,
    onChange: options => onSelect(name, onChange, options),
    options: rest.options,
    selectedValue: value || null
  }));
};
export { onSelect };
export default SelectField;
//# sourceMappingURL=SelectField.js.map