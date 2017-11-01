/**
 * @flow
 * @file Content Explorer Delete Confirmation Dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import { injectIntl, FormattedMessage } from 'react-intl';
import messages from '../messages';

import { Button, PrimaryButton } from '../Button';
import { CLASS_MODAL_CONTENT, CLASS_MODAL_OVERLAY, CLASS_MODAL, TYPE_FOLDER } from '../../constants';
import type { BoxItem } from '../../flowTypes';

type Props = {
    isOpen: boolean,
    onDelete: Function,
    onCancel: Function,
    item: BoxItem,
    isLoading: boolean,
    parentElement: HTMLElement,
    intl: any
};

const DeleteConfirmationDialog = ({ isOpen, onDelete, onCancel, item, isLoading, parentElement, intl }: Props) => {
    const message = item.type === TYPE_FOLDER ? messages.deleteDialogFolderText : messages.deleteDialogFileText;
    return (
        <Modal
            isOpen={isOpen}
            parentSelector={() => parentElement}
            portalClassName={CLASS_MODAL}
            className={CLASS_MODAL_CONTENT}
            overlayClassName={CLASS_MODAL_OVERLAY}
            onRequestClose={onCancel}
            contentLabel={intl.formatMessage(messages.deleteDialogLabel)}
        >
            <FormattedMessage {...message} values={{ name: item.name }} />
            <div className='buik-modal-btns'>
                <PrimaryButton onClick={onDelete} isLoading={isLoading}>
                    <FormattedMessage {...messages.delete} />
                </PrimaryButton>
                <Button onClick={onCancel} isDisabled={isLoading} autoFocus>
                    <FormattedMessage {...messages.cancel} />
                </Button>
            </div>
        </Modal>
    );
};

export default injectIntl(DeleteConfirmationDialog);
