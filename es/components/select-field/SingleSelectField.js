const _excluded = ["intl", "isDisabled", "selectedValue", "placeholder", "shouldShowClearOption", "options"];
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import omit from 'lodash/omit';
import { injectIntl } from 'react-intl';
import BaseSelectField from './BaseSelectField';
import CLEAR from './constants';
import messages from './messages';
class SingleSelectField extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "handleChange", selectedOptions => {
      const {
        onChange,
        fieldType
      } = this.props;

      // There should only ever be 1 selected item
      if (onChange && selectedOptions.length === 1) {
        onChange(selectedOptions[0], fieldType);
      } else if (selectedOptions.length === 0) {
        onChange({
          value: null
        });
      }
    });
  }
  render() {
    const _this$props = this.props,
      {
        intl,
        isDisabled,
        selectedValue,
        placeholder,
        shouldShowClearOption,
        options
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);

    // @TODO: Invariant testing
    // 1) selectedValue is required to be contained in the options
    // 2) # of options should be non-zero

    // Make sure to omit passed props that could be interpreted incorrectly by the base component
    const selectFieldProps = omit(rest, ['defaultValue', 'multiple', 'onChange']);

    // If selectedValue is passed in, map it to the multi selected equivalent
    const isFieldSelected = selectedValue !== null;
    selectFieldProps.selectedValues = !isFieldSelected ? [] : [selectedValue];
    const optionsWithClearOption = shouldShowClearOption ? [{
      value: CLEAR,
      displayText: intl.formatMessage(messages.clearAll)
    }, ...options] : options;
    return /*#__PURE__*/React.createElement(BaseSelectField, _extends({
      className: !isFieldSelected && placeholder ? 'placeholder' : '',
      isDisabled: isDisabled,
      onChange: this.handleChange,
      placeholder: placeholder,
      options: optionsWithClearOption,
      shouldShowClearOption: shouldShowClearOption
    }, selectFieldProps));
  }
}
export { SingleSelectField as SingleSelectFieldBase };
export default injectIntl(SingleSelectField);
//# sourceMappingURL=SingleSelectField.js.map