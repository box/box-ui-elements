function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file File Keywords SkillCard component
 * @author Box
 */

import React, { PureComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import PlainButton from '../../../../components/plain-button/PlainButton';
import IconEdit from '../../../../icons/general/IconEdit';
import LoadingIndicatorWrapper from '../../../../components/loading-indicator/LoadingIndicatorWrapper';
import InlineError from '../../../../components/inline-error/InlineError';
import Tooltip from '../../../../components/tooltip/Tooltip';
import messages from '../../../common/messages';
import { SKILLS_TARGETS } from '../../../common/interactionTargets';
import EditableKeywords from './EditableKeywords';
import ReadOnlyKeywords from './ReadOnlyKeywords';
import './Keywords.scss';
class Keywords extends PureComponent {
  /**
   * [constructor]
   *
   * @public
   * @return {Keywords}
   */
  constructor(props) {
    super(props);
    /**
     * Toggles the edit mode
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "toggleIsEditing", () => {
      this.setState(prevState => ({
        isEditing: !prevState.isEditing
      }));
    });
    /**
     * Adds a new keyword.
     * Iterates over the transcript to find locations
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "onAdd", keyword => {
      const {
        transcript
      } = this.props;
      const {
        adds
      } = this.state;
      const locations = [];
      const regex = new RegExp(`\\b${keyword.text}\\b`, 'i');
      if (transcript && Array.isArray(transcript.entries)) {
        transcript.entries.forEach(({
          text,
          appears
        }) => {
          if (text && regex.test(text) && Array.isArray(appears) && appears.length > 0) {
            locations.push(appears[0]);
          }
        });
      }
      keyword.appears = locations;
      adds.push(keyword);
      this.setState({
        adds: adds.slice(0)
      });
    });
    /**
     * Deletes a keyword
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "onDelete", keyword => {
      const {
        adds,
        removes
      } = this.state;
      const addedIndex = adds.findIndex(added => added === keyword);
      if (addedIndex > -1) {
        adds.splice(addedIndex, 1);
        this.setState({
          adds: adds.slice(0)
        });
      } else {
        removes.push(keyword);
        this.setState({
          removes: removes.slice(0)
        });
      }
    });
    /**
     * Saves the new card data
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "onSave", () => {
      const {
        onSkillChange
      } = this.props;
      const {
        removes,
        adds
      } = this.state;
      this.toggleIsEditing();
      if (removes.length > 0 || adds.length > 0) {
        this.setState({
          isLoading: true
        });
        onSkillChange(removes, adds);
      }
    });
    /**
     * Cancels editing
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "onCancel", () => {
      this.resetState(this.props);
    });
    this.state = {
      keywords: props.card.entries,
      adds: [],
      removes: [],
      isEditing: props.hasError,
      hasError: props.hasError,
      isLoading: false
    };
  }

  /**
   * Helper to reset the state
   *
   * @private
   * @param {Object} props - component props
   * @return {void}
   */
  resetState(props) {
    this.setState({
      keywords: props.card.entries,
      adds: [],
      removes: [],
      isEditing: false,
      hasError: false,
      isLoading: false
    });
  }
  /**
   * Renders the keywords
   *
   * @private
   * @return {void}
   */
  render() {
    const {
      card,
      getViewer,
      isEditable
    } = this.props;
    const {
      duration
    } = card;
    const {
      isEditing,
      isLoading,
      hasError,
      keywords,
      removes,
      adds
    } = this.state;
    const hasKeywords = keywords.length > 0;
    const entries = keywords.filter(face => !removes.includes(face)).concat(adds);
    const editClassName = classNames('be-keyword-edit', {
      'be-keyword-is-editing': isEditing
    });
    return /*#__PURE__*/React.createElement(LoadingIndicatorWrapper, {
      className: "be-keywords",
      isLoading: isLoading
    }, hasKeywords && isEditable && !isLoading && /*#__PURE__*/React.createElement(Tooltip, {
      text: /*#__PURE__*/React.createElement(FormattedMessage, messages.editLabel)
    }, /*#__PURE__*/React.createElement(PlainButton, {
      className: editClassName,
      "data-resin-target": SKILLS_TARGETS.KEYWORDS.EDIT,
      onClick: this.toggleIsEditing,
      type: "button"
    }, /*#__PURE__*/React.createElement(IconEdit, null))), hasError && /*#__PURE__*/React.createElement(InlineError, {
      title: /*#__PURE__*/React.createElement(FormattedMessage, messages.sidebarSkillsErrorTitle)
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.sidebarSkillsErrorContent)), isEditing && /*#__PURE__*/React.createElement(EditableKeywords, {
      keywords: entries,
      onAdd: this.onAdd,
      onCancel: this.onCancel,
      onDelete: this.onDelete,
      onSave: this.onSave
    }), !isEditing && hasKeywords && /*#__PURE__*/React.createElement(ReadOnlyKeywords, {
      duration: duration,
      getViewer: getViewer,
      keywords: entries
    }), !isEditing && !hasKeywords && /*#__PURE__*/React.createElement(FormattedMessage, messages.skillNoInfoFoundError));
  }
}
export default Keywords;
//# sourceMappingURL=Keywords.js.map