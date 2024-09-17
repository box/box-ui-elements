import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Modal, TextInput } from '@box/blueprint-web';
import type { BoxItem } from '../../common/types/core';

import { ERROR_CODE_ITEM_NAME_TOO_LONG, ERROR_CODE_ITEM_NAME_IN_USE } from '../../constants';

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

/* eslint-disable jsx-a11y/label-has-for */
const RenameDialog = ({ errorCode, isLoading, isOpen, item, onCancel, onRename, parentElement }: RenameDialogProps) => {
    const { formatMessage } = useIntl();

    let textInput = null;
    let error;

    const { name = '', extension, type } = item;
    const ext = extension ? `.${extension}` : '';
    const nameWithoutExt = extension ? name.replace(ext, '') : name;
    const itemType = type === 'web_link' ? 'webLink' : type;

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
                className="be-modal-rename"
                container={parentElement}
                size="medium"
            >
                <Modal.Header>
                    <FormattedMessage {...messages[`${itemType}RenameHeading`]} />
                </Modal.Header>
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
                    <Modal.Footer.PrimaryButton
                        loading={isLoading}
                        loadingAriaLabel={formatMessage(messages.loading)}
                        onClick={rename}
                    >
                        {formatMessage(messages.rename)}
                    </Modal.Footer.PrimaryButton>
                    <Modal.Footer.SecondaryButton disabled={isLoading} onClick={onCancel}>
                        {formatMessage(messages.cancel)}
                    </Modal.Footer.SecondaryButton>
                </Modal.Footer>
                <Modal.Close aria-label="Close" />
            </Modal.Content>
        </Modal>
    );
};

export default RenameDialog;
