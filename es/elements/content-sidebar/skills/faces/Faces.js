function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/**
 * 
 * @file Faces Skill Card component
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import PlainButton from '../../../../components/plain-button/PlainButton';
import PrimaryButton from '../../../../components/primary-button/PrimaryButton';
import LoadingIndicatorWrapper from '../../../../components/loading-indicator/LoadingIndicatorWrapper';
import InlineError from '../../../../components/inline-error/InlineError';
import Tooltip from '../../../../components/tooltip/Tooltip';
import Button from '../../../../components/button/Button';
import IconEdit from '../../../../icons/general/IconEdit';
import messages from '../../../common/messages';
import { SKILLS_TARGETS } from '../../../common/interactionTargets';
import Face from './Face';
import Timeline from '../timeline';
import './Faces.scss';
class Faces extends React.PureComponent {
  /**
   * [constructor]
   *
   * @public
   * @return {Faces}
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
     * Toggles face selection
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "onSelect", face => {
      const {
        selected
      } = this.state;
      this.setState({
        selected: selected === face ? undefined : face
      });
    });
    /**
     * Deletes a face
     *
     * @private
     * @return {void}
     */
    _defineProperty(this, "onDelete", face => {
      const {
        removes
      } = this.state;
      removes.push(face);
      this.setState({
        removes: removes.slice(0)
      });
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
        removes
      } = this.state;
      this.toggleIsEditing();
      if (removes.length > 0) {
        this.setState({
          isLoading: true
        });
        onSkillChange(removes);
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
      faces: props.card.entries,
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
      faces: props.card.entries,
      removes: [],
      isEditing: false,
      selected: undefined,
      hasError: false,
      isLoading: false
    });
  }
  /**
   * Renders the faces
   *
   * @private
   * @return {void}
   */
  render() {
    const {
      card,
      isEditable,
      getViewer
    } = this.props;
    const {
      selected,
      faces,
      removes,
      isEditing,
      hasError,
      isLoading
    } = this.state;
    const {
      duration
    } = card;
    const hasFaces = faces.length > 0;
    const entries = faces.filter(face => !removes.includes(face));
    const editClassName = classNames('be-face-edit', {
      'be-faces-is-editing': isEditing
    });
    return /*#__PURE__*/React.createElement(LoadingIndicatorWrapper, {
      className: "be-faces",
      isLoading: isLoading
    }, hasFaces && isEditable && !isLoading && /*#__PURE__*/React.createElement(Tooltip, {
      text: /*#__PURE__*/React.createElement(FormattedMessage, messages.editLabel)
    }, /*#__PURE__*/React.createElement(PlainButton, {
      className: editClassName,
      "data-resin-target": SKILLS_TARGETS.FACES.EDIT,
      onClick: this.toggleIsEditing,
      type: "button"
    }, /*#__PURE__*/React.createElement(IconEdit, null))), hasError && /*#__PURE__*/React.createElement(InlineError, {
      title: /*#__PURE__*/React.createElement(FormattedMessage, messages.sidebarSkillsErrorTitle)
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.sidebarSkillsErrorContent)), hasFaces ? entries.map((face, index) =>
    /*#__PURE__*/
    /* eslint-disable react/no-array-index-key */
    React.createElement(Face, {
      key: index,
      face: face,
      isEditing: isEditing,
      onDelete: this.onDelete,
      onSelect: this.onSelect,
      selected: selected
    })
    /* eslint-enable react/no-array-index-key */) : /*#__PURE__*/React.createElement(FormattedMessage, messages.skillNoInfoFoundError), !!selected && !isEditing && Array.isArray(selected.appears) && selected.appears.length > 0 && /*#__PURE__*/React.createElement(Timeline, {
      duration: duration,
      getViewer: getViewer,
      interactionTarget: SKILLS_TARGETS.FACES.TIMELINE,
      timeslices: selected.appears
    }), isEditing && /*#__PURE__*/React.createElement("div", {
      className: "be-faces-buttons"
    }, /*#__PURE__*/React.createElement(Button, {
      "data-resin-target": SKILLS_TARGETS.FACES.EDIT_CANCEL,
      onClick: this.onCancel,
      type: "button"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.cancel)), /*#__PURE__*/React.createElement(PrimaryButton, {
      "data-resin-target": SKILLS_TARGETS.FACES.EDIT_SAVE,
      onClick: this.onSave,
      type: "button"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.save))));
  }
}
export default Faces;
//# sourceMappingURL=Faces.js.map