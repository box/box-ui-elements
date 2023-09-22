import React, { useState } from 'react';

import ContentAnswersModal from './ContentAnswersModal';
import ContentAnswersOpenButton from './ContentAnswersOpenButton';

type ExternalProps = {
    show?: boolean;
};

const ContentAnswers = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="ContentAnswers">
            <ContentAnswersOpenButton onClick={handleClick} />
            <ContentAnswersModal isOpen={isModalOpen} onRequestClose={handleClose} />
        </div>
    );
};

export type ContentAnswersProps = ExternalProps;
export default ContentAnswers;
