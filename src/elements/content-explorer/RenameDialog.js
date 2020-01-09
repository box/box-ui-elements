/**
 * @flow
 * @file Content Explorer Rename Dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import PrimaryButton from '../../components/primary-button/PrimaryButton';
import Button from '../../components/button/Button';
import messages from '../common/messages';
import {
    CLASS_MODAL_CONTENT,
    CLASS_MODAL_OVERLAY,
    CLASS_MODAL,
    ERROR_CODE_ITEM_NAME_TOO_LONG,
    ERROR_CODE_ITEM_NAME_IN_USE,
} from '../../constants';
import type { BoxItem } from '../../common/types/core';

type Props = {
    appElement: HTMLElement,
    errorCode: string,
    isLoading: boolean,
    isOpen: boolean,
    item: BoxItem,
    onCancel: Function,
    onRename: Function,
    parentElement: HTMLElement,
} & InjectIntlProvidedProps;

/* eslint-disable jsx-a11y/label-has-for */
const RenameDialog = ({
    isOpen,
    onRename,
    onCancel,
    item,
    isLoading,
    errorCode,
    parentElement,
    appElement,
    intl,
}: Props) => {
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
        <Modal
            appElement={appElement}
            className={CLASS_MODAL_CONTENT}
            contentLabel={intl.formatMessage(messages.renameDialogLabel)}
            isOpen={isOpen}
            onRequestClose={onCancel}
            overlayClassName={CLASS_MODAL_OVERLAY}
            parentSelector={() => parentElement}
            portalClassName={`${CLASS_MODAL} be-modal-rename`}
        >
            <label>
                {error ? (
                    <div className="be-modal-error">
                        <FormattedMessage {...error} values={{ name: nameWithoutExt }} />
                    </div>
                ) : null}
                <FormattedMessage tagName="div" {...messages.renameDialogText} values={{ name: nameWithoutExt }} />
                <input ref={ref} defaultValue={nameWithoutExt} onKeyDown={onKeyDown} required type="text" />
            </label>
            <div className="be-modal-btns">
                <PrimaryButton isLoading={isLoading} onClick={rename} type="button">
                    <FormattedMessage {...messages.rename} />
                </PrimaryButton>
                <Button isDisabled={isLoading} onClick={onCancel} type="button">
                    <FormattedMessage {...messages.cancel} />
                </Button>
            </div>
        </Modal>
    );
};

export default injectIntl(RenameDialog);
