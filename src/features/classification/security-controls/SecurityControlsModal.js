// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import type { MessageDescriptor } from 'react-intl';

import { Modal, ModalActions } from '../../../components/modal';
import Button from '../../../components/button';
import ClassifiedBadge from '../ClassifiedBadge';
import Label from '../../../components/label/Label';
import SecurityControlsItem from './SecurityControlsItem';
import { CLASSIFICATION_COMMUNITY_URL } from '../constants';
import { Link } from '../../../components/link';
import messages from './messages';
import classificationMessages from '../messages';
import './SecurityControlsModal.scss';

type Props = {
    classificationName: string,
    closeModal: Function,
    definition: string,
    isSecurityControlsModalOpen: boolean,
    itemName: string,
    modalItems: Array<MessageDescriptor>,
};

const SecurityControlsModal = ({
    closeModal,
    definition,
    classificationName,
    isSecurityControlsModalOpen,
    itemName,
    modalItems,
}: Props) => {
    const title = <FormattedMessage {...messages.modalTitle} values={{ itemName }} />;

    const learnMoreLink = (
        <Link
            data-resin-target="communityUrl"
            href={CLASSIFICATION_COMMUNITY_URL}
            rel="noopener noreferrer"
            target="_blank"
        >
            <FormattedMessage {...messages.learnMoreLink} />
        </Link>
    );

    return (
        <Modal
            className="bdl-SecurityControlsModal"
            title={title}
            onRequestClose={closeModal}
            isOpen={isSecurityControlsModalOpen}
        >
            <p>
                <FormattedMessage {...messages.modalDescription} values={{ learnMoreLink }} />
            </p>
            <ClassifiedBadge name={((classificationName: any): string)} />
            <Label text={<FormattedMessage {...classificationMessages.definition} />}>
                <p className="bdl-Classification-definition">{definition}</p>
            </Label>
            <ul className="bdl-SecurityControls">
                {modalItems.map((item, index) => (
                    <SecurityControlsItem key={index} message={item} />
                ))}
            </ul>
            <ModalActions>
                <Button onClick={closeModal}>
                    <FormattedMessage {...messages.gotItButtonText} />
                </Button>
            </ModalActions>
        </Modal>
    );
};

SecurityControlsModal.defaultProps = {
    closeModal: () => {},
    definition: '',
    classificationName: '',
    isSecurityControlsModalOpen: false,
    itemName: '',
    modalItems: [],
};

export default SecurityControlsModal;
