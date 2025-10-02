function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Transcript component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { bdlGray50 } from '../../../../styles/variables';
import PlainButton from '../../../../components/plain-button/PlainButton';
import IconEdit from '../../../../icons/general/IconEdit';
import IconCopy from '../../../../icons/general/IconCopy';
import IconExpand from '../../../../icons/general/IconExpand';
import IconCollapse from '../../../../icons/general/IconCollapse';
import { formatTime } from '../../../../utils/datetime';
import LoadingIndicatorWrapper from '../../../../components/loading-indicator/LoadingIndicatorWrapper';
import Tooltip from '../../../../components/tooltip/Tooltip';
import { copy } from '../../../../utils/download';
import { SKILLS_TARGETS } from '../../../common/interactionTargets';
import messages from '../../../common/messages';
import { isValidTimeSlice } from './timeSliceUtils';
import TranscriptRow from './TranscriptRow';
import './Transcript.scss';
class Transcript extends React.PureComponent {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      isEditingIndex: undefined,
      newTranscriptText: '',
      isCollapsed: true,
      isLoading: false
    });
    /**
     * Reducer to accumulate all transcript entries for copying
     *
     * @param {Object} accumulator - reducer accumulator
     * @return {string} accumulated transcript entries
     */
    _defineProperty(this, "transcriptReducer", (accumulator, {
      appears,
      text
    }) => {
      const start = isValidTimeSlice(appears) && Array.isArray(appears) ? `${formatTime(appears[0].start)}:` : '';
      return `${accumulator}${start} ${text || ''}\r\n`;
    });
    /**
     * Mapper to accumulate all transcript entries for displaying
     *
     * @param {Object} accumulator - reducer accumulator
     * @param {number} index - mapper index
     * @return {string} accumulated transcript entries
     */
    _defineProperty(this, "transcriptMapper", ({
      appears,
      text
    }, index) => {
      const {
        isEditingIndex,
        newTranscriptText
      } = this.state;
      const isEditingRow = isEditingIndex === index;
      const transcriptText = isEditingRow ? newTranscriptText : text;
      const interactionTarget = isEditingRow ? SKILLS_TARGETS.TRANSCRIPTS.EDIT_TEXT : SKILLS_TARGETS.TRANSCRIPTS.TRANSCRIPT;
      return /*#__PURE__*/React.createElement(TranscriptRow, {
        key: index,
        appears: appears,
        interactionTarget: interactionTarget,
        isEditing: isEditingRow,
        onCancel: this.onCancel,
        onChange: this.onChange,
        onClick: () => this.onClick(index),
        onSave: this.onSave,
        text: transcriptText
      });
    });
    /**
     * Toggles the edit mode
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "toggleIsEditing", () => {
      this.setState(prevState => ({
        isEditingIndex: typeof prevState.isEditingIndex === 'number' ? undefined : -1
      }));
    });
    /**
     * Saves the new card data
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "onSave", () => {
      const {
        card: {
          entries
        },
        onSkillChange
      } = this.props;
      const {
        isEditingIndex,
        newTranscriptText
      } = this.state;
      if (typeof isEditingIndex !== 'number') {
        return;
      }
      const entry = entries[isEditingIndex];
      if (entry.text === newTranscriptText) {
        this.onCancel();
      } else {
        this.setState({
          isLoading: true,
          isEditingIndex: -1
        });
        onSkillChange(null, null, [{
          replacement: _objectSpread(_objectSpread({}, entry), {}, {
            text: newTranscriptText
          }),
          replaced: entry
        }]);
      }
    });
    /**
     * Cancels editing
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "onCancel", () => {
      this.setState({
        isEditingIndex: -1,
        newTranscriptText: ''
      });
    });
    /**
     * Reflects changes of editing
     *
     * @private
     * @param {Event} event - keyboard event
     * @return {void}
     */
    _defineProperty(this, "onChange", event => {
      const currentTarget = event.currentTarget;
      this.setState({
        newTranscriptText: currentTarget.value
      });
    });
    /**
     * Click handler for transcript
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "onClick", index => {
      const {
        card: {
          entries
        }
      } = this.props;
      const {
        isEditingIndex
      } = this.state;
      if (typeof isEditingIndex === 'number') {
        this.setState({
          isEditingIndex: index,
          newTranscriptText: entries[index].text
        });
      } else {
        this.previewSegment(index);
      }
    });
    /**
     * Copies the transcript.
     * Also animates the copy button.
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "copyTranscript", () => {
      const {
        card: {
          entries
        }
      } = this.props;
      const copiedClass = 'be-transcript-copied';
      copy(entries.reduce(this.transcriptReducer, ''));

      // Animate the button by adding a class
      if (this.copyBtn) {
        this.copyBtn.classList.add(copiedClass);
      }

      // Remove the animation class
      setTimeout(() => {
        if (this.copyBtn) {
          this.copyBtn.classList.remove(copiedClass);
        }
      }, 1000);
    });
    /**
     * Copy button reference
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "copyBtnRef", btn => {
      this.copyBtn = btn;
    });
    /**
     * Toggles transcript exapand and collapse
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "toggleExpandCollapse", () => {
      this.setState(prevState => ({
        isCollapsed: !prevState.isCollapsed
      }));
    });
  }
  /**
   * Called when transcripts gets new properties
   *
   * @private
   * @return {void}
   */
  componentDidUpdate(prevProps) {
    if (prevProps === this.props) {
      return;
    }
    const wasEditing = typeof this.state.isEditingIndex === 'number';
    this.setState({
      isEditingIndex: wasEditing ? -1 : undefined,
      newTranscriptText: '',
      isLoading: false
    });
  }
  /**
   * Previews a transcript segment
   *
   * @private
   * @param {number|void} [index] - row index to edit
   * @return {void}
   */
  previewSegment(index) {
    const {
      card: {
        entries
      },
      getViewer
    } = this.props;
    const {
      appears
    } = entries[index];
    const viewer = getViewer ? getViewer() : null;
    const isValid = isValidTimeSlice(appears) && Array.isArray(appears) && appears.length === 1;
    const timeSlice = appears;
    const start = isValid ? timeSlice[0].start : 0;
    if (isValid && viewer && typeof viewer.play === 'function') {
      viewer.play(start);
    }
  }
  /**
   * Renders the transcript
   *
   * @private
   * @return {Object}
   */
  render() {
    const {
      card: {
        entries
      },
      isEditable
    } = this.props;
    const {
      isEditingIndex,
      isCollapsed,
      isLoading
    } = this.state;
    const hasEntries = entries.length > 0;
    const hasManyEntries = entries.length > 5;
    const isEditing = typeof isEditingIndex === 'number';
    const editBtnClassName = classNames('be-transcript-edit', {
      'be-transcript-is-editing': isEditing
    });
    const contentClassName = classNames({
      'be-transcript-content-collapsed': isCollapsed
    });
    const expandCollapseMessage = isCollapsed ? messages.expand : messages.collapse;
    return /*#__PURE__*/React.createElement(LoadingIndicatorWrapper, {
      className: "be-transcript",
      isLoading: isLoading
    }, hasEntries && !isLoading && /*#__PURE__*/React.createElement("div", {
      className: "be-transcript-actions"
    }, /*#__PURE__*/React.createElement(Tooltip, {
      text: /*#__PURE__*/React.createElement(FormattedMessage, messages.copy)
    }, /*#__PURE__*/React.createElement(PlainButton, {
      className: "be-transcript-copy",
      "data-resin-target": SKILLS_TARGETS.TRANSCRIPTS.COPY,
      getDOMRef: this.copyBtnRef,
      onClick: this.copyTranscript,
      type: "button"
    }, /*#__PURE__*/React.createElement(IconCopy, {
      color: bdlGray50
    }))), hasManyEntries && /*#__PURE__*/React.createElement(Tooltip, {
      text: /*#__PURE__*/React.createElement(FormattedMessage, expandCollapseMessage)
    }, /*#__PURE__*/React.createElement(PlainButton, {
      className: "be-transcript-expand",
      "data-resin-target": SKILLS_TARGETS.TRANSCRIPTS.EXPAND,
      onClick: this.toggleExpandCollapse,
      type: "button"
    }, isCollapsed ? /*#__PURE__*/React.createElement(IconExpand, {
      color: bdlGray50
    }) : /*#__PURE__*/React.createElement(IconCollapse, {
      color: bdlGray50
    }))), isEditable && /*#__PURE__*/React.createElement(Tooltip, {
      text: /*#__PURE__*/React.createElement(FormattedMessage, messages.editLabel)
    }, /*#__PURE__*/React.createElement(PlainButton, {
      className: editBtnClassName,
      "data-resin-target": SKILLS_TARGETS.TRANSCRIPTS.EDIT,
      onClick: this.toggleIsEditing,
      type: "button"
    }, /*#__PURE__*/React.createElement(IconEdit, null)))), isEditing ? /*#__PURE__*/React.createElement("div", {
      className: "be-transcript-edit-message"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.transcriptEdit)) : null, hasEntries ? /*#__PURE__*/React.createElement("div", {
      className: contentClassName
    }, entries.map(this.transcriptMapper)) : /*#__PURE__*/React.createElement(FormattedMessage, messages.skillNoInfoFoundError));
  }
}
export default Transcript;
//# sourceMappingURL=Transcript.js.map