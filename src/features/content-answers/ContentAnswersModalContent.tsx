import React from 'react';

import WelcomeMessage from './WelcomeMessage';

import './ContentAnswersModalContent.scss';

type Props = {
    fileName: string;
};

const ContentAnswersModalContent = ({ fileName }: Props) => {
    return (
        <div className="bdl-ContentAnswersModalContent">
            <WelcomeMessage fileName={fileName} />
        </div>
    );
};

export default ContentAnswersModalContent;
