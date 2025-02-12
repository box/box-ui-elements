import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import ButtonAdapter from '../../components/button/ButtonAdapter';
import { ButtonType } from '../../components/button/Button';
import Modal from '../../components/modal/Modal';
import { ModalActions } from '../../components/modal';
import commonMessages from '../../common/messages';

import messages from './messages';
import type { ModalActionsProps } from '../../components/modal/ModalActions';

interface Props {
    isOpen?: boolean;
    onRequestClose: () => void;
    onSubmit: () => void;
    submitting?: boolean;
}

const SharedLinkModal = ({ isOpen, onRequestClose, onSubmit, submitting }: Props) => (
    <Modal
        className="shared-link-modal"
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        title={<FormattedMessage {...messages.sharedLinkModalTitle} />}
    >
        <div className="shared-link-modal-description">
            <FormattedMessage {...messages.modalDescription} />
        </div>
        <ModalActions className="shared-link-modal-actions">
            <ButtonAdapter isDisabled={submitting} onClick={onRequestClose} type={ButtonType.BUTTON}>
                <FormattedMessage {...commonMessages.cancel} />
            </ButtonAdapter>
            <ButtonAdapter
                isDisabled={submitting}
                isLoading={submitting}
                onClick={onSubmit}
                type={ButtonType.BUTTON}
                isSelected
            >
                <FormattedMessage {...commonMessages.okay} />
            </ButtonAdapter>
        </ModalActions>
    </Modal>
);

export default SharedLinkModal;
