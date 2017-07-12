/**
 * @flow
 * @file Content Explorer Delete Confirmation Dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import type { BoxItem } from '../../flowTypes';
import { Button, PrimaryButton } from '../Button';
import { CLASS_MODAL_CONTENT, CLASS_MODAL_OVERLAY, CLASS_MODAL, TYPE_FOLDER } from '../../constants';

type Props = {
    isOpen: boolean,
    onDelete: Function,
    onCancel: Function,
    item: BoxItem,
    getLocalizedMessage: Function,
    isLoading: boolean,
    parentElement: HTMLElement
};

const DeleteConfirmationDialog = ({
    isOpen,
    onDelete,
    onCancel,
    item,
    getLocalizedMessage,
    isLoading,
    parentElement
}: Props) =>
    <Modal
        isOpen={isOpen}
        parentSelector={() => parentElement}
        portalClassName={CLASS_MODAL}
        className={CLASS_MODAL_CONTENT}
        overlayClassName={CLASS_MODAL_OVERLAY}
        onRequestClose={onCancel}
        contentLabel={getLocalizedMessage('buik.modal.delete.confirmation.label')}
    >
        <div>
            {getLocalizedMessage(`buik.modal.delete.confirmation.text${item.type === TYPE_FOLDER ? '.folder' : ''}`, {
                name: item.name
            })}
        </div>
        <div className='buik-modal-btns'>
            <PrimaryButton onClick={onDelete} isLoading={isLoading}>
                {getLocalizedMessage('buik.more.options.delete')}
            </PrimaryButton>
            <Button onClick={onCancel} isDisabled={isLoading} autoFocus>
                {getLocalizedMessage('buik.footer.button.cancel')}
            </Button>
        </div>
    </Modal>;

export default DeleteConfirmationDialog;
