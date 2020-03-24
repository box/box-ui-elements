// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { Modal, ModalActions } from '../../../components/modal';
import commonMessages from '../../../common/messages';
import Button from '../../../components/button';
import classificationMessages from '../messages';
import ClassifiedBadge from '../ClassifiedBadge';
import Label from '../../../components/label/Label';
import messages from './messages';
import SecurityControlsItem from './SecurityControlsItem';
import './SecurityControlsModal.scss';
import type { MessageItem } from './utils';

type Props = {
    classificationName?: string,
    closeModal: Function,
    definition?: string,
    fillColor?: string,
    isSecurityControlsModalOpen: boolean,
    itemName?: string,
    modalItems: Array<MessageItem>,
    strokeColor?: string,
};

const SecurityControlsModal = ({
    closeModal,
    definition,
    fillColor,
    classificationName,
    isSecurityControlsModalOpen,
    itemName,
    modalItems,
    strokeColor,
}: Props) => {
    if (!itemName || !classificationName || !definition) {
        return null;
    }

    const title = <FormattedMessage {...messages.modalTitle} values={{ itemName }} />;
    const securityControlsItems = modalItems.map(({ message, tooltipMessage }) => {
        if (message) {
            return <SecurityControlsItem key={message.id} message={message} appNames={tooltipMessage} />;
        }
        return null;
    });

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
            <ClassifiedBadge
                strokeColor={strokeColor}
                fillColor={fillColor}
                name={((classificationName: any): string)}
            />
            <Label text={<FormattedMessage {...classificationMessages.definition} />}>
                <p className="bdl-SecurityControlsModal-definition">{definition}</p>
            </Label>
            <ul className="bdl-SecurityControlsModal-controlsItemList">{securityControlsItems}</ul>
            <ModalActions>
                <Button onClick={closeModal} type="button">
                    <FormattedMessage {...commonMessages.close} />
                </Button>
            </ModalActions>
        </Modal>
    );
};

SecurityControlsModal.defaultProps = {
    isSecurityControlsModalOpen: false,
    modalItems: [],
};

export default SecurityControlsModal;
