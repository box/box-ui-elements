import React, { useState } from 'react';
import Modal from 'react-modal';
import { useIntl } from 'react-intl';
import { Modal as BlueprintModal, TextInput } from '@box/blueprint-web';
import {
    CLASS_MODAL_CONTENT,
    CLASS_MODAL_OVERLAY,
    CLASS_MODAL,
    ERROR_CODE_ITEM_NAME_TOO_LONG,
    ERROR_CODE_ITEM_NAME_IN_USE,
} from '../../../constants';

import messages from '../messages';

export interface CreateFolderDialogProps {
    appElement: HTMLElement;
    errorCode: string;
    isLoading: boolean;
    isOpen: boolean;
    onCancel: () => void;
    onCreate: (value: string) => void;
    parentElement: HTMLElement;
}

const CreateFolderDialog = ({
    appElement,
    errorCode,
    isOpen,
    isLoading,
    onCancel,
    onCreate,
    parentElement,
}: CreateFolderDialogProps) => {
    const { formatMessage } = useIntl();
    const [value, setValue] = useState('');
    let error;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const handleCreate = () => {
        if (value) {
            onCreate(value);
        }
    };

    const handleKeyDown = ({ key }) => {
        switch (key) {
            case 'Enter':
                handleCreate();
                break;
            default:
                break;
        }
    };

    switch (errorCode) {
        case ERROR_CODE_ITEM_NAME_IN_USE:
            error = formatMessage(messages.createDialogErrorInUse);
            break;
        case ERROR_CODE_ITEM_NAME_TOO_LONG:
            error = formatMessage(messages.createDialogErrorTooLong);
            break;
        default:
            error = errorCode ? formatMessage(messages.createDialogErrorInvalid) : null;
            break;
    }

    return (
        <Modal
            appElement={appElement}
            className={CLASS_MODAL_CONTENT}
            contentLabel={formatMessage(messages.createDialogLabel)}
            isOpen={isOpen}
            onRequestClose={onCancel}
            overlayClassName={CLASS_MODAL_OVERLAY}
            parentSelector={() => parentElement}
            portalClassName={`${CLASS_MODAL} be-modal-create-folder`}
        >
            <BlueprintModal.Body>
                <TextInput
                    autoFocus
                    error={error}
                    label={formatMessage(messages.createDialogText)}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    required
                    value={value}
                />
            </BlueprintModal.Body>
            <BlueprintModal.Footer>
                <BlueprintModal.Footer.SecondaryButton disabled={isLoading} onClick={onCancel} size="large">
                    {formatMessage(messages.cancel)}
                </BlueprintModal.Footer.SecondaryButton>
                <BlueprintModal.Footer.PrimaryButton
                    loading={isLoading}
                    loadingAriaLabel={formatMessage(messages.loading)}
                    onClick={handleCreate}
                    size="large"
                >
                    {formatMessage(messages.create)}
                </BlueprintModal.Footer.PrimaryButton>
            </BlueprintModal.Footer>
        </Modal>
    );
};

export default CreateFolderDialog;
