import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { Modal, ModalActions } from '../../../components/modal';
import Button, { ButtonType } from '../../../components/button';
import ClassifiedBadge from '../ClassifiedBadge';
import Label from '../../../components/label/Label';
import SecurityControlsItem from './SecurityControlsItem';

import type { MessageItem } from '../flowTypes';

import commonMessages from '../../../common/messages';
import classificationMessages from '../messages';
import messages from './messages';

import './SecurityControlsModal.scss';

export interface SecurityControlsModalProps {
    classificationColor?: string;
    classificationName?: string;
    closeModal: () => void;
    definition?: string;
    isSecurityControlsModalOpen?: boolean;
    itemName?: string;
    modalItems?: Array<MessageItem>;
}

const SecurityControlsModal = ({
    closeModal,
    definition,
    classificationColor,
    classificationName,
    isSecurityControlsModalOpen = false,
    itemName,
    modalItems = [],
}: SecurityControlsModalProps) => {
    if (!itemName || !classificationName || !definition) {
        return null;
    }

    const title = <FormattedMessage {...messages.modalTitle} values={{ itemName }} />;

    return (
        <Modal
            className="bdl-SecurityControlsModal"
            title={title}
            onRequestClose={closeModal}
            isOpen={isSecurityControlsModalOpen}
        >
            <p>
                <FormattedMessage {...messages.modalDescription} />
            </p>
            <ClassifiedBadge color={classificationColor} name={classificationName as string} />
            <Label text={<FormattedMessage {...classificationMessages.definition} />}>
                <p className="bdl-SecurityControlsModal-definition">{definition}</p>
            </Label>
            <ul className="bdl-SecurityControlsModal-controlsItemList">
                {modalItems.map(({ message, tooltipMessage }, index) => (
                    <SecurityControlsItem key={index} message={message} tooltipMessage={tooltipMessage} />
                ))}
            </ul>
            <ModalActions>
                <Button onClick={closeModal} type={ButtonType.BUTTON}>
                    <FormattedMessage {...commonMessages.close} />
                </Button>
            </ModalActions>
        </Modal>
    );
};

export default SecurityControlsModal;
