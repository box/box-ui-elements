// @flow
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { Modal, ModalActions } from '../../components/modal';
import Button from '../../components/button';
import PrimaryButton from '../../components/primary-button';
import commonMessages from '../../common/messages';

import messages from './messages';

type Props = {
    cancelButtonProps?: Object,
    isOpen: boolean,
    modalProps?: Object,
    okayButtonProps?: Object,
    onLoad?: Function,
    onRequestClose: Function,
    removeLink: Function,
    submitting: boolean,
};

class RemoveLinkConfirmModal extends Component<Props> {
    componentDidMount() {
        const { onLoad } = this.props;

        if (onLoad) {
            onLoad();
        }
    }

    render() {
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
                    <Button isDisabled={submitting} onClick={onRequestClose} {...cancelButtonProps}>
                        <FormattedMessage {...commonMessages.cancel} />
                    </Button>
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
