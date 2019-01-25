import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import { Modal, ModalActions } from 'components/modal';
import TextInput from 'components/text-input';
import Button from 'components/button';
import PrimaryButton from 'components/primary-button';

import messages from '../messages';

import './NewFolderModal.scss';

class NewFolderModal extends Component {
    static propTypes = {
        /** Adds class name to modal. */
        className: PropTypes.string,
        intl: intlShape.isRequired,
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
    };

    static defaultProps = {
        className: '',
        isOpen: false,
        parentFolderName: '',
        isCreatingFolder: false,
        createFolderError: null,
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
        } = this.props;
        const { folderNameInput } = this.state;

        const isCreateButtonDisabled = !folderNameInput.trim().length || !!createFolderError || !!isCreatingFolder;

        return (
            <Modal
                className={classNames('new-folder-modal', className)}
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                focusElementSelector=".folder-name-input input"
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
                    type="text"
                    onInput={this.handleFolderNameInput}
                    label={<FormattedMessage {...messages.newFolderModalFolderNameLabel} />}
                    placeholder={intl.formatMessage(messages.newFolderModalFolderNamePlaceholder)}
                    error={createFolderError}
                    value={folderNameInput}
                    isRequired
                />
                <ModalActions>
                    <Button className="new-folder-modal-cancel-button" type="button" onClick={onRequestClose}>
                        <FormattedMessage {...messages.newFolderModalCancel} />
                    </Button>
                    <PrimaryButton
                        className="new-folder-modal-create-button"
                        type="button"
                        onClick={this.handleCreateClick}
                        isLoading={isCreatingFolder}
                        isDisabled={isCreateButtonDisabled}
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
