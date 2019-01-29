/**
 * @flow
 * @file Content Explorer Create Folder Dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import { injectIntl, FormattedMessage } from 'react-intl';
import PrimaryButton from 'box-react-ui/lib/components/primary-button/PrimaryButton';
import Button from 'box-react-ui/lib/components/button/Button';
import messages from '../messages';
import {
    CLASS_MODAL_CONTENT,
    CLASS_MODAL_OVERLAY,
    CLASS_MODAL,
    ERROR_CODE_ITEM_NAME_TOO_LONG,
    ERROR_CODE_ITEM_NAME_IN_USE,
} from '../../../constants';

type Props = {
    isOpen: boolean,
    onCreate: Function,
    onCancel: Function,
    isLoading: boolean,
    errorCode: string,
    parentElement: HTMLElement,
    appElement: HTMLElement,
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
            isOpen={isOpen}
            parentSelector={() => parentElement}
            portalClassName={CLASS_MODAL}
            className={CLASS_MODAL_CONTENT}
            overlayClassName={CLASS_MODAL_OVERLAY}
            onRequestClose={onCancel}
            contentLabel={intl.formatMessage(messages.createDialogLabel)}
            appElement={appElement}
        >
            <label>
                {error ? (
                    <div className="be-modal-error">
                        <FormattedMessage {...error} />
                    </div>
                ) : null}
                <FormattedMessage tagName="div" {...messages.createDialogText} />
                <input type="text" required ref={ref} onKeyDown={onKeyDown} />
            </label>
            <div className="be-modal-btns">
                <PrimaryButton type="button" onClick={create} isLoading={isLoading}>
                    <FormattedMessage {...messages.create} />
                </PrimaryButton>
                <Button type="button" onClick={onCancel} isDisabled={isLoading}>
                    <FormattedMessage {...messages.cancel} />
                </Button>
            </div>
        </Modal>
    );
};

export default injectIntl(CreateFolderDialog);
