function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Modal, ModalActions } from '../../../components/modal';
import TextInput from '../../../components/text-input';
import Button from '../../../components/button';
import PrimaryButton from '../../../components/primary-button';
import messages from '../messages';
import './NewFolderModal.scss';
class NewFolderModal extends Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "handleCreateClick", () => {
      const {
        onCreateFolderSubmit
      } = this.props;
      const {
        folderNameInput
      } = this.state;
      onCreateFolderSubmit(folderNameInput);
    });
    _defineProperty(this, "handleFolderNameInput", event => {
      const {
        onCreateFolderInput
      } = this.props;
      const input = event.target.value;
      this.setState({
        folderNameInput: input
      });
      if (onCreateFolderInput) {
        onCreateFolderInput(input);
      }
    });
    this.state = {
      folderNameInput: ''
    };
  }
  render() {
    const {
      className,
      intl,
      isOpen,
      onRequestClose,
      parentFolderName,
      isCreatingFolder,
      createFolderError,
      shouldNotUsePortal
    } = this.props;
    const {
      folderNameInput
    } = this.state;
    const isCreateButtonDisabled = !folderNameInput.trim().length || !!createFolderError || !!isCreatingFolder;
    return /*#__PURE__*/React.createElement(Modal, {
      className: classNames('new-folder-modal', className),
      focusElementSelector: ".folder-name-input input",
      isOpen: isOpen,
      onRequestClose: onRequestClose,
      shouldNotUsePortal: shouldNotUsePortal,
      title: /*#__PURE__*/React.createElement(FormattedMessage, _extends({}, messages.newFolderModalTitle, {
        values: {
          parentFolderName
        }
      }))
    }, /*#__PURE__*/React.createElement(TextInput, {
      className: "folder-name-input",
      error: createFolderError,
      isRequired: true,
      label: /*#__PURE__*/React.createElement(FormattedMessage, messages.newFolderModalFolderNameLabel),
      onInput: this.handleFolderNameInput,
      placeholder: intl.formatMessage(messages.newFolderModalFolderNamePlaceholder),
      type: "text",
      value: folderNameInput
    }), /*#__PURE__*/React.createElement(ModalActions, null, /*#__PURE__*/React.createElement(Button, {
      className: "new-folder-modal-cancel-button",
      onClick: onRequestClose,
      type: "button"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.newFolderModalCancel)), /*#__PURE__*/React.createElement(PrimaryButton, {
      className: "new-folder-modal-create-button",
      isDisabled: isCreateButtonDisabled,
      isLoading: isCreatingFolder,
      onClick: this.handleCreateClick,
      type: "button"
    }, /*#__PURE__*/React.createElement(FormattedMessage, messages.newFolderModalCreate))));
  }
}
_defineProperty(NewFolderModal, "propTypes", {
  /** Adds class name to modal. */
  className: PropTypes.string,
  intl: PropTypes.any,
  /** Opens the modal. */
  isOpen: PropTypes.bool,
  /** Called when the modal is requested to be closed. */
  onRequestClose: PropTypes.func.isRequired,
  /**
   * Called when the folder creation is submitted.
   *
   * @param {string} folderName
   */
  onCreateFolderSubmit: PropTypes.func.isRequired,
  /**
   * Called with the latest folder name input.
   *
   * @param {string} folderName
   */
  onCreateFolderInput: PropTypes.func,
  /** The name of the parent folder that the new folder will be created in. */
  parentFolderName: PropTypes.string,
  /** Folder is in the process of being created. */
  isCreatingFolder: PropTypes.bool,
  /** Message that will be shown when there was an error creating the folder. */
  createFolderError: PropTypes.string,
  /** Whether the modal should be nested in a Portal or in a div */
  shouldNotUsePortal: PropTypes.bool
});
_defineProperty(NewFolderModal, "defaultProps", {
  className: '',
  isOpen: false,
  parentFolderName: '',
  isCreatingFolder: false,
  createFolderError: null,
  shouldNotUsePortal: false
});
export { NewFolderModal as NewFolderModalBase };
export default injectIntl(NewFolderModal);
//# sourceMappingURL=NewFolderModal.js.map