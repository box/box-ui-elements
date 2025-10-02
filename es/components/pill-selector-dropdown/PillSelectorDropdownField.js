function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import getProp from 'lodash/get';
import noop from 'lodash/noop';
import PillSelectorDropdown from './PillSelectorDropdown';
import defaultDropdownRenderer from './defaultDropdownRenderer';
import defaultDropdownFilter from './filters/defaultDropdownFilter';
import defaultInputParser from './defaultInputParser';
class PillSelectorDropdownField extends React.PureComponent {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      inputText: ''
    });
    _defineProperty(this, "handleBlur", event => {
      const {
        field
      } = this.props;
      const {
        name,
        onBlur
      } = field;
      // Sets touched in formik for the pill selector field.
      // Event may or may not be available at this time.
      onBlur(event || this.createFakeEventTarget(name));
    });
    _defineProperty(this, "handleInput", (text, event) => {
      const {
        onInput
      } = this.props;
      this.setState({
        inputText: text
      });
      onInput(text, event);
      if (text === '') {
        this.handleBlur(event);
      }
    });
    _defineProperty(this, "handleSelect", options => {
      const {
        field
      } = this.props;
      const {
        name,
        onChange,
        value = []
      } = field;
      const filteredOptions = options.filter(option => this.isValidOption(option));
      onChange(this.createFakeEventTarget(name, [...value, ...filteredOptions]));
    });
    _defineProperty(this, "handleRemove", (option, index) => {
      const {
        field
      } = this.props;
      const {
        name,
        onChange,
        value = []
      } = field;
      const options = value.slice();
      options.splice(index, 1);
      onChange(this.createFakeEventTarget(name, options));
    });
    _defineProperty(this, "handleParseItems", inputValue => {
      const {
        field,
        inputParser,
        options
      } = this.props;
      const {
        value: selectedOptions = []
      } = field;
      return inputParser(inputValue, options, selectedOptions);
    });
  }
  isValidOption({
    displayText
  }) {
    return !!displayText.trim();
  }
  createFakeEventTarget(name, value) {
    // Returns a dummy EventTarget like object that formik understands how to read
    return {
      target: {
        name,
        value
      }
    };
  }
  render() {
    const {
      inputText
    } = this.state;
    const {
      className,
      dropdownFilter,
      dropdownRenderer,
      dropdownScrollBoundarySelector,
      field,
      form,
      isCustomInputAllowed,
      isDisabled,
      label,
      options,
      placeholder,
      shouldClearUnmatchedInput,
      validator
    } = this.props;
    const {
      name,
      value = []
    } = field;
    const {
      errors,
      touched
    } = form;
    const isTouched = getProp(touched, name);
    const error = isTouched ? getProp(errors, name) : null;
    const filteredOptions = dropdownFilter(options, value, inputText);
    const inputProps = {
      name
    }; // so that events generated have event.target.name

    return /*#__PURE__*/React.createElement(PillSelectorDropdown, {
      allowCustomPills: isCustomInputAllowed,
      allowInvalidPills: true,
      className: className,
      disabled: isDisabled,
      dropdownScrollBoundarySelector: dropdownScrollBoundarySelector,
      inputProps: inputProps,
      label: label,
      error: error,
      onBlur: this.handleBlur,
      onInput: this.handleInput,
      onRemove: this.handleRemove,
      onSelect: this.handleSelect,
      parseItems: this.handleParseItems,
      placeholder: placeholder,
      selectedOptions: value,
      selectorOptions: filteredOptions,
      shouldClearUnmatchedInput: shouldClearUnmatchedInput,
      shouldSetActiveItemOnOpen: true,
      validator: validator
    }, dropdownRenderer(filteredOptions));
  }
}
_defineProperty(PillSelectorDropdownField, "defaultProps", {
  dropdownFilter: defaultDropdownFilter,
  dropdownRenderer: defaultDropdownRenderer,
  inputParser: defaultInputParser,
  isCustomInputAllowed: true,
  isDisabled: false,
  onInput: noop,
  options: [],
  shouldClearUnmatchedInput: false
});
export default PillSelectorDropdownField;
//# sourceMappingURL=PillSelectorDropdownField.js.map