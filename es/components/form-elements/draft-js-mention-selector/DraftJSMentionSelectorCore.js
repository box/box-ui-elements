const _excluded = ["item"];
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { EditorState } from 'draft-js';
import DatalistItem from '../../datalist-item';
import DraftJSEditor from '../../draft-js-editor';
import SelectorDropdown from '../../selector-dropdown';
import { addMention, defaultMentionTriggers, getActiveMentionForEditorState } from './utils';
import messages from './messages';
import './MentionSelector.scss';
const DefaultSelectorRow = _ref => {
  let {
      item = {}
    } = _ref,
    rest = _objectWithoutProperties(_ref, _excluded);
  return /*#__PURE__*/React.createElement(DatalistItem, rest, item.name, " ", /*#__PURE__*/React.createElement("span", {
    className: "dropdown-secondary-text"
  }, item.email));
};
const DefaultStartMentionMessage = () => /*#__PURE__*/React.createElement(FormattedMessage, messages.startMention);
const MentionStartState = ({
  message
}) => /*#__PURE__*/React.createElement("div", {
  role: "alert",
  className: "mention-start-state"
}, message);
class DraftJSMentionSelector extends React.Component {
  constructor(props) {
    super(props);
    /**
     * Called on each keypress when a mention is being composed
     * @returns {void}
     */
    _defineProperty(this, "handleMention", () => {
      const {
        onMention
      } = this.props;
      const {
        activeMention
      } = this.state;
      if (onMention) {
        onMention(activeMention ? activeMention.mentionString : '');
      }
    });
    /**
     * Method that gets called when a mention contact is selected
     * @param {number} index The selected index
     * @returns {void}
     */
    _defineProperty(this, "handleContactSelected", index => {
      const {
        contacts
      } = this.props;
      this.addMention(contacts[index]);
      this.setState({
        activeMention: null,
        isFocused: true
      }, () => {
        this.handleMention();
      });
    });
    _defineProperty(this, "handleBlur", event => {
      const {
        onBlur
      } = this.props;
      this.setState({
        isFocused: false
      });
      if (onBlur) {
        onBlur(event);
      }
    });
    _defineProperty(this, "handleFocus", event => {
      const {
        onFocus
      } = this.props;
      this.setState({
        isFocused: true
      });
      if (onFocus) {
        onFocus(event);
      }
    });
    /**
     * Event handler called when DraftJSEditor emits onChange
     * Checks current text to see if any mentions were made
     * @param {EditorState} editorState The new editor state
     * @returns {void}
     */
    _defineProperty(this, "handleChange", nextEditorState => {
      const {
        onChange
      } = this.props;
      const activeMention = this.getActiveMentionForEditorState(nextEditorState);
      this.setState({
        activeMention
      }, () => {
        if (onChange) {
          onChange(nextEditorState);
        }
        if (activeMention && activeMention.mentionString) {
          this.handleMention();
        }
      });
    });
    /**
     * @returns {boolean}
     */
    _defineProperty(this, "shouldDisplayMentionLookup", () => {
      const {
        contacts
      } = this.props;
      const {
        activeMention
      } = this.state;
      return !!(activeMention && activeMention.mentionString && contacts.length);
    });
    const mentionTriggers = props.mentionTriggers.reduce((prev, current) => `${prev}\\${current}`, '');
    this.state = {
      activeMention: null,
      isFocused: false,
      mentionPattern: new RegExp(`([${mentionTriggers}])([^${mentionTriggers}]*)$`)
    };
  }

  /**
   * Lifecycle method that gets called immediately after an update
   * @param {object} lastProps Props the component is receiving
   * @returns {void}
   */
  componentDidUpdate(prevProps) {
    const {
      contacts: prevContacts
    } = prevProps;
    const {
      contacts: currentContacts
    } = this.props;
    const {
      activeMention
    } = this.state;
    if (activeMention !== null && !currentContacts.length && prevContacts.length !== currentContacts.length) {
      // if empty set of contacts get passed in, set active mention to null
      this.setState({
        activeMention: null
      });
    }
  }

  /**
   * Extracts the active mention from the editor state
   *
   * @param {EditorState} editorState
   * @returns {object}
   */
  getActiveMentionForEditorState(editorState) {
    const {
      mentionPattern
    } = this.state;
    return getActiveMentionForEditorState(editorState, mentionPattern);
  }
  /**
   * Inserts a selected mention into the editor
   * @param {object} mention The selected mention to insert
   */
  addMention(mention) {
    const {
      activeMention
    } = this.state;
    const {
      editorState
    } = this.props;
    const editorStateWithLink = addMention(editorState, activeMention, mention);
    this.setState({
      activeMention: null
    }, () => {
      this.handleChange(editorStateWithLink);
    });
  }
  render() {
    const {
      className,
      contacts,
      contactsLoaded,
      editorState,
      error,
      hideLabel,
      isDisabled,
      isRequired,
      label,
      description,
      onReturn,
      placeholder,
      selectorRow,
      startMentionMessage,
      onMention
    } = this.props;
    const {
      activeMention,
      isFocused
    } = this.state;
    const classes = classNames('mention-selector-wrapper', className);
    const showMentionStartState = !!(onMention && activeMention && !activeMention.mentionString && isFocused);
    const usersFoundMessage = this.shouldDisplayMentionLookup() ? _objectSpread(_objectSpread({}, messages.usersFound), {}, {
      values: {
        usersCount: contacts.length
      }
    }) : messages.noUsersFound;
    return /*#__PURE__*/React.createElement("div", {
      className: classes
    }, /*#__PURE__*/React.createElement(SelectorDropdown, {
      onSelect: this.handleContactSelected,
      selector: /*#__PURE__*/React.createElement(DraftJSEditor, {
        editorState: editorState,
        error: error,
        hideLabel: hideLabel,
        isDisabled: isDisabled,
        isFocused: isFocused,
        isRequired: isRequired,
        label: label,
        description: description,
        onBlur: this.handleBlur,
        onFocus: this.handleFocus,
        onChange: this.handleChange,
        onReturn: onReturn,
        placeholder: placeholder
      })
    }, this.shouldDisplayMentionLookup() ? contacts.map(contact => /*#__PURE__*/React.cloneElement(selectorRow, _objectSpread(_objectSpread(_objectSpread({}, selectorRow.props), contact), {}, {
      key: contact.id
    }))) : []), showMentionStartState ? /*#__PURE__*/React.createElement(MentionStartState, {
      message: startMentionMessage
    }) : null, contactsLoaded && /*#__PURE__*/React.createElement("span", {
      className: "accessibility-hidden",
      "data-testid": "accessibility-alert",
      role: "alert"
    }, /*#__PURE__*/React.createElement(FormattedMessage, usersFoundMessage)));
  }
}
_defineProperty(DraftJSMentionSelector, "defaultProps", {
  className: '',
  contacts: [],
  isDisabled: false,
  isRequired: false,
  mentionTriggers: defaultMentionTriggers,
  selectorRow: /*#__PURE__*/React.createElement(DefaultSelectorRow, null),
  startMentionMessage: /*#__PURE__*/React.createElement(DefaultStartMentionMessage, null)
});
export default DraftJSMentionSelector;
//# sourceMappingURL=DraftJSMentionSelectorCore.js.map