const _excluded = ["additionalButtons", "className"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import classNames from 'classnames';
import omit from 'lodash/omit';
import { FormattedMessage } from 'react-intl';
import messages from '../../common/messages';
import TextInput from '../text-input';
import Button from '../button';
import './TextInputWithCopyButton.scss';
const DEFAULT_SUCCESS_STATE_DURATION = 3000;
const defaultCopyText = /*#__PURE__*/React.createElement(FormattedMessage, messages.copy);
const defaultCopiedText = /*#__PURE__*/React.createElement(FormattedMessage, messages.copied);
class TextInputWithCopyButton extends React.PureComponent {
  constructor(props) {
    super(props);
    _defineProperty(this, "copySelectedText", () => document.execCommand('copy'));
    _defineProperty(this, "restoreCopyButton", () => {
      this.setState({
        copySuccess: false,
        buttonText: this.props.buttonDefaultText
      });
    });
    _defineProperty(this, "handleCopyButtonClick", () => {
      this.performAutofocus();
      this.copySelectedText();
      this.animateCopyButton();
    });
    _defineProperty(this, "handleFocus", event => {
      if (this.copyInputRef) {
        this.performAutofocus();
      }
      if (this.props.onFocus) {
        this.props.onFocus(event);
      }
    });
    _defineProperty(this, "handleCopyEvent", event => {
      const {
        disabled,
        onCopySuccess
      } = this.props;
      if (disabled) {
        event.preventDefault();
      } else {
        this.animateCopyButton();
        if (onCopySuccess) {
          onCopySuccess(event);
        }
      }
    });
    _defineProperty(this, "performAutofocus", () => {
      const {
        copyInputRef
      } = this;
      if (copyInputRef) {
        copyInputRef.select();
        copyInputRef.scrollLeft = 0;
      }
    });
    _defineProperty(this, "renderCopyButton", () => this.isCopyCommandSupported ? /*#__PURE__*/React.createElement(Button, _extends({
      isDisabled: this.props.disabled,
      onClick: this.handleCopyButtonClick,
      type: "button"
    }, this.props.buttonProps), this.state.buttonText) : null);
    this.isCopyCommandSupported = document.queryCommandSupported('copy');
    this.state = {
      copySuccess: false,
      buttonText: props.buttonDefaultText,
      hasFocused: false
    };
  }
  componentDidMount() {
    const {
      autofocus,
      value
    } = this.props;
    if (autofocus && value) {
      this.performAutofocus();
    }
  }
  componentDidUpdate() {
    const {
      autofocus,
      value,
      triggerCopyOnLoad
    } = this.props;
    const {
      copySuccess,
      hasFocused
    } = this.state;

    // if we've set focus before, and should auto focus on update, make sure to
    // focus after component update
    if (autofocus && value) {
      this.performAutofocus();
    }
    if (triggerCopyOnLoad && !copySuccess && !hasFocused) {
      this.animateCopyButton();
    }
  }
  componentWillUnmount() {
    this.clearCopySuccessTimeout();
  }
  animateCopyButton() {
    const {
      successStateDuration,
      buttonSuccessText
    } = this.props;
    this.clearCopySuccessTimeout();
    this.setState({
      copySuccess: true,
      buttonText: buttonSuccessText,
      hasFocused: true
    }, () => {
      this.copySuccessTimeout = setTimeout(() => {
        this.restoreCopyButton();
      }, successStateDuration);
    });
  }
  clearCopySuccessTimeout() {
    if (!this.copySuccessTimeout) {
      return;
    }
    clearTimeout(this.copySuccessTimeout);
    this.copySuccessTimeout = null;
  }
  render() {
    const _this$props = this.props,
      {
        additionalButtons,
        className
      } = _this$props,
      rest = _objectWithoutProperties(_this$props, _excluded);
    const {
      copySuccess
    } = this.state;
    const {
      isCopyCommandSupported
    } = this;
    const inputProps = omit(rest, ['autofocus', 'buttonDefaultText', 'buttonSuccessText', 'buttonProps', 'onCopySuccess', 'successStateDuration', 'triggerCopyOnLoad']);
    if (isCopyCommandSupported) {
      inputProps.inputRef = ref => {
        this.copyInputRef = ref;
      };
    }
    const wrapperClasses = classNames(className, {
      'copy-success': copySuccess,
      'text-input-with-copy-button-container': isCopyCommandSupported
    });
    const copyEvent = isCopyCommandSupported ? {
      onCopy: this.handleCopyEvent
    } : {};
    return /*#__PURE__*/React.createElement("div", _extends({
      className: wrapperClasses
    }, copyEvent), /*#__PURE__*/React.createElement(TextInput, _extends({}, inputProps, {
      onFocus: this.handleFocus
    })), additionalButtons, this.renderCopyButton());
  }
}
_defineProperty(TextInputWithCopyButton, "defaultProps", {
  buttonDefaultText: defaultCopyText,
  buttonProps: {},
  buttonSuccessText: defaultCopiedText,
  className: '',
  hideOptionalLabel: true,
  readOnly: true,
  successStateDuration: DEFAULT_SUCCESS_STATE_DURATION,
  type: 'text'
});
export default TextInputWithCopyButton;
//# sourceMappingURL=TextInputWithCopyButton.js.map