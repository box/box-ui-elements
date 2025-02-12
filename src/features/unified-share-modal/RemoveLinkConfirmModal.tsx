import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { Modal, ModalActions } from '../../components/modal';
import ButtonAdapter from '../../components/button/ButtonAdapter';
import { ButtonType } from '../../components/button/Button';
import PrimaryButton from '../../components/primary-button';
import commonMessages from '../../common/messages';

import messages from './messages';

interface Props {
    cancelButtonProps?: Record<string, unknown>;
    isOpen: boolean;
    modalProps?: Record<string, unknown>;
    okayButtonProps?: Record<string, unknown>;
    onLoad?: () => void;
    onRequestClose: () => void;
    removeLink: () => void;
    submitting: boolean;
}

class RemoveLinkConfirmModal extends Component<Props> {
    componentDidMount(): void {
        const { onLoad } = this.props;

        if (onLoad) {
            onLoad();
        }
    }

    render(): JSX.Element {
        const {
            isOpen,
            onRequestClose,
            removeLink,
            submitting,
            okayButtonProps,
            modalProps,
            cancelButtonProps,
        } = this.props;

        return (
            <Modal
                className="be-modal"
                focusElementSelector=".btn-primary"
                isOpen={isOpen}
                onRequestClose={submitting ? undefined : onRequestClose}
                title={<FormattedMessage {...messages.removeLinkConfirmationTitle} />}
                type="alert"
                {...modalProps}
            >
                <FormattedMessage {...messages.removeLinkConfirmationDescription} />
                <ModalActions>
                    <ButtonAdapter isDisabled={submitting} onClick={onRequestClose} type={ButtonType.BUTTON} {...cancelButtonProps}>
                        <FormattedMessage {...commonMessages.cancel} />
                    </ButtonAdapter>
                    <PrimaryButton
                        isDisabled={submitting}
                        isLoading={submitting}
                        onClick={removeLink}
                        {...okayButtonProps}
                    >
                        <FormattedMessage {...commonMessages.okay} />
                    </PrimaryButton>
                </ModalActions>
            </Modal>
        );
    }
}

export default RemoveLinkConfirmModal;
