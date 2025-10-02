function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import TextInput from '../../components/text-input/TextInput';
import commonMessages from '../../common/messages';
import messages from './messages';
const VALUE_MISSING = 'valueMissing';
const TYPE_MISMATCH = 'typeMismatch';
const errorMap = {
  [VALUE_MISSING]: /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.requiredFieldError),
  [TYPE_MISMATCH]: /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.invalidURLError)
};
class EditableURL extends React.Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      error: '',
      value: this.props.value
    });
    _defineProperty(this, "handleBlur", () => {
      if (!this.inputEl) {
        return;
      }
      const {
        valid,
        valueMissing
      } = this.inputEl.validity;
      if (!valid) {
        this.setState({
          error: valueMissing ? VALUE_MISSING : TYPE_MISMATCH
        });
        return;
      }
      this.props.onValidURLChange(this.state.value);
    });
    _defineProperty(this, "handleChange", event => {
      this.setState({
        value: event.currentTarget.value
      });
    });
    _defineProperty(this, "handleFocus", () => {
      this.setState({
        error: ''
      });
    });
  }
  componentDidUpdate({
    value: prevValue
  }) {
    const {
      value
    } = this.props;
    if (prevValue !== value) {
      this.setState({
        value
      });
    }
  }
  render() {
    const {
      intl: {
        formatMessage
      }
    } = this.props;
    const {
      error,
      value
    } = this.state;
    return /*#__PURE__*/React.createElement(TextInput, {
      className: "url-input",
      error: error ? errorMap[error] : undefined,
      hideLabel: true,
      inputRef: ref => {
        this.inputEl = ref;
      },
      isRequired: true,
      label: formatMessage(messages.url),
      onBlur: this.handleBlur,
      onChange: this.handleChange,
      onFocus: this.handleFocus,
      placeholder: formatMessage(messages.urlPlaceholder),
      type: "url",
      value: value
    });
  }
}
export { EditableURL as EditableURLBase, VALUE_MISSING, TYPE_MISMATCH };
export default injectIntl(EditableURL);
//# sourceMappingURL=EditableURL.js.map