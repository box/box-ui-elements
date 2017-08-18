/**
 * @flow
 * @file Content Explorer Create Folder Dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import { Button, PrimaryButton } from '../Button';
import {
    CLASS_MODAL_CONTENT,
    CLASS_MODAL_OVERLAY,
    CLASS_MODAL,
    ERROR_CODE_ITEM_NAME_TOO_LONG,
    ERROR_CODE_ITEM_NAME_IN_USE
} from '../../constants';

type Props = {
    isOpen: boolean,
    onCreate: Function,
    onCancel: Function,
    getLocalizedMessage: Function,
    isLoading: boolean,
    errorCode: string,
    parentElement: HTMLElement
};

/* eslint-disable jsx-a11y/label-has-for */
const CreateFolderDialog = ({
    isOpen,
    onCreate,
    onCancel,
    getLocalizedMessage,
    isLoading,
    errorCode,
    parentElement
}: Props) => {
    let textInput = null;
    let error = '';

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
    const ref = (input) => {
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
            error = getLocalizedMessage('buik.modal.create.dialog.error.inuse');
            break;
        case ERROR_CODE_ITEM_NAME_TOO_LONG:
            error = getLocalizedMessage('buik.modal.create.dialog.error.toolong');
            break;
        default:
            error = errorCode ? getLocalizedMessage('buik.modal.create.dialog.error.invalid') : '';
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
            contentLabel={getLocalizedMessage('buik.modal.create.dialog.label')}
        >
            <label>
                {error
                    ? <div className='buik-modal-error'>
                        {error}
                    </div>
                    : null}
                <div>
                    {getLocalizedMessage('buik.modal.create.dialog.text')}
                </div>
                <input type='text' required ref={ref} onKeyDown={onKeyDown} />
            </label>
            <div className='buik-modal-btns'>
                <PrimaryButton onClick={create} isLoading={isLoading}>
                    {getLocalizedMessage('buik.modal.create.dialog.button')}
                </PrimaryButton>
                <Button onClick={onCancel} isDisabled={isLoading}>
                    {getLocalizedMessage('buik.footer.button.cancel')}
                </Button>
            </div>
        </Modal>
    );
};

export default CreateFolderDialog;
