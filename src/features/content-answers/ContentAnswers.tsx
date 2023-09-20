import React, { useState } from 'react';

import ContentAnswersModal from './ContentAnswersModal';
import ContentAnswersOpenButton from './ContentAnswersOpenButton';

type ExternalProps = {
    fileExtension: string;
    fileId: string;
    show?: boolean;
    versionId: string;
};

const ContentAnswers = ({ fileExtension }: ExternalProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="ContentAnswers">
            <ContentAnswersOpenButton onClick={handleClick} fileExtension={fileExtension} />
            <ContentAnswersModal isOpen={isModalOpen} onRequestClose={handleClose} />
        </div>
    );
};

export type ContentAnswersProps = ExternalProps;
export default ContentAnswers;
