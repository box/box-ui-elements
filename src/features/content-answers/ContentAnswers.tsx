import React, { useState } from 'react';

import ContentAnswersOpenButton from './ContentAnswersOpenButton';

const ContentAnswers = () => {
    const [openContentAnswersModal, setOpenContentAnswersModal] = useState(false);

    const handleClick = () => {
        setOpenContentAnswersModal(!openContentAnswersModal);
    };

    return (
        <div>
            <ContentAnswersOpenButton onClick={handleClick} />
        </div>
    );
};

export default ContentAnswers;
