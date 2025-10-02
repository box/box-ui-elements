function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import PropTypes from 'prop-types';
import React, { Component } from 'react';
class FormInput extends Component {
  componentDidMount() {
    const {
      name,
      onValidityStateUpdate
    } = this.props;
    if (this.context.form) {
      this.context.form.registerInput(name, onValidityStateUpdate);
    }
  }
  componentWillUnmount() {
    if (this.context.form) {
      this.context.form.unregisterInput(this.props.name);
    }
  }
  render() {
    return /*#__PURE__*/React.createElement("div", null, this.props.children);
  }
}
_defineProperty(FormInput, "propTypes", {
  children: PropTypes.node.isRequired,
  /** callback called when Form pushed down a new validityState, useful for displaying server validation errors */
  onValidityStateUpdate: PropTypes.func.isRequired,
  /** Input name */
  name: PropTypes.string.isRequired
});
_defineProperty(FormInput, "contextTypes", {
  form: PropTypes.shape({
    registerInput: PropTypes.func.isRequired,
    unregisterInput: PropTypes.func.isRequired
  })
});
export default FormInput;
//# sourceMappingURL=FormInput.js.map