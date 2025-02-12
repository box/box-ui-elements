import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { Modal, ModalActions } from '../../components/modal';
import ButtonAdapter from '../../components/button/ButtonAdapter';
import commonMessages from '../../common/messages';

import messages from './messages';

interface Props {
    isOpen?: boolean;
    onRequestClose: () => void;
    removeLink: () => void;
    submitting?: boolean;
}

const RemoveLinkConfirmModal = (props: Props) => {
    const { isOpen, onRequestClose, removeLink, submitting } = props;

    return (
        <Modal
            focusElementSelector=".btn-primary"
            isOpen={isOpen}
            onRequestClose={submitting ? undefined : onRequestClose}
            title={<FormattedMessage {...messages.removeLinkConfirmationTitle} />}
            type="alert"
        >
            <FormattedMessage {...messages.removeLinkConfirmationDescription} />
            <ModalActions>
                <ButtonAdapter isDisabled={submitting} onClick={onRequestClose}>
                    {commonMessages.cancel.defaultMessage}
                </ButtonAdapter>
                <ButtonAdapter isDisabled={submitting} isLoading={submitting} onClick={removeLink} isSelected>
                    {commonMessages.okay.defaultMessage}
                </ButtonAdapter>
            </ModalActions>
        </Modal>
    );
};

RemoveLinkConfirmModal.displayName = 'RemoveLinkConfirmModal';

export default RemoveLinkConfirmModal;
