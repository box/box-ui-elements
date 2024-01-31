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
    static propTypes = {
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
        shouldNotUsePortal: PropTypes.bool,
    };

    static defaultProps = {
        className: '',
        isOpen: false,
        parentFolderName: '',
        isCreatingFolder: false,
        createFolderError: null,
        shouldNotUsePortal: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            folderNameInput: '',
        };
    }

    handleCreateClick = () => {
        const { onCreateFolderSubmit } = this.props;
        const { folderNameInput } = this.state;
        onCreateFolderSubmit(folderNameInput);
    };

    handleFolderNameInput = event => {
        const { onCreateFolderInput } = this.props;
        const input = event.target.value;
        this.setState({
            folderNameInput: input,
        });
        if (onCreateFolderInput) {
            onCreateFolderInput(input);
        }
    };

    render() {
        const {
            className,
            intl,
            isOpen,
            onRequestClose,
            parentFolderName,
            isCreatingFolder,
            createFolderError,
            shouldNotUsePortal,
        } = this.props;
        const { folderNameInput } = this.state;

        const isCreateButtonDisabled = !folderNameInput.trim().length || !!createFolderError || !!isCreatingFolder;

        return (
            <Modal
                className={classNames('new-folder-modal', className)}
                focusElementSelector=".folder-name-input input"
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                shouldNotUsePortal={shouldNotUsePortal}
                title={
                    <FormattedMessage
                        {...messages.newFolderModalTitle}
                        values={{
                            parentFolderName,
                        }}
                    />
                }
            >
                <TextInput
                    className="folder-name-input"
                    error={createFolderError}
                    isRequired
                    label={<FormattedMessage {...messages.newFolderModalFolderNameLabel} />}
                    onInput={this.handleFolderNameInput}
                    placeholder={intl.formatMessage(messages.newFolderModalFolderNamePlaceholder)}
                    type="text"
                    value={folderNameInput}
                />
                <ModalActions>
                    <Button className="new-folder-modal-cancel-button" onClick={onRequestClose} type="button">
                        <FormattedMessage {...messages.newFolderModalCancel} />
                    </Button>
                    <PrimaryButton
                        className="new-folder-modal-create-button"
                        isDisabled={isCreateButtonDisabled}
                        isLoading={isCreatingFolder}
                        onClick={this.handleCreateClick}
                        type="button"
                    >
                        <FormattedMessage {...messages.newFolderModalCreate} />
                    </PrimaryButton>
                </ModalActions>
            </Modal>
        );
    }
}

export { NewFolderModal as NewFolderModalBase };
export default injectIntl(NewFolderModal);
