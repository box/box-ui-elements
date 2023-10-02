import React, { useState } from 'react';

import ContentAnswersModal from './ContentAnswersModal';
import ContentAnswersOpenButton from './ContentAnswersOpenButton';

type ExternalProps = {
    show?: boolean;
};

type Props = {
    fileExtension: string;
    fileId: string;
    versionId: string;
};

const ContentAnswers = ({ fileExtension }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="bdl-ContentAnswers">
            <ContentAnswersOpenButton fileExtension={fileExtension} onClick={handleClick} />
            <ContentAnswersModal isOpen={isModalOpen} onRequestClose={handleClose} />
        </div>
    );
};

export type ContentAnswersProps = ExternalProps;
export default ContentAnswers;
