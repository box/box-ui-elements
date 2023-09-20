import React, { useState } from 'react';

import ContentAnswersModal from './ContentAnswersModal';
import ContentAnswersOpenButton from './ContentAnswersOpenButton';

type ExternalProps = {
    show?: boolean;
};

const ContentAnswers = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(prevState => !prevState);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <ContentAnswersOpenButton onClick={handleClick} />
            {isModalOpen && <ContentAnswersModal onRequestClose={handleClose} />}
        </div>
    );
};

export type ContentAnswersProps = ExternalProps;
export default ContentAnswers;
