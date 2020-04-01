/**
 * @flow
 * @file Content Explorer Create Folder Dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import PrimaryButton from '../../../components/primary-button/PrimaryButton';
import Button from '../../../components/button/Button';
import messages from '../messages';
import {
    CLASS_MODAL_CONTENT,
    CLASS_MODAL_OVERLAY,
    CLASS_MODAL,
    ERROR_CODE_ITEM_NAME_TOO_LONG,
    ERROR_CODE_ITEM_NAME_IN_USE,
} from '../../../constants';

type Props = {
    appElement: HTMLElement,
    errorCode: string,
    isLoading: boolean,
    isOpen: boolean,
    onCancel: Function,
    onCreate: Function,
    parentElement: HTMLElement,
} & InjectIntlProvidedProps;

/* eslint-disable jsx-a11y/label-has-for */
const CreateFolderDialog = ({
    isOpen,
    onCreate,
    onCancel,
    isLoading,
    errorCode,
    parentElement,
    appElement,
    intl,
}: Props) => {
    let textInput = null;
    let error;

    /**
     * Appends the extension and calls rename function
     */
    const create = () => {
        if (textInput && textInput.value) {
            onCreate(textInput.value);
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
                create();
                break;
            default:
                break;
        }
    };

    switch (errorCode) {
        case ERROR_CODE_ITEM_NAME_IN_USE:
            error = messages.createDialogErrorInUse;
            break;
        case ERROR_CODE_ITEM_NAME_TOO_LONG:
            error = messages.createDialogErrorTooLong;
            break;
        default:
            error = errorCode ? messages.createDialogErrorInvalid : null;
            break;
    }

    return (
        <Modal
            appElement={appElement}
            className={CLASS_MODAL_CONTENT}
            contentLabel={intl.formatMessage(messages.createDialogLabel)}
            isOpen={isOpen}
            onRequestClose={onCancel}
            overlayClassName={CLASS_MODAL_OVERLAY}
            parentSelector={() => parentElement}
            portalClassName={CLASS_MODAL}
        >
            <label>
                {error ? (
                    <div className="be-modal-error">
                        <FormattedMessage {...error} />
                    </div>
                ) : null}
                <FormattedMessage tagName="div" {...messages.createDialogText} />
                <input ref={ref} onKeyDown={onKeyDown} required type="text" />
            </label>
            <div className="be-modal-btns">
                <PrimaryButton data-testid="be-btn-create-folder" isLoading={isLoading} onClick={create} type="button">
                    <FormattedMessage {...messages.create} />
                </PrimaryButton>
                <Button
                    data-testid="be-btn-create-folder-cancel"
                    isDisabled={isLoading}
                    onClick={onCancel}
                    type="button"
                >
                    <FormattedMessage {...messages.cancel} />
                </Button>
            </div>
        </Modal>
    );
};

export default injectIntl(CreateFolderDialog);
