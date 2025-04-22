// @flow
import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { Modal, ModalActions } from '../../components/modal';
import Button from '../../components/button';
import PrimaryButton from '../../components/primary-button';
import commonMessages from '../../common/messages';
import messages from './messages';
import type { collaboratorType } from './flowTypes';

type Props = {
    cancelButtonProps?: Object,
    isOpen: boolean,
    modalProps?: Object,
    okayButtonProps?: Object,
    onLoad?: Function,
    onRequestClose: Function,
    onSubmit: Function,
    submitting: boolean,
    collaborator: ?collaboratorType,
};

const RemoveCollaboratorConfirmModal = ({
    isOpen,
    onRequestClose,
    onSubmit,
    submitting,
    collaborator,
    okayButtonProps,
    modalProps,
    cancelButtonProps,
    onLoad,
}: Props) => {
    useEffect(() => {
        onLoad?.();
    }, [onLoad]);

    return (
        <Modal
            className="be-modal"
            focusElementSelector=".btn-primary"
            isOpen={isOpen}
            onRequestClose={submitting ? undefined : onRequestClose}
            title={<FormattedMessage {...messages.removeCollaboratorConfirmationTitle} />}
            type="alert"
            {...modalProps}
        >
            <FormattedMessage
                {...messages.removeCollaboratorConfirmationDescription}
                values={{
                    name: collaborator.email ?? collaborator.name,
                }}
            />
            <ModalActions>
                <Button isDisabled={submitting} onClick={onRequestClose} {...cancelButtonProps}>
                    <FormattedMessage {...commonMessages.cancel} />
                </Button>
                <PrimaryButton isDisabled={submitting} isLoading={submitting} onClick={onSubmit} {...okayButtonProps}>
                    <FormattedMessage {...commonMessages.okay} />
                </PrimaryButton>
            </ModalActions>
        </Modal>
    );
};

export default RemoveCollaboratorConfirmModal;
