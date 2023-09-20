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
    onRequestClose: () => void;
};

const ContentAnswersModal = ({ onRequestClose }: Props) => {
    return (
        <Modal
            isOpen
            className="ContentAnswersModal"
            data-testid="content-answers-modal"
            onRequestClose={onRequestClose}
            title={
                <>
                    <BoxAiLogo className="BoxAiLogo" data-testid="content-answers-icon-color" width={32} height={32} />
                    <p>
                        <span>
                            <FormattedMessage {...messages.contentAnswersTitle} />
                        </span>
                    </p>
                </>
            }
        >
            <ContentAnswersModalContent />
            <ContentAnswersModalFooter />
        </Modal>
    );
};

export default ContentAnswersModal;
