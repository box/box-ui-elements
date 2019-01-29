/**
 * @flow
 * @file Content Explorer Delete Confirmation Dialog
 * @author Box
 */

import React from 'react';
import Modal from 'react-modal';
import { injectIntl, FormattedMessage } from 'react-intl';
import PrimaryButton from 'box-react-ui/lib/components/primary-button/PrimaryButton';
import Button from 'box-react-ui/lib/components/button/Button';
import messages from 'elements/common/messages';
import { CLASS_MODAL_CONTENT, CLASS_MODAL_OVERLAY, CLASS_MODAL, TYPE_FOLDER } from '../../constants';

type Props = {
    isOpen: boolean,
    onDelete: Function,
    onCancel: Function,
    item: BoxItem,
    isLoading: boolean,
    parentElement: HTMLElement,
    appElement: HTMLElement,
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
            isOpen={isOpen}
            parentSelector={() => parentElement}
            portalClassName={CLASS_MODAL}
            className={CLASS_MODAL_CONTENT}
            overlayClassName={CLASS_MODAL_OVERLAY}
            onRequestClose={onCancel}
            contentLabel={intl.formatMessage(messages.deleteDialogLabel)}
            appElement={appElement}
        >
            <FormattedMessage {...message} values={{ name: item.name }} />
            <div className="be-modal-btns">
                <PrimaryButton type="button" onClick={onDelete} isLoading={isLoading}>
                    <FormattedMessage {...messages.delete} />
                </PrimaryButton>
                <Button type="button" onClick={onCancel} isDisabled={isLoading} autoFocus>
                    <FormattedMessage {...messages.cancel} />
                </Button>
            </div>
        </Modal>
    );
};

export default injectIntl(DeleteConfirmationDialog);
