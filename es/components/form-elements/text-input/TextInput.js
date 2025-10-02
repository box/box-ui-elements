function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import TextInputCore from '../../text-input';
import * as messages from '../input-messages';
import FormInput from '../form/FormInput';
class TextInput extends React.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "onChange", ({
      currentTarget
    }) => {
      const {
        value
      } = currentTarget;
      if (this.state.error) {
        this.setState({
          value
        }, this.checkValidity);
      } else {
        this.setState({
          value
        });
      }
    });
    _defineProperty(this, "onValidityStateUpdateHandler", error => {
      if (error.valid !== undefined) {
        this.setErrorFromValidityState(error);
      } else {
        this.setState({
          error
        });
      }
    });
    // Updates component value and validity state
    _defineProperty(this, "checkValidity", () => {
      const {
        isRequired,
        validation
      } = this.props;
      const {
        input
      } = this;
      if (!input) {
        return;
      }
      if (validation && (isRequired || input.value.trim().length)) {
        const error = validation(input.value);
        this.setState({
          error,
          value: input.value
        });
        if (error) {
          input.setCustomValidity(error.code);
        } else {
          input.setCustomValidity('');
        }
      } else {
        this.setErrorFromValidityState(input.validity);
      }
    });
    this.state = {
      error: null,
      value: props.value
    };
  }
  componentDidUpdate(prevProps) {
    // If a new value is passed by prop, set it
    if (prevProps.value !== this.props.value) {
      this.setState({
        value: this.props.value
      });
    }
  }
  setErrorFromValidityState(validityState) {
    const {
      badInput,
      customError,
      patternMismatch,
      tooLong,
      tooShort,
      typeMismatch,
      valid,
      valueMissing
    } = validityState;
    const {
      isRequired,
      minLength,
      maxLength,
      type,
      validation
    } = this.props;
    const {
      value
    } = this.state;
    let error;
    if (valid) {
      error = null;
    } else if (badInput) {
      error = messages.badInput();
    } else if (patternMismatch) {
      error = messages.patternMismatch();
    } else if (tooShort && typeof minLength !== 'undefined') {
      error = messages.tooShort(minLength);
    } else if (tooLong && typeof maxLength !== 'undefined') {
      error = messages.tooLong(maxLength);
    } else if (typeMismatch && type === 'email') {
      error = messages.typeMismatchEmail();
    } else if (typeMismatch && type === 'url') {
      error = messages.typeMismatchUrl();
    } else if (valueMissing) {
      error = messages.valueMissing();
    } else if (customError && (isRequired || value.trim().length) && validation) {
      error = validation(value);
    }
    this.setState({
      error
    });
  }
  render() {
    const {
      autoFocus,
      className = '',
      isDisabled,
      isRequired,
      label,
      maxLength,
      minLength,
      name,
      onFocus,
      pattern,
      placeholder,
      type,
      isReadOnly,
      isLoading,
      labelTooltip,
      hideLabel
    } = this.props;
    const {
      error,
      value
    } = this.state;
    return /*#__PURE__*/React.createElement("div", {
      className: className
    }, /*#__PURE__*/React.createElement(FormInput, {
      name: name,
      onValidityStateUpdate: this.onValidityStateUpdateHandler
    }, /*#__PURE__*/React.createElement(TextInputCore, {
      disabled: isDisabled,
      label: label,
      isRequired: isRequired,
      error: error ? error.message : null,
      autoFocus: autoFocus,
      maxLength: maxLength,
      minLength: minLength,
      name: name,
      onBlur: this.checkValidity,
      onFocus: onFocus,
      onChange: this.onChange,
      pattern: pattern,
      placeholder: placeholder,
      inputRef: input => {
        this.input = input;
      },
      type: type,
      value: value,
      readOnly: isReadOnly,
      isLoading: isLoading,
      labelTooltip: labelTooltip,
      hideLabel: hideLabel
    })));
  }
}
_defineProperty(TextInput, "defaultProps", {
  autoFocus: false,
  value: '',
  type: 'text',
  isReadOnly: false,
  isLoading: false
});
export default TextInput;
//# sourceMappingURL=TextInput.js.map