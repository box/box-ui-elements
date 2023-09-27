import React from 'react';
import { FormattedMessage } from 'react-intl';

import BoxAiLogo from '../../icon/logo/BoxAiLogo';
import ContentAnswersModalContent from './body/ContentAnswersModalContent';
import ContentAnswersModalFooter from './ContentAnswersModalFooter';
// @ts-ignore flow import
import Modal from '../../components/modal/Modal';

import messages from './messages';

import './ContentAnswersModal.scss';

type Props = {
    fileName: string;
    isOpen: boolean;
    onRequestClose: () => void;
};

const ContentAnswersModal = ({ fileName, isOpen, onRequestClose }: Props) => {
    return (
        <Modal
            className="ContentAnswersModal"
            data-testid="content-answers-modal"
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title={
                <>
                    <BoxAiLogo className="BoxAiLogo" data-testid="content-answers-icon-color" width={32} height={32} />
                    <FormattedMessage {...messages.contentAnswersTitle} />
                </>
            }
        >
            <ContentAnswersModalContent fileName={fileName} />
            <ContentAnswersModalFooter />
        </Modal>
    );
};

export default ContentAnswersModal;
