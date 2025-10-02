function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import uniqueId from 'lodash/uniqueId';
import { Editor } from 'draft-js';
import 'draft-js/dist/Draft.css';
import Tooltip from '../tooltip';
import commonMessages from '../../common/messages';
import './DraftJSEditor.scss';
const OptionalFormattedMessage = () => /*#__PURE__*/React.createElement("span", {
  className: "bdl-Label-optional"
}, "(", /*#__PURE__*/React.createElement(FormattedMessage, commonMessages.optional), ")");
class DraftJSEditor extends React.Component {
  constructor(...args) {
    super(...args);
    /**
     * Calls onChange handler passed in
     * @param {EditorState} editorState The new/updated editor state
     * @returns {void}
     */
    _defineProperty(this, "handleChange", editorState => {
      const {
        onChange
      } = this.props;
      onChange(editorState);
    });
    _defineProperty(this, "handleBlur", editorState => {
      const {
        onBlur
      } = this.props;
      onBlur(editorState);
    });
    /**
     * Event handler which being passed to 'handleReturn' prop of DraftJSEditor
     * This gives consumer the ability to handle return key event before DraftJSEditor handles it.
     * @param {SyntheticKeyboardEvent} event
     * @returns {string}
     */
    _defineProperty(this, "handleReturn", event => {
      const {
        onReturn,
        inputProps
      } = this.props;
      if (onReturn && !inputProps['aria-activedescendant']) {
        // Return 'handled' tells DraftJS Editor to not handle return key event,
        // return 'not-handled' tells DraftJS Editor to continue handle the return key event.
        // We encapsulate this DraftJS Editor specific contract here, and use true/fase
        // to indicate whether to let DraftJS Editor handle return event or not in the upper level.
        return onReturn(event) ? 'handled' : 'not-handled';
      }
      return 'not-handled';
    });
    _defineProperty(this, "labelID", uniqueId('label'));
    _defineProperty(this, "descriptionID", uniqueId('description'));
  }
  render() {
    const {
      editorState,
      error,
      hideLabel,
      inputProps,
      isDisabled,
      isRequired,
      label,
      description,
      onFocus,
      placeholder
    } = this.props;
    const {
      handleBlur,
      handleChange
    } = this;
    const classes = classNames({
      'draft-js-editor': true,
      'is-disabled bdl-is-disabled': isDisabled,
      'show-error': !!error
    });
    let a11yProps = {};
    if (inputProps.role) {
      a11yProps = {
        ariaActiveDescendantID: inputProps['aria-activedescendant'],
        ariaAutoComplete: inputProps['aria-autocomplete'],
        ariaExpanded: inputProps['aria-expanded'],
        ariaOwneeID: inputProps['aria-owns'],
        ariaMultiline: true,
        role: 'textbox'
      };
    }
    return /*#__PURE__*/React.createElement("div", {
      className: classes
    }, /*#__PURE__*/React.createElement("span", {
      className: classNames('bdl-Label', {
        'accessibility-hidden': hideLabel
      }),
      id: this.labelID
    }, label, !isRequired && /*#__PURE__*/React.createElement(OptionalFormattedMessage, null)), /*#__PURE__*/React.createElement("span", {
      className: "accessibility-hidden screenreader-description",
      id: this.descriptionID
    }, description), /*#__PURE__*/React.createElement(Tooltip, {
      targetWrapperClassName: "bdl-DraftJSEditor-target",
      isShown: !!error,
      position: "bottom-left",
      text: error ? error.message : '',
      theme: "error"
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Editor, _extends({}, a11yProps, {
      ariaLabelledBy: this.labelID,
      ariaDescribedBy: this.descriptionID,
      editorState: editorState,
      handleReturn: this.handleReturn,
      onBlur: handleBlur,
      onChange: handleChange,
      onFocus: onFocus,
      placeholder: placeholder,
      readOnly: isDisabled,
      stripPastedStyles: true
    })))));
  }
}
_defineProperty(DraftJSEditor, "defaultProps", {
  inputProps: {},
  isRequired: false,
  isFocused: false
});
export default DraftJSEditor;
//# sourceMappingURL=DraftJSEditor.js.map