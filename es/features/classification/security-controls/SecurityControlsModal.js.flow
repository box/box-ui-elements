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
import type { MessageItem } from '../flowTypes';

type Props = {
    classificationColor?: string,
    classificationName?: string,
    closeModal: Function,
    definition?: string,
    isSecurityControlsModalOpen: boolean,
    itemName?: string,
    modalItems: Array<MessageItem>,
};

const SecurityControlsModal = ({
    closeModal,
    definition,
    classificationColor,
    classificationName,
    isSecurityControlsModalOpen,
    itemName,
    modalItems,
}: Props) => {
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
            <ClassifiedBadge color={classificationColor} name={((classificationName: any): string)} />
            <Label text={<FormattedMessage {...classificationMessages.definition} />}>
                <p className="bdl-SecurityControlsModal-definition">{definition}</p>
            </Label>
            <ul className="bdl-SecurityControlsModal-controlsItemList">
                {modalItems.map(({ message, tooltipMessage }, index) => (
                    <SecurityControlsItem key={index} message={message} tooltipMessage={tooltipMessage} />
                ))}
            </ul>
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
