import * as React from 'react';
import { useIntl } from 'react-intl';
import { Modal, TextInput } from '@box/blueprint-web';
import type { BoxItem } from '../../common/types/core';

import {
    ERROR_CODE_ITEM_NAME_IN_USE,
    ERROR_CODE_ITEM_NAME_TOO_LONG,
    TYPE_FILE,
    TYPE_FOLDER,
    TYPE_WEBLINK,
} from '../../constants';

import messages from '../common/messages';

import './RenameDialog.scss';

export interface RenameDialogProps {
    errorCode: string;
    isLoading: boolean;
    isOpen: boolean;
    item: BoxItem;
    onCancel: () => void;
    onRename: (nameWithoutExt: string, extension: string) => void;
    parentElement: HTMLElement;
}

const RenameDialog = ({ errorCode, isLoading, isOpen, item, onCancel, onRename, parentElement }: RenameDialogProps) => {
    const { formatMessage } = useIntl();

    let textInput = null;
    let error;

    const { name = '', extension, type } = item;
    const ext = extension ? `.${extension}` : '';
    const nameWithoutExt = extension ? name.replace(ext, '') : name;

    const headerMessages = {
        [TYPE_FILE]: messages.renameDialogFileHeader,
        [TYPE_FOLDER]: messages.renameDialogFolderHeader,
        [TYPE_WEBLINK]: messages.renameDialogWebLinkHeader,
    };

    /**
     * Appends the extension and calls rename function
     */
    const rename = () => {
        if (textInput && textInput.value) {
            if (textInput.value === nameWithoutExt) {
                onCancel();
            } else {
                onRename(textInput.value, ext);
            }
        }
    };

    /**
     * Grabs reference to the input element
     */
    const ref = input => {
        textInput = input;
        if (textInput instanceof HTMLInputElement) {
            textInput.focus();
            textInput.select();
        }
    };

    /**
     * Handles enter key down
     */
    const onKeyDown = ({ key }) => {
        switch (key) {
            case 'Enter':
                rename();
                break;
            default:
                break;
        }
    };

    switch (errorCode) {
        case ERROR_CODE_ITEM_NAME_IN_USE:
            error = messages.renameDialogErrorInUse;
            break;
        case ERROR_CODE_ITEM_NAME_TOO_LONG:
            error = messages.renameDialogErrorTooLong;
            break;
        default:
            error = errorCode ? messages.renameDialogErrorInvalid : null;
            break;
    }

    return (
        <Modal onOpenChange={onCancel} open={isOpen}>
            <Modal.Content
                aria-label={formatMessage(messages.renameDialogLabel)}
                className="bce-RenameDialog"
                container={parentElement}
                size="small"
            >
                <Modal.Header>{formatMessage(headerMessages[type])}</Modal.Header>
                <Modal.Body>
                    <TextInput
                        defaultValue={nameWithoutExt}
                        error={error && formatMessage(error)}
                        label={formatMessage(messages.name)}
                        onKeyDown={onKeyDown}
                        ref={ref}
                        required
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Modal.Footer.SecondaryButton disabled={isLoading} onClick={onCancel}>
                        {formatMessage(messages.cancel)}
                    </Modal.Footer.SecondaryButton>
                    <Modal.Footer.PrimaryButton
                        loading={isLoading}
                        loadingAriaLabel={formatMessage(messages.loading)}
                        onClick={rename}
                    >
                        {formatMessage(messages.rename)}
                    </Modal.Footer.PrimaryButton>
                </Modal.Footer>
                <Modal.Close aria-label={formatMessage(messages.close)} />
            </Modal.Content>
        </Modal>
    );
};

export default RenameDialog;
