function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import serialize from 'form-serialize';
function getFormValidityState(form) {
  // Turn the form.elements HTMLCollection into Array before reducing
  return [].slice.call(form.elements).reduce((validityObj, inputEl) => {
    // Only serialize inputs that have a name defined
    if (inputEl.name && !inputEl.validity.valid) {
      const validityState = inputEl.validity;
      if (inputEl.validity.customError) {
        // If the input is displaying a custom error,
        // we expose the errorCode stored in the validationMessage
        validityState.customErrorCode = inputEl.validationMessage;
      }
      validityObj[inputEl.name] = {
        validityState
      };
      return validityObj;
    }
    return validityObj;
  }, {});
}
class Form extends Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "onChange", ({
      currentTarget
    }) => {
      if (this.props.onChange) {
        const formData = serialize(currentTarget, {
          hash: true,
          empty: true
        });
        this.props.onChange(formData);
      }
    });
    _defineProperty(this, "onSubmit", event => {
      const form = event.target;
      event.preventDefault();
      const isValid = form.checkValidity();
      const {
        onInvalidSubmit,
        onValidSubmit
      } = this.props;
      const {
        registeredInputs
      } = this.state;
      if (isValid) {
        const formData = serialize(form, {
          hash: true,
          empty: true
        });
        onValidSubmit(formData);
      } else {
        const formValidityState = getFormValidityState(form);

        // Push form validity state to inputs so errors are shown on submit
        Object.keys(formValidityState).forEach(key => registeredInputs[key] && registeredInputs[key](formValidityState[key].validityState));
        if (onInvalidSubmit) {
          onInvalidSubmit(formValidityState);
        }
      }
    });
    _defineProperty(this, "registerInput", (name, setValidityStateHandler) => {
      const {
        registeredInputs
      } = this.state;
      if (registeredInputs[name]) {
        throw new Error(`Input '${name}' is already registered.`);
      }
      const nextState = this.state;
      nextState.registeredInputs[name] = setValidityStateHandler;
      this.setState(nextState);
    });
    _defineProperty(this, "unregisterInput", name => {
      const nextState = this.state;
      delete nextState.registeredInputs[name];
      this.setState(nextState);
    });
    this.state = {
      registeredInputs: {}
    };
  }
  getChildContext() {
    return {
      form: {
        registerInput: this.registerInput.bind(this),
        unregisterInput: this.unregisterInput.bind(this)
      }
    };
  }
  componentDidUpdate({
    formValidityState: prevFormValidityState
  }) {
    const {
      formValidityState
    } = this.props;
    const {
      registeredInputs
    } = this.state;
    if (formValidityState !== prevFormValidityState) {
      Object.keys(formValidityState).forEach(key => {
        if (registeredInputs[key]) {
          registeredInputs[key](formValidityState[key]);
        }
      });
    }
  }
  render() {
    const {
      children
    } = this.props;
    return /*#__PURE__*/React.createElement("form", {
      noValidate: true,
      onChange: this.onChange,
      onSubmit: this.onSubmit
    }, children);
  }
}
_defineProperty(Form, "propTypes", {
  children: PropTypes.node,
  /** Called when an input in the form changes */
  onChange: PropTypes.func,
  /** Called when a valid submit is made */
  onValidSubmit: PropTypes.func.isRequired,
  /** Called when an invalid submit is made */
  onInvalidSubmit: PropTypes.func,
  /** An object mapping input names to error messages */
  formValidityState: PropTypes.object // eslint-disable-line react/no-unused-prop-types
});
_defineProperty(Form, "childContextTypes", {
  form: PropTypes.shape({
    registerInput: PropTypes.func.isRequired,
    unregisterInput: PropTypes.func.isRequired
  }).isRequired
});
export default Form;
//# sourceMappingURL=Form.js.map