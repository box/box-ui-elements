import React, { useState } from 'react';

import ContentAnswersOpenButton from './ContentAnswersOpenButton';

const ContentAnswers = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div>
            <ContentAnswersOpenButton onClick={handleClick} />
        </div>
    );
};

export default ContentAnswers;
