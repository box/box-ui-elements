function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Editable Skill Keywords card component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import PillSelector from '../../../../components/pill-selector-dropdown/PillSelector';
import PrimaryButton from '../../../../components/primary-button/PrimaryButton';
import Button from '../../../../components/button/Button';
import messages from '../../../common/messages';
import { SKILLS_TARGETS } from '../../../common/interactionTargets';
import getPills from './keywordUtils';
import './EditableKeywords.scss';
class EditableKeywords extends React.PureComponent {
  /**
   * [constructor]
   *
   * @public
   * @return {EditableKeywords}
   */
  constructor(props) {
    super(props);
    /**
     * Called when keywords gets new properties.
     * Should reset to original state.
     *
     * @private
     * @param {Object} option - pill
     * @param {number} index - pill index
     * @return {void}
     */
    _defineProperty(this, "onRemove", (option, index) => {
      // eslint-disable-line
      const {
        onDelete,
        keywords
      } = this.props;
      onDelete(keywords[index]);
    });
    /**
     * When pressing enter in the pill input box
     *
     * @private
     * @param {Event} event - keyboard event
     * @return {void}
     */
    _defineProperty(this, "onKeyDown", ({
      key
    }) => {
      if (key === 'Enter' && !this.state.isInCompositionMode) {
        this.onBlur();
      }
    });
    /**
     * Called when pill selector is blurred.
     * Adds a new pill if needed.
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "onBlur", () => {
      const {
        onAdd
      } = this.props;
      const {
        keyword
      } = this.state;
      if (keyword) {
        onAdd({
          type: 'text',
          text: keyword
        });
      }
    });
    /**
     * Enables composition mode.
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "onCompositionStart", () => {
      this.setState({
        isInCompositionMode: true
      });
    });
    /**
     * Disables composition mode.
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "onCompositionEnd", () => {
      this.setState({
        isInCompositionMode: false
      });
    });
    /**
     * Called when pill selector gets new input value.
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "onInput", event => {
      const currentTarget = event.currentTarget;
      this.setState({
        keyword: currentTarget.value
      });
    });
    this.state = {
      pills: getPills(props.keywords),
      keyword: '',
      isInCompositionMode: false
    };
  }

  /**
   * Called when keywords gets new properties.
   * Should reset to original state.
   *
   * @private
   * @param {Object} nextProps - component props
   * @return {void}
   */
  componentDidUpdate({
    keywords: prevKeywords
  }) {
    const {
      keywords
    } = this.props;
    if (prevKeywords !== keywords) {
      this.setState({
        pills: getPills(keywords),
        keyword: ''
      });
    }
  }
  /**
   * Renders the keywords
   *
   * @private
   * @return {void}
   */
  render() {
    const {
      onSave,
      onCancel
    } = this.props;
    const {
      pills,
      keyword
    } = this.state;
    return /*#__PURE__*/React.createElement("span", {
      className: "bdl-EditableKeywords"
    }, /*#__PURE__*/React.createElement(PillSelector, {
      onBlur: this.onBlur,
      onCompositionEnd: this.onCompositionEnd,
      onCompositionStart: this.onCompositionStart,
      onInput: this.onInput,
      onKeyDown: this.onKeyDown,
      onPaste: this.onInput,
      onRemove: this.onRemove,
      selectedOptions: pills,
      value: keyword
    }), /*#__PURE__*/React.createElement("div", {
      className: "be-keywords-buttons"
    }, /*#__PURE__*/React.createElement(Button, {
      "data-resin-target": SKILLS_TARGETS.KEYWORDS.EDIT_CANCEL,
      onClick: onCancel,
      type: "button"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.cancel)), /*#__PURE__*/React.createElement(PrimaryButton, {
      "data-resin-target": SKILLS_TARGETS.KEYWORDS.EDIT_SAVE,
      onClick: onSave,
      type: "button"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.save))));
  }
}
export default EditableKeywords;
//# sourceMappingURL=EditableKeywords.js.map