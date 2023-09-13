import React, { useState } from 'react';

import ContentAnswersOpenButton from './ContentAnswersOpenButton';

type ExternalProps = {
    show?: boolean;
};

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

export type ContentAnswersProps = ExternalProps;
export default ContentAnswers;
