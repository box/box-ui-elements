/* @flow */
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { Modal, ModalActions } from '../../components/modal';
import Button from '../../components/button';
import PrimaryButton from '../../components/primary-button';
import commonMessages from '../../common/messages';

import messages from './messages';

type Props = {
    isOpen?: boolean,
    onRequestClose: Function,
    removeLink: Function,
    submitting?: boolean,
};

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
                <Button isDisabled={submitting} onClick={onRequestClose}>
                    <FormattedMessage {...commonMessages.cancel} />
                </Button>
                <PrimaryButton isDisabled={submitting} isLoading={submitting} onClick={removeLink}>
                    <FormattedMessage {...commonMessages.okay} />
                </PrimaryButton>
            </ModalActions>
        </Modal>
    );
};

RemoveLinkConfirmModal.displayName = 'RemoveLinkConfirmModal';

export default RemoveLinkConfirmModal;
