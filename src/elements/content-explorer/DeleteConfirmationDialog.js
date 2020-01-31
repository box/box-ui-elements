/**
 * @flow
 * @file Content Explorer Delete Confirmation Dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import { injectIntl, FormattedMessage } from 'react-intl';
import type { InjectIntlProvidedProps } from 'react-intl';
import PrimaryButton from '../../components/primary-button/PrimaryButton';
import Button from '../../components/button/Button';
import messages from '../common/messages';
import { CLASS_MODAL_CONTENT, CLASS_MODAL_OVERLAY, CLASS_MODAL, TYPE_FOLDER } from '../../constants';
import type { BoxItem } from '../../common/types/core';

type Props = {
    appElement: HTMLElement,
    isLoading: boolean,
    isOpen: boolean,
    item: BoxItem,
    onCancel: Function,
    onDelete: Function,
    parentElement: HTMLElement,
} & InjectIntlProvidedProps;

const DeleteConfirmationDialog = ({
    isOpen,
    onDelete,
    onCancel,
    item,
    isLoading,
    parentElement,
    appElement,
    intl,
}: Props) => {
    const message = item.type === TYPE_FOLDER ? messages.deleteDialogFolderText : messages.deleteDialogFileText;
    return (
        <Modal
            appElement={appElement}
            className={CLASS_MODAL_CONTENT}
            contentLabel={intl.formatMessage(messages.deleteDialogLabel)}
            isOpen={isOpen}
            onRequestClose={onCancel}
            overlayClassName={CLASS_MODAL_OVERLAY}
            parentSelector={() => parentElement}
            portalClassName={CLASS_MODAL}
        >
            <FormattedMessage {...message} values={{ name: item.name }} />
            <div className="be-modal-btns">
                <PrimaryButton isLoading={isLoading} onClick={onDelete} type="button">
                    <FormattedMessage {...messages.delete} />
                </PrimaryButton>
                <Button autoFocus isDisabled={isLoading} onClick={onCancel} type="button">
                    <FormattedMessage {...messages.cancel} />
                </Button>
            </div>
        </Modal>
    );
};

export default injectIntl(DeleteConfirmationDialog);
