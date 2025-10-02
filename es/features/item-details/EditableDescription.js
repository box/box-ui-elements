function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { injectIntl } from 'react-intl';
import TextareaAutosize from 'react-textarea-autosize';
import messages from './messages';
class EditableDescription extends React.PureComponent {
  constructor(props) {
    super(props);
    _defineProperty(this, "handleBlur", () => {
      const {
        value
      } = this.state;
      this.props.onDescriptionChange(value);
    });
    _defineProperty(this, "handleChange", event => {
      const {
        value
      } = event.currentTarget;
      this.setState({
        value
      });
    });
    this.state = {
      value: props.value || ''
    };
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
      intl,
      textAreaProps
    } = this.props;
    const {
      value
    } = this.state;
    return /*#__PURE__*/React.createElement(TextareaAutosize, _extends({}, textAreaProps, {
      className: "description-textarea",
      maxLength: "255",
      maxRows: 6,
      onBlur: this.handleBlur,
      onChange: this.handleChange,
      placeholder: intl.formatMessage(messages.descriptionPlaceholder),
      value: value
    }));
  }
}
_defineProperty(EditableDescription, "defaultProps", {
  textAreaProps: {},
  value: ''
});
export { EditableDescription as EditableDescriptionBase };
export default injectIntl(EditableDescription);
//# sourceMappingURL=EditableDescription.js.map