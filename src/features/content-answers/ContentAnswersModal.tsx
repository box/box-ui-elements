import React from 'react';
import { FormattedMessage } from 'react-intl';

import BoxAiLogo from '../../icon/logo/BoxAiLogo';
import ContentAnswersModalContent from './ContentAnswersModalContent';
import ContentAnswersModalFooter from './ContentAnswersModalFooter';
// @ts-ignore flow import
import Modal from '../../components/modal/Modal';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { BoxItem } from '../../common/types/core';

import messages from './messages';

import './ContentAnswersModal.scss';

type Props = {
    file: BoxItem;
    isOpen: boolean;
    onRequestClose: () => void;
};

const ContentAnswersModal = ({ file, isOpen, onRequestClose }: Props) => {
    const fileName = file && file.name;
    return (
        <Modal
            className="bdl-ContentAnswersModal"
            data-testid="content-answers-modal"
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            title={
                <>
                    <BoxAiLogo
                        className="bdl-BoxAiLogo"
                        data-testid="content-answers-icon-color"
                        width={32}
                        height={32}
                    />
                    <FormattedMessage {...messages.contentAnswersTitle} />
                </>
            }
        >
            <ContentAnswersModalContent fileName={fileName} />
            <ContentAnswersModalFooter data-testid="content-answers-modal-footer" file={file} />
        </Modal>
    );
};

export default ContentAnswersModal;
