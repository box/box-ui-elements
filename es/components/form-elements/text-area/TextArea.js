function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import TextAreaCore from '../../text-area';
import * as messages from '../input-messages';
import FormInput from '../form/FormInput';
class TextArea extends React.Component {
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
        textarea
      } = this;
      if (!textarea) {
        return;
      }
      if (validation && (isRequired || textarea.value.trim().length)) {
        const error = validation(textarea.value);
        this.setState({
          error,
          value: textarea.value
        });
        if (error) {
          textarea.setCustomValidity(error.code);
        } else {
          textarea.setCustomValidity('');
        }
      } else {
        this.setErrorFromValidityState(textarea.validity);
      }
    });
    this.state = {
      error: null,
      value: props.value
    };
  }
  componentDidUpdate({
    value: prevValue
  }) {
    // If a new value is passed by prop, set it
    if (prevValue !== this.props.value) {
      this.setState({
        value: this.props.value
      });
    }
  }
  setErrorFromValidityState(validityState) {
    const {
      badInput,
      customError,
      tooLong,
      valid,
      valueMissing
    } = validityState;
    const {
      isRequired,
      maxLength,
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
    } else if (tooLong && typeof maxLength !== 'undefined') {
      error = messages.tooLong(maxLength);
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
      isReadOnly,
      isRequired,
      isResizable,
      label,
      name,
      placeholder
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
    }, /*#__PURE__*/React.createElement(TextAreaCore, {
      autoFocus: autoFocus,
      disabled: isDisabled,
      error: error ? error.message : null,
      label: label,
      isRequired: isRequired,
      isResizable: isResizable,
      name: name,
      onBlur: this.checkValidity,
      onChange: this.onChange,
      placeholder: placeholder,
      readOnly: isReadOnly,
      textareaRef: textarea => {
        this.textarea = textarea;
      },
      value: value
    })));
  }
}
_defineProperty(TextArea, "defaultProps", {
  autoFocus: false,
  value: '',
  isReadOnly: false
});
export default TextArea;
//# sourceMappingURL=TextArea.js.map