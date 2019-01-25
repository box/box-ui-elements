// @flow
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { Modal, ModalActions } from 'components/modal';
import Button from 'components/button';
import PrimaryButton from 'components/primary-button';
import commonMessages from '../../common/messages';

import messages from './messages';

type Props = {
    isOpen: boolean,
    onRequestClose: Function,
    removeLink: Function,
    submitting: boolean,
    onLoad?: Function,
    okayButtonProps?: Object,
    cancelButtonProps?: Object,
    modalProps?: Object,
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
                focusElementSelector=".btn-primary"
                title={<FormattedMessage {...messages.removeLinkConfirmationTitle} />}
                isOpen={isOpen}
                onRequestClose={submitting ? undefined : onRequestClose}
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
