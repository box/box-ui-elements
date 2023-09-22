import React from 'react';
import { FormattedMessage } from 'react-intl';

import BoxAiLogo from '../../icon/logo/BoxAiLogo';
import ContentAnswersModalContent from './ContentAnswersModalContent';
import ContentAnswersModalFooter from './ContentAnswersModalFooter';
// @ts-ignore flow import
import Modal from '../../components/modal/Modal';

import messages from './messages';

import './ContentAnswersModal.scss';

type Props = {
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const ContentAnswersModal = ({ isModalOpen, onRequestClose }: Props) => {
    return (
        <Modal
            className="ContentAnswersModal"
            data-testid="content-answers-modal"
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
            title={
                <>
                    <BoxAiLogo className="BoxAiLogo" data-testid="content-answers-icon-color" width={32} height={32} />
                    <FormattedMessage {...messages.contentAnswersTitle} />
                </>
            }
        >
            <ContentAnswersModalContent />
            <ContentAnswersModalFooter />
        </Modal>
    );
};

export default ContentAnswersModal;
