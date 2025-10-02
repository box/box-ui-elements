function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import Button from '../../components/button/Button';
import TextInput from '../../components/text-input/TextInput';
import Tooltip from '../../components/tooltip/Tooltip';
import commonMessages from '../../common/messages';
import IconInfo from '../../icons/general/IconInfo';
import messages from './messages';
import './CustomInstanceNewField.scss';
class CustomInstanceNewField extends React.PureComponent {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      key: '',
      value: '',
      error: ''
    });
    /**
     * Change handler for the key
     *
     * @param {Event} event - keyboard event
     * @return {void}
     */
    _defineProperty(this, "onKeyChange", event => {
      this.onChange(event, 'key');
    });
    /**
     * Change handler for the value
     *
     * @param {Event} event - keyboard event
     * @return {void}
     */
    _defineProperty(this, "onValueChange", event => {
      this.onChange(event, 'value');
    });
    /**
     * Persists the new metadata added or shows an error
     *
     * @return {void}
     */
    _defineProperty(this, "onAdd", () => {
      const {
        key,
        value
      } = this.state;
      const {
        onAdd,
        properties
      } = this.props;
      if (Object.prototype.hasOwnProperty.call(properties, key)) {
        this.setState({
          error: /*#__PURE__*/React.createElement(FormattedMessage, messages.customErrorDuplicateKey)
        });
      } else if (key.startsWith('$')) {
        this.setState({
          error: /*#__PURE__*/React.createElement(FormattedMessage, messages.customErrorInternalKey)
        });
      } else if (key) {
        onAdd(key, value);
      } else {
        this.setState({
          error: /*#__PURE__*/React.createElement(FormattedMessage, messages.customErrorRequired)
        });
      }
    });
  }
  /**
   * Common change handler
   *
   * @param {Event} event - keyboard event
   * @param {string} attr - key or value
   * @return {void}
   */
  onChange(event, attr) {
    const currentTarget = event.currentTarget;
    this.setState({
      error: '',
      [attr]: currentTarget.value
    });
  }
  render() {
    const {
      intl,
      isCancellable,
      onCancel
    } = this.props;
    const {
      key,
      value,
      error
    } = this.state;
    return /*#__PURE__*/React.createElement("div", {
      className: "custom-new-field"
    }, /*#__PURE__*/React.createElement("div", {
      className: "custom-new-field-header"
    }, /*#__PURE__*/React.createElement(FormattedMessage, _extends({
      tagName: "h5"
    }, messages.customNewField)), /*#__PURE__*/React.createElement(Tooltip, {
      text: /*#__PURE__*/React.createElement(FormattedMessage, messages.customNewFieldMessage)
    }, /*#__PURE__*/React.createElement("div", {
      tabIndex: "-1"
    }, /*#__PURE__*/React.createElement(IconInfo, {
      color: "#777",
      height: 18,
      width: 18
    })))), /*#__PURE__*/React.createElement(TextInput, {
      error: error,
      isRequired: true,
      label: /*#__PURE__*/React.createElement(FormattedMessage, messages.customKey),
      onChange: this.onKeyChange,
      placeholder: intl.formatMessage(messages.customKeyPlaceholder),
      type: "text",
      value: key
    }), /*#__PURE__*/React.createElement(TextInput, {
      hideOptionalLabel: true,
      label: /*#__PURE__*/React.createElement(FormattedMessage, messages.customValue),
      onChange: this.onValueChange,
      placeholder: intl.formatMessage(messages.customValuePlaceholder),
      type: "text",
      value: value
    }), /*#__PURE__*/React.createElement("div", {
      className: "custom-new-field-actions"
    }, isCancellable && /*#__PURE__*/React.createElement(Button, {
      "data-resin-target": "metadata-customfieldcancel",
      onClick: onCancel,
      type: "button"
    }, /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.cancel)), /*#__PURE__*/React.createElement(Button, {
      "data-resin-target": "metadata-customfieldadd",
      onClick: this.onAdd,
      type: "button"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.customAdd))));
  }
}
export { CustomInstanceNewField as CustomInstanceNewFieldBase };
export default injectIntl(CustomInstanceNewField);
//# sourceMappingURL=CustomInstanceNewField.js.map