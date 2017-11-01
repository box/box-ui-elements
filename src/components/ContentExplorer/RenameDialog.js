/**
 * @flow
 * @file Content Explorer Rename Dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from '../messages';
import { Button, PrimaryButton } from '../Button';
import {
    CLASS_MODAL_CONTENT,
    CLASS_MODAL_OVERLAY,
    CLASS_MODAL,
    ERROR_CODE_ITEM_NAME_TOO_LONG,
    ERROR_CODE_ITEM_NAME_IN_USE
} from '../../constants';
import type { BoxItem } from '../../flowTypes';

type Props = {
    isOpen: boolean,
    onRename: Function,
    onCancel: Function,
    item: BoxItem,
    isLoading: boolean,
    errorCode: string,
    parentElement: HTMLElement,
    intl: any
};

/* eslint-disable jsx-a11y/label-has-for */
const RenameDialog = ({ isOpen, onRename, onCancel, item, isLoading, errorCode, parentElement, intl }: Props) => {
    let textInput = null;
    let error;

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
        <Modal
            isOpen={isOpen}
            parentSelector={() => parentElement}
            portalClassName={`${CLASS_MODAL} buik-modal-rename`}
            className={CLASS_MODAL_CONTENT}
            overlayClassName={CLASS_MODAL_OVERLAY}
            onRequestClose={onCancel}
            contentLabel={intl.formatMessage(messages.renameDialogLabel)}
        >
            <label>
                {error
                    ? <div className='buik-modal-error'>
                        <FormattedMessage {...error} values={{ name: nameWithoutExt }} />
                    </div>
                    : null}
                <FormattedMessage tagName='div' {...messages.renameDialogText} values={{ name: nameWithoutExt }} />
                <input type='text' required ref={ref} defaultValue={nameWithoutExt} onKeyDown={onKeyDown} />
            </label>
            <div className='buik-modal-btns'>
                <PrimaryButton onClick={rename} isLoading={isLoading}>
                    <FormattedMessage {...messages.rename} />
                </PrimaryButton>
                <Button onClick={onCancel} isDisabled={isLoading}>
                    <FormattedMessage {...messages.cancel} />
                </Button>
            </div>
        </Modal>
    );
};

export default injectIntl(RenameDialog);
