/**
 * @flow
 * @file Content Explorer Delete Confirmation Dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import type { BoxItem } from '../../flowTypes';
import { Button, PrimaryButton } from '../Button';
import { CLASS_MODAL_CONTENT, CLASS_MODAL_OVERLAY, CLASS_MODAL } from '../../constants';

type Props = {
    isOpen: boolean,
    onRename: Function,
    onCancel: Function,
    item: BoxItem,
    getLocalizedMessage: Function,
    isLoading: boolean,
    errorCode: string,
    parentElement: HTMLElement
};

/* eslint-disable jsx-a11y/label-has-for */
const RenameDialog = ({
    isOpen,
    onRename,
    onCancel,
    item,
    getLocalizedMessage,
    isLoading,
    errorCode,
    parentElement
}: Props) => {
    let textInput = null;
    let error = '';

    const { name = '', extension } = item;
    const ext = extension ? `.${extension}` : '';
    const nameWithoutExt = extension ? name.replace(ext, '') : name;

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
                rename();
                break;
            default:
                break;
        }
    };

    switch (errorCode) {
        case 'item_name_in_use':
            error = getLocalizedMessage('buik.modal.rename.dialog.error.inuse');
            break;
        case 'item_name_too_long':
            error = getLocalizedMessage('buik.modal.rename.dialog.error.toolong');
            break;
        default:
            error = errorCode ? getLocalizedMessage('buik.modal.rename.dialog.error.invalid') : '';
            break;
    }

    return (
        <Modal
            isOpen={isOpen}
            parentSelector={() => parentElement}
            portalClassName={`${CLASS_MODAL} buik-modal-rename`}
            className={CLASS_MODAL_CONTENT}
            overlayClassName={CLASS_MODAL_OVERLAY}
            contentLabel={getLocalizedMessage('buik.modal.rename.dialog.label')}
        >
            <label>
                {error ? <div className='buik-modal-error'>{error}</div> : null}
                <div>
                    {getLocalizedMessage('buik.modal.rename.dialog.text', {
                        name: nameWithoutExt
                    })}
                </div>
                <input type='text' required ref={ref} defaultValue={nameWithoutExt} onKeyDown={onKeyDown} />
            </label>
            <div className='buik-modal-btns'>
                <PrimaryButton onClick={rename} isLoading={isLoading}>
                    {getLocalizedMessage('buik.more.options.rename')}
                </PrimaryButton>
                <Button onClick={onCancel} isDisabled={isLoading}>
                    {getLocalizedMessage('buik.footer.button.cancel')}
                </Button>
            </div>
        </Modal>
    );
};

export default RenameDialog;
